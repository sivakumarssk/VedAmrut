import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  rightElement?: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  iconColor?: string;
};

export default function ScreenHeader({
  title,
  onBack,
  rightElement,
  titleStyle,
  iconColor = '#222',
}: ScreenHeaderProps) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack ?? (() => router.back())}
      >
        <Ionicons name="arrow-back" size={24} color={iconColor} />
      </TouchableOpacity>

      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>

      {rightElement && (
        <View style={styles.rightElement}>{rightElement}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginLeft: 4,
  },
  rightElement: {
    marginLeft: 12,
  },
});
