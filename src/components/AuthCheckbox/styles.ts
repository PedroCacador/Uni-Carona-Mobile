import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const { colors, spacing, typography, radius } = theme;

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.auth.inputBorder,
    backgroundColor: colors.auth.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.auth.primary,
    borderColor: colors.auth.primary,
  },
  checkboxError: {
    borderColor: colors.error,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  text: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.auth.textSecondary,
    lineHeight: 20,
  },
  link: {
    color: colors.auth.link,
    fontWeight: typography.weights.medium,
  },
  errorText: {
    marginTop: spacing.xs,
    marginLeft: 30,
    fontSize: typography.sizes.xs,
    color: colors.error,
  },
});
