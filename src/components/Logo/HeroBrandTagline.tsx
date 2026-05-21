import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { theme } from '../../theme';

export interface HeroBrandTaglineProps {
  prefix?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Destaque tipográfico "caronas uni" conforme o painel esquerdo do web.
 */
export const HeroBrandTagline: React.FC<HeroBrandTaglineProps> = ({
  prefix = 'Junte-se à maior comunidade de ',
  style,
}) => {
  return (
    <Text style={[styles.container, style]} accessibilityRole="header">
      {prefix}
      <Text>
        <Text style={styles.caronas}>caronas </Text>
        <Text style={styles.uni}>uni</Text>
      </Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.auth.text,
    lineHeight: 40,
    marginBottom: theme.spacing.sm,
  },
  caronas: {
    color: theme.colors.auth.text,
    fontWeight: theme.typography.weights.bold,
  },
  uni: {
    color: theme.colors.auth.accent,
    fontWeight: theme.typography.weights.extrabold,
    textTransform: 'lowercase',
  },
});
