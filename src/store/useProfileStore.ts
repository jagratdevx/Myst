import { create } from 'zustand';
import { UserProfile } from '../types/pdf';
import { profileService } from '../services/profileService';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: true,

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
  },

  completeOnboarding: async () => {
    const profile = get().profile;
    if (profile) {
      try {
        const updated = await profileService.updateProfile({ onboardingCompleted: true });
        set({ profile: updated });
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
  }
}));
