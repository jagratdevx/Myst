import React from 'react';
import { View, StyleSheet, SafeAreaView, ViewStyle, StyleProp } from 'react-native';
import { GradientBackground } from './GradientBackground';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AnimatedScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AnimatedScreenWrapper: React.FC<AnimatedScreenWrapperProps> = ({ 
  children, 
  style 
}) => {
  return (
    <View style={styles.container}>
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View 
            entering={FadeIn.duration(400)} 
            style={[styles.content, style]}
          >
            {children}
          </Animated.View>
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
