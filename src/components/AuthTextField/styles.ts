import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../theme';

const { colors, spacing, typography, radius } = theme;

export const INPUT_HEIGHT = 52;
const INPUT_FONT_SIZE = typography.sizes.md;
const INPUT_LINE_HEIGHT = Platform.OS === 'ios' ? 22 : 20;

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: INPUT_HEIGHT,
    minHeight: INPUT_HEIGHT,
    backgroundColor: colors.auth.input,
    borderWidth: 1,
    borderColor: colors.auth.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
  },
  inputContainerFocused: {
    borderColor: colors.auth.inputBorderFocus,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: spacing.sm,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    height: INPUT_HEIGHT,
    fontSize: INPUT_FONT_SIZE,
    lineHeight: INPUT_LINE_HEIGHT,
    fontWeight: typography.weights.regular,
    color: colors.auth.text,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        includeFontPadding: false,
      },
      ios: {
        paddingTop: 0,
        paddingBottom: 0,
      },
      default: {},
    }),
  },
  toggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 36,
    height: INPUT_HEIGHT,
    paddingHorizontal: spacing.xs,
    marginLeft: spacing.xs,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.xs,
    color: colors.error,
  },
});
