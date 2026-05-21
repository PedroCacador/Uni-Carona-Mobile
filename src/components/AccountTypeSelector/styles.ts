import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const { colors, spacing, typography, radius } = theme;

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.auth.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.auth.input,
    borderWidth: 1.5,
    borderColor: colors.auth.inputBorder,
    borderRadius: radius.md,
    minHeight: 88,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  optionActive: {
    borderColor: colors.auth.inputBorderFocus,
    backgroundColor: 'rgba(0, 71, 171, 0.15)',
  },
  optionError: {
    borderColor: colors.error,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.auth.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(0, 71, 171, 0.25)',
  },
  optionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.auth.textSecondary,
    textAlign: 'center',
  },
  optionTextActive: {
    color: colors.auth.text,
    fontWeight: typography.weights.bold,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.xs,
    color: colors.error,
  },
});
