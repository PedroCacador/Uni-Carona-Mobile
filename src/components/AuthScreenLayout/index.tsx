import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authLayoutStyles } from '../../styles/authLayout';

export interface AuthScreenLayoutProps {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const AuthScreenLayout: React.FC<AuthScreenLayoutProps> = ({
  children,
  contentContainerStyle,
}) => {
  return (
    <SafeAreaView style={authLayoutStyles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={authLayoutStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            authLayoutStyles.scrollContent,
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
