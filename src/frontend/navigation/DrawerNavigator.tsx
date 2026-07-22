import React from 'react';
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import { useTheme } from '../../hooks/useTheme';
import { DrawerContent } from './DrawerContent';

import { DashboardScreen } from '../screens/DashboardScreen';
import { FocusScreen } from '../screens/FocusScreen';
import { PlannerScreen } from '../screens/PlannerScreen';
import { ChatbotScreen } from '../screens/ChatbotScreen';
import { PDFLibraryScreen } from '../screens/PDFLibraryScreen';
import { FlashcardScreen } from '../screens/FlashcardScreen';
import { FinanceScreen } from '../screens/FinanceScreen';
import { TestScoreScreen } from '../screens/TestScoreScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  const { colors, isDark } = useTheme();

  const screenOptions: DrawerNavigationOptions = {
    headerShown: false,
    drawerType: 'front',
    drawerStyle: {
      width: 280,
      backgroundColor: colors.background,
    },
    swipeEdgeWidth: 50,
    swipeMinDistance: 10,
  };

  const screens = [
    { name: 'Dashboard', component: DashboardScreen },
    { name: 'Focus', component: FocusScreen },
    { name: 'Planner', component: PlannerScreen },
    { name: 'Chat', component: ChatbotScreen },
    { name: 'Library', component: PDFLibraryScreen },
    { name: 'Flashcards', component: FlashcardScreen },
    { name: 'Finance', component: FinanceScreen },
    { name: 'TestScore', component: TestScoreScreen },
    { name: 'Settings', component: SettingsScreen },
  ];

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={screenOptions}
      initialRouteName="Dashboard"
    >
      {screens.map(s => (
        <Drawer.Screen key={s.name} name={s.name} component={s.component} />
      ))}
    </Drawer.Navigator>
  );
};
