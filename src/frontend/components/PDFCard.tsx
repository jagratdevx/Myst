import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { PDFDocument } from '../../types/pdf';
import { FileText, Star, Clock, Trash2, MoreVertical } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { hapticService } from '../../services/hapticService';

interface PDFCardProps {
  pdf: PDFDocument;
  index: number;
  onPress: (pdf: PDFDocument) => void;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PDFCard = React.memo(({ pdf, index, onPress, onFavorite, onDelete }: PDFCardProps) => {
  const { colors } = useTheme();

  const handlePress = () => {
    hapticService.light();
    onPress(pdf);
  };

  const handleFavorite = () => {
    hapticService.selection();
    onFavorite(pdf.id);
  };

  const handleDelete = () => {
    hapticService.medium();
    onDelete(pdf.id);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    return (kb / 1024).toFixed(1) + ' MB';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 50)}
      layout={Layout.springify().damping(15)}
    >
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        <GlassCard style={styles.card}>
          <View style={styles.content}>
            <View style={[styles.iconBox, { backgroundColor: colors.glass }]}>
              <FileText size={24} color={colors.accent} />
            </View>
            
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                {pdf.name}
              </Text>
              <View style={styles.meta}>
                <Text style={[styles.subText, { color: colors.textSecondary }]}>{pdf.subject}</Text>
                <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
                <Text style={[styles.subText, { color: colors.textSecondary }]}>{formatSize(pdf.size)}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={handleFavorite} style={styles.actionBtn}>
                <Star 
                  size={18} 
                  color={pdf.isFavorite ? colors.warning : colors.textSecondary} 
                  fill={pdf.isFavorite ? colors.warning : 'transparent'} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
                <Trash2 size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Clock size={12} color={colors.textSecondary} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Imported on {formatDate(pdf.dateImported)}
            </Text>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 0,
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
    opacity: 0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    padding: 8,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 6,
  },
});
