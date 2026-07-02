import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface DisclaimerBannerProps {
  lastVerifiedAt?: string;
  isWarning?: boolean;
  warningMessage?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  lastVerifiedAt,
  isWarning,
  warningMessage,
}) => {
  if (isWarning && warningMessage) {
    return (
      <View style={[styles.container, styles.warningContainer]}>
        <Text style={styles.warningText}>⚠️ {warningMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        <Text style={styles.iconText}>📜</Text>
        <View style={styles.textColumn}>
          <Text style={styles.disclaimerText}>
            Namaz vakitleri resmi Diyanet İşleri Başkanlığı verileriyle doğrulanarak sunulur.
          </Text>
          {lastVerifiedAt && (
            <Text style={styles.timestampText}>
              ✓ Son resmi doğrulama: {new Date(lastVerifiedAt).toLocaleString('tr-TR')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginVertical: Spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.accent,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  warningContainer: {
    backgroundColor: Colors.light.warningBackground,
    borderLeftColor: Colors.light.warning,
    borderColor: '#F59E0B',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconText: {
    fontSize: 20,
    marginTop: 2,
  },
  textColumn: {
    flex: 1,
  },
  disclaimerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  warningText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.warning,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 20,
  },
  timestampText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.light.primary,
    marginTop: Spacing.xs,
    fontWeight: Typography.fontWeight.bold,
  },
});
