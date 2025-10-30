import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function RecipeDetail() {
  const params = useLocalSearchParams();
  // params.id may be undefined / string | string[]; cast safely:
  const id = typeof params.id === "string" ? params.id : String(params.id);
  const router = useRouter();

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchRecipe = async () => {
      try {
        const ref = doc(db, "recipes", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRecipe({ id: snap.id, ...snap.data() });
        } else {
          console.warn("No recipe found for id:", id);
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const getYouTubeEmbedUrl = (url: string): string => {
    try {
      if (url.includes("youtube.com/watch?v=")) {
        const videoId = url.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (error) {
      console.warn("Invalid YouTube URL:", url);
    }
    return url;
  };

  const handleRatingCompleted = async (value: number) => {
    setRating(value);
    const { error } = await supabase
      .from("receipes")
      .update({ rating: value })
      .eq("id", id);

    if (error) console.error("Error updating rating:", error);

    if (value === 5) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 2, stiffness: 100 }),
        withSpring(1, { damping: 2, stiffness: 100 })
      );
      Alert.alert("Thank you!", "You gave this recipe a perfect 5-star rating!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#CC5500" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#666" }}>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{recipe.title}</Text>

      <Text style={styles.sectionHeader}>Ingredients</Text>
      <Text style={styles.text}>{recipe.ingredients || "No ingredients listed."}</Text>

      <Text style={styles.sectionHeader}>Instructions</Text>
      <Text style={styles.text}>{recipe.steps || recipe.description || "No instructions provided."}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: { width: "100%", height: 260, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  sectionHeader: { fontSize: 18, fontWeight: "700", marginTop: 18, marginBottom: 8, color: "#CC5500" },
  text: { fontSize: 16, lineHeight: 22, color: "#333" },
});
