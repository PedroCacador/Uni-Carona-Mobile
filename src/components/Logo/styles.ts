import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

const { spacing } = theme;

export const styles = StyleSheet.create({
  wordmark: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stacked: {
    alignItems: 'flex-start',
  },
  stackedCarona: {
    marginTop: -2,
  },
});

export const logoSpacing = {
  marginBottom: spacing.lg,
};
