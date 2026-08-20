import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RatingBadgeProps = {
  rating: number;
  reviews: number;
};

export default function RatingBadge({
  rating,
  reviews,
}: RatingBadgeProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="star" size={14} color="#F4B400" />
      <Text style={styles.text}>
        {rating} ({reviews})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',

    backgroundColor: '#FFF5E5',

    borderRadius: 18,

    paddingHorizontal: 12,
    paddingVertical: 6,

    marginTop: 12,
  },

  text: {
    marginLeft: 4,
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
});