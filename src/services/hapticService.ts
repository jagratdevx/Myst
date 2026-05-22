import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * HapticService - Centralized haptic feedback for a tactile "premium" feel.
 * Gracefully fails on unsupported devices or builds without the native module.
 */
export const hapticService = {
  /**
   * Subtle tap for general interactions (button clicks, switches)
   */
  light: () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignore errors if native module not yet in build
    }
  },

  /**
   * Stronger tap for primary actions (completing a task, saving a form)
   */
  medium: () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Success vibration (onboarding finished, focus session done)
   */
  success: () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Error/Warning vibration (deletion confirmation, input error)
   */
  error: () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Tactile feedback for long-press or selection changes
   */
  selection: () => {
    try {
      Haptics.selectionAsync();
    } catch (e) {
      // Ignore
    }
  }
};
