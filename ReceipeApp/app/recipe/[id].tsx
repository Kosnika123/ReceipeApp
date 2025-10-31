import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Rating } from "react-native-ratings";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import * as Haptics from "expo-haptics";

export default function RecipeDetail() {
  const params = useLocalSearchParams();
  const id = typeof params.id === "string" ? params.id : String(params.id);
  const router = useRouter();

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchRecipe = async () => {
      try {
        const { data, error } = await supabase
          .from("receipes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) console.error("Error fetching recipe:", error);
        else if (data) setRecipe(data);
        else console.warn("No recipe found for id:", id);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleFinishRating = async (value: number) => {
    setRating(value);

    const { error } = await supabase
      .from("receipes")
      .update({ rating: value })
      .eq("id", id);

    if (error) {
      Alert.alert("Update failed", error.message);
      return;
    }

    if (value === 5) {
      scale.value = withSequence(
        withSpring(1.5, { damping: 2 }),
        withSpring(1, { damping: 2 })
      );
      Alert.alert("Thank you!", "You gave this recipe a perfect 5-star rating!");
    }
  };

  // ❤️ Handle Favorite toggle
  const toggleFavorite = async () => {
    if (!recipe) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("recipe_id", id);

        if (error) throw error;
        setIsFavorite(false);
        Alert.alert("Removed", "Recipe removed from favorites.");
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert([
          {
            recipe_id: id,
            title: recipe.title,
            image_url: recipe.image_url,
          },
        ]);

        if (error) throw error;
        setIsFavorite(true);
        Alert.alert("Added!", "Recipe added to favorites.");
      }
    } catch (error: any) {
      console.error("Error updating favorites:", error);
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  if (!recipe) {
    return (
      <ThemedView style={styles.loader}>
        <ThemedText style={{ color: Colors.light.icon }}>Recipe not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.tint} />
        </TouchableOpacity>

        <ThemedText type="subtitle" style={styles.headerTitle}>
          Recipe Details
        </ThemedText>

        <TouchableOpacity onPress={toggleFavorite} style={styles.heartButton}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={26}
            color={isFavorite ? "red" : Colors.light.tint}
          />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.imageContainer}>
          <Image source={{ uri: recipe.image_url }} style={styles.image} />
        </ThemedView>

        <ThemedView style={styles.contentCard}>
          <ThemedText type="title" style={styles.title}>{recipe.title}</ThemedText>

          <ThemedView style={styles.ratingCard}>
            <Rating
              type="star"
              ratingCount={5}
              imageSize={30}
              showRating={false}
              onFinishRating={handleFinishRating}
              startingValue={rating}
              readonly={false}
            />
            {rating === 5 && (
              <Animated.View style={[animatedStyle, styles.animatedStar]}>
                <Ionicons name="star" size={40} color="#FFD700" />
              </Animated.View>
            )}
          </ThemedView>

          <ThemedText type="subtitle" style={styles.sectionHeader}>Instructions</ThemedText>
          {(() => {
            const instructions = recipe.steps || recipe.instructions || "";
            if (!instructions) {
              return <ThemedText style={styles.text}>No instructions provided.</ThemedText>;
            }
            const steps = instructions.split("\n").filter((step: string) => step.trim() !== "");
            return steps.map((step: string, index: number) => (
              <ThemedText key={index} style={[styles.text, styles.step]}>
                {index + 1}. {step.trim()}
              </ThemedText>
            ));
          })()}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.icon,
  },
  backButton: { padding: 8 },
  headerTitle: { fontFamily: Fonts.sans, fontWeight: "600" },
  heartButton: { padding: 8 },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  image: { width: "100%", height: 280, borderRadius: 16 },
  contentCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  title: { fontFamily: Fonts.sans, marginBottom: 16, textAlign: "center" },
  ratingCard: { borderRadius: 12, padding: 16, marginVertical: 16, alignItems: "center" },
  sectionHeader: { fontFamily: Fonts.sans, color: Colors.light.tint, marginTop: 20, marginBottom: 12 },
  text: { fontFamily: Fonts.sans, lineHeight: 24 },
  step: { marginBottom: 8 },
  animatedStar: { marginTop: 12 },
});
