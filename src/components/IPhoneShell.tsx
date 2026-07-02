import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';

interface IPhoneShellProps {
  children: React.ReactNode;
}

export const IPhoneShell: React.FC<IPhoneShellProps> = ({ children }) => {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.webBackdrop}>
      {/* iPhone Kasa Çerçevesi */}
      <View style={styles.iphoneFrame}>
        {/* Titanyum Kenar Işıltısı */}
        <View style={styles.innerBezel}>
          {/* Ekran Alanı */}
          <View style={styles.screenArea}>
            {/* iOS Status Bar */}
            <View style={styles.statusBar}>
              <Text style={styles.statusTime}>09:41</Text>
              
              {/* Dynamic Island */}
              <View style={styles.dynamicIsland}>
                <View style={styles.cameraLens} />
              </View>

              <View style={styles.statusIcons}>
                <Text style={styles.iconText}>📶</Text>
                <Text style={styles.iconText}>📡</Text>
                <Text style={styles.iconText}>🔋</Text>
              </View>
            </View>

            {/* İç İçerik (Uygulama Ekranları) */}
            <View style={styles.appContent}>
              {children}
            </View>

            {/* iOS Home Indicator Bar */}
            <View style={styles.homeIndicatorContainer}>
              <View style={styles.homeIndicator} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webBackdrop: {
    flex: 1,
    backgroundColor: '#0F172A', // Derin Gece Mavisi Studio Arka Planı
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    minHeight: '100vh' as any,
  },
  iphoneFrame: {
    width: 393,
    height: 844,
    backgroundColor: '#1E293B', // Titanyum Koyu Gri Kasa
    borderRadius: 50,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.6,
    shadowRadius: 35,
    elevation: 25,
    borderWidth: 2,
    borderColor: '#334155',
  },
  innerBezel: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 40,
    padding: 3,
    overflow: 'hidden',
  },
  screenArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  statusBar: {
    height: 48,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    zIndex: 999,
  },
  statusTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    width: 50,
  },
  dynamicIsland: {
    width: 110,
    height: 30,
    backgroundColor: '#000000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  cameraLens: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 4,
    width: 60,
    justifyContent: 'flex-end',
  },
  iconText: {
    fontSize: 12,
  },
  appContent: {
    flex: 1,
  },
  homeIndicatorContainer: {
    height: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
    opacity: 0.8,
  },
});
