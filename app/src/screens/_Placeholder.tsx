import React from "react";
import { StyleSheet, Text, View } from "react-native";
export default function Placeholder() {
  return (
    <View style={styles.c}><Text style={styles.t}>Pripravujeme…</Text></View>
  );
}
const styles = StyleSheet.create({ c:{flex:1,alignItems:"center",justifyContent:"center"}, t:{opacity:0.6} });
