// app/home.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitaj, {user}</Text>
      <Text style={styles.subtitle}>Toto je tvoja domovská obrazovka.</Text>
      <Button
        title="Odhlásiť sa"
        onPress={() => {
          logout();
          router.replace('/');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#58A6FF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    color: '#C9D1D9',
    fontSize: 16,
    marginBottom: 20,
  },
});
