import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import type { AccountType } from '../../types/register';
import { styles } from './styles';

interface AccountTypeSelectorProps {
  value: AccountType | null;
  onChange: (type: AccountType) => void;
  error?: string;
}

export const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const hasError = Boolean(error);

  const renderOption = (
    type: AccountType,
    label: string,
    icon: React.ComponentProps<typeof Feather>['name'],
  ) => {
    const isActive = value === type;
    const iconColor = isActive
      ? theme.colors.auth.inputBorderFocus
      : theme.colors.auth.placeholder;

    return (
      <Pressable
        key={type}
        style={[
          styles.option,
          isActive && styles.optionActive,
          hasError && !isActive && styles.optionError,
        ]}
        onPress={() => onChange(type)}
        accessibilityRole="button"
        accessibilityLabel={`Tipo de conta: ${label}`}
        accessibilityState={{ selected: isActive }}
      >
        <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
          <Feather name={icon} size={22} color={iconColor} />
        </View>
        <Text
          style={[styles.optionText, isActive && styles.optionTextActive]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Tipo de conta</Text>
      <View style={styles.row}>
        {renderOption('passenger', 'Passageiro', 'users')}
        {renderOption('driver', 'Motorista', 'navigation-2')}
      </View>
      {hasError && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
};
