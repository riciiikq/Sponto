import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MapTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa (čoskoro real-time 👀)</Text>
      <Text style={styles.sub}>Tu bude zobrazenie polohy posádok a meetpointov.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#0D1117", alignItems:"center", justifyContent:"center", padding:20 },
  title: { color:"#58A6FF", fontSize:20, fontWeight:"800" },
  sub: { color:"#8B949E", marginTop:8, textAlign:"center" }
});
