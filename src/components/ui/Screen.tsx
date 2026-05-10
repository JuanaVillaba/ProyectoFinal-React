import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
};

export default function Screen({ children, style, noPadding }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'right', 'left', 'bottom']}>
      <View style={[styles.body, noPadding && styles.noPadding]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  body: {
    flex: 1,
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
});