import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const GlassModal: React.FC<GlassModalProps> = ({ 
  visible, 
  onClose, 
  title, 
  children 
}) => {
  const { colors, theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeIn} 
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.shadow }]} 
        >
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        <Animated.View 
          entering={SlideInDown.springify().damping(15)} 
          style={[
            styles.modalContent, 
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }
          ]}
        >
          {theme === 'dark' ? (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          ) : null}
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.glass }]}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 24,
  },
});
