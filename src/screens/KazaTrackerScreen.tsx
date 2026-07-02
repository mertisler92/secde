import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { ArchHeader, StarMotif } from '../components/IslamicMotif';

interface KazaTrackerScreenProps {
  onBack: () => void;
}

interface KazaItem {
  id: string;
  name: string;
  count: number;
  icon: string;
  subText: string;
}

export const KazaTrackerScreen: React.FC<KazaTrackerScreenProps> = ({ onBack }) => {
  // Aktif sekme: 'NAMAZ' veya 'ORUC'
  const [activeTab, setActiveTab] = useState<'NAMAZ' | 'ORUC'>('NAMAZ');

  // Sayaç state'leri
  const [namazKazalari, setNamazKazalari] = useState<KazaItem[]>([
    { id: 'sabah', name: 'Sabah Namazı', count: 0, icon: '🌅', subText: '2 Rekat Farz' },
    { id: 'ogle', name: 'Öğle Namazı', count: 0, icon: '☀️', subText: '4 Rekat Farz' },
    { id: 'ikindi', name: 'İkindi Namazı', count: 0, icon: '🌇', subText: '4 Rekat Farz' },
    { id: 'aksam', name: 'Akşam Namazı', count: 0, icon: '🌆', subText: '3 Rekat Farz' },
    { id: 'yatsi', name: 'Yatsı Namazı', count: 0, icon: '🌃', subText: '4 Rekat Farz' },
    { id: 'vitir', name: 'Vitir Namazı', count: 0, icon: '✨', subText: '3 Rekat Vacip' },
  ]);

  const [orucKazalari, setOrucKazalari] = useState<KazaItem[]>([
    { id: 'oruc', name: 'Ramazan Orucu', count: 0, icon: '🌙', subText: 'Gün Bazlı Oruç Borcu' },
  ]);

  const updateCount = (tab: 'NAMAZ' | 'ORUC', id: string, delta: number) => {
    const updateFn = tab === 'NAMAZ' ? setNamazKazalari : setOrucKazalari;
    updateFn((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newCount = Math.max(0, item.count + delta);
          return { ...item, count: newCount };
        }
        return item;
      })
    );
  };

  const handleResetSection = (tab: 'NAMAZ' | 'ORUC') => {
    const message = `Tüm ${tab === 'NAMAZ' ? 'kaza namazı' : 'kaza orucu'} sayaçlarınızı sıfırlamak istediğinizden emin misiniz?`;
    
    if (Platform.OS === 'web') {
      const confirmReset = window.confirm(message);
      if (confirmReset) {
        const updateFn = tab === 'NAMAZ' ? setNamazKazalari : setOrucKazalari;
        updateFn((prev) => prev.map((item) => ({ ...item, count: 0 })));
      }
    } else {
      Alert.alert(
        'Sıfırlama Onayı',
        message,
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sıfırla',
            style: 'destructive',
            onPress: () => {
              const updateFn = tab === 'NAMAZ' ? setNamazKazalari : setOrucKazalari;
              updateFn((prev) => prev.map((item) => ({ ...item, count: 0 })));
            },
          },
        ]
      );
    }
  };

  // Toplam kaza miktarları hesaplama
  const totalNamazKazasi = namazKazalari.reduce((sum, item) => sum + item.count, 0);
  const totalOrucKazasi = orucKazalari.reduce((sum, item) => sum + item.count, 0);

  const activeList = activeTab === 'NAMAZ' ? namazKazalari : orucKazalari;

  return (
    <View style={styles.container}>
      {/* Üst Yönlendirme Barı */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>← Ana Ekran</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Kaza Defteri</Text>
      </View>

      <ArchHeader
        title="Kaza Takipçisi"
        subtitle="İbadet Borçlarınızı Kolayca Hesaplayın ve Takip Edin"
        icon="📊"
      />

      {/* Üst Özet Bilgi Kartı */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Toplam Namaz Kazası</Text>
          <Text style={styles.summaryValue}>{totalNamazKazasi} Vakit</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Toplam Oruç Kazası</Text>
          <Text style={styles.summaryValue}>{totalOrucKazasi} Gün</Text>
        </View>
      </View>

      {/* Kategori Sekmeleri (Namaz / Oruç) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'NAMAZ' && styles.activeTabButton]}
          onPress={() => setActiveTab('NAMAZ')}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabButtonText, activeTab === 'NAMAZ' && styles.activeTabButtonText]}>
            🕌 Namaz Kazaları
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ORUC' && styles.activeTabButton]}
          onPress={() => setActiveTab('ORUC')}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabButtonText, activeTab === 'ORUC' && styles.activeTabButtonText]}>
            🌙 Oruç Kazaları
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sayaç Kartları Listesi */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeList.map((item) => (
          <View key={item.id} style={styles.kazaCard}>
            {/* Üst Sıra: İsim, Alt Bilgi ve Büyük Sayaç Kontrolleri */}
            <View style={styles.cardMainRow}>
              <View style={styles.cardHeaderInfo}>
                <Text style={styles.cardIconText}>{item.icon} {item.name}</Text>
                <Text style={styles.cardSubText}>{item.subText}</Text>
              </View>

              {/* Büyük Dokunmatik Sayaç */}
              <View style={styles.counterWrapper}>
                <TouchableOpacity
                  style={[styles.counterBtn, styles.btnMinus]}
                  onPress={() => updateCount(activeTab, item.id, -1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>

                <View style={styles.countNumberBox}>
                  <Text style={styles.countNumber}>{item.count}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.counterBtn, styles.btnPlus]}
                  onPress={() => updateCount(activeTab, item.id, 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>


          </View>
        ))}

        {/* Sıfırlama Butonu */}
        <TouchableOpacity
          style={styles.resetSectionBtn}
          onPress={() => handleResetSection(activeTab)}
          activeOpacity={0.8}
        >
          <Text style={styles.resetSectionBtnText}>
            🗑️ Bu Bölümü Sıfırla
          </Text>
        </TouchableOpacity>
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
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#0F2C1F', // Koyu yeşil şık tasarım
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 9.5,
    color: '#E5C158',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  summaryDivider: {
    width: 1.5,
    height: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activeTabButtonText: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: 100,
  },
  kazaCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1.5,
  },
  cardMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardIconText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  cardSubText: {
    fontSize: 9.5,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  counterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  btnMinus: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  btnPlus: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: Platform.OS === 'ios' ? -1 : 0,
  },
  countNumberBox: {
    minWidth: 44,
    height: 36,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNumber: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.light.primary,
  },

  resetSectionBtn: {
    marginTop: Spacing.sm,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetSectionBtnText: {
    color: '#DC2626',
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
});
