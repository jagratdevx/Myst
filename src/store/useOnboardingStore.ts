import { create } from 'zustand';
import { UserProfile } from '../types/pdf';
import { profileService } from '../services/profileService';

interface OnboardingState {
  profile: UserProfile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  profile: null,
  loading: true,

  fetchProfile: async () => {
    try {
      const profile = await profileService.getProfile();
      set({ profile, loading: false });
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ loading: false });
    }
  },

  updateProfile: async (updates) => {
    try {
      const updated = await profileService.updateProfile(updates);
      set({ profile: updated });
    } catch (error) {
      console.error('Error updating profile:', error);
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
