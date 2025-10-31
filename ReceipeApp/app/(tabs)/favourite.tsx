import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();

    // ✅ Real-time listener for changes in "favorites" table
    const channel = supabase
      .channel("realtime-favorites")
      .on(
        "postgres_changes",
        {
          event: "*", // listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "favorites",
        },
        (payload) => {
          console.log("🔄 Favorites updated:", payload);

          // Apply real-time changes instantly without refetching entire list
          setFavorites((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new, ...prev];
              case "UPDATE":
                return prev.map((f) =>
                  f.id === payload.new.id ? payload.new : f
                );
              case "DELETE":
                return prev.filter((f) => f.id !== payload.old.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
    } else {
      setFavorites(data || []);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF7F50" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No favorite recipes yet ❤️</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/recipe/${item.recipe_id}` as any)}
        >
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    margin: 8,
  },
});
