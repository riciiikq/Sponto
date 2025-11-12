// app/index.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Button from "../components/Button";
import Slide from "../components/Slide";
import { OnboardingStrings } from "../strings/Strings";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSpring(1.05, { damping: 5, stiffness: 110 }),
      -1,
      true
    );
  }, [pulse]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleNext = () => {
    if (currentIndex < OnboardingStrings.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace("/auth");
    }
  };

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <LinearGradient
      colors={["#050014", "#120623", "#1F0A3F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* soft background lights */}
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowMid} />
      <View style={styles.backgroundGlowBottom} />

      {/* hviezdičky / particles */}
      <StarField />

      <FlatList
        ref={flatListRef}
        data={OnboardingStrings}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Slide
            title={item.title}
            description={item.description}
            image={item.image}
          />
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* dots – jeden indikátor, žiadny progress bar */}
      <View style={styles.dotsContainer}>
        {OnboardingStrings.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <View
              key={index}
              style={[styles.dot, isActive && styles.activeDot]}
            />
          );
        })}
      </View>

      <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
        <Button
          title={
            currentIndex === OnboardingStrings.length - 1 ? "Začať" : "Ďalej"
          }
          onPress={handleNext}
        />
      </Animated.View>
    </LinearGradient>
  );
}

/* ===== StarField / particles ===== */

type StarPos = { top: number; left: number; size: number };

const STAR_COUNT = 34;

function StarField() {
  const stars = useMemo<StarPos[]>(
    () =>
      Array.from({ length: STAR_COUNT }).map(() => ({
        top: Math.random() * height * 0.94,
        left: Math.random() * width,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <>
      {stars.map((s, idx) => (
        <Star
          key={idx}
          top={s.top}
          left={s.left}
          size={s.size}
          delay={idx * 80}
        />
      ))}
    </>
  );
}

function Star({
  top,
  left,
  size,
  delay,
}: {
  top: number;
  left: number;
  size: number;
  delay: number;
}) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const start = setTimeout(() => {
      opacity.value = withRepeat(
        withTiming(1, { duration: 1400 + Math.random() * 800 }),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(start);
  }, [opacity, delay]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: opacity.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        { top, left, width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    />
  );
}

/* ===== styles ===== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundGlowTop: {
  position: 'absolute',
  top: -height * 0.12,
  left: -width * 0.25,
  width: width * 0.9,
  height: width * 0.9,
  borderRadius: width * 0.9,
  backgroundColor: '#8B5CF633',
},
backgroundGlowMid: {
  position: 'absolute',
  top: height * 0.25,
  right: -width * 0.2,
  width: width * 0.7,
  height: width * 0.7,
  borderRadius: width * 0.7,
  backgroundColor: '#4C1D9544',
},
backgroundGlowBottom: {
  position: 'absolute',
  bottom: -height * 0.22,
  left: width * 0.05,
  width: width * 1.0,
  height: width * 1.0,
  borderRadius: width * 1.0,
  backgroundColor: '#A855F744',
},


  star: {
    position: "absolute",
    backgroundColor: "#F9FAFB",
  },

  dotsContainer: {
    position: "absolute",
    bottom: 130,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: "#1E293B",
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
    borderRadius: 999,
    backgroundColor: "#A855F7",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 60,
    width: "82%",
    alignSelf: "center",
  },
});
