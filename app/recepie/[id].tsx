import { useLocalSearchParams } from "expo-router";
import { ScrollView, Image, Text, View, StyleSheet } from "react-native";

export default function RecipeDetail() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    ingredients?: string;
    steps?: string;
  }>();

  const {
    id,
    title = "Untitled Recipe",
    description = "No description available.",
    imageUrl,
    ingredients = "No ingredients listed.",
    steps = "No steps provided.",
  } = params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.hero} />
      ) : (
        <View style={[styles.hero, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>

      <Text style={styles.section}>Ingredients</Text>
      <Text style={styles.body}>{ingredients}</Text>

      <Text style={styles.section}>Steps</Text>
      <Text style={styles.body}>{steps}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff8f3" },
  hero: { width: "100%", height: 220, borderRadius: 12, marginBottom: 12 },
  placeholder: {
    backgroundColor: "#ffe0cc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#ff8c42",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff8c42",
    marginBottom: 6,
  },
  desc: { fontSize: 15, color: "#444", marginBottom: 16 },
  section: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
  },
  body: { fontSize: 14, lineHeight: 20, color: "#555" },
});
