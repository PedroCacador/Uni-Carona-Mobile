import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

export type AuthToastType = 'success' | 'error';

export interface AuthToastProps {
  message: string;
  type?: AuthToastType;
  onClose: () => void;
  duration?: number;
}

export const AuthToast: React.FC<AuthToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <View
      style={styles.container}
      accessibilityRole={isSuccess ? 'text' : 'alert'}
      accessibilityLiveRegion={isSuccess ? 'polite' : 'assertive'}
    >
      <View style={[styles.toast, isSuccess ? styles.toastSuccess : styles.toastError]}>
        <View style={[styles.iconWrap, isSuccess ? styles.iconSuccess : styles.iconError]}>
          <Feather
            name={isSuccess ? 'check-circle' : 'alert-circle'}
            size={18}
            color={isSuccess ? '#16a34a' : '#dc2626'}
          />
        </View>
        <Text style={styles.message}>{message}</Text>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar notificação"
          hitSlop={8}
        >
          <Feather name="x" size={16} color="#64748b" />
        </Pressable>
      </View>
    </View>
  );
};
