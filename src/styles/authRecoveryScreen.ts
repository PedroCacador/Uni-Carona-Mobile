import { StyleSheet } from 'react-native';
import { authLayoutStyles } from './authLayout';
import { theme } from '../theme';

const { colors, spacing, typography, radius } = theme;

export const authRecoveryScreenStyles = StyleSheet.create({
  container: {
    ...authLayoutStyles.form,
    flexGrow: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  backText: {
    fontSize: typography.sizes.sm,
    color: colors.auth.link,
    fontWeight: typography.weights.medium,
  },
  logo: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.auth.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.auth.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  emailHighlight: {
    color: colors.auth.text,
    fontWeight: typography.weights.medium,
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  successIconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.auth.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  successDescription: {
    fontSize: typography.sizes.sm,
    color: colors.auth.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  resendSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  resendText: {
    fontSize: typography.sizes.sm,
    color: colors.auth.textSecondary,
  },
  resendCounter: {
    fontSize: typography.sizes.sm,
    color: colors.auth.placeholder,
    fontWeight: typography.weights.medium,
  },
  resendButton: {
    paddingVertical: spacing.xs,
  },
  resendButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.auth.link,
    fontWeight: typography.weights.bold,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.auth.textSecondary,
  },
  footerLink: {
    fontSize: typography.sizes.sm,
    color: colors.auth.link,
    fontWeight: typography.weights.bold,
  },
  successButton: {
    width: '100%',
  },
});
