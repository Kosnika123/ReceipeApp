import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={{ uri: "../assets/videos/App-intro.mp4" }} // Replace with your food video
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      {/* Overlay content */}
      <View style={styles.overlay}>
        <Text style={styles.logo}>CREME</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)")}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>


        <TouchableOpacity style={[styles.button, styles.email]}>
          <Text style={styles.buttonText}>Continue with Email</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          By continuing you agree to our{" "}
          <Text style={{ textDecorationLine: "underline" }}>Privacy Policy</Text> and{" "}
          <Text style={{ textDecorationLine: "underline" }}>Terms of Use</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: { fontSize: 40, fontWeight: "bold", color: "#fff", marginBottom: 50 },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  apple: { backgroundColor: "#333" },
  email: { backgroundColor: "#666" },
  buttonText: { color: "#000", fontWeight: "600" },
  footer: { fontSize: 12, color: "#fff", textAlign: "center", marginTop: 40 },
});
