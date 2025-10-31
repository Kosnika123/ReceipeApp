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
    "Starters",
    "Dessert",
    "Vegetarian",
    "Seafood",
    "Chicken",
    "Lamb",
    "Vegan",
    "Miscellaneous",
  ]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const fadeAnim = new Animated.Value(1);
  // const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [imageSources, setImageSources] = useState<{[key: string]: any}>({});

  const defaultImage = require("../../assets/images/icon.png"); // Default image fallback

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const featuredImages = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400",
    "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=400",
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=400",
    "https://unsplash.com/photos/cooked-food-awj7sRviVXo"
  ];

  // Fetch recipes from Supabase
  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("receipes")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("❌ Supabase Error:", error);
    } else {
      setRecipes(data || []);
      setFilteredRecipes(data || []);

      // Collect all categories dynamically from data
const uniqueCategories = Array.from(
  new Set(data?.map((r: any) => r.cartegory).filter(Boolean)) // ✅ fixed here
);
      const allCategories = Array.from(
        new Set([
          "All",
          "Starter",
          "Dessert",
          "Vegetarian",
          "Seafood",
          "Chicken",
          "Lamb",
          "Vegan",
          "Miscellaneous",
          ...uniqueCategories,
        ])
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

  // ✅ Fixed filtering logic with debounce and cleanup
  useEffect(() => {
    if (!recipes.length) return;

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      const searchLower = search.trim().toLowerCase();
      const selectedLower = selectedCategory.toLowerCase();

 const filtered = recipes.filter((item) => {
  const matchesSearch =
    !searchLower || item.title?.toLowerCase().includes(searchLower);
  const matchesCategory =
    selectedLower === "all" ||
    item.cartegory?.toLowerCase() === selectedLower; // ✅ fixed here
  return matchesSearch && matchesCategory;
});


      setFilteredRecipes(filtered);
    }, 250);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, selectedCategory, recipes]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor, padding: 16, fontFamily: "serif" },
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
      left: 17,
      backgroundColor: "#0a7ea4",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      marginBottom: 17,
      marginStart: 66,
    },
    overlayText: { color: "#ffffffff", fontSize: 16, fontWeight: "600" },

    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: "#000000ff",
      borderRadius: 21,
      padding: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
    },
    searchInput: { flex: 1, paddingVertical: 8, color: textColor},
    categoriesContainer: { marginVertical: 10 },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      borderRadius: 20,
      backgroundColor: backgroundColor === "#fff" ? "#f0f0f0" : "#ffffffff",
    },
    selectedCategory: { backgroundColor: tintColor },
    categoryText: { fontSize: 14, color: textColor },
    selectedCategoryText: { color: "#000000ff" },
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
              onPress={() => {
                setSelectedCategory(cat);
                setSearch(""); // clears search when changing category
              }}
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
          <ActivityIndicator
            size="large"
            color={tintColor}
            style={{ marginTop: 20 }}
          />
        ) : (
          <View style={styles.grid}>
            {filteredRecipes.map((item) => (
                <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                  pathname: `/recipe/[id]`,
                  params: {
                    id: item.id,       // <-- this is required
                    source: "supabase",
                    title: item.title,
                    description: item.description,
                    ingredients: item.ingredients,
                    steps: item.steps,
                    imageUrl: item.imageurl,
                  },
                  })
                }
                >
                <Image
                  source={imageSources[item.id] || { uri: item.image_url }}
                  style={styles.cardImage}
                  onError={() => {
                    // Fallback to default image if loading fails
                    setImageSources(prev => ({ ...prev, [item.id]: defaultImage }));
                  }}
                />
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
