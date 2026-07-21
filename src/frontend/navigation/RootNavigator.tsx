import React, { useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';
import { PDFViewerScreen } from '../screens/PDFViewerScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { OnboardingWelcome } from '../screens/Onboarding/OnboardingWelcome';
import { OnboardingProfile } from '../screens/Onboarding/OnboardingProfile';
import { OnboardingSubjects } from '../screens/Onboarding/OnboardingSubjects';
import { OnboardingGoals } from '../screens/Onboarding/OnboardingGoals';
import { OnboardingBudget } from '../screens/Onboarding/OnboardingBudget';
import { OnboardingFinal } from '../screens/Onboarding/OnboardingFinal';
import { useProfileStore } from '../../store/useProfileStore';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const Stack = createStackNavigator();

const LoadingScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const { colors } = useTheme();
  const { profile, loading } = useProfileStore();
  const navigated = useRef(false);

  useEffect(() => {
    if (!loading && !navigated.current) {
      navigated.current = true;
      const showOnboarding = !profile || !profile.onboardingCompleted;
      navigation.reset({
        index: 0,
        routes: [{ name: showOnboarding ? 'OnboardingWelcome' : 'Main' }],
      });
    }
  }, [loading, profile, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
};

export const RootNavigator = () => {
  const { fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, []);

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
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcome} />
        <Stack.Screen name="OnboardingProfile" component={OnboardingProfile} />
        <Stack.Screen name="OnboardingSubjects" component={OnboardingSubjects} />
        <Stack.Screen name="OnboardingGoals" component={OnboardingGoals} />
        <Stack.Screen name="OnboardingBudget" component={OnboardingBudget} />
        <Stack.Screen name="OnboardingFinal" component={OnboardingFinal} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
