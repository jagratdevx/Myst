import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { hapticService } from '../../services/hapticService';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface FloatingActionButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onPress, 
  style,
  icon
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    hapticService.medium();
    scale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    onPress();
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={handlePress}
        style={[
          styles.button, 
          { 
            backgroundColor: colors.accent,
            shadowColor: colors.accent,
          }
        ]}
      >
        {icon || <Plus size={32} color="#FFFFFF" />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    zIndex: 100,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});
