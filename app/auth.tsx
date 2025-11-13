// app/auth.tsx
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

type Errors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function AuthScreen() {
  const router = useRouter();
  const { login } = useAuth(); // zatiaľ mock, ale ready na integráciu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingInstagram, setLoadingInstagram] = useState(false);

  const validate = () => {
    const next: Errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      next.email = 'Zadaj email.';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail.toLowerCase())
    ) {
      next.email = 'Zadaj platný email.';
    }

    if (!password) {
      next.password = 'Zadaj heslo.';
    } else if (password.length < 6) {
      next.password = 'Heslo musí mať aspoň 6 znakov.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleEmailLogin = async () => {
    if (!validate()) return;
    setLoadingEmail(true);
    setErrors({});
    try {
      // TODO: napoj reálne API (Supabase/Firebase/Backend)
      const user = await fakeEmailPasswordLogin(email.trim(), password);

      // useAuth context – zachováme existujúci login(email)
      login(user.email);

      // po prihlásení redirect na Home (upravenú route si vieš zmeniť)
      router.replace('/src/screens/HomeScreen');
    } catch (e: any) {
      setErrors((prev) => ({
        ...prev,
        general:
          e?.message ??
          'Nepodarilo sa prihlásiť. Skús znova alebo zmeň heslo.',
      }));
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setErrors({});
    try {
      // TODO: nahradiť reálnym Google OAuth (expo-auth-session / Firebase / Supabase)
      const user = await fakeSocialLogin('google');
      login(user.email);
      router.replace('/src/screens/HomeScreen');
    } catch (e: any) {
      setErrors((prev) => ({
        ...prev,
        general: 'Google prihlásenie zlyhalo. Skús neskôr.',
      }));
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleInstagramLogin = async () => {
    setLoadingInstagram(true);
    setErrors({});
    try {
      // TODO: nahradiť reálnym Instagram OAuth / vlastným backend flow
      const user = await fakeSocialLogin('instagram');
      login(user.email);
      router.replace('/src/screens/HomeScreen');
    } catch (e: any) {
      setErrors((prev) => ({
        ...prev,
        general: 'Instagram prihlásenie zlyhalo. Skús neskôr.',
      }));
    } finally {
      setLoadingInstagram(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/register');
  };

  const isAnyLoading = loadingEmail || loadingGoogle || loadingInstagram;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Vitaj👋</Text>
        <Text style={styles.subtitle}>
          Prihlás sa do Sponto a naplánuj ďalší spontánny výjazd.
        </Text>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="napr. meno@gmail.com"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Heslo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Heslo</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Tvoje heslo"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowPassword((v) => !v)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color="#9CA3AF"
              />
            </Pressable>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* General error */}
        {errors.general ? (
          <Text style={[styles.errorText, { marginTop: 4 }]}>
            {errors.general}
          </Text>
        ) : null}

        <View style={styles.spacer} />

        {/* Email login button */}
        <View style={{ marginBottom: 16 }}>
          <Button
            title={loadingEmail ? 'Prihlasujem…' : 'Prihlásiť sa'}
            onPress={handleEmailLogin}
          />
          {loadingEmail && (
            <ActivityIndicator
              style={{ marginTop: 8 }}
              size="small"
              color="#9CA3AF"
            />
          )}
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>alebo</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social logins */}
        <View style={styles.socialRow}>
          <Pressable
            style={[styles.socialButton, isAnyLoading && styles.socialDisabled]}
            onPress={handleGoogleLogin}
            disabled={isAnyLoading}
          >
            {loadingGoogle ? (
              <ActivityIndicator size="small" color="#F97316" />
            ) : (
              <>
                <AntDesign name="google" size={18} color="#F97316" />
                <Text style={styles.socialText}>Google</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={[styles.socialButton, isAnyLoading && styles.socialDisabled]}
            onPress={handleInstagramLogin}
            disabled={isAnyLoading}
          >
            {loadingInstagram ? (
              <ActivityIndicator size="small" color="#DB2777" />
            ) : (
              <>
                <AntDesign name="instagram" size={18} color="#DB2777" />
                <Text style={styles.socialText}>Instagram</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Register link */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Nemáš ešte účet?</Text>
          <Pressable onPress={handleGoToRegister}>
            <Text style={styles.bottomLink}>Vytvoriť účet</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ====== MOCK API – neskôr vymeníš za skutočné služby ====== */

async function fakeEmailPasswordLogin(email: string, password: string) {
  // tu neskôr zavoláš Supabase / Firebase / vlastný backend
  await new Promise((res) => setTimeout(res, 700));
  // vyhoď chybu podľa potreby, napr.:
  // throw new Error('Invalid credentials');
  return { id: 'mock-user-id', email };
}

async function fakeSocialLogin(provider: 'google' | 'instagram') {
  await new Promise((res) => setTimeout(res, 700));
  return {
    id: `${provider}-mock-user`,
    email: `${provider}_user@example.com`,
  };
}

/* ====== STYLES ====== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  title: {
    fontSize: 26,
    color: '#E5E7EB',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#020617',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 15,
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#F97373',
  },

  spacer: {
    height: 8,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1F2937',
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: '#6B7280',
  },

  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#020617',
  },
  socialDisabled: {
    opacity: 0.6,
  },
  socialText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },

  bottomRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  bottomText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  bottomLink: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '600',
  },
});
