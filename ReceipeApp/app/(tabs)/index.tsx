import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  View,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { useThemeColor } from "../../hooks/use-theme-color";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // two columns layout

export default function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([
    "All",
    "African",
    "Intercontinental",
    "Seafood",
    "Vegetarian",
    "Dessert",
  ]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const fadeAnim = new Animated.Value(1);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const featuredImages = [
    "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
    "https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg",
  ];

  // Fetch recipes
  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("receipes")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.error("❌ Supabase Error:", error);
    else {
      setRecipes(data || []);
      setFilteredRecipes(data || []);

      const uniqueCategories = Array.from(
        new Set(data?.map((r: any) => r.category).filter(Boolean))
      );
      const allCategories = Array.from(
        new Set(["All", "Seafood", "Vegetarian", "Dessert", ...uniqueCategories])
      );
      setCategories(allCategories);
    }

    setLoading(false);
  }

  // Auto-change featured image every 12s
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        setFeaturedIndex((prev) => (prev + 1) % featuredImages.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Handle search + category filter with debounce
 

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor, padding: 16 },
    header: {
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: textColor,
      fontFamily: "serif",
    },
    subtitle: { fontSize: 14, color: textColor, marginTop: 4 },
    featuredImage: {
      width: "100%",
      height: 200,
      borderRadius: 16,
      marginVertical: 16,
    },
    overlay: {
      position: "absolute",
      bottom: 10,
      left: 10,
      backgroundColor: "rgba(0,0,0,0.5)",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    overlayText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: tintColor,
      borderRadius: 25,
      paddingHorizontal: 10,
      marginVertical: 10,
    },
    searchInput: { flex: 1, paddingVertical: 8, color: textColor },
    categoriesContainer: { marginVertical: 10 },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      borderRadius: 20,
      backgroundColor: backgroundColor === "#fff" ? "#f0f0f0" : "#333",
    },
    selectedCategory: { backgroundColor: tintColor },
    categoryText: { fontSize: 14, color: textColor },
    selectedCategoryText: { color: "#000" },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    card: {
      width: CARD_WIDTH,
      backgroundColor,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardImage: {
      width: "100%",
      height: 120,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginVertical: 8,
      textAlign: "center",
      color: textColor,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Food Recipes</ThemedText>
        <Ionicons name="settings-outline" size={24} color={textColor} />
      </ThemedView>

      <ThemedText style={styles.subtitle}>
        Discover the best recipes from around the world.
      </ThemedText>

      {/* Featured Image */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <View>
          <Image
            source={{ uri: featuredImages[featuredIndex] }}
            style={styles.featuredImage}
          />
          <View style={styles.overlay}>
            <ThemedText style={styles.overlayText}>Featured Recipe</ThemedText>
          </View>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={textColor}
          style={{ marginHorizontal: 8 }}
        />
        <TextInput
          placeholder="Search recipes..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={textColor}
        />
      </ThemedView>

      {/* Categories */}
      <ThemedView style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <ThemedText
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.selectedCategoryText,
                ]}
              >
                {cat}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Recipes Grid */}
      <ThemedView>
        {loading ? (
          <ActivityIndicator size="large" color={tintColor} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.grid}>
            {filteredRecipes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => router.push(`/recipe/${item.id}` as any)}
              >
                <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                <ThemedText style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}
