import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { AUTH_BENEFITS, type BenefitItem } from '../../types/benefits';
import { styles } from './styles';

export interface BenefitsListProps {
  items?: BenefitItem[];
  style?: StyleProp<ViewStyle>;
}

export const BenefitsList: React.FC<BenefitsListProps> = ({
  items = AUTH_BENEFITS,
  style,
}) => {
  return (
    <View
      style={[styles.list, style]}
      accessible
      accessibilityLabel="Benefícios da plataforma UniCarona"
    >
      {items.map((item) => (
        <View
          key={item.id}
          style={styles.item}
          accessible
          accessibilityLabel={`${item.step}. ${item.text}`}
        >
          <View style={styles.badge} accessibilityElementsHidden>
            <Text style={styles.badgeNumber}>{item.step}</Text>
          </View>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
};
