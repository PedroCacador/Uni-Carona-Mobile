jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = ({ name }: { name: string }) =>
    React.createElement(Text, null, name);

  return {
    Feather: MockIcon,
    Ionicons: MockIcon,
  };
});
