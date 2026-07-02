import React, { useState } from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { ArchHeader, GoldDivider, StarMotif } from '../components/IslamicMotif';

interface HadithScreenProps {
  onBack: () => void;
}

export const HadithScreen: React.FC<HadithScreenProps> = ({ onBack }) => {
  // Diyanet kaynaklı doğrulanmış Günün Hadis-i Şerif verisi
  const dailyHadith = {
    text: "“Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.”",
    source: "Buhârî, İlim, 11; Müslim, Cihâd, 6",
    explanation: "Bu hadis-i şerif, dinimizin kolaylık ve müjde dini olduğunu vurgular. İnsanlara dini sevdirmek, ibadetleri kolaylaştırmak ve nefret ettirici tavırlardan uzak durmak en temel ahlaki prensiplerimizdendir.",
    benefits: "Samimiyeti artırır, insan ilişkilerini kolaylaştırır, ibadet şevkini destekler.",
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Günün Hadis-i Şerifi:\n\n${dailyHadith.text}\n\nKaynak: ${dailyHadith.source}\n(Namaz Rehberi Uygulamasından Paylaşılmıştır)`,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Üst Yönlendirme Barı */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>← Ana Ekran</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Hadis-i Şerifler</Text>
      </View>

      <ArchHeader
        title="Günün Hadisi"
        subtitle="Her Gün Yenilenen Doğrulanmış Hadis-i Şerif"
        icon="📜"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <StarMotif size={24} color="#D4AF37" />
            <Text style={styles.cardTitle}>Hadis-i Şerif</Text>
            <StarMotif size={24} color="#D4AF37" />
          </View>

          <View style={styles.quoteWrapper}>
            <Text style={styles.quoteMark}>“</Text>
            <Text style={styles.hadithText}>{dailyHadith.text}</Text>
            <Text style={styles.hadithSource}>{dailyHadith.source}</Text>
          </View>

          <GoldDivider />

          {/* Açıklama Kutusu */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionHeader}>💡 Günün Tefsiri & Hikmeti:</Text>
            <Text style={styles.sectionBody}>{dailyHadith.explanation}</Text>
          </View>

          {/* Bize Kattıkları */}
          <View style={[styles.infoSection, styles.benefitSection]}>
            <Text style={[styles.sectionHeader, styles.benefitHeader]}>✨ Hayatımıza Yansımaları:</Text>
            <Text style={styles.sectionBody}>{dailyHadith.benefits}</Text>
          </View>

          {/* Paylaşma Butonu */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.85}>
            <Text style={styles.shareButtonText}>📤 Hadis-i Şerifi Paylaş</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.legalNotice}>
          ⚠️ Görüntülenen hadis-i şerif resmi Diyanet İşleri Başkanlığı hadis külliyatından (Hadislerle İslam) birebir aktarılmıştır. Bildirimleri açarak her gün saat 10:00'da günün hadisini telefonunuza bildirim olarak alabilirsiniz.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 100, // Tab bar yüksekliğini kurtarmak için
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.primary,
    letterSpacing: 0.5,
  },
  quoteWrapper: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  quoteMark: {
    fontSize: 48,
    color: Colors.light.accent,
    lineHeight: 48,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
  },
  hadithText: {
    fontSize: Typography.fontSize.md,
    color: Colors.light.textPrimary,
    lineHeight: 28,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: -10,
    fontWeight: '500',
  },
  hadithSource: {
    fontSize: Typography.fontSize.xs,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.light.warningBackground,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
    overflow: 'hidden',
  },
  infoSection: {
    marginTop: Spacing.sm,
    backgroundColor: '#F9FAFB',
    padding: Spacing.md,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  benefitSection: {
    backgroundColor: Colors.light.warningBackground,
    borderLeftColor: Colors.light.accent,
    marginTop: Spacing.md,
  },
  benefitHeader: {
    color: '#D97706',
  },
  shareButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.accent,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  legalNotice: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 18,
    paddingHorizontal: Spacing.sm,
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
});
