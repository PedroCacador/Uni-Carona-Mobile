import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const { colors, spacing, typography, radius } = theme;

const BADGE_SIZE = 32;

export const styles = StyleSheet.create({
  list: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: colors.auth.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  badgeNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.auth.hero,
    lineHeight: typography.sizes.sm + 2,
    textAlign: 'center',
  },
  text: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.auth.text,
    lineHeight: 22,
  },
});
