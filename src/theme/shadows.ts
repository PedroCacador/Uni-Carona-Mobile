import { Platform, ViewStyle } from 'react-native';
import { colors } from './colors';

export const shadows = {
  primaryButton: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.auth.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
};
