'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'


interface Profile {
  id: string;
  email: string;
  business_name?: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: Profile | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    profileData: Partial<Profile>
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Helper function to get API URL
  const getApiUrl = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    // Only run on client side to prevent hydration mismatch
    if (mounted && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // Try to get current user
        getCurrentUser();
      } else {
        setLoading(false);
      }
    } else if (mounted) {
      setLoading(false);
    }
  }, [mounted]);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await apiClient.getCurrentUser()
        // api returns user profile directly for /auth/me
        // normalize to Profile shape
        setUser(userData as unknown as Profile)
        setProfile(userData as unknown as Profile)
      } catch (err) {
        // Clear invalid token
        localStorage.removeItem('token')
        throw err
      }
    } catch (error) {
      console.error("Failed to get current user:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: Partial<Profile>
  ) => {
    try {
      setLoading(true)
      
      await apiClient.register({
        email,
        password,
        full_name: profileData.full_name || '',
        role: (profileData.role as string) || 'merchant',
        business_name: profileData.business_name
      })

      // After successful registration, automatically sign in
      await signIn(email, password)
      console.log('✅ Registration successful')
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const data = await apiClient.login(email, password)
      
      if (data && (data as any).access_token) {
        // Set user data from response if present; otherwise fetch
        if ((data as any).user) {
          setUser((data as any).user)
          setProfile((data as any).user)
        } else {
          await getCurrentUser()
        }
        console.log('✅ Login successful:', data)
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Clear local storage and state
      localStorage.removeItem("token");

      setUser(null);
      setProfile(null);

      console.log("✅ Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);

      // Update profile logic here
      if (profile) {
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);
        setUser(updatedProfile);
        console.log("✅ Profile updated:", updatedProfile);
      }
    } catch (error: any) {
      console.error("Profile update failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user && !!profile;

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
