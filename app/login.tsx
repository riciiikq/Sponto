// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = () => {
    login(email);
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prihlás sa</Text>
      <TextInput
        style={styles.input}
        placeholder="Zadaj email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Pokračovať" onPress={handleLogin} />
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
    fontWeight: '600',
    marginBottom: 20,
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
