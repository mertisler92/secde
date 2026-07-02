import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { ArchHeader, StarMotif } from '../components/IslamicMotif';

interface HolyDaysScreenProps {
  onBack: () => void;
}

// 2026 Dini Günler ve Geceler Veri Listesi (Resmi Diyanet Takvimi)
const HOLY_DAYS_2026 = [
  { name: 'Miraç Kandili', dateStr: '15 Ocak 2026', date: new Date('2026-01-15') },
  { name: 'Berat Kandili', dateStr: '2 Şubat 2026', date: new Date('2026-02-02') },
  { name: 'Ramazan Başlangıcı', dateStr: '19 Şubat 2026', date: new Date('2026-02-19') },
  { name: 'Kadir Gecesi', dateStr: '16 Mart 2026', date: new Date('2026-03-16') },
  { name: 'Ramazan Bayramı (1. Gün)', dateStr: '20 Mart 2026', date: new Date('2026-03-20') },
  { name: 'Kurban Bayramı (1. Gün)', dateStr: '27 Mayıs 2026', date: new Date('2026-05-27') },
  { name: 'Hicri Yılbaşı (1448)', dateStr: '16 Haziran 2026', date: new Date('2026-06-16') },
  { name: 'Aşure Günü', dateStr: '25 Haziran 2026', date: new Date('2026-06-25') },
  { name: 'Mevlid Kandili', dateStr: '24 Ağustos 2026', date: new Date('2026-08-24') },
  { name: 'Üç Ayların Başlangıcı', dateStr: '10 Aralık 2026', date: new Date('2026-12-10') },
  { name: 'Regaib Kandili', dateStr: '10 Aralık 2026', date: new Date('2026-12-10') },
];

export const HolyDaysScreen: React.FC<HolyDaysScreenProps> = ({ onBack }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Karşılaştırma için saati sıfırla

  const getRemainingDays = (targetDate: Date) => {
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>← Ana Ekran</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Dini Takvim</Text>
      </View>

      <ArchHeader
        title="Dini Günler & Geceler"
        subtitle="2026 Yılı Hicri/Miladi Özel Gün Takvimi"
        icon="📅"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardInfoTitle}>📌 Mübarek Günler ve Geceler</Text>
          <Text style={styles.cardInfoDesc}>
            Aşağıda 2026 (Hicri 1447-1448) yılına ait önemli geceler, kandiller ve bayram günlerinin listesi ve kalan süreler yer almaktadır.
          </Text>
        </View>

        {HOLY_DAYS_2026.map((item, idx) => {
          const remainingDays = getRemainingDays(item.date);
          const isPassed = remainingDays < 0;
          const isToday = remainingDays === 0;

          return (
            <View key={idx} style={[styles.dayRow, isPassed && styles.passedRow, isToday && styles.todayRow]}>
              <View style={styles.dayInfo}>
                <View style={styles.titleRow}>
                  <StarMotif size={12} color={isPassed ? '#9CA3AF' : '#D4AF37'} />
                  <Text style={[styles.dayName, isPassed && styles.passedText]}>{item.name}</Text>
                </View>
                <Text style={styles.dayDate}>{item.dateStr}</Text>
              </View>

              <View style={styles.badgeContainer}>
                {isPassed ? (
                  <Text style={styles.passedBadge}>Tamamlandı</Text>
                ) : isToday ? (
                  <Text style={styles.todayBadge}>Bugün!</Text>
                ) : (
                  <View style={styles.upcomingBadge}>
                    <Text style={styles.remainingText}>{remainingDays} Gün Kaldı</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
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
    marginRight: 70, // Geri butonuyla merkezlemek için
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.md,
  },
  cardInfoTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  cardInfoDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 8,
  },
  passedRow: {
    opacity: 0.65,
    backgroundColor: '#F9FAFB',
  },
  todayRow: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
    backgroundColor: Colors.light.warningBackground,
  },
  dayInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  passedText: {
    color: Colors.light.textSecondary,
  },
  dayDate: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
    marginLeft: 18,
  },
  badgeContainer: {
    marginLeft: Spacing.sm,
  },
  passedBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  todayBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: Colors.light.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  upcomingBadge: {
    backgroundColor: Colors.light.warningBackground,
    borderWidth: 1,
    borderColor: Colors.light.accent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  remainingText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
  },
});
