import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { ArchHeader } from '../components/IslamicMotif';

interface HomeScreenProps {
  location: { city: string; country: string } | null;
  onNavigateToVakitler: () => void;
  onNavigateToQibla: () => void;
  onNavigateToKaza: () => void;
  onNavigateToHolyDays: () => void;
  onNavigateToHadith: () => void;
  onNavigateToZikirmatik: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  location,
  onNavigateToVakitler,
  onNavigateToQibla,
  onNavigateToKaza,
  onNavigateToHolyDays,
  onNavigateToHadith,
  onNavigateToZikirmatik,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  // Saat güncelleyici
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Demo vakitleri (sadece ana sayfadaki hızlı geri sayım hesaplaması için)
  const prayerTimes = {
    imsak: '03:42',
    gunes: '05:28',
    ogle: '13:14',
    ikindi: '17:08',
    aksam: '20:48',
    yatsi: '22:24',
  };

  const getCurrentVakit = () => {
    const now = currentTime.slice(0, 5); // "HH:MM"
    if (now < prayerTimes.imsak || now >= prayerTimes.yatsi) return { current: 'Yatsı', next: 'İmsak', nextTime: prayerTimes.imsak };
    if (now >= prayerTimes.imsak && now < prayerTimes.gunes) return { current: 'İmsak', next: 'Güneş', nextTime: prayerTimes.gunes };
    if (now >= prayerTimes.gunes && now < prayerTimes.ogle) return { current: 'Güneş', next: 'Öğle', nextTime: prayerTimes.ogle };
    if (now >= prayerTimes.ogle && now < prayerTimes.ikindi) return { current: 'Öğle', next: 'İkindi', nextTime: prayerTimes.ikindi };
    if (now >= prayerTimes.ikindi && now < prayerTimes.aksam) return { current: 'İkindi', next: 'Akşam', nextTime: prayerTimes.aksam };
    return { current: 'Akşam', next: 'Yatsı', nextTime: prayerTimes.yatsi };
  };

  const vakitInfo = getCurrentVakit();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Kompakt Özel Üst Bar */}
      <View style={styles.compactHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Secde</Text>
          <Text style={styles.headerSubtitle}>Manevi Yaşam ve İbadet Rehberi</Text>
        </View>
        <View style={styles.headerIconContainer}>
          <Text style={styles.headerIcon}>🕌</Text>
        </View>
      </View>

      <View style={styles.mainContentArea}>
        {/* Hızlı Manevi Özet Kartı */}
        {location !== null ? (
          <TouchableOpacity style={styles.quickSummaryCard} onPress={onNavigateToVakitler} activeOpacity={0.85}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryCity}>📍 {location.city}</Text>
              <Text style={styles.summaryClock}>Saat: {currentTime}</Text>
            </View>
            <View style={styles.summaryRight}>
              <Text style={styles.summaryVakitHeader}>Sonraki Vakit ({vakitInfo.next})</Text>
              <Text style={styles.summaryTimer}>{vakitInfo.nextTime}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.quickSummaryCard, styles.noLocationCard, styles.noLocationVertical]} onPress={onNavigateToVakitler} activeOpacity={0.85}>
            <Text style={styles.noLocationTitle}>📍 Konum Belirlenmedi</Text>
            <Text style={styles.noLocationDesc}>Ezan vakitlerini görmek ve geri sayımı başlatmak için dokunun.</Text>
            <View style={styles.setupButton}>
              <Text style={styles.setupButtonText}>Kurulum Yap →</Text>
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>🧩 Manevi Hizmetler</Text>

        {/* 3x2 Hizmet Izgarası (Grid) - Her Zaman Doğrudan Görünür */}
        <View style={styles.servicesGrid}>
          {/* 1. Ezan Vakitleri */}
          <TouchableOpacity style={styles.serviceCard} onPress={onNavigateToVakitler} activeOpacity={0.8}>
            <View style={[styles.iconCircle, styles.ezanCircle]}>
              <Text style={styles.serviceIcon}>🕌</Text>
            </View>
            <Text style={styles.serviceName}>Ezan Vakitleri</Text>
            <Text style={styles.serviceDesc}>Namaz vakti takibi</Text>
          </TouchableOpacity>

          {/* 2. Kıble Pusulası */}
          <TouchableOpacity style={styles.serviceCard} onPress={onNavigateToQibla} activeOpacity={0.8}>
            <View style={[styles.iconCircle, styles.kibleCircle]}>
              <Text style={styles.serviceIcon}>🧩</Text>
            </View>
            <Text style={styles.serviceName}>Kıble Pusulası</Text>
            <Text style={styles.serviceDesc}>Kıble yönü bulucu</Text>
          </TouchableOpacity>

          {/* 3. Kaza Takipçisi */}
          <TouchableOpacity style={styles.serviceCard} onPress={onNavigateToKaza} activeOpacity={0.8}>
            <View style={[styles.iconCircle, styles.kazaCircle]}>
              <Text style={styles.serviceIcon}>📊</Text>
            </View>
            <Text style={styles.serviceName}>Kaza Takipçisi</Text>
            <Text style={styles.serviceDesc}>Kaza namazı sayacı</Text>
          </TouchableOpacity>

          {/* 4. Dini Günler */}
          <TouchableOpacity style={styles.serviceCard} onPress={onNavigateToHolyDays} activeOpacity={0.8}>
            <View style={[styles.iconCircle, styles.diniCircle]}>
              <Text style={styles.serviceIcon}>📅</Text>
            </View>
            <Text style={styles.serviceName}>Dini Günler</Text>
            <Text style={styles.serviceDesc}>Kandil ve bayramlar</Text>
          </TouchableOpacity>

          {/* 5. Günün Hadisi */}
          <TouchableOpacity style={styles.serviceCard} onPress={onNavigateToHadith} activeOpacity={0.8}>
            <View style={[styles.iconCircle, styles.hadisCircle]}>
              <Text style={styles.serviceIcon}>📜</Text>
            </View>
            <Text style={styles.serviceName}>Hadis-i Şerifler</Text>
            <Text style={styles.serviceDesc}>Günün hadis ve tefsiri</Text>
          </TouchableOpacity>

          {/* 6. Zikirmatik */}
          <TouchableOpacity style={styles.serviceCard} onPress={onNavigateToZikirmatik} activeOpacity={0.8}>
            <View style={[styles.iconCircle, styles.zikirCircle]}>
              <Text style={styles.serviceIcon}>📿</Text>
            </View>
            <Text style={styles.serviceName}>Zikirmatik</Text>
            <Text style={styles.serviceDesc}>Dijital tesbih sayacı</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
  },
  compactHeader: {
    backgroundColor: '#0B3B24',
    paddingTop: 42,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#E5C158',
    marginTop: 2,
    fontWeight: '500',
  },
  headerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 18,
  },
  mainContentArea: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-evenly',
    paddingTop: 8,
    paddingBottom: 80,
  },
  quickSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#072A19', // Premium derin yeşil
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#072A19',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 8,
  },
  noLocationCard: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  noLocationVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 4,
  },
  noLocationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },
  noLocationDesc: {
    fontSize: 9.5,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 1,
    lineHeight: 14,
  },
  setupButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  setupButtonText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
  summaryLeft: {
    flex: 1,
  },
  summaryCity: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  summaryClock: {
    color: '#E5E7EB',
    fontSize: 10,
    marginTop: 2,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryVakitHeader: {
    color: '#E5C158',
    fontSize: 9,
    fontWeight: '700',
  },
  summaryTimer: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.light.textPrimary,
    marginBottom: 6,
    marginTop: 2,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.accent,
    paddingLeft: 6,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  serviceCard: {
    width: '48.5%',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  ezanCircle: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  kibleCircle: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  kazaCircle: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  diniCircle: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  hadisCircle: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  zikirCircle: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  serviceIcon: {
    fontSize: 18,
  },
  serviceName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  serviceDesc: {
    fontSize: 8.5,
    color: Colors.light.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
