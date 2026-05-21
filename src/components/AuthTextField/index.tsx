import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import { styles } from './styles';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

export const PASSWORD_PLACEHOLDER = 'Mín. 6 caracteres';
export const CONFIRM_PASSWORD_PLACEHOLDER = 'Repita a senha';

export interface AuthTextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon: FeatherIconName;
  error?: string;
  optional?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  isPassword?: boolean;
}

const AuthTextFieldComponent: React.FC<AuthTextFieldProps> = ({
  label,
  icon,
  error,
  optional = false,
  containerStyle,
  isPassword = false,
  placeholder,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = Boolean(error);
  const iconColor = isFocused
    ? theme.colors.auth.inputBorderFocus
    : theme.colors.auth.placeholder;

  const resolvedPlaceholder =
    placeholder ??
    (isPassword ? PASSWORD_PLACEHOLDER : undefined);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={styles.label} accessibilityRole="text">
        {label}
        {optional ? ' (opcional)' : ''}
      </Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && !hasError && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
        ]}
      >
        <Feather
          name={icon}
          size={20}
          color={iconColor}
          style={styles.icon}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
        <TextInput
          style={styles.input}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={theme.colors.auth.placeholder}
          secureTextEntry={isPassword && !isPasswordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error ?? resolvedPlaceholder}
          {...inputProps}
        />
        {isPassword && (
          <Pressable
            style={styles.toggleButton}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
            }
            hitSlop={8}
          >
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={theme.colors.auth.placeholder}
            />
          </Pressable>
        )}
      </View>
      {hasError && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
};

export const AuthTextField = React.memo(AuthTextFieldComponent);
