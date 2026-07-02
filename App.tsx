import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { PrayersScreen } from './src/screens/PrayersScreen';
import { VakitlerScreen } from './src/screens/VakitlerScreen';
import { QiblaScreen } from './src/screens/QiblaScreen';
import { HadithScreen } from './src/screens/HadithScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { KazaTrackerScreen } from './src/screens/KazaTrackerScreen';
import { HolyDaysScreen } from './src/screens/HolyDaysScreen';
import { ZikirmatikScreen } from './src/screens/ZikirmatikScreen';
import { IPhoneShell } from './src/components/IPhoneShell';
import { Colors } from './src/constants/theme';

type ScreenType = 
  | 'HOME' 
  | 'PRAYERS' 
  | 'VAKITLER' 
  | 'QIBLA' 
  | 'HADITH' 
  | 'SETTINGS' 
  | 'KAZA' 
  | 'HOLY_DAYS' 
  | 'ZIKIRMATIK';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HOME');
  const [location, setLocation] = useState<{ city: string; country: string } | null>(null);

  return (
    <IPhoneShell>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />

        <View style={styles.contentArea}>
          {/* 1. Super App Portalı / Ana Sayfa */}
          {currentScreen === 'HOME' && (
            <HomeScreen
              location={location}
              onNavigateToVakitler={() => setCurrentScreen('VAKITLER')}
              onNavigateToQibla={() => setCurrentScreen('QIBLA')}
              onNavigateToKaza={() => setCurrentScreen('KAZA')}
              onNavigateToHolyDays={() => setCurrentScreen('HOLY_DAYS')}
              onNavigateToHadith={() => setCurrentScreen('HADITH')}
              onNavigateToZikirmatik={() => setCurrentScreen('ZIKIRMATIK')}
            />
          )}

          {/* 2. Namaz Asistanı (Dualar ve Sureler) */}
          {currentScreen === 'PRAYERS' && (
            <PrayersScreen />
          )}

          {/* 3. Ayarlar */}
          {currentScreen === 'SETTINGS' && (
            <SettingsScreen />
          )}

          {/* Sub-Screens (Hizmetler - Ezan, Kıble, Kaza, Dini Günler, Hadis, Zikirmatik) */}
          {currentScreen === 'VAKITLER' && (
            <VakitlerScreen
              location={location}
              onLocationSet={(loc) => setLocation(loc)}
              onChangeLocation={() => setLocation(null)}
              onBack={() => setCurrentScreen('HOME')}
            />
          )}

          {currentScreen === 'QIBLA' && (
            <QiblaScreen onBack={() => setCurrentScreen('HOME')} />
          )}

          {currentScreen === 'HADITH' && (
            <HadithScreen onBack={() => setCurrentScreen('HOME')} />
          )}

          {currentScreen === 'KAZA' && (
            <KazaTrackerScreen onBack={() => setCurrentScreen('HOME')} />
          )}

          {currentScreen === 'HOLY_DAYS' && (
            <HolyDaysScreen onBack={() => setCurrentScreen('HOME')} />
          )}

          {currentScreen === 'ZIKIRMATIK' && (
            <ZikirmatikScreen onBack={() => setCurrentScreen('HOME')} />
          )}
        </View>

        {/* Sabit Alt Menü / Tab Bar Navigation (Yalnızca 3 Buton: Dualar, Ana Sayfa, Ayarlar) */}
        <View style={styles.tabBarContainer}>
          {/* Arka Plan ve Normal Sekmeler */}
          <View style={styles.tabBar}>
            {/* Sol: Namaz Asistanı */}
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('PRAYERS')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabIcon, currentScreen === 'PRAYERS' && styles.activeTabColor]}>📖</Text>
              <Text style={[styles.tabLabel, currentScreen === 'PRAYERS' && styles.activeTabColor]}>
                Namaz{'\n'}Asistanı
              </Text>
            </TouchableOpacity>

            {/* Orta Boşluk (Yüzen Ana Sayfa butonu için) */}
            <View style={styles.tabItemPlaceholder} />

            {/* Sağ: Ayarlar */}
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('SETTINGS')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabIcon, currentScreen === 'SETTINGS' && styles.activeTabColor]}>⚙️</Text>
              <Text style={[styles.tabLabel, currentScreen === 'SETTINGS' && styles.activeTabColor]}>
                Ayarlar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Orta Yüzen Ana Sayfa (Secde) Butonu */}
          <View style={styles.floatingButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.floatingButton,
                currentScreen === 'HOME' && styles.activeFloatingButton,
              ]}
              onPress={() => setCurrentScreen('HOME')}
              activeOpacity={0.9}
            >
              <Text style={styles.floatingButtonIcon}>🕌</Text>
            </TouchableOpacity>
            <Text style={[styles.floatingButtonLabel, currentScreen === 'HOME' && styles.activeTabColor]}>
              Secde
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </IPhoneShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentArea: {
    flex: 1,
  },
  // Tab Bar Container
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: Colors.light.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  tabItemPlaceholder: {
    width: 90,
  },
  tabIcon: {
    fontSize: 20,
    color: '#94A3B8',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
    lineHeight: 12,
  },
  activeTabColor: {
    color: '#0B3B24',
    fontWeight: '800',
  },
  // Floating Center Button
  floatingButtonWrapper: {
    position: 'absolute',
    top: 4,
    alignItems: 'center',
    zIndex: 1001,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0B3B24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  activeFloatingButton: {
    backgroundColor: '#0B3B24',
    borderColor: '#D4AF37',
  },
  floatingButtonIcon: {
    fontSize: 20,
  },
  floatingButtonLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
    lineHeight: 12,
  },
});
