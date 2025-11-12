// components/Slide.tsx
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface SlideProps {
  title: string;
  description: string;
  image: any;
}

const { width, height } = Dimensions.get('window');

export default function Slide({ title, description, image }: SlideProps) {
  return (
    <Animated.View
      style={styles.slide}
      entering={FadeInUp.duration(650).springify().damping(14)}
    >
      {/* fullscreen-ish image */}
      <View style={styles.imageWrapper}>
        <View style={styles.imageGlow} />
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>

      {/* glass text card */}
      <View style={styles.textCard}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    paddingHorizontal: 24,
    paddingTop: height * 0.09,
    paddingBottom: height * 0.18,
    justifyContent: 'space-between',
  },

  imageWrapper: {
    height: height * 0.52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 1,
    height: height * 0.8,
  },

  textCard: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: '#020617dd',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F9FAFB',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  description: {
    fontSize: 16,
    color: '#CBD5F5',
    textAlign: 'center',
    lineHeight: 22,
  },
});
