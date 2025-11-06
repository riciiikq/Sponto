import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Spontánne výlety",
    desc: "Vytvor trip za pár sekúnd a zavolaj partiu bez chaosu v chate.",
  },
  {
    id: "2",
    title: "Živá mapa konvoja",
    desc: "Sleduj priateľov, autá a meetpoint v reálnom čase.",
  },
  {
    id: "3",
    title: "AI odporúčania",
    desc: "Tipy kam ísť dnes večer: fastfood, vyhliadka, bar s parkovaním.",
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const router = useRouter();

  const next = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }
  };

  const finish = async () => {
    await AsyncStorage.setItem("sponto_seen_onboarding", "1");
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(i) => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />

      {/* indikátory */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaRow}>
        {index < slides.length - 1 ? (
          <>
            <TouchableOpacity onPress={finish} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>Preskočiť</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={next} style={styles.btn}>
              <Text style={styles.btnText}>Ďalej</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={finish} style={[styles.btn, { flex:1 }]}>
            <Text style={styles.btnText}>Začať</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#0D1117", paddingBottom:24 },
  slide: { flex:1, alignItems:"center", justifyContent:"center", paddingHorizontal:24 },
  title: { color:"#58A6FF", fontSize:32, fontWeight:"800", textAlign:"center" },
  desc: { color:"#C9D1D9", fontSize:16, textAlign:"center", marginTop:10 },
  dots: { flexDirection:"row", justifyContent:"center", gap:8, marginBottom:16 },
  dot: { width:8, height:8, borderRadius:4, backgroundColor:"#334155" },
  dotActive: { backgroundColor:"#58A6FF", width:20 },
  ctaRow: { flexDirection:"row", gap:10, paddingHorizontal:16 },
  btn: { backgroundColor:"#238636", paddingVertical:14, borderRadius:12, alignItems:"center", justifyContent:"center", paddingHorizontal:18 },
  btnText: { color:"#fff", fontWeight:"700", fontSize:16 },
  btnGhost: { backgroundColor:"#111827", borderWidth:1, borderColor:"#1F2937", flex:1 },
  btnGhostText: { color:"#C9D1D9", fontWeight:"700", fontSize:16, textAlign:"center" },
});
