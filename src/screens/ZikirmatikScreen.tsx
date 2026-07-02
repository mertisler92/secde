import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Typography } from '../constants/theme';
import { ArchHeader, StarMotif } from '../components/IslamicMotif';

interface ZikirmatikScreenProps {
  onBack: () => void;
}

interface DhikrPreset {
  name: string;
  target: number;
}

const PRESETS: DhikrPreset[] = [
  { name: 'Sübhanallah', target: 33 },
  { name: 'Elhamdülillah', target: 33 },
  { name: 'Allahu Ekber', target: 33 },
  { name: 'Lâ ilâhe illallâh', target: 100 },
  { name: 'Estâğfirullâh', target: 100 },
];

export const ZikirmatikScreen: React.FC<ZikirmatikScreenProps> = ({ onBack }) => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState<boolean>(true);

  // AsyncStorage Anahtarları
  const COUNT_KEY = '@zikirmatik_count';
  const PRESET_KEY = '@zikirmatik_preset_idx';
  const VIB_KEY = '@zikirmatik_vibration';

  // Mount anında hafızadaki verileri yükle
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedCount = await AsyncStorage.getItem(COUNT_KEY);
        const savedPresetIdx = await AsyncStorage.getItem(PRESET_KEY);
        const savedVib = await AsyncStorage.getItem(VIB_KEY);

        if (savedCount !== null) {
          setCount(parseInt(savedCount, 10));
        }
        if (savedPresetIdx !== null) {
          setSelectedPresetIdx(parseInt(savedPresetIdx, 10));
        }
        if (savedVib !== null) {
          setIsVibrationEnabled(savedVib === 'true');
        }
      } catch (e) {
        console.log('Zikirmatik verileri yüklenirken hata:', e);
      }
    };
    loadPersistedData();
  }, []);

  const activePreset = PRESETS[selectedPresetIdx];

  const handleIncrement = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    AsyncStorage.setItem(COUNT_KEY, nextCount.toString()).catch(() => {});

    // Titreşim tetikle
    if (isVibrationEnabled && Platform.OS !== 'web') {
      if (nextCount === activePreset.target) {
        // Hedefe ulaşınca ritmik titreşim
        Vibration.vibrate([0, 150, 100, 150]);
      } else {
        // Normal tıklama için kısa titreşim
        Vibration.vibrate(60);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    AsyncStorage.setItem(COUNT_KEY, '0').catch(() => {});
  };

  const handlePresetSelect = (idx: number) => {
    setSelectedPresetIdx(idx);
    setCount(0);
    AsyncStorage.setItem(PRESET_KEY, idx.toString()).catch(() => {});
    AsyncStorage.setItem(COUNT_KEY, '0').catch(() => {});
  };

  const handleToggleVibration = () => {
    const nextVal = !isVibrationEnabled;
    setIsVibrationEnabled(nextVal);
    AsyncStorage.setItem(VIB_KEY, nextVal.toString()).catch(() => {});
  };

  return (
    <View style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>← Ana Ekran</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Zikirmatik</Text>
      </View>

      <ArchHeader
        title="Zikirmatik"
        subtitle="Hafif Titreşim Geri Bildirimli Tesbih Sayacı"
        icon="📿"
      />

      <View style={styles.content}>
        {/* Preset Zikir Seçiciler */}
        <View style={styles.presetsWrapper}>
          <Text style={styles.presetsLabel}>📿 Zikir Seçin:</Text>
          <View style={styles.presetsGrid}>
            {PRESETS.map((preset, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.presetTab,
                  selectedPresetIdx === idx && styles.presetTabActive,
                ]}
                onPress={() => handlePresetSelect(idx)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.presetTabText,
                    selectedPresetIdx === idx && styles.presetTabTextActive,
                  ]}
                >
                  {preset.name}
                </Text>
                <Text
                  style={[
                    styles.presetTargetText,
                    selectedPresetIdx === idx && styles.presetTargetTextActive,
                  ]}
                >
                  (Hedef: {preset.target})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dijital Sayaç Gösterge Alanı */}
        <View style={styles.counterDisplayCard}>
          <Text style={styles.presetLabelInfo}>{activePreset.name}</Text>
          <Text style={styles.countText}>{count}</Text>
          <Text style={styles.targetLabelInfo}>
            Hedef: {activePreset.target} • {count >= activePreset.target ? 'Tamamlandı! 🎉' : `${activePreset.target - count} kaldı`}
          </Text>
        </View>

        {/* Tıklama Alanı (Büyük Yuvarlak Buton ve Yanında Küçük Sıfırlama Butonu) */}
        <View style={styles.tapAreaRow}>
          {/* Boş dengeleyici (sol tarafı simetrik tutmak için) */}
          <View style={styles.sidePlaceholder} />

          {/* Büyük Sayaç Butonu */}
          <TouchableOpacity
            style={[styles.mainTapButton, count >= activePreset.target && styles.mainTapButtonTargetMet]}
            onPress={handleIncrement}
            activeOpacity={0.9}
          >
            <View style={styles.innerTapCircle}>
              <Text style={styles.tapButtonText}>ZEKRET</Text>
              <Text style={styles.tapSubText}>dokun</Text>
            </View>
          </TouchableOpacity>

          {/* Küçük Sıfırlama Butonu (Fiziksel Zikirmatiklerdeki gibi) */}
          <TouchableOpacity
            style={styles.physicalResetBtn}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Text style={styles.physicalResetIcon}>🔄</Text>
            <Text style={styles.physicalResetText}>SIFIRLA</Text>
          </TouchableOpacity>
        </View>

        {/* Alt Kontroller (Titreşim Aç/Kapat) */}
        <View style={styles.bottomControls}>
          <TouchableOpacity 
            style={[styles.controlBtn, styles.vibrateBtn]} 
            onPress={handleToggleVibration}
            activeOpacity={0.85}
          >
            <Text style={styles.controlBtnText}>
              {isVibrationEnabled ? '📳 Titreşim Açık' : '🔕 Titreşim Kapalı'}
            </Text>
          </TouchableOpacity>
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
    marginRight: 70, // Geri butonuyla ortalamak için
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: 85,
    justifyContent: 'space-between',
  },
  presetsWrapper: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  presetsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetTab: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetTabActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.accent,
  },
  presetTabText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  presetTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  presetTargetText: {
    fontSize: 8,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  presetTargetTextActive: {
    color: '#E5C158',
  },
  // Counter Display
  counterDisplayCard: {
    backgroundColor: '#0F2C1F', // Koyu yeşil şık dijital arkaplan
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
    padding: 16,
    alignItems: 'center',
    marginVertical: 12,
  },
  presetLabelInfo: {
    fontSize: Typography.fontSize.sm,
    color: '#D4AF37',
    fontWeight: '700',
  },
  countText: {
    fontSize: 54,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', // Dijital sayaç havası
    fontWeight: 'bold',
    color: '#10B981', // Fosforlu yeşil
    marginVertical: 4,
  },
  targetLabelInfo: {
    fontSize: 10,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  // Tap Button Area
  tapAreaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
    width: '100%',
  },
  sidePlaceholder: {
    width: 60,
  },
  physicalResetBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  physicalResetIcon: {
    fontSize: 14,
  },
  physicalResetText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 1,
  },
  mainTapButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.light.primary,
    borderWidth: 6,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  mainTapButtonTargetMet: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  innerTapCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  tapSubText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 9,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  // Controls
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 6,
  },
  controlBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  vibrateBtn: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
  },
  resetBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  controlBtnText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  resetBtnText: {
    color: '#DC2626',
  },
});
