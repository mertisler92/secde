import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Vibration } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { Colors, Spacing, Typography } from '../constants/theme';
import { StarMotif } from '../components/IslamicMotif';

interface QiblaScreenProps {
  onBack: () => void;
}

export const QiblaScreen: React.FC<QiblaScreenProps> = ({ onBack }) => {
  const qiblaDegree = 154.2; // İstanbul için kıble açısı (Kuzeyden saat yönünde)
  
  // Pusula yön bilgisi (Magnetometer'dan okunur)
  const [heading, setHeading] = useState<number>(0);
  // Sensör kullanılabilir mi?
  const [sensorAvailable, setSensorAvailable] = useState<boolean>(true);
  // Web için manuel simülatör derecesi (Kullanıcı yönü döndürme simülasyonu)
  const [webSimDegree, setWebSimDegree] = useState<number>(0);

  // Magnetometer dinleyicisi
  useEffect(() => {
    let subscription: any = null;

    // Sensör hızını ayarla (16ms = 60fps akıcılık için)
    Magnetometer.setUpdateInterval(30);

    const subscribe = async () => {
      try {
        const isAvailable = await Magnetometer.isAvailableAsync();
        if (!isAvailable) {
          setSensorAvailable(false);
          return;
        }

        subscription = Magnetometer.addListener((data) => {
          // Magnetometer verisinden açısal yön (heading) hesaplama
          let { x, y } = data;
          let angle = Math.atan2(y, x) * (180 / Math.PI);
          // 0 - 360 arasına sabitle
          let calculatedHeading = Math.round(angle >= 0 ? angle : 360 + angle);
          
          // Akıcı hareket için küçük değişimleri filtrele
          setHeading(calculatedHeading);
        });
      } catch (err) {
        setSensorAvailable(false);
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Şu anki aktif yön (Sensör varsa sensörden, web/simülatör ise el ile kaydırılan dereceden)
  const currentHeading = sensorAvailable ? heading : webSimDegree;

  // Kıble oku açısı: Kıble açısı ile cihazın mevcut yönü arasındaki fark
  // Bu açı ok işaretinin pusula içinde dönmesini sağlar.
  const arrowRotation = (qiblaDegree - currentHeading + 360) % 360;

  // Kullanıcı kıbleye tam yöneldi mi? (Açı farkı ±5 derece toleranslı)
  const isAligned = Math.abs(arrowRotation) < 6 || Math.abs(arrowRotation - 360) < 6;

  // Kıbleye hizalandığında tek seferlik kısa titreşim (Mobil cihazlar için)
  useEffect(() => {
    if (isAligned && sensorAvailable && Platform.OS !== 'web') {
      Vibration.vibrate(120);
    }
  }, [isAligned]);

  return (
    <View style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>← Ana Ekran</Text>
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>Kıble Pusulası</Text>
      </View>

      <View style={styles.contentPadding}>
        {/* Hizalama Durum Kartı */}
        <View style={[styles.alignmentCard, isAligned ? styles.alignedCard : styles.notAlignedCard]}>
          {isAligned ? (
            <Text style={styles.alignmentTitle}>🟢 KABEYE YÖNELDİNİZ</Text>
          ) : (
            <Text style={styles.alignmentTitle}>🔄 Telefonu Döndürün</Text>
          )}
          <Text style={styles.alignmentBody}>
            {isAligned 
              ? 'Namaz kılmak için doğru yöndensiniz.' 
              : 'Yeşil ok işaretini tam yukarıya (0° çizgisine) hizalayın.'}
          </Text>
        </View>

        {/* Pusula Kadran Tasarımı */}
        <View style={styles.compassContainer}>
          <View style={[styles.outerRing, isAligned && styles.alignedOuterRing]}>
            <View style={styles.dialCircle}>
              
              {/* Kuzey (N) ve diğer yön işaretleri */}
              <Text style={styles.northText}>N</Text>
              <Text style={styles.southText}>S</Text>
              
              {/* Kabe Ok İşareti (Yönü Gösteren Ok) */}
              <View 
                style={[
                  styles.arrowWrapper, 
                  { transform: [{ rotate: `${arrowRotation}deg` }] }
                ]}
              >
                {/* Altın renkli büyük yön oku */}
                <View style={[styles.arrowHead, isAligned && styles.arrowHeadAligned]} />
                <View style={[styles.arrowBody, isAligned && styles.arrowBodyAligned]} />
                
                {/* Oku takip eden Kabe İkonu */}
                <View style={styles.kabaBadge}>
                  <Text style={styles.kabaIcon}>🕋</Text>
                </View>
              </View>

              {/* Merkez motif */}
              <StarMotif size={24} color={isAligned ? '#10B981' : '#D4AF37'} />
            </View>
          </View>
        </View>

        {/* Bilgilendirme Alanı */}
        <View style={styles.infoBadge}>
          <Text style={styles.infoText}>
            📍 Konum: İstanbul • Kıble Açısı: {qiblaDegree}°{'\n'}
            Pusula Sapma Açısı: {currentHeading}°
          </Text>
        </View>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.accent,
  },
  backButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: Typography.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.bold,
  },
  topNavTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: '#FFFFFF',
    marginLeft: Spacing.md,
  },
  contentPadding: {
    flex: 1,
    padding: Spacing.md,
    paddingBottom: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Alignment Card
  alignmentCard: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  notAlignedCard: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
  },
  alignedCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  alignmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  alignmentBody: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  // Compass UI
  compassContainer: {
    marginVertical: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 6,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  alignedOuterRing: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.2,
  },
  dialCircle: {
    width: 218,
    height: 218,
    borderRadius: 109,
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  northText: {
    position: 'absolute',
    top: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  southText: {
    position: 'absolute',
    bottom: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  // Rotating Arrow Wrapper
  arrowWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowHead: {
    position: 'absolute',
    top: 26,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderLeftColor: 'transparent',
    borderRightWidth: 12,
    borderRightColor: 'transparent',
    borderBottomWidth: 26,
    borderBottomColor: '#D4AF37',
  },
  arrowHeadAligned: {
    borderBottomColor: '#10B981',
  },
  arrowBody: {
    position: 'absolute',
    top: 50,
    width: 6,
    height: 48,
    backgroundColor: '#D4AF37',
  },
  arrowBodyAligned: {
    backgroundColor: '#10B981',
  },
  kabaBadge: {
    position: 'absolute',
    top: 96,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.light.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  kabaIcon: {
    fontSize: 16,
  },
  // Info Badge
  infoBadge: {
    backgroundColor: Colors.light.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },

});
