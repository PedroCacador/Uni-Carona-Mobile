import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { authLayoutStyles } from '../../styles/authLayout';
import { theme } from '../../theme';
import { BenefitsList } from '../BenefitsList';
import { HeroBrandTagline } from '../Logo/HeroBrandTagline';
import { Logo } from '../Logo';

export interface AuthHeroSectionProps {
  badgeLabel: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const AuthHeroSection: React.FC<AuthHeroSectionProps> = ({
  badgeLabel,
  subtitle = 'Grátis para estudantes. Sem taxas, sem complicações. Comece agora.',
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <View style={authLayoutStyles.hero}>
      <View style={authLayoutStyles.heroDecorLarge} />
      <View style={authLayoutStyles.heroDecorSmall} />

      {showBackButton && onBackPress && (
        <Pressable
          style={authLayoutStyles.backButton}
          onPress={onBackPress}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Feather
            name="arrow-left"
            size={20}
            color={theme.colors.auth.link}
          />
          <Text style={authLayoutStyles.backText}>Voltar</Text>
        </Pressable>
      )}

      <Logo size="lg" colorScheme="onHero" />

      <View style={authLayoutStyles.badge}>
        <Text style={authLayoutStyles.badgeText}>{badgeLabel}</Text>
      </View>

      <HeroBrandTagline />

      <Text style={authLayoutStyles.heroSubtitle}>{subtitle}</Text>

      <BenefitsList />
    </View>
  );
};
