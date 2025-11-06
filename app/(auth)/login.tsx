import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../providers/AuthProvider";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    setErr(null);
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      setErr(e.message || "Prihlásenie zlyhalo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios:"padding", android: undefined })}>
      <Text style={styles.title}>Sponto</Text>
      <Text style={styles.subtitle}>Spontánne výlety. Silné zážitky.</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        placeholderTextColor="#8B949E"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Heslo (min. 6 znakov)"
        placeholderTextColor="#8B949E"
        secureTextEntry
        style={styles.input}
      />

      {err ? <Text style={styles.error}>{err}</Text> : null}

      <TouchableOpacity style={[styles.btn, busy && { opacity: 0.7 }]} onPress={onLogin} disabled={busy}>
        <Text style={styles.btnText}>{busy ? "Prihlasujem..." : "Prihlásiť sa"}</Text>
      </TouchableOpacity>

      <Text style={styles.note}>Demo: zadaj ľubovoľný e-mail a heslo dlhé aspoň 6 znakov.</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#0D1117", padding:24, justifyContent:"center" },
  title: { color:"#58A6FF", fontSize:42, fontWeight:"800", textAlign:"center" },
  subtitle: { color:"#C9D1D9", textAlign:"center", marginTop:6, marginBottom:28 },
  input: {
    backgroundColor:"#161B22", color:"#fff", borderRadius:12, paddingHorizontal:14, paddingVertical:12,
    fontSize:16, marginBottom:12, borderWidth:1, borderColor:"#1F2937"
  },
  btn: { backgroundColor:"#238636", borderRadius:12, paddingVertical:14, alignItems:"center", marginTop:8 },
  btnText: { color:"#fff", fontSize:16, fontWeight:"700" },
  error: { color:"#f87171", marginTop:4, marginBottom:8, textAlign:"center" },
  note: { color:"#8B949E", marginTop:14, textAlign:"center", fontSize:12 }
});
