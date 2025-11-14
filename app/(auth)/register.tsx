// app/register.tsx
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  general?: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth(); // po registrácii rovno prihlásime
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingInstagram, setLoadingInstagram] = useState(false);

  const validate = () => {
    const next: Errors = {};

    if (!name.trim()) {
      next.name = "Zadaj meno alebo prezývku.";
    } else if (!/^[A-Za-zÀ-ž0-9._]+$/.test(name.trim())) {
      next.name = "Môže obsahovať len písmená, čísla, bodku a podčiarkovník.";
    } else if (name.length < 3) {
      next.name = "Prezývka musí mať aspoň 3 znaky.";
    } else if (name.length > 24) {
      next.name = "Maximálna dĺžka prezývky je 24 znakov.";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      next.email = "Zadaj email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail.toLowerCase())) {
      next.email = "Zadaj platný email.";
    }

    if (!password) {
      next.password = "Zadaj heslo.";
    } else if (password.length < 6) {
      next.password = "Heslo musí mať aspoň 6 znakov.";
    }

    if (!passwordConfirm) {
      next.passwordConfirm = "Potvrď heslo.";
    } else if (passwordConfirm !== password) {
      next.passwordConfirm = "Heslá sa nezhodujú.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleEmailRegister = async () => {
    if (!validate()) return;
    setLoadingEmail(true);
    setErrors({});
    try {
      // TODO: napoj reálne API (Supabase/Firebase/backend register)
      const user = await fakeEmailRegister(name.trim(), email.trim(), password);

      // po úspešnej registrácii rovno setni user do kontextu
      login(user.email);
      router.replace("/src/screens/HomeScreen");
    } catch (e: any) {
      setErrors((prev) => ({
        ...prev,
        general:
          e?.message ??
          "Registrácia zlyhala. Skús to znova alebo použi inú metódu.",
      }));
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoadingGoogle(true);
    setErrors({});
    try {
      // TODO: reálne Google OAuth (expo-auth-session / Firebase / Supabase)
      const user = await fakeSocialSignup("google");
      login(user.email);
      router.replace("/src/screens/HomeScreen");
    } catch (e: any) {
      setErrors((prev) => ({
        ...prev,
        general: "Registrácia cez Google zlyhala. Skús neskôr.",
      }));
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleInstagramSignup = async () => {
    setLoadingInstagram(true);
    setErrors({});
    try {
      // TODO: reálne Instagram OAuth / vlastné backend flow
      const user = await fakeSocialSignup("instagram");
      login(user.email);
      router.replace("/home");
    } catch (e: any) {
      setErrors((prev) => ({
        ...prev,
        general: "Registrácia cez Instagram zlyhala. Skús neskôr.",
      }));
    } finally {
      setLoadingInstagram(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace("/auth");
  };

  const isAnyLoading = loadingEmail || loadingGoogle || loadingInstagram;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Vytvor si účet 🎒</Text>
        <Text style={styles.subtitle}>
          Registruj sa do Sponto a maj spontánne tripy vždy poruke.
        </Text>

        {/* Meno */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meno / prezývka</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Ako ťa budú vidieť kamaráti"
              placeholderTextColor="#6B7280"
              value={name}
              onChangeText={(txt) => {
                const cleaned = txt.replace(/[^A-Za-zÀ-ž0-9._]/g, "");
                setName(cleaned);
              }}
            />
          </View>
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="napr. ty@mail.com"
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
              placeholder="Min. 6 znakov"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowPassword((v) => !v)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#9CA3AF"
              />
            </Pressable>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Potvrdenie hesla */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Potvrdenie hesla</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Zadaj heslo ešte raz"
              placeholderTextColor="#6B7280"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry={!showPasswordConfirm}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowPasswordConfirm((v) => !v)}>
              <Ionicons
                name={showPasswordConfirm ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#9CA3AF"
              />
            </Pressable>
          </View>
          {errors.passwordConfirm ? (
            <Text style={styles.errorText}>{errors.passwordConfirm}</Text>
          ) : null}
        </View>

        {/* General error */}
        {errors.general ? (
          <Text style={[styles.errorText, { marginTop: 4 }]}>
            {errors.general}
          </Text>
        ) : null}

        <View style={styles.spacer} />

        {/* Register button */}
        <View style={{ marginBottom: 16 }}>
          <Button
            title={loadingEmail ? "Vytváram účet…" : "Registrovať sa"}
            onPress={handleEmailRegister}
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

        {/* Social signup */}
        <View style={styles.socialRow}>
          <Pressable
            style={[styles.socialButton, isAnyLoading && styles.socialDisabled]}
            onPress={handleGoogleSignup}
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
            onPress={handleInstagramSignup}
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

        {/* Login link */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Už máš účet?</Text>
          <Pressable onPress={handleGoToLogin}>
            <Text style={styles.bottomLink}>Prihlásiť sa</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ===== MOCK REGISTER API – neskôr nahraď reálnym backendom ===== */

async function fakeEmailRegister(
  name: string,
  email: string,
  password: string
) {
  // sem príde Supabase/Firebase/backend register
  await new Promise((res) => setTimeout(res, 800));

  // môžeš podľa potreby vyhadzovať chyby:
  // if (email === 'exists@example.com') throw new Error('Email už existuje');

  return {
    id: "mock-registered-user",
    name,
    email,
  };
}

async function fakeSocialSignup(provider: "google" | "instagram") {
  await new Promise((res) => setTimeout(res, 700));
  return {
    id: `${provider}-registered-user`,
    email: `${provider}_user@example.com`,
  };
}

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1F2937",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  title: {
    fontSize: 26,
    color: "#E5E7EB",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
    backgroundColor: "#020617",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: "#F9FAFB",
    fontSize: 15,
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#F97373",
  },

  spacer: {
    height: 8,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1F2937",
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: "#6B7280",
  },

  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#020617",
  },
  socialDisabled: {
    opacity: 0.6,
  },
  socialText: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "600",
  },

  bottomRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  bottomText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  bottomLink: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "600",
  },
});
