import { StyleSheet } from 'react-native';
import { theme } from '../theme';

const { colors, spacing, typography, radius } = theme;

export const authLayoutStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.auth.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: colors.auth.hero,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
  },
  heroDecorLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.auth.decorativeCircle,
    top: -60,
    right: -40,
  },
  heroDecorSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.auth.decorativeCircle,
    bottom: 20,
    left: -30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  backText: {
    fontSize: typography.sizes.sm,
    color: colors.auth.link,
    fontWeight: typography.weights.medium,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.auth.badgeBorder,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
    backgroundColor: colors.auth.accentMuted,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.auth.accent,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.auth.text,
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.auth.textSecondary,
    lineHeight: 22,
    maxWidth: 340,
  },
  form: {
    backgroundColor: colors.auth.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  formTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.auth.text,
    marginBottom: spacing.sm,
  },
  loginPrompt: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  loginPromptText: {
    fontSize: typography.sizes.sm,
    color: colors.auth.textSecondary,
  },
  loginPromptLink: {
    fontSize: typography.sizes.sm,
    color: colors.auth.link,
    fontWeight: typography.weights.bold,
  },
  generalError: {
    fontSize: typography.sizes.sm,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});
