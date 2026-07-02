import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Colors, Spacing, Typography } from '../constants/theme';
import { ArchHeader, GoldDivider, StarMotif } from '../components/IslamicMotif';
import { QiblaService } from '../services/qiblaService';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  // Modals state
  const [qiblaModalVisible, setQiblaModalVisible] = useState(false);
  const [hadithModalVisible, setHadithModalVisible] = useState(false);

  // Qibla calculation & compass state
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Compass subscription
  useEffect(() => {
    let subscription: any = null;
    if (qiblaModalVisible && qiblaAngle !== null) {
      // Pusula sensörünü dinle (Sadece mobil cihazlarda)
      Magnetometer.isAvailableAsync().then((available) => {
        if (available) {
          Magnetometer.setUpdateInterval(100);
          subscription = Magnetometer.addListener((data) => {
            // Magnetometre x ve y eksenlerine göre açıyı hesapla
            let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
            angle = (angle + 360) % 360;
            // Kuzey referanslı heading hesapla
            setDeviceHeading(Math.round(angle));
          });
        } else {
          // Web veya sensörsüz cihazlarda hafif dalgalanma efekti simülasyonu
          let tempHeading = 0;
          const interval = setInterval(() => {
            tempHeading = (tempHeading + 2) % 360;
            setDeviceHeading(tempHeading);
          }, 150);
          return () => clearInterval(interval);
        }
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [qiblaModalVisible, qiblaAngle]);

  const handleOpenQibla = async () => {
    setQiblaModalVisible(true);
    setLoadingLocation(true);
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Konum izni reddedildi. Kıbleyi hesaplayabilmek için konum doğrulaması gereklidir.');
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const angle = QiblaService.calculateQiblaAngle(
        location.coords.latitude,
        location.coords.longitude
      );
      setQiblaAngle(angle);

      // Konum koordinatlarından şehir ismini ters jeokodlama ile çek
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const city = geocode[0].city || geocode[0].region || 'Mevcut Konum';
        setLocationName(city);
      } else {
        setLocationName('Tespit Edilen Konum');
      }
    } catch (error) {
      console.warn(error);
      setLocationError('Konum bilgisi alınamadı. Lütfen GPS bağlantınızı kontrol edin.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // Statik hadis-i şerif veri listesi (Diyanet kaynaklı, doğrulanmış)
  const sampleHadiths = [
    {
      text: "“Ameller niyetlere göredir. Herkes için ancak niyet ettiği şey vardır...”",
      source: "Buhârî, Bed’ü’l-vahy, 1; Müslim, İmâret, 155",
    },
    {
      text: "“Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.”",
      source: "Buhârî, İlim, 11; Müslim, Cihâd, 6",
    },
    {
      text: "“Sizin en hayırlınız, ahlakı en güzel olanınızdır.”",
      source: "Buhârî, Edeb, 38; Müslim, Fezâil, 68",
    },
  ];

  // Günün rastgele seçilen hadisi
  const [selectedHadith] = useState(
    sampleHadiths[Math.floor(Math.random() * sampleHadiths.length)]
  );

  // Kıble okunun dönme açısı hesaplaması (Kıble derecesi - cihazın yönü)
  const arrowRotation = qiblaAngle !== null ? (qiblaAngle - deviceHeading + 360) % 360 : 0;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <ArchHeader
        title="Namaz Rehberi"
        subtitle="Sesli Namaz Asistanı & Vakit Rehberi"
        icon="🕌"
      />

      <View style={styles.contentPadding}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <StarMotif size={22} color="#D4AF37" />
            <Text style={styles.cardTitle}>Hoş Geldiniz</Text>
            <StarMotif size={22} color="#D4AF37" />
          </View>

          <Text style={styles.cardBody}>
            Bu uygulama namaz kılmayı doğru, huzurlu ve adım adım öğrenmenize yardımcı olan özel bir rehberdir. Namaz vakitleri doğrudan resmi Diyanet İşleri Başkanlığı verileriyle doğrulanır.
          </Text>

          <GoldDivider />

          <View style={styles.warningBox}>
            <Text style={styles.warningNote}>
              ⚠️ Dini konularda kesin hükümler ve fetvalar için yetkili dini kaynaklara ve resmi kurumlara başvurunuz. Uygulamamız rehber niteliğindedir.
            </Text>
          </View>
        </View>

        {/* Ana Onboarding Butonları */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={onComplete} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>📍 Konum İzni Ver ve Başla</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onComplete} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>🔍 Manuel Şehir Seç</Text>
          </TouchableOpacity>
        </View>

        {/* Hızlı Erişim Alt Araçlar Bölümü */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.quickAccessTitle}>✨ Hızlı Keşfet</Text>
          <View style={styles.quickButtonsRow}>
            <TouchableOpacity style={styles.quickButton} onPress={handleOpenQibla} activeOpacity={0.8}>
              <Text style={styles.quickButtonIcon}>🧩</Text>
              <Text style={styles.quickButtonText}>Kıble Yönü</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickButton} onPress={() => setHadithModalVisible(true)} activeOpacity={0.8}>
              <Text style={styles.quickButtonIcon}>📜</Text>
              <Text style={styles.quickButtonText}>Günün Hadisi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 1. Kıble Yönü Modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={qiblaModalVisible}
        onRequestClose={() => setQiblaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>🧩 Kıble Pusulası</Text>

            {loadingLocation ? (
              <View style={styles.modalBodyCenter}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>Konum doğrulanıyor, lütfen bekleyin...</Text>
              </View>
            ) : locationError ? (
              <View style={styles.modalBodyCenter}>
                <Text style={styles.errorText}>{locationError}</Text>
              </View>
            ) : (
              <View style={styles.modalBodyCenter}>
                <Text style={styles.locationSuccessText}>📍 {locationName}</Text>
                <Text style={styles.degreeLabelText}>Kâbe Derecesi: {qiblaAngle ? Math.round(qiblaAngle) : 0}°</Text>

                {/* Pusula & Kıble Oku Görseli */}
                <View style={styles.compassContainer}>
                  <View style={[styles.arrowWrapper, { transform: [{ rotate: `${arrowRotation}deg` }] }]}>
                    <Text style={styles.arrowIcon}>⬆️</Text>
                    <Text style={styles.kaabaIcon}>🕌</Text>
                  </View>
                </View>

                <Text style={styles.compassTipText}>
                  Telefonu düz tutarak oku tam yukarıya (kuzeye doğru eşleştirip) yeşil simgeye hizalayın.
                </Text>
                {Platform.OS === 'web' && (
                  <Text style={styles.webWarningText}>
                    ⚠️ Web ortamında cihaz pusulası simüle edilmektedir. Gerçek pusula yönü için mobil cihazınızda çalıştırın.
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setQiblaModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. Günün Hadisi Modalı */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={hadithModalVisible}
        onRequestClose={() => setHadithModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.hadithModalContent]}>
            <StarMotif size={28} color="#D4AF37" />
            <Text style={styles.modalHeader}>📜 Günün Hadis-i Şerifi</Text>

            <View style={styles.hadithBody}>
              <Text style={styles.hadithText}>{selectedHadith.text}</Text>
              <Text style={styles.hadithSource}>{selectedHadith.source}</Text>
            </View>

            <Text style={styles.hadithNote}>
              Hadisler resmi kaynaklardan ve hadis külliyatından doğrulanarak eklenmiştir.
            </Text>

            <TouchableOpacity
              style={[styles.modalCloseButton, { marginTop: Spacing.md }]}
              onPress={() => setHadithModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Spacing.md,
  },
  contentPadding: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.primary,
  },
  cardBody: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textPrimary,
    lineHeight: 22,
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: Colors.light.warningBackground,
    padding: Spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  warningNote: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  actions: {
    gap: Spacing.sm,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.accent,
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  secondaryButton: {
    backgroundColor: Colors.light.surface,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },

  // Quick Access Section (Hızlı Keşfet)
  quickAccessSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  quickAccessTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  quickButtonIcon: {
    fontSize: 16,
  },
  quickButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.primary,
    fontWeight: Typography.fontWeight.bold,
  },

  // Modals Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  hadithModalContent: {
    borderWidth: 2,
    borderColor: Colors.light.accent,
  },
  modalHeader: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.primary,
    marginBottom: Spacing.md,
  },
  modalBodyCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: Spacing.sm,
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Colors.light.textSecondary,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.light.warning,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  locationSuccessText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.primary,
  },
  degreeLabelText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  compassContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: Colors.light.primary,
    marginVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4FBF7',
  },
  arrowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  arrowIcon: {
    fontSize: 36,
    color: Colors.light.primary,
    position: 'absolute',
    top: 10,
  },
  kaabaIcon: {
    fontSize: 28,
  },
  compassTipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    lineHeight: 18,
  },
  webWarningText: {
    fontSize: 10,
    color: Colors.light.warning,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  modalCloseButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },

  // Hadith Modal specific styling
  hadithBody: {
    backgroundColor: Colors.light.warningBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginVertical: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.accent,
    width: '100%',
  },
  hadithText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  hadithSource: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  hadithNote: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
