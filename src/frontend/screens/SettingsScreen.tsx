import React, { useEffect, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch, 
  TouchableOpacity, 
  Alert, 
  Share,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useProfileStore } from '../../store/useProfileStore';
import { usePDFStore } from '../../store/usePDFStore';
import { 
  User, 
  Moon, 
  ChevronRight,
  Trash2,
  Download,
  Sun,
  BookOpen,
  Target,
  FileX,
  Info,
  Database,
  Palette,
  Library,
  Eye
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, toggleTheme, isDark, isHighContrast, toggleHighContrast } = useTheme();
  const { contentPadding } = useResponsive();
  const { fetchData, resetAllData, exportData } = useSettingsStore();
  const { profile, fetchProfile } = useProfileStore();
  const { pdfs, fetchPDFs } = usePDFStore();

  useEffect(() => {
    fetchData();
    fetchPDFs();
    fetchProfile();
  }, [fetchData, fetchPDFs, fetchProfile]);

  const handleReset = useCallback(() => {
    Alert.alert(
      "Reset All Data",
      "This will permanently delete all your local tasks, finance records, and focus history. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Everything", 
          style: "destructive",
          onPress: async () => {
            await resetAllData();
            Alert.alert("Data Cleared", "All local data has been reset. Please restart the app.");
          }
        }
      ]
    );
  }, [resetAllData]);

  const handleExport = useCallback(async () => {
    try {
      const data = await exportData();
      await Share.share({
        message: data,
        title: 'Myst Data Export'
      });
    } catch (error) {
      Alert.alert("Export Failed", "Could not export your data.");
    }
  }, [exportData]);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      "Clear PDF Cache",
      "This will remove all imported PDFs from your local storage. Meta-data will be preserved but files will need re-importing.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => Alert.alert("Coming Soon", "Cache clearing functionality is being refined.") }
      ]
    );
  }, []);

  return (
    <AnimatedScreenWrapper>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}
      >
        <Text style={[styles.header, { color: colors.textPrimary }]}>Settings</Text>

        {/* Profile Card */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <GlassCard style={styles.profileCard}>
            <View style={[styles.avatar, { backgroundColor: `${colors.accent}20`, borderColor: `${colors.accent}40` }]}>
              <User size={32} color={colors.accent} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>{profile?.name || 'Student'}</Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{profile?.grade || 'Myst User'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* Profile Details (Brief) */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.briefGrid}>
          <View style={[styles.briefItem, { backgroundColor: colors.glass }]}>
            <BookOpen size={18} color={colors.accentSecondary} />
            <Text style={[styles.briefText, { color: colors.textPrimary }]}>{profile?.subjects?.length || 0} Subjects</Text>
          </View>
          <View style={[styles.briefItem, { backgroundColor: colors.glass }]}>
            <Target size={18} color={colors.accent} />
            <Text style={[styles.briefText, { color: colors.textPrimary }]}>{profile?.goals?.length || 0} Goals</Text>
          </View>
        </Animated.View>

        {/* Settings Sections */}
        <SettingsSection title="Appearance" delay={400}>
          <SettingsItem 
            icon={<Palette size={20} color={colors.accent} />} 
            label="Theme" 
            value={isHighContrast ? "High Contrast" : isDark ? "Dark Mode" : "Light Mode"}
            hasSwitch 
            switchValue={isDark && !isHighContrast} 
            onSwitchChange={toggleTheme}
          />
          <SettingsItem 
            icon={<Eye size={20} color={colors.accentSecondary} />} 
            label="High Contrast" 
            hasSwitch 
            switchValue={isHighContrast} 
            onSwitchChange={toggleHighContrast}
          />
        </SettingsSection>

        <SettingsSection title="Study Library" delay={500}>
          <SettingsItem 
            icon={<Library size={20} color={colors.accentSecondary} />} 
            label="Manage PDFs" 
            value={`${pdfs.length} documents`}
            onPress={() => navigation.navigate('Library')}
          />
          <SettingsItem 
            icon={<FileX size={20} color={colors.error} />} 
            label="Clear PDF Cache" 
            onPress={handleClearCache}
          />
        </SettingsSection>

        <SettingsSection title="Data & Privacy" delay={600}>
          <SettingsItem 
            icon={<Download size={20} color={colors.accentSecondary} />} 
            label="Export Data (JSON)" 
            onPress={handleExport}
          />
          <SettingsItem 
            icon={<Trash2 size={20} color={colors.error} />} 
            label="Reset App Data" 
            onPress={handleReset}
          />
        </SettingsSection>

        <SettingsSection title="About" delay={700}>
          <SettingsItem 
            icon={<Info size={20} color={colors.textSecondary} />} 
            label="App Version" 
            value="v2.1.0-premium"
          />
          <SettingsItem 
            icon={<User size={20} color={colors.textSecondary} />} 
            label="Architects" 
            value="Jagrat & Nilabh"
          />
          <SettingsItem 
            icon={<Database size={20} color={colors.textSecondary} />} 
            label="Storage" 
            value="Offline-First"
          />
        </SettingsSection>

        <Animated.View entering={FadeInDown.delay(800)} style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Designed with ❤️ for students
          </Text>
          <Text style={[styles.footerText, { color: colors.textSecondary, opacity: 0.5 }]}>
            Myst Student OS
          </Text>
        </Animated.View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </AnimatedScreenWrapper>
  );
};

const SettingsSection = React.memo(({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) => {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <GlassCard style={styles.sectionCard}>
        {children}
      </GlassCard>
    </Animated.View>
  );
});

const SettingsItem = React.memo(({ 
  icon, 
  label, 
  value, 
  hasSwitch, 
  switchValue,
  onSwitchChange,
  onPress
}: { 
  icon: React.ReactNode; 
  label: string; 
  value?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  onPress?: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.item, { borderBottomColor: colors.border }]} 
      disabled={!onPress && !hasSwitch} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.itemIcon, { backgroundColor: `${colors.textSecondary}10` }]}>
          {icon}
        </View>
        <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      <View style={styles.itemRight}>
        {value && !hasSwitch && <Text style={[styles.itemValue, { color: colors.textSecondary }]}>{value}</Text>}
        {hasSwitch ? (
          <Switch 
            value={switchValue} 
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#FFFFFF"
          />
        ) : (
          onPress && <ChevronRight size={18} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 28,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
    borderRadius: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.8,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  briefGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  briefItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  briefText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
    opacity: 0.6,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 14,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: '500',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
});
