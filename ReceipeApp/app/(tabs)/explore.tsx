import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  steps?: string;
  image_url: string;
};

export default function Explore() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*") // removed generic type parameter to satisfy supabase typings
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error);
      } else {
        setRecipes((data as unknown as Recipe[]) || []);
      }
    } catch (err) {
      console.error("Unexpected fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openRecipe = (recipe: Recipe) => {
    router.push({
      pathname: `/recipe/[id]`,
      params: {
        id: recipe.id,
        source: "supabase",
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        imageUrl: recipe.image_url, // match what `New` inserts
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => openRecipe(item)}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  image: { width: "100%", height: 150 },
  title: { padding: 10, fontWeight: "bold", fontSize: 16, color: "#333" },
});
