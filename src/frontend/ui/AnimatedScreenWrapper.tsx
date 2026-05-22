import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { GradientBackground } from './GradientBackground';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AnimatedScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AnimatedScreenWrapper: React.FC<AnimatedScreenWrapperProps> = ({ 
  children, 
  style 
}) => {
  const insets = useSafeAreaInsets();
  
  // Extra padding for camera notch/dynamic island
  const paddingTop = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 20);

  return (
    <View style={styles.container}>
      <GradientBackground>
        <Animated.View 
          entering={FadeIn.duration(400)} 
          style={[
            styles.content, 
            { paddingTop, paddingBottom: insets.bottom },
            style
          ]}
        >
          {children}
        </Animated.View>
      </GradientBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
