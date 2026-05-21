import React, { useMemo } from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../theme';
import { logoSpacing, styles } from './styles';

export type LogoSize = 'sm' | 'md' | 'lg';
export type LogoVariant = 'wordmark' | 'stacked';
export type LogoColorScheme = 'onHero' | 'onDark' | 'muted';

export interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  colorScheme?: LogoColorScheme;
  uniColor?: string;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const LINE_HEIGHT_RATIO = 1.12;

function getColorScheme(scheme: LogoColorScheme) {
  const { auth } = theme.colors;

  switch (scheme) {
    case 'onHero':
      return { uni: auth.text, accent: auth.accent };
    case 'muted':
      return { uni: auth.textSecondary, accent: auth.textSecondary };
    case 'onDark':
    default:
      return { uni: auth.text, accent: auth.accent };
  }
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'wordmark',
  colorScheme = 'onHero',
  uniColor,
  accentColor,
  style,
  accessibilityLabel = 'UniCarona',
}) => {
  const colors = getColorScheme(colorScheme);
  const resolvedUniColor = uniColor ?? colors.uni;
  const resolvedAccentColor = accentColor ?? colors.accent;

  const metrics = useMemo(() => {
    const fontSize = theme.typography.logo[size];
    return {
      fontSize,
      lineHeight: Math.round(fontSize * LINE_HEIGHT_RATIO),
      letterSpacing: size === 'lg' ? -0.8 : size === 'md' ? -0.5 : -0.3,
    };
  }, [size]);

  const uniStyle: TextStyle = {
    fontSize: metrics.fontSize,
    lineHeight: metrics.lineHeight,
    letterSpacing: metrics.letterSpacing,
    fontWeight: theme.typography.weights.semibold,
    color: resolvedUniColor,
  };

  const caronaStyle: TextStyle = {
    fontSize: metrics.fontSize,
    lineHeight: metrics.lineHeight,
    letterSpacing: metrics.letterSpacing,
    fontWeight: theme.typography.weights.extrabold,
    color: resolvedAccentColor,
  };

  if (variant === 'stacked') {
    return (
      <View
        style={[styles.stacked, logoSpacing, style]}
        accessibilityRole="header"
        accessibilityLabel={accessibilityLabel}
      >
        <Text style={uniStyle}>Uni</Text>
        <Text style={[caronaStyle, styles.stackedCarona]}>Carona</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.wordmark, logoSpacing, style]}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={uniStyle}>Uni</Text>
      <Text style={caronaStyle}>Carona</Text>
    </View>
  );
};
