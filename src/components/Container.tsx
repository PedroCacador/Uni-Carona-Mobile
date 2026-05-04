import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ children, centered, style, ...props }) => {
  return (
    <View style={[styles.container, centered && styles.centered, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
