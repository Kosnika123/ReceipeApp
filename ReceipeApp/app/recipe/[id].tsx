import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Video } from "expo-av";
import { WebView } from "react-native-webview";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("receipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setRecipe(data);
      setLoading(false);
    };

    if (id) fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.loader}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  if (!recipe) {
    return (
      <ThemedView style={styles.loader}>
        <ThemedText>No recipe found.</ThemedText>
      </ThemedView>
    );
  }

  // Format instructions with clearer spacing (split by line breaks or periods)
  const formattedInstructions = recipe.instructions
    ? recipe.instructions
        .split(/\r?\n|(?<=\.)\s+/)
        .map((line: string, index: number) => (
          <ThemedText key={index} style={[styles.text, { color: textColor }]}>
            {line.trim()}
          </ThemedText>
        ))
    : null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        <Image source={{ uri: recipe.image_url }} style={styles.image} />

        {/* Video Section */}
        {recipe.video_url ? (
          <ThemedView style={styles.videoContainer}>
            {recipe.video_url.includes("youtube.com") ||
            recipe.video_url.includes("youtu.be") ? (
              <WebView
                style={styles.webview}
                source={{
                  uri: recipe.video_url.replace("watch?v=", "embed/"),
                }}
                allowsFullscreenVideo
              />
            ) : (
              <Video
                source={{ uri: recipe.video_url }}
                style={styles.video}
                useNativeControls
              />
            )}
          </ThemedView>
        ) : null}

        {/* Recipe Title */}
        <ThemedText type="title" style={styles.title}>
          {recipe.title}
        </ThemedText>

        {/* Ingredients */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Ingredients
        </ThemedText>
        <ThemedText style={styles.text}>
          {recipe.ingredients}
        </ThemedText>

        {/* Instructions */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Instructions
        </ThemedText>
        <ThemedView style={styles.instructionsContainer}>
          {formattedInstructions}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 16, marginBottom: 20 },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  videoContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  video: {
    width: "100%",
    height: 240,
    borderRadius: 16,
  },
  webview: {
    width: "100%",
    height: 240,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
  },
  instructionsContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
});
