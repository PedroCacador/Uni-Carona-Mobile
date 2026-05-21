import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const { colors, spacing, typography, radius, shadows } = theme;

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.auth.primary,
    borderRadius: radius.md,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    ...shadows.primaryButton,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.auth.text,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
