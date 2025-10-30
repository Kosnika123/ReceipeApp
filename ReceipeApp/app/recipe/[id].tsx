import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Video } from "expo-av";
import { WebView } from "react-native-webview";
import { Rating } from "react-native-ratings";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(0);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  // ✅ Hooks must be outside conditionals
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("receipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else {
        setRecipe(data);
        setRating(data.rating || 0);
      }
      setLoading(false);
    };

    if (id) fetchRecipe();
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
        <Image source={{ uri: recipe.image_url }} style={styles.image} />

        {recipe.video_url ? (
          <ThemedView style={styles.videoContainer}>
            {recipe.video_url.includes("youtube.com") ||
            recipe.video_url.includes("youtu.be") ? (
              <>
                <WebView
                  style={styles.webview}
                  source={{ uri: getYouTubeEmbedUrl(recipe.video_url) }}
                  allowsFullscreenVideo
                />
                <ThemedText style={{ textAlign: "center", marginTop: 8 }}>
                  Can't see the video?{" "}
                  <Text
                    style={{ color: tintColor }}
                    onPress={() => Linking.openURL(recipe.video_url)}
                  >
                    Watch on YouTube
                  </Text>
                </ThemedText>
              </>
            ) : (
              <Video
                source={{ uri: recipe.video_url }}
                style={styles.video}
                useNativeControls
              />
            )}
          </ThemedView>
        ) : null}

        <ThemedText type="title" style={styles.title}>
          {recipe.title}
        </ThemedText>

        {/* Rating Section */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Rating
        </ThemedText>
        <Animated.View style={animatedStyle}>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={40}
            startingValue={rating}
            showRating={false}
            onFinishRating={handleRatingCompleted}
            tintColor={backgroundColor}
            ratingColor="#eaff03ff"
            ratingBackgroundColor="#fefefeff"
            
            style={{ paddingVertical: 10, 
               
                   borderWidth: 1,
                  borderRadius: 8,
                alignSelf: "center", }}
          />
        </Animated.View>

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
