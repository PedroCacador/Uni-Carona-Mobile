import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import { styles } from './styles';

export interface AuthCheckboxProps {
  checked: boolean;
  onToggle: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
  onPressTerms?: () => void;
  onPressPrivacy?: () => void;
}

export const AuthCheckbox: React.FC<AuthCheckboxProps> = ({
  checked,
  onToggle,
  error,
  disabled = false,
  onPressTerms,
  onPressPrivacy,
}) => {
  const hasError = Boolean(error);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Pressable
          style={[
            styles.checkbox,
            checked && styles.checkboxChecked,
            hasError && !checked && styles.checkboxError,
            disabled && styles.checkboxDisabled,
          ]}
          onPress={() => onToggle(!checked)}
          disabled={disabled}
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled }}
          accessibilityLabel="Aceitar termos de uso e política de privacidade"
        >
          {checked && (
            <Feather name="check" size={14} color={theme.colors.auth.text} />
          )}
        </Pressable>
        <Text style={styles.text}>
          Li e aceito os{' '}
          <Text
            style={styles.link}
            onPress={disabled ? undefined : onPressTerms}
            accessibilityRole="link"
            accessibilityLabel="Termos de Uso"
            suppressHighlighting
          >
            Termos de Uso
          </Text>{' '}
          e{' '}
          <Text
            style={styles.link}
            onPress={disabled ? undefined : onPressPrivacy}
            accessibilityRole="link"
            accessibilityLabel="Política de Privacidade"
            suppressHighlighting
          >
            Política de Privacidade
          </Text>
        </Text>
      </View>
      {hasError && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
};
