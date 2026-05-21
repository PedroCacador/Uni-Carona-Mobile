import { StyleSheet } from 'react-native';
import { authLayoutStyles } from '../../styles/authLayout';
import { theme } from '../../theme';

const { colors, spacing, typography } = theme;

export const styles = StyleSheet.create({
  ...authLayoutStyles,
  form: authLayoutStyles.form,
  formSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.auth.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontSize: typography.sizes.sm,
    color: colors.auth.link,
    fontWeight: typography.weights.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.auth.textSecondary,
  },
  footerLink: {
    fontSize: typography.sizes.sm,
    color: colors.auth.link,
    fontWeight: typography.weights.bold,
    marginLeft: spacing.xs,
  },
});
