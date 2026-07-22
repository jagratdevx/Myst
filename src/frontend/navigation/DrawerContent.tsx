import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useProfileStore } from '../../store/useProfileStore';
import { useGamificationStore } from '../../store/useGamificationStore';
import { Trophy, LayoutDashboard, Target, Calendar, MessageSquare, Library, Brain, Wallet, BarChart3, Settings } from 'lucide-react-native';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { name: 'Focus', icon: Target, label: 'Focus Timer' },
  { name: 'Planner', icon: Calendar, label: 'Planner' },
  { name: 'Chat', icon: MessageSquare, label: 'AI Chat' },
  { name: 'Library', icon: Library, label: 'Study Library' },
  { name: 'Flashcards', icon: Brain, label: 'Flashcards' },
  { name: 'Finance', icon: Wallet, label: 'Finance' },
  { name: 'TestScore', icon: BarChart3, label: 'Test Scores' },
  { name: 'Settings', icon: Settings, label: 'Settings' },
];

export const DrawerContent = ({ navigation, state }: DrawerContentComponentProps) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const profile = useProfileStore(s => s.profile);
  const { level, xp, xpToNextLevel } = useGamificationStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.profileSection, { borderBottomColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Text style={styles.avatarText}>
            {profile?.name?.charAt(0)?.toUpperCase() || 'M'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{profile?.name || 'Student'}</Text>
          <Text style={[styles.grade, { color: colors.textSecondary }]}>{profile?.grade || ''}</Text>
        </View>
        <View style={[styles.levelBadge, { backgroundColor: `${colors.accentSecondary}20` }]}>
          <Trophy size={14} color={colors.accentSecondary} />
          <Text style={[styles.levelText, { color: colors.accentSecondary }]}>{level}</Text>
        </View>
      </View>

      <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => {
          const isActive = state.index === menuItems.findIndex(m => m.name === state.routeNames[state.index]);
          const focused = state.routeNames[state.index] === item.name;
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.menuItem,
                focused && [styles.activeItem, { backgroundColor: `${colors.accent}15` }],
              ]}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
            >
              <Icon size={22} color={focused ? colors.accent : colors.textSecondary} strokeWidth={focused ? 2.5 : 2} />
              <Text style={[styles.menuLabel, { color: focused ? colors.accent : colors.textSecondary, fontWeight: focused ? '700' : '500' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.xpBarBg}>
          <View style={[styles.xpBarFill, { width: `${Math.min(100, (xp / (xpToNextLevel || 1)) * 100)}%`, backgroundColor: colors.accentSecondary }]} />
        </View>
        <Text style={[styles.xpText, { color: colors.textSecondary }]}>{xp} / {xpToNextLevel} XP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileSection: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#081120' },
  profileInfo: { flex: 1, marginLeft: 14 },
  name: { fontSize: 18, fontWeight: '800' },
  grade: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 4 },
  levelText: { fontSize: 14, fontWeight: '800' },
  menuScroll: { flex: 1, paddingHorizontal: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, marginBottom: 4, gap: 14 },
  activeItem: { },
  menuLabel: { fontSize: 16 },
  footer: { padding: 20, borderTopWidth: 1 },
  xpBarBg: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  xpBarFill: { height: 6, borderRadius: 3 },
  xpText: { fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' },
});
