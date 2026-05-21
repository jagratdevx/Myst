import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';
import { PDFViewerScreen } from '../screens/PDFViewerScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { OnboardingWelcome } from '../screens/Onboarding/OnboardingWelcome';
import { OnboardingProfile } from '../screens/Onboarding/OnboardingProfile';
import { OnboardingSubjects } from '../screens/Onboarding/OnboardingSubjects';
import { OnboardingGoals } from '../screens/Onboarding/OnboardingGoals';
import { OnboardingFinal } from '../screens/Onboarding/OnboardingFinal';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { profile, loading, fetchProfile } = useOnboardingStore();
  const { colors } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const showOnboarding = !profile || !profile.onboardingCompleted;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          gestureEnabled: true,
        }}
      >
        {showOnboarding ? (
          <>
            <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcome} />
            <Stack.Screen name="OnboardingProfile" component={OnboardingProfile} />
            <Stack.Screen name="OnboardingSubjects" component={OnboardingSubjects} />
            <Stack.Screen name="OnboardingGoals" component={OnboardingGoals} />
            <Stack.Screen name="OnboardingFinal" component={OnboardingFinal} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
