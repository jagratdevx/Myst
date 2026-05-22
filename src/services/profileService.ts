import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/pdf';

const PROFILE_KEY = '@myst_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  grade: '',
  subjects: [],
  goals: [],
  monthlyBudget: 12000,
  savingsGoal: 2000,
  onboardingCompleted: false
};

const normalizeProfile = (profile: UserProfile): UserProfile => ({
  ...DEFAULT_PROFILE,
  ...profile,
  monthlyBudget: Number(profile.monthlyBudget || DEFAULT_PROFILE.monthlyBudget),
  savingsGoal: Number(profile.savingsGoal || 0),
});

export const profileService = {
  getProfile: async (): Promise<UserProfile | null> => {
    try {
      const data = await AsyncStorage.getItem(PROFILE_KEY);
      return data ? normalizeProfile(JSON.parse(data)) : null;
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
    const current = await profileService.getProfile() || DEFAULT_PROFILE;
    const updated = normalizeProfile({ ...current, ...updates });
    await profileService.saveProfile(updated);
    return updated;
  }
};
