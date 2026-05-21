import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/pdf';

const PROFILE_KEY = '@myst_user_profile';

export const profileService = {
  getProfile: async (): Promise<UserProfile | null> => {
    try {
      const data = await AsyncStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  saveProfile: async (profile: UserProfile): Promise<void> => {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  },

  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const current = await profileService.getProfile() || {
      name: '',
      grade: '',
      subjects: [],
      goals: [],
      onboardingCompleted: false
    };
    const updated = { ...current, ...updates };
    await profileService.saveProfile(updated);
    return updated;
  }
};
