import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Fonts } from "@/constants/theme";

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
        .from("receipes")
        .select("*") // removed generic type parameter to satisfy supabase typings
        .eq('cartegory', 'Miscellaneous')
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
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Explore Recipes</ThemedText>
      </ThemedView>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openRecipe(item)}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconSymbol key={star} name="star" size={16} color="#FFD700" />
              ))}
            </View>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1 },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.icon,
  },
  headerTitle: {
    fontFamily: Fonts.sans,
    fontWeight: "600",
    textAlign: "center",
  },
  listContainer: { padding: 10 },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: { width: "100%", height: 150 },
  title: {
    padding: 10,
    fontFamily: Fonts.sans,
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.light.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
