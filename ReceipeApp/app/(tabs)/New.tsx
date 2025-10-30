import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";

export default function New() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "You need to allow access to your gallery!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddRecipe = async () => {
    if (!title || !description || !ingredients || !image) {
      Alert.alert("Missing fields", "Please fill in all fields and select an image.");
      return;
    }

    setLoading(true);

    try {
      // Upload image to Supabase Storage
      const fileExt = image.split(".").pop();
      const fileName = `recipe_${Date.now()}.${fileExt}`;
      const fileResponse = await fetch(image);
      const fileBlob = await fileResponse.blob();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("recipes") // Ensure this bucket exists
        .upload(fileName, fileBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("recipes")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // Insert into Supabase table
      const { data, error } = await supabase.from("recipes").insert([
        {
          title,
          description,
          ingredients,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      Alert.alert("✅ Success", "Recipe uploaded successfully!");
      setTitle("");
      setDescription("");
      setIngredients("");
      setImage(null);

    } catch (error) {
      console.error("Error uploading recipe:", error);
      Alert.alert("Error", "Failed to upload recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add a New Recipe</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <Ionicons name="camera-outline" size={40} color="#888" />
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Recipe Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Recipe Ingredients"
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={3}
        value={ingredients}
        onChangeText={setIngredients}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Recipe Instructions"
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddRecipe} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="add-circle-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Add Recipe</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#f2f2f2", borderRadius: 10, padding: 12, fontSize: 16, color: "#333", marginVertical: 8 },
  textArea: { textAlignVertical: "top" },
  imagePicker: { backgroundColor: "#f2f2f2", height: 180, justifyContent: "center", alignItems: "center", borderRadius: 12, marginBottom: 10 },
  previewImage: { width: "100%", height: "100%", borderRadius: 12 },
  button: { marginTop: 20, backgroundColor: "#ff6347", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 12 },
  buttonText: { fontSize: 17, color: "#fff", fontWeight: "600" },
});
