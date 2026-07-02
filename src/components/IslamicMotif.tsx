import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface StarMotifProps {
  size?: number;
  color?: string;
}

export const StarMotif: React.FC<StarMotifProps> = ({ size = 24, color = Colors.light.accent }) => {
  return (
    <View style={[styles.starContainer, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.75, color, textAlign: 'center', lineHeight: size }}>۞</Text>
    </View>
  );
};

export const GoldDivider: React.FC = () => {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerStar}>۞</Text>
      <View style={styles.dividerLine} />
    </View>
  );
};

export const ArchHeader: React.FC<{ title: string; subtitle?: string; icon?: string }> = ({
  title,
  subtitle,
  icon = '🕌',
}) => {
  return (
    <View style={styles.archContainer}>
      <View style={styles.archTop}>
        <Text style={styles.archIcon}>{icon}</Text>
      </View>
      <Text style={styles.archTitle}>{title}</Text>
      {subtitle && <Text style={styles.archSubtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5C158',
    opacity: 0.4,
  },
  dividerStar: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  archContainer: {
    backgroundColor: '#0B3B24',
    paddingTop: 36,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 3,
    borderBottomColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  archTop: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    marginBottom: 10,
  },
  archIcon: {
    fontSize: 26,
  },
  archTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  archSubtitle: {
    fontSize: 13,
    color: '#E5C158',
    marginTop: 4,
    fontWeight: '500',
  },
});
