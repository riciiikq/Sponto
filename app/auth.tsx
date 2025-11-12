// app/auth.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = () => {
    // tu neskôr bude Supabase/Firebase autentifikácia
    login(email); // mock login
    router.replace('/src/screens/HomeScreen'); // po login-e ide do homescreen
  };

  const handleRegisterNavigation = () => {
    router.push('/register'); // presmerovanie na register obrazovku
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prihlásenie</Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Heslo input */}
      <TextInput
        style={styles.input}
        placeholder="Heslo"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login button */}
      <Button title="Prihlásiť sa" onPress={handleLogin} />

      {/* Register button */}
      <Button title="Registrovať sa" onPress={handleRegisterNavigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    color: '#58A6FF',
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderColor: '#30363D',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    color: '#FFFFFF',
  },
});
