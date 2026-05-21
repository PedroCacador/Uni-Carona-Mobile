import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList, RootStackParamList } from './types';

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useAuthNavigation(): AuthNavigationProp {
  return useNavigation<AuthNavigationProp>();
}

export function useRootNavigation(): RootNavigationProp {
  return useNavigation<RootNavigationProp>();
}
