import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";

type Recipe = {
  id?: string;
  title: string;
  description: string;
  ingredients: string;
  steps?: string;
  imageUrl: string;
};

export default function RecipeDetail() {
  const params = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const id = typeof params.id === "string" ? params.id : undefined;

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return setLoading(false);

      try {
        const { data, error } = await supabase.from("recipes").select("*").eq("id", id).single();
        if (error) console.error("Supabase fetch error:", error);
        else {
          setRecipe({
            id: data.id,
            title: data.title,
            description: data.description,
            ingredients: data.ingredients,
            steps: data.steps,
            imageUrl: data.image_url,
          });
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#CC5500" style={{ flex: 1, justifyContent: "center" }} />;

  if (!recipe) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Recipe not found.</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>{recipe.description}</Text>

      <Text style={styles.sectionHeader}>Ingredients</Text>
      <Text style={styles.text}>{recipe.ingredients}</Text>

      {recipe.steps && <>
        <Text style={styles.sectionHeader}>Steps</Text>
        <Text style={styles.text}>{recipe.steps}</Text>
      </>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: { width: "100%", height: 260, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  description: { fontSize: 16, color: "#555", marginBottom: 12 },
  sectionHeader: { fontSize: 18, fontWeight: "700", marginTop: 16, marginBottom: 8, color: "#CC5500" },
  text: { fontSize: 16, lineHeight: 22, color: "#333" },
});
