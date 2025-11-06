import { MotiText, MotiView } from "moti";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 1000 }}
        style={styles.titleContainer}
      >
        <MotiText style={styles.title}>Sponto</MotiText>
        <MotiText style={styles.subtitle}>
          Spontánne výlety, spoločné zážitky.
        </MotiText>
      </MotiView>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Začať trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    color: "#58A6FF",
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#C9D1D9",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#238636",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
