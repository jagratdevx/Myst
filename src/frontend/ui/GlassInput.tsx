import React from 'react';
import { StyleSheet, TextInput, View, Text, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface GlassInputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const GlassInput: React.FC<GlassInputProps> = ({ 
  label, 
  containerStyle, 
  icon,
  ...props 
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <View style={[styles.inputWrapper, { backgroundColor: colors.glass, borderColor: colors.border }]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, Boolean(icon) && styles.inputWithIcon, { color: colors.textPrimary }]}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
});
