import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../../ui/AnimatedScreenWrapper';
import { GlowButton } from '../../ui/GlowButton';
import { GlassInput } from '../../ui/GlassInput';
import { useTheme } from '../../../hooks/useTheme';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const OnboardingProfile = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { updateProfile } = useOnboardingStore();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');

  const handleNext = async () => {
    if (name.trim() && grade.trim()) {
      await updateProfile({ name, grade });
      navigation.navigate('OnboardingSubjects');
    }
  };

  return (
    <AnimatedScreenWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Tell us about you</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                This helps us personalize your academic experience.
              </Text>
            </View>

            <View style={styles.form}>
              <Animated.View entering={FadeInDown.delay(200)}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                <GlassInput 
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChangeText={setName}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: 24 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Class / Grade</Text>
                <GlassInput 
                  placeholder="e.g. 11th Grade"
                  value={grade}
                  onChangeText={setGrade}
                />
              </Animated.View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <GlowButton 
              label="Continue" 
              onPress={handleNext}
              disabled={!name.trim() || !grade.trim()}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    paddingTop: 10,
    flexGrow: 1,
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    marginTop: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  footer: {
    padding: 30,
    paddingTop: 10,
    marginBottom: 10,
  },
});
