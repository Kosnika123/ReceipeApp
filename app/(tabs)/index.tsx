import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "./contexts/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

export default function HomeScreen() {
  const { user } = useAuth();

  // If no user is logged in, show a welcome message
  if (!user) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome to RecipeApp! 👋</Text>
          <Text style={styles.subtitle}>Discover amazing recipes from around the world</Text>
        </View>

        <View style={styles.featuredCard}>
          <Text style={styles.featuredTitle}>Get Started</Text>
          <Text style={styles.featuredDesc}>
            Sign up or log in to save recipes, create your own, and join our food community!
          </Text>
        <View style={styles.authButtons}>
<TouchableOpacity
  style={styles.loginButton}
  onPress={() => router.push('/contexts/screens/LoginScreen')} // Fix this path
>
  <Text style={styles.loginButtonText}>Log In</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.signupButton}
  onPress={() => router.push('/(tabs)/contexts/screens/Signupscreen')} // Fix this path
>
  <Text style={styles.signupButtonText}>Sign Up</Text>
</TouchableOpacity>
  </View>

        </View>

        {/* Featured recipes for non-logged in users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Recipes</Text>
          <View style={styles.recipeGrid}>
            <View style={styles.recipeMiniCard}>
              <Ionicons name="pizza" size={32} color="#f57c00" />
              <Text style={styles.recipeMiniText}>Pasta</Text>
            </View>
            <View style={styles.recipeMiniCard}>
              <Ionicons name="ice-cream" size={32} color="#f57c00" />
              <Text style={styles.recipeMiniText}>Desserts</Text>
            </View>
            <View style={styles.recipeMiniCard}>
              <Ionicons name="fish" size={32} color="#f57c00" />
              <Text style={styles.recipeMiniText}>Seafood</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Logged in user view
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome back, {user.name}! 👋</Text>
        <Text style={styles.subtitle}>What would you like to cook today?</Text>
      </View>

      {/* Quick Stats */}
     <View style={styles.statsContainer}>
  <View style={styles.statCard}>
    <Ionicons name="restaurant" size={24} color="#f57c00" />
    <Text style={styles.statNumber}>{user?.recipesCreated || 0}</Text>
    <Text style={styles.statLabel}>Created</Text>
  </View>
  <View style={styles.statCard}>
    <Ionicons name="heart" size={24} color="#f57c00" />
    <Text style={styles.statNumber}>{user?.recipesSaved || 0}</Text>
    <Text style={styles.statLabel}>Saved</Text>
  </View>
  <View style={styles.statCard}>
    <Ionicons name="time" size={24} color="#f57c00" />
    <Text style={styles.statNumber}>{user?.recipesCooked || 0}</Text>
    <Text style={styles.statLabel}>Cooked</Text>
  </View>
</View>

      {/* Featured Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Special</Text>
        <View style={styles.featuredCard}>
          <Text style={styles.featuredTitle}>Creamy Garlic Pasta</Text>
          <Text style={styles.featuredDesc}>Quick and delicious pasta recipe ready in 20 minutes</Text>
<TouchableOpacity
  style={styles.recipeButton}
  onPress={() => router.push('/(tabs)/contexts/Home')} // ✅ move it here
>
  <Text style={styles.recipeButtonText}>View Recipe</Text>
</TouchableOpacity>

        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Ionicons name="heart" size={20} color="#f57c00" />
          <Text style={styles.activityText}>You liked "Chocolate Cake"</Text>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="bookmark" size={20} color="#f57c00" />
          <Text style={styles.activityText}>You saved "Avocado Toast"</Text>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="person-add" size={20} color="#f57c00" />
          <Text style={styles.activityText}>Welcome to RecipeApp!</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle" size={28} color="#f57c00" />
            <Text style={styles.actionText}>Add Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="search" size={28} color="#f57c00" />
            <Text style={styles.actionText}>Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people" size={28} color="#f57c00" />
            <Text style={styles.actionText}>Community</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featuredDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  recipeButton: {
    backgroundColor: '#f57c00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  recipeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  // New styles for non-logged in state
  authButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#f57c00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#f57c00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#f57c00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeMiniCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recipeMiniText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});