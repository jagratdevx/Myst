import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { BreathingOrb } from '../ui/BreathingOrb';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { SectionHeader } from '../ui/SectionHeader';
import { AnimatedStatCard } from '../ui/AnimatedStatCard';
import { useTheme } from '../../hooks/useTheme';
import { useFocusStore } from '../../store/useFocusStore';
import { 
  RotateCcw, 
  Coffee, 
  Wind, 
  Moon,
  Zap,
  Flame,
  Clock
} from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Audio } from 'expo-av';

const AMBIENT_SOUNDS = [
  { id: 'rain', label: 'Rain', icon: <Wind size={20} />, file: require('../../assets/audio/liecio-calming-rain-257596.mp3') },
  { id: 'forest', label: 'Forest', icon: <Moon size={20} />, file: require('../../assets/audio/dany_photo-forestbirds-319791.mp3') },
  { id: 'cafe', label: 'Cafe', icon: <Coffee size={20} />, file: require('../../assets/audio/km007-cafe-ambience-9263.mp3') },
  { id: 'white', label: 'Noise', icon: <Zap size={20} />, file: require('../../assets/audio/themediaguy-soft-soothing-deep-white-noise-378857.mp3') },
];

export const FocusScreen = () => {
  const { colors } = useTheme();
  const { stats, saveSession, fetchData } = useFocusStore();
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(1500); // 25 minutes
  const [initialSeconds] = useState(1500);
  const [mode, setFocusMode] = useState<'study' | 'break'>('study');
  
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const toggleAmbientSound = async (soundId: string) => {
    if (activeSoundId === soundId) {
      // Stop current
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setActiveSoundId(null);
      }
      return;
    }

    // Stop and unload existing sound if any
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    const soundOption = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (soundOption) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        soundOption.file,
        { shouldPlay: true, isLooping: true, volume: 0.5 }
      );
      setSound(newSound);
      setActiveSoundId(soundId);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    const duration = initialSeconds - seconds;
    if (duration > 10) { // Only save if more than 10 seconds
      await saveSession(duration, mode);
      Alert.alert(
        mode === 'study' ? 'Focus Complete!' : 'Break Over!',
        mode === 'study' ? 'Great job staying focused.' : 'Ready to get back to work?',
        [{ text: 'OK' }]
      );
    }
    setSeconds(mode === 'study' ? 300 : 1500); // Toggle to break or study
    setFocusMode(mode === 'study' ? 'break' : 'study');
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(mode === 'study' ? 1500 : 300);
  };

  const formatHours = (seconds: number) => {
    return (seconds / 3600).toFixed(1) + 'h';
  };

  return (
    <AnimatedScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Immersive Timer Section */}
        <View style={styles.timerSection}>
          <BreathingOrb isBreathing={isActive} />
          <Animated.View entering={FadeIn.delay(400)} style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: colors.textPrimary }]}>{formatTime(seconds)}</Text>
            <Text style={[styles.modeText, { color: colors.accent }]}>{mode === 'study' ? 'DEEP FOCUS' : 'SHORT BREAK'}</Text>
          </Animated.View>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={resetTimer} style={[styles.iconButton, { backgroundColor: colors.glass, borderColor: colors.border }]}>
            <RotateCcw color={colors.textSecondary} size={24} />
          </TouchableOpacity>
          
          <GlowButton 
            title={isActive ? "PAUSE" : "START SESSION"} 
            onPress={toggleTimer}
            style={styles.mainButton}
            color={isActive ? colors.accentSecondary : colors.accent}
          />

          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.glass, borderColor: colors.border }]} 
            onPress={() => {
              if (!isActive) {
                setFocusMode(mode === 'study' ? 'break' : 'study');
                setSeconds(mode === 'study' ? 300 : 1500);
              }
            }}
          >
            <Coffee color={mode === 'break' ? colors.accent : colors.textSecondary} size={24} />
          </TouchableOpacity>
        </View>

        {/* Ambient Modes */}
        <SectionHeader title="Ambient Sounds" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ambientScroll}>
          {AMBIENT_SOUNDS.map((item) => (
            <AmbientItem 
              key={item.id}
              icon={React.cloneElement(item.icon as React.ReactElement, { color: activeSoundId === item.id ? colors.accent : colors.textSecondary })} 
              label={item.label} 
              active={activeSoundId === item.id}
              onPress={() => toggleAmbientSound(item.id)}
            />
          ))}
        </ScrollView>

        {/* Stats */}
        <SectionHeader title="Focus Overview" />
        <View style={styles.statsGrid}>
          <AnimatedStatCard 
            label="Focus Hours" 
            value={formatHours(stats.totalFocusTime)} 
            icon={<Clock size={20} color={colors.accentSecondary} />} 
            delay={300}
          />
          <AnimatedStatCard 
            label="Sessions" 
            value={stats.totalSessions.toString()} 
            icon={<Zap size={20} color={colors.accent} />} 
            delay={400}
          />
        </View>
        
        <GlassCard style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Flame size={24} color={colors.error} />
            <Text style={[styles.streakTitle, { color: colors.textPrimary }]}>{stats.streakDays} Day Streak</Text>
          </View>
          <Text style={[styles.streakSub, { color: colors.textSecondary }]}>
            {stats.streakDays > 0 
              ? `You've stayed consistent! Keep it up to reach the top 5%.`
              : `Start a session today to begin your focus streak!`}
          </Text>
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </AnimatedScreenWrapper>
  );
};

const AmbientItem = ({ icon, label, active = false, onPress }: { icon: React.ReactNode; label: string; active?: boolean; onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.ambientItem, 
        { backgroundColor: colors.glass, borderColor: colors.border },
        active && { backgroundColor: `${colors.accent}15`, borderColor: colors.accent }
      ]}
    >
      {icon}
      <Text style={[
        styles.ambientLabel, 
        { color: colors.textSecondary },
        active && { color: colors.accent }
      ]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  timerSection: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  modeText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 4,
    marginTop: -10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  mainButton: {
    flex: 1,
    marginHorizontal: 20,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  ambientScroll: {
    width: '100%',
    marginBottom: 32,
  },
  ambientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  ambientLabel: {
    marginLeft: 8,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  streakCard: {
    width: '100%',
    padding: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 12,
  },
  streakSub: {
    fontSize: 14,
    lineHeight: 20,
  },
});
