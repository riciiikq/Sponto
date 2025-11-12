// app/index.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/Button';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Vitaj v Sponto</Text>
      <Text style={styles.subtitle}>
        Spoj sa s priateľmi, vytváraj spontánne výjazdy a objavuj nové miesta.
      </Text>

      <Button title="Začať" onPress={() => router.push('/login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#58A6FF',
    marginBottom: 12,
  },
  subtitle: {
    color: '#C9D1D9',
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 16,
  },
});

