import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../providers/AuthProvider";

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.sub}>{user?.email}</Text>
      

      <TouchableOpacity style={styles.btn} onPress={signOut}>
        <Text style={styles.btnText}>Odhlásiť sa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#0D1117", alignItems:"center", justifyContent:"center", padding:20 },
  title: { color:"#58A6FF", fontSize:24, fontWeight:"800" },
  sub: { color:"#8B949E", marginTop:8, marginBottom:16 },
  btn: { backgroundColor:"#ef4444", paddingVertical:14, paddingHorizontal:24, borderRadius:12 },
  btnText: { color:"#fff", fontWeight:"700" }
});

