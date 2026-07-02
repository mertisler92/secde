import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Colors, Spacing, Typography } from '../constants/theme';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ArchHeader } from '../components/IslamicMotif';

interface VakitlerScreenProps {
  location: { city: string; country: string } | null;
  onLocationSet: (loc: { city: string; country: string }) => void;
  onChangeLocation: () => void;
  onBack: () => void;
}

const CITIES_DATA: Record<string, string[]> = {
  'İstanbul': ['Fatih', 'Kadıköy', 'Üsküdar', 'Beşiktaş', 'Başakşehir', 'Esenyurt', 'Ümraniye'],
  'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Altındağ', 'Etimesgut'],
  'İzmir': ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Çeşme', 'Balçova'],
  'Bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım', 'İnegöl', 'Gemlik'],
  'Antalya': ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Alanya', 'Manavgat'],
};

export const VakitlerScreen: React.FC<VakitlerScreenProps> = ({
  location,
  onLocationSet,
  onChangeLocation,
  onBack,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Manuel Seçim State'leri
  const [isManualSetupActive, setIsManualSetupActive] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

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

  const handleGetGPSLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Konum izni reddedildi. Lütfen manuel seçim yapın.');
        setIsLoading(false);
        return;
      }
      await Location.getCurrentPositionAsync({});
      setTimeout(() => {
        onLocationSet({ city: 'Fatih, İstanbul', country: 'Türkiye' });
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      alert('Konum alınamadı, lütfen manuel seçim yapın.');
      setIsLoading(false);
    }
  };

  const handleSelectDistrict = (district: string) => {
    setIsLoading(true);
    setTimeout(() => {
      onLocationSet({ city: `${district}, ${selectedCity}`, country: 'Türkiye' });
      setIsLoading(false);
      setIsManualSetupActive(false);
      setSelectedCity(null);
    }, 600);
  };

  return (
    <View style={styles.container}>
      {/* Üst Yönlendirme Barı */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>← Ana Ekran</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Ezan Vakitleri</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {location === null ? (
          /* KONUM KURULUM EKRANI (EZAN VAKİTLERİ İÇİN ÖNCELİKLİ ADIM) */
          <View style={styles.onboardingContainer}>
            <ArchHeader
              title="Konum Kurulumu"
              subtitle="Ezan Vakitleri İçin Lütfen Şehir Seçimi Yapın"
              icon="📍"
            />

            <View style={styles.contentPadding}>
              {isManualSetupActive ? (
                <View style={styles.manualSetupCard}>
                  <View style={styles.manualHeaderRow}>
                    <TouchableOpacity 
                      onPress={() => {
                        if (selectedCity) {
                          setSelectedCity(null);
                        } else {
                          setIsManualSetupActive(false);
                        }
                      }} 
                      style={styles.inlineBackButton}
                    >
                      <Text style={styles.inlineBackButtonText}>← Geri</Text>
                    </TouchableOpacity>
                    <Text style={styles.manualCardTitle}>
                      {selectedCity ? `${selectedCity} - İlçe Seçin` : 'İl Seçimi Yapın'}
                    </Text>
                  </View>

                  {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginVertical: 30 }} />
                  ) : (
                    <ScrollView style={styles.manualScrollList} nestedScrollEnabled={true}>
                      {!selectedCity ? (
                        Object.keys(CITIES_DATA).map((city) => (
                          <TouchableOpacity
                            key={city}
                            style={styles.selectionRowItem}
                            onPress={() => setSelectedCity(city)}
                          >
                            <Text style={styles.selectionRowText}>{city}</Text>
                            <Text style={styles.chevronIcon}>→</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        CITIES_DATA[selectedCity].map((district) => (
                          <TouchableOpacity
                            key={district}
                            style={styles.selectionRowItem}
                            onPress={() => handleSelectDistrict(district)}
                          >
                            <Text style={styles.selectionRowText}>{district}</Text>
                            <Text style={styles.checkIcon}>✓</Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  )}
                </View>
              ) : (
                <View>
                  <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>Namaz Vakitlerini Aktifleştirin 🕌</Text>
                    <Text style={styles.welcomeBody}>
                      Diyanet veritabanı üzerinden bulunduğunuz bölgedeki ezan saatlerini listelemek ve ana sayfaya canlı geri sayım eklemek için konumunuzu ayarlayın.
                    </Text>
                  </View>

                  {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 20 }} />
                  ) : (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.gpsButton} onPress={handleGetGPSLocation} activeOpacity={0.85}>
                        <Text style={styles.gpsButtonText}>📍 Konumu Kullan</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.manualButton} onPress={() => setIsManualSetupActive(true)} activeOpacity={0.85}>
                        <Text style={styles.manualButtonText}>✍️ Konumu Kendim Seçeyim</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        ) : (
          /* NAMAZ VAKİTLERİ DASHBOARD GÖSTERİMİ */
          <View>
            <ArchHeader
              title={location.city}
              subtitle={`Bugünün Vakitleri | Saat: ${currentTime || '...'}`}
              icon="🕌"
            />

            <View style={styles.contentPadding}>
              <DisclaimerBanner />

              {/* Geri Sayım Kartı */}
              <View style={styles.countdownCard}>
                <Text style={styles.countdownHeader}>Şu Anki Vakit: <Text style={styles.vakitHighlight}>{vakitInfo.current}</Text></Text>
                <Text style={styles.countdownTimer}>
                  Bir Sonraki Vakit ({vakitInfo.next}): <Text style={styles.timeHighlight}>{vakitInfo.nextTime}</Text>
                </Text>
                <Text style={styles.liveClock}>Canlı Saat: {currentTime}</Text>
              </View>

              {/* Vakit Tablosu */}
              <Text style={styles.sectionHeaderTitle}>🕌 Günlük Vakitler</Text>
              
              <View style={styles.timesGrid}>
                <View style={[styles.timeRow, vakitInfo.current === 'İmsak' && styles.activeTimeRow]}>
                  <Text style={styles.timeName}>İmsak (Sahur)</Text>
                  <Text style={styles.timeVal}>{prayerTimes.imsak}</Text>
                </View>

                <View style={[styles.timeRow, vakitInfo.current === 'Güneş' && styles.activeTimeRow]}>
                  <Text style={styles.timeName}>Güneş</Text>
                  <Text style={styles.timeVal}>{prayerTimes.gunes}</Text>
                </View>

                <View style={[styles.timeRow, vakitInfo.current === 'Öğle' && styles.activeTimeRow]}>
                  <Text style={styles.timeName}>Öğle</Text>
                  <Text style={styles.timeVal}>{prayerTimes.ogle}</Text>
                </View>

                <View style={[styles.timeRow, vakitInfo.current === 'İkindi' && styles.activeTimeRow]}>
                  <Text style={styles.timeName}>İkindi</Text>
                  <Text style={styles.timeVal}>{prayerTimes.ikindi}</Text>
                </View>

                <View style={[styles.timeRow, vakitInfo.current === 'Akşam' && styles.activeTimeRow]}>
                  <Text style={styles.timeName}>Akşam (İftar)</Text>
                  <Text style={styles.timeVal}>{prayerTimes.aksam}</Text>
                </View>

                <View style={[styles.timeRow, vakitInfo.current === 'Yatsı' && styles.activeTimeRow]}>
                  <Text style={styles.timeName}>Yatsı</Text>
                  <Text style={styles.timeVal}>{prayerTimes.yatsi}</Text>
                </View>
              </View>

              {/* Konum Değiştirme Butonu */}
              <TouchableOpacity style={styles.changeLocButton} onPress={onChangeLocation} activeOpacity={0.8}>
                <Text style={styles.changeLocButtonText}>🔄 Farklı Şehir/Konum Seç</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.light.primary,
    marginRight: 70,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  contentPadding: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  onboardingContainer: {
    width: '100%',
  },
  welcomeCard: {
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
  welcomeTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  welcomeBody: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textPrimary,
    lineHeight: 22,
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
    marginTop: Spacing.sm,
  },
  gpsButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  gpsButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  manualButton: {
    backgroundColor: Colors.light.surface,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  manualButtonText: {
    color: Colors.light.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  // Manuel Seçim
  manualSetupCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  manualHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
    marginBottom: 10,
  },
  inlineBackButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  inlineBackButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  manualCardTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.light.primary,
    marginRight: 40,
  },
  manualScrollList: {
    maxHeight: 250,
  },
  selectionRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  selectionRowText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  chevronIcon: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  checkIcon: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Vakitler Dashboard Styles
  countdownCard: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.accent,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  countdownHeader: {
    fontSize: Typography.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  vakitHighlight: {
    color: '#E5C158',
    fontWeight: '800',
  },
  countdownTimer: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 6,
    textAlign: 'center',
  },
  timeHighlight: {
    color: '#E5C158',
  },
  liveClock: {
    fontSize: 11,
    color: '#E5E7EB',
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  timesGrid: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activeTimeRow: {
    backgroundColor: Colors.light.warningBackground,
    borderRadius: 12,
    borderColor: Colors.light.accent,
    borderWidth: 1,
  },
  timeName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  timeVal: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  changeLocButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  changeLocButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textDecorationLine: 'underline',
  },
});
