// app/register.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuth(); // mock login po registrácii

  const handleRegister = () => {
    // Tu bude volanie backendu
    login(email); // po registrácii sa prihlási
    router.replace('/src/screens/HomeScreen'); // presmerovanie do homescreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrovať sa</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Heslo"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Registrovať" onPress={handleRegister} />
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
