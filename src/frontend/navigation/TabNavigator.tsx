import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { 
  LayoutDashboard, 
  Target, 
  Calendar, 
  Library, 
  Wallet, 
  BarChart3, 
  Settings 
} from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import Animated, { FadeIn } from 'react-native-reanimated';

// Screens
import { DashboardScreen } from '../screens/DashboardScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { FocusScreen } from '../screens/FocusScreen';
import { PlannerScreen } from '../screens/PlannerScreen';
import { PDFLibraryScreen } from '../screens/PDFLibraryScreen';
import { FinanceScreen } from '../screens/FinanceScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors, isDark } = useTheme();
  const { isSmallScreen } = useResponsive();

  const barBg = isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.96)';
  const barBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)';
  
  return (
    <View style={[
      styles.tabBarContainer, 
      { 
        backgroundColor: barBg, 
        borderColor: barBorder,
        bottom: Platform.OS === 'ios' ? 24 : 16,
        paddingHorizontal: isSmallScreen ? 8 : 12,
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const Icon = (props: any) => {
          switch (route.name) {
            case 'Dashboard': return <LayoutDashboard {...props} />;
            case 'Focus': return <Target {...props} />;
            case 'Planner': return <Calendar {...props} />;
            case 'Library': return <Library {...props} />;
            case 'Finance': return <Wallet {...props} />;
            case 'Analytics': return <BarChart3 {...props} />;
            case 'Settings': return <Settings {...props} />;
            default: return null;
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            {isFocused && (
              <Animated.View 
                entering={FadeIn.duration(200)}
                style={[
                  styles.activeIndicator, 
                  { backgroundColor: isDark ? 'rgba(94, 235, 255, 0.12)' : 'rgba(15, 23, 42, 0.05)' }
                ]} 
              />
            )}
            <Icon 
              size={22} 
              color={isFocused 
                ? colors.accent 
                : (isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(15, 23, 42, 0.5)')
              } 
              strokeWidth={isFocused ? 2.5 : 2}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Focus" component={FocusScreen} />
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Library" component={PDFLibraryScreen} />
      <Tab.Screen name="Finance" component={FinanceScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});
