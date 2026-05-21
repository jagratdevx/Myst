import { create } from 'zustand';
import { UserProfile } from '../types/pdf';
import { profileService } from '../services/profileService';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,

  fetchProfile: async () => {
    set({ loading: true });
    try {
      const profile = await profileService.getProfile();
      set({ profile, loading: false });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      set({ loading: false });
    }
  },

  updateProfile: async (updates) => {
    try {
      const updatedProfile = await profileService.updateProfile(updates);
      set({ profile: updatedProfile });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }
}));
