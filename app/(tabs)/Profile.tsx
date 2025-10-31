import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

// Mock user data - replace with your actual data
const mockUser = {
  id: '1',
  name: 'Alex Johnson',
  username: 'alexjohn',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  joinDate: '2023-03-15',
  favoriteCuisine: 'Italian',
  bio: 'Passionate home chef 🍳 | Love exploring new recipes | Coffee enthusiast ☕',
  recipesCreated: 12,
  recipesSaved: 24
};

const mockRecipes = [
  { 
    id: 1, 
    name: "Lemon Tart", 
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop",
    time: "45 min",
    rating: 4.8
  },
  { 
    id: 2, 
    name: "Spaghetti Carbonara", 
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=150&h=150&fit=crop",
    time: "30 min",
    rating: 4.6
  },
  { 
    id: 3, 
    name: "Blueberry Pancakes", 
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop",
    time: "20 min",
    rating: 4.9
  },
];

const mockSavedRecipes = [
  { 
    id: 1, 
    name: "Avocado Toast", 
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=120&h=120&fit=crop",
    category: "Breakfast"
  },
  { 
    id: 2, 
    name: "Greek Salad", 
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&h=120&fit=crop",
    category: "Salad"
  },
];

export default function ProfileScreen() {
  const [user, setUser] = useState(mockUser);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recipes');

  // Simulate loading user data
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => Alert.alert("Logged out", "You have been logged out successfully!") 
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature coming soon!");
  };

  const handleRecipePress = (recipeId: number) => {
    Alert.alert("Recipe Selected", `Opening recipe #${recipeId}`);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Blur Effect */}
      <BlurView intensity={90} tint="light" style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleEditProfile}>
            <Ionicons name="settings-outline" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Profile Card with Glass Morphism */}
      <View style={styles.profileCard}>
        <BlurView intensity={60} tint="light" style={styles.profileBlurContainer}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <View style={styles.avatarBadge}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          </View>

          {/* User Info */}
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userUsername}>@{user.username}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.recipesCreated}</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.recipesSaved}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={18} color="#FF6B35" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#fff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      {/* User Details Card */}
      <BlurView intensity={70} tint="light" style={styles.detailsCard}>
        <View style={styles.detailItem}>
          <Ionicons name="mail-outline" size={20} color="#FF6B35" />
          <Text style={styles.detailText}>{user.email}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={20} color="#FF6B35" />
          <Text style={styles.detailText}>Joined {formatJoinDate(user.joinDate)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="restaurant-outline" size={20} color="#FF6B35" />
          <Text style={styles.detailText}>Favorite: {user.favoriteCuisine}</Text>
        </View>
      </BlurView>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
          onPress={() => setActiveTab('recipes')}
        >
          <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
            My Recipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
            Saved Recipes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'recipes' ? (
        <View style={styles.recipesSection}>
          <Text style={styles.sectionTitle}>My Creations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipesScroll}>
            {mockRecipes.map((recipe) => (
              <TouchableOpacity 
                key={recipe.id} 
                style={styles.recipeCard}
                onPress={() => handleRecipePress(recipe.id)}
              >
                <BlurView intensity={50} tint="light" style={styles.recipeBlurContainer}>
                  <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                    <View style={styles.recipeMeta}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.recipeMetaText}>{recipe.time}</Text>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.recipeMetaText}>{recipe.rating}</Text>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.savedSection}>
          <Text style={styles.sectionTitle}>Saved Recipes</Text>
          <View style={styles.savedGrid}>
            {mockSavedRecipes.map((recipe) => (
              <TouchableOpacity 
                key={recipe.id} 
                style={styles.savedCard}
                onPress={() => handleRecipePress(recipe.id)}
              >
                <BlurView intensity={50} tint="light" style={styles.savedBlurContainer}>
                  <Image source={{ uri: recipe.image }} style={styles.savedImage} />
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedName}>{recipe.name}</Text>
                    <Text style={styles.savedCategory}>{recipe.category}</Text>
                  </View>
                  <TouchableOpacity style={styles.unsaveButton}>
                    <Ionicons name="heart" size={16} color="#FF6B35" />
                  </TouchableOpacity>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Recent Activity */}
      <BlurView intensity={60} tint="light" style={styles.activityCard}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Ionicons name="heart" size={20} color="#FF6B35" />
          <Text style={styles.activityText}>Liked "Chocolate Cake" recipe</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="add-circle" size={20} color="#4CAF50" />
          <Text style={styles.activityText}>Added new recipe "Pasta Salad"</Text>
          <Text style={styles.activityTime}>1 day ago</Text>
        </View>
      </BlurView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  profileCard: {
    margin: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  profileBlurContainer: {
    padding: 25,
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  userBio: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    gap: 6,
  },
  editButtonText: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    gap: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  detailsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  recipesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  recipesScroll: {
    paddingLeft: 20,
  },
  recipeCard: {
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    width: 200,
  },
  recipeBlurContainer: {
    padding: 15,
  },
  recipeImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    marginBottom: 10,
  },
  recipeInfo: {
    alignItems: 'center',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recipeMetaText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  savedSection: {
    marginBottom: 20,
  },
  savedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  savedCard: {
    width: '48%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  savedBlurContainer: {
    padding: 12,
  },
  savedImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
  },
  savedInfo: {
    marginBottom: 8,
  },
  savedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  savedCategory: {
    fontSize: 12,
    color: '#666',
  },
  unsaveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  activityCard: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});