import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
          ])
        ),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient colors={["#0D0D0F", "#161622", "#1E1E2A"]} style={styles.container}>
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Image
            source={require("../assets/sponto-icon.png")} // tvoje logo (S)
            style={styles.logo}
          />
        </Animated.View>

        <Text style={styles.title}>Sponto</Text>
        <Text style={styles.subtitle}>Spontánne výjazdy. Silné zážitky.</Text>
      </Animated.View>

      <LottieView
        source={require("../assets/pulse-loader.json")}
        autoPlay
        loop
        style={styles.loader}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    tintColor: "#8A2BE2",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 12,
  },
  subtitle: {
    color: "#B8B8C6",
    fontSize: 16,
    marginTop: 8,
    fontWeight: "400",
  },
  loader: {
    width: 120,
    height: 120,
  },
});
