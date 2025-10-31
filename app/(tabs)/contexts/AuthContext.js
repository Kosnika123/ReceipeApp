import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase'; // Make sure this path is correct

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

// In your AuthContext, make sure login and signup return user data with the same structure
const Login = async (email, password) => {
  try {
    // Your authentication logic
    const user = {
      id: '1',
      name: 'John Doe', // Make sure this field exists
      email: email,
      recipesCreated: 5,
      recipesSaved: 12,
      // ... other user data
    };
    setUser(user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// In your AuthContext or RecipeContext
const updateUserStats = async (type, change = 1) => {
  try {
    setUser(prevUser => ({
      ...prevUser,
      [type]: (prevUser[type] || 0) + change
    }));
    
    // Also update in your backend/database
    await updateUserInDatabase(user.id, { [type]: user[type] + change });
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

// Specific functions for each action
const addCreatedRecipe = () => updateUserStats('recipesCreated', 1);
const addSavedRecipe = () => updateUserStats('recipesSaved', 1);
const removeSavedRecipe = () => updateUserStats('recipesSaved', -1);
const addCookedRecipe = () => updateUserStats('recipesCooked', 1);

const Signup = async (username, email, password) => {
  try {
    // Your registration logic
    const user = {
      id: '2',
      name: username, // Use the username as name
      email: email,
      recipesCreated: 0,
      recipesSaved: 0,
      // ... other user data
    };
    setUser(user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check Supabase session first
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
      }
      
      if (session?.user) {
        // User is logged in via Supabase, fetch their profile
        await fetchUserProfile(session.user.id);
      } else {
        // Fallback to local storage for demo
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Create profile if it doesn't exist
        await createUserProfile(userId);
      } else {
        // Convert Supabase profile to app format
        const userProfile = {
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
          avatar: data.avatar,
          joinDate: data.join_date,
          favoriteCuisine: data.favorite_cuisine,
          bio: data.bio,
          recipesCreated: data.recipes_created,
          recipesSaved: data.recipes_saved
        };
        
        setUser(userProfile);
        // Also store in AsyncStorage for fallback
        await AsyncStorage.setItem('user', JSON.stringify(userProfile));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setIsLoading(false);
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error getting auth user:', authError);
        setIsLoading(false);
        return;
      }
      
      const newProfile = {
        id: userId,
        username: authUser.user?.user_metadata?.username || authUser.user?.email?.split('@')[0] || 'user',
        name: authUser.user?.user_metadata?.name || authUser.user?.user_metadata?.username || 'User',
        email: authUser.user?.email,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        join_date: new Date().toISOString().split('T')[0],
        favorite_cuisine: 'Italian',
        bio: 'Food enthusiast and home cook',
        recipes_created: 0,
        recipes_saved: 0
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        // Fallback to local storage
        await createLocalUser(authUser.user?.user_metadata?.username, authUser.user?.email);
      } else if (data) {
        const userProfile = {
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
          avatar: data.avatar,
          joinDate: data.join_date,
          favoriteCuisine: data.favorite_cuisine,
          bio: data.bio,
          recipesCreated: data.recipes_created,
          recipesSaved: data.recipes_saved
        };
        
        setUser(userProfile);
        await AsyncStorage.setItem('user', JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLocalUser = async (username, email) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        name: username,
        username: username,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        joinDate: new Date().toISOString().split('T')[0],
        favoriteCuisine: 'Italian',
        bio: 'Food enthusiast and home cook',
        recipesCreated: 0,
        recipesSaved: 0
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Error creating local user:', error);
    }
  };

  const login = async (email, password) => {
    try {
      // Try Supabase login first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.log('Supabase login failed, using demo mode:', error.message);
        // Fallback to demo login
        return await demoLogin(email, password);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: "Login failed" };
    }
  };

  const demoLogin = async (email, password) => {
    try {
      // Demo login - accept any credentials
      const mockUser = {
        id: '1',
        name: email.split('@')[0],
        username: email.split('@')[0],
        email: email,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        joinDate: new Date().toISOString().split('T')[0],
        favoriteCuisine: 'Italian',
        bio: 'Food enthusiast and home cook',
        recipesCreated: 0,
        recipesSaved: 0
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      console.error('Demo login error:', error);
      return { success: false, error: "Login failed" };
    }
  };

  const signup = async (username, email, password) => {
    try {
      // Try Supabase signup first
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            username: username,
            name: username,
          },
        },
      });

      if (error) {
        console.log('Supabase signup failed, using demo mode:', error.message);
        // Fallback to demo signup
        return await demoSignup(username, email, password);
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: "Registration failed" };
    }
  };

  const demoSignup = async (username, email, password) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        name: username,
        username: username,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        joinDate: new Date().toISOString().split('T')[0],
        favoriteCuisine: 'Italian',
        bio: 'New food enthusiast!',
        recipesCreated: 0,
        recipesSaved: 0
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Demo signup error:', error);
      return { success: false, error: "Signup failed" };
    }
  };

  const logout = async () => {
    try {
      // Try Supabase logout
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log('Supabase logout failed:', error.message);
      }
      
      // Always clear local storage
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};