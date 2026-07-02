import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { ArchHeader, GoldDivider, StarMotif } from '../components/IslamicMotif';

export const SettingsScreen: React.FC = () => {
  // Bildirim Ayarları State'leri
  const [hadithNotif, setHadithNotif] = useState(true);
  const [hadithHour, setHadithHour] = useState<number>(10);
  const [hadithMinute, setHadithMinute] = useState<number>(0);
  const [prayerTimeNotif, setPrayerTimeNotif] = useState(true);
  const [adhanSound, setAdhanSound] = useState(true);
  const [preWarning, setPreWarning] = useState(false);
  const [vibrationOnly, setVibrationOnly] = useState(false);

  // Destek Modalı Görünürlük State'i
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  // Destek Bölümü State'leri
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState<string>('');

  const supportPackages = [30, 50, 100, 250];

  const handleSelectPackage = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (text: string) => {
    setCustomAmount(text);
    setSelectedAmount(null);
  };

  const handleSupportSubmit = () => {
    const finalAmount = selectedAmount ? `${selectedAmount} ₺` : `${customAmount} ₺`;
    if (!selectedAmount && !customAmount) {
      Alert.alert('Hata', 'Lütfen destek olmak istediğiniz tutarı seçin veya girin.');
      return;
    }
    Alert.alert(
      'Gönüllü Destek',
      `Geliştiriciye ${finalAmount} tutarında gönüllü destek sağlama talebiniz oluşturuldu.\n\n(Ödeme altyapısı entegrasyon aşamasındadır.)`,
      [{ text: 'Tamam', onPress: () => setSupportModalVisible(false) }]
    );
  };

  return (
    <View style={styles.container}>
      <ArchHeader
        title="Ayarlar"
        subtitle="Bildirim Tercihleri ve Geliştirici Desteği"
        icon="⚙️"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* BÖLÜM 1: BİLDİRİM VE UYGULAMA AYARLARI */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>⚙️ Uygulama & Bildirim Ayarları</Text>

          {/* Günün Hadisi Bildirimi */}
          <View style={styles.settingRowBlock}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Günün Hadisi Bildirimi</Text>
                <Text style={styles.settingSubtitle}>Her gün belirleyeceğiniz saatte telefona bildirim olarak gönderilir.</Text>
              </View>
              <Switch
                value={hadithNotif}
                onValueChange={setHadithNotif}
                trackColor={{ false: '#E5E7EB', true: Colors.light.primaryLight }}
                thumbColor={hadithNotif ? Colors.light.primary : '#F3F4F6'}
              />
            </View>

            {hadithNotif && (
              <View style={styles.timePickerContainer}>
                <Text style={styles.timePickerLabel}>⏰ Bildirim Saati:</Text>
                <View style={styles.timePickerControls}>
                  {/* Saat Kontrolü */}
                  <View style={styles.timeControlGroup}>
                    <TouchableOpacity 
                      style={styles.timeAdjustBtn} 
                      onPress={() => setHadithHour(h => (h - 1 + 24) % 24)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.timeAdjustBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeValueText}>{String(hadithHour).padStart(2, '0')}</Text>
                    <TouchableOpacity 
                      style={styles.timeAdjustBtn} 
                      onPress={() => setHadithHour(h => (h + 1) % 24)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.timeAdjustBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.timeColon}>:</Text>

                  {/* Dakika Kontrolü */}
                  <View style={styles.timeControlGroup}>
                    <TouchableOpacity 
                      style={styles.timeAdjustBtn} 
                      onPress={() => setHadithMinute(m => (m - 5 + 60) % 60)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.timeAdjustBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeValueText}>{String(hadithMinute).padStart(2, '0')}</Text>
                    <TouchableOpacity 
                      style={styles.timeAdjustBtn} 
                      onPress={() => setHadithMinute(m => (m + 5) % 60)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.timeAdjustBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Namaz Vakti Bildirimleri */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Vakit Bildirimleri</Text>
              <Text style={styles.settingSubtitle}>Namaz vakti girdiğinde uyarı gönderilir.</Text>
            </View>
            <Switch
              value={prayerTimeNotif}
              onValueChange={setPrayerTimeNotif}
              trackColor={{ false: '#E5E7EB', true: Colors.light.primaryLight }}
              thumbColor={prayerTimeNotif ? Colors.light.primary : '#F3F4F6'}
            />
          </View>

          {/* Ezan Sesi */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Ezan Sesi</Text>
              <Text style={styles.settingSubtitle}>Vakit bildirimlerinde ezan sesi çalar.</Text>
            </View>
            <Switch
              disabled={!prayerTimeNotif}
              value={adhanSound}
              onValueChange={setAdhanSound}
              trackColor={{ false: '#E5E7EB', true: Colors.light.primaryLight }}
              thumbColor={adhanSound ? Colors.light.primary : '#F3F4F6'}
            />
          </View>

          {/* Vakit Öncesi Uyarı */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Vakit Öncesi Hatırlatma</Text>
              <Text style={styles.settingSubtitle}>Namaz vaktinden 15 dakika önce hatırlatır.</Text>
            </View>
            <Switch
              value={preWarning}
              onValueChange={setPreWarning}
              trackColor={{ false: '#E5E7EB', true: Colors.light.primaryLight }}
              thumbColor={preWarning ? Colors.light.primary : '#F3F4F6'}
            />
          </View>

          {/* Sadece Titreşim */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sadece Titreşim</Text>
              <Text style={styles.settingSubtitle}>Tüm bildirimler ses yerine sadece titrer.</Text>
            </View>
            <Switch
              value={vibrationOnly}
              onValueChange={setVibrationOnly}
              trackColor={{ false: '#E5E7EB', true: Colors.light.primaryLight }}
              thumbColor={vibrationOnly ? Colors.light.primary : '#F3F4F6'}
            />
          </View>

          {/* Geliştiriciye Destek Ol (Satır Olarak Eklendi) */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Geliştiriciye Destek Ol</Text>
              <Text style={styles.settingSubtitle}>Gönüllü destek paketlerini inceleyin.</Text>
            </View>
            <TouchableOpacity
              style={styles.inlineButton}
              onPress={() => setSupportModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.inlineButtonText}>Destek Ol</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BÖLÜM 2: GİZLİLİK & KVKK */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>🔒 Gizlilik ve Veri Güvenliği</Text>
          <Text style={styles.privacyText}>
            Uygulamamız gizlilik odaklıdır. Konum verileriniz sadece anlık namaz vakitlerini ve kıbleyi hesaplamak için yerel olarak cihazınızda işlenir. Sunucularımızda kesinlikle saklanmaz veya üçüncü taraflarla paylaşılmaz.
          </Text>
          <Text style={styles.kvkkLink}>KVKK ve Kullanım Sözleşmesi</Text>
        </View>

        <Text style={styles.footerText}>Namaz Rehberi v1.0.0</Text>
      </ScrollView>

      {/* Geliştiriciye Destek Ol Modalı (Yerel Modal yerine cihaz içi absolute overlay kullanıldı) */}
      {supportModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <StarMotif size={20} color="#D4AF37" />
              <Text style={styles.modalHeaderTitle}>Geliştiriciye Destek Ol</Text>
              <StarMotif size={20} color="#D4AF37" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <Text style={styles.supportDescription}>
                Bu uygulamayı faydalı buluyorsanız, reklamsız ve kesintisiz geliştirilmesine katkı sağlamak amacıyla gönüllü olarak destek olabilirsiniz. Destek vermek tamamen isteğe bağlıdır ve temel özellikleri kullanmak için zorunlu değildir.
              </Text>

              <View style={styles.packagesGrid}>
                {supportPackages.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.packageCard,
                      selectedAmount === amount && styles.selectedPackageCard,
                    ]}
                    onPress={() => handleSelectPackage(amount)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.packageAmount,
                        selectedAmount === amount && styles.selectedPackageText,
                      ]}
                    >
                      {amount} ₺
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.customInputLabel}>Veya Farklı Bir Tutar Belirtin (₺)</Text>
              <TextInput
                style={styles.customInput}
                placeholder="Örn: 150"
                keyboardType="numeric"
                value={customAmount}
                onChangeText={handleCustomAmountChange}
              />

              <TouchableOpacity style={styles.supportSubmitButton} onPress={handleSupportSubmit} activeOpacity={0.85}>
                <Text style={styles.supportSubmitButtonText}>
                  {selectedAmount
                    ? `${selectedAmount} ₺ ile Destek Sağla`
                    : customAmount
                    ? `${customAmount} ₺ ile Destek Sağla`
                    : 'Tutar Seçiniz'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSupportModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Kapat</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
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
    paddingBottom: 100, // Tab bar taşmaması için
  },
  sectionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  settingTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  settingSubtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  inlineButton: {
    backgroundColor: Colors.light.warningBackground,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  inlineButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  privacyText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  kvkkLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginTop: Spacing.sm,
    textDecorationLine: 'underline',
  },
  footerText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    zIndex: 9999,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalHeaderTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  modalScroll: {
    width: '100%',
  },
  supportDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  packageCard: {
    width: '48%',
    backgroundColor: Colors.light.background,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  selectedPackageCard: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.warningBackground,
  },
  packageAmount: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.primary,
  },
  selectedPackageText: {
    color: Colors.light.primary,
  },
  customInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  customInput: {
    backgroundColor: Colors.light.background,
    padding: Spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.md,
  },
  supportSubmitButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.accent,
    marginBottom: Spacing.sm,
  },
  supportSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  modalCloseButton: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalCloseButtonText: {
    color: Colors.light.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  // Hadis Saati Seçici Stilleri
  settingRowBlock: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 4,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 12,
    marginTop: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timePickerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  timePickerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 4,
  },
  timeAdjustBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeAdjustBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  timeValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    width: 24,
    textAlign: 'center',
  },
  timeColon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.textSecondary,
  },
});
