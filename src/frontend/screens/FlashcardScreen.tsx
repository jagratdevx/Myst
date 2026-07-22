import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { FloatingActionButton } from '../ui/FloatingActionButton';
import { GlassModal } from '../ui/GlassModal';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useFlashcardStore } from '../../store/useFlashcardStore';
import { FlashcardDeck } from '../../types/flashcard';
import { BookOpen, Plus, Brain, Trash2, ChevronRight, Sparkles } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export const FlashcardScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { contentPadding } = useResponsive();
  const { decks, loading, fetchData, createDeck, deleteDeck } = useFlashcardStore();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createDeck(title.trim(), description.trim());
    setTitle('');
    setDescription('');
    setShowCreate(false);
  };

  const handleDelete = (deck: FlashcardDeck) => {
    Alert.alert('Delete Deck', `Delete "${deck.title}" and all its cards?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDeck(deck.id) },
    ]);
  };

  const renderDeck = ({ item, index }: { item: FlashcardDeck; index: number }) => (
    <Animated.View entering={FadeIn.delay(100 * index)}>
      <TouchableOpacity onPress={() => navigation.navigate('DeckDetail', { deckId: item.id })} activeOpacity={0.7}>
        <GlassCard style={styles.deckCard}>
          <View style={styles.deckRow}>
            <View style={[styles.deckIcon, { backgroundColor: `${colors.accentSecondary}20` }]}>
              <BookOpen size={24} color={colors.accentSecondary} />
            </View>
            <View style={styles.deckInfo}>
              <Text style={[styles.deckTitle, { color: colors.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.deckDesc, { color: colors.textSecondary }]} numberOfLines={1}>{item.description}</Text>
              <View style={styles.deckMeta}>
                <Text style={[styles.deckCount, { color: colors.accent }]}>{item.cardCount} cards</Text>
                {item.source === 'pdf' && <Sparkles size={12} color={colors.warning} />}
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
              <Trash2 size={18} color={colors.error} />
            </TouchableOpacity>
            <ChevronRight size={20} color={colors.textSecondary} />
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <AnimatedScreenWrapper>
      <FlatList
        data={decks}
        keyExtractor={i => i.id}
        renderItem={renderDeck}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: contentPadding, paddingTop: 60 }]}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Flashcards</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Study with spaced repetition</Text>
          </View>
        )}
        ListEmptyComponent={() => !loading ? (
          <View style={styles.empty}>
            <BookOpen size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No decks yet. Create one or generate from a PDF!</Text>
          </View>
        ) : <ActivityIndicator size="large" color={colors.accent} />}
      />

      <FloatingActionButton onPress={() => setShowCreate(true)} />

      <GlassModal visible={showCreate} onClose={() => setShowCreate(false)} title="Create Deck">
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.secondary }]}
          placeholder="Deck title"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.inputMultiline, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.secondary }]}
          placeholder="Description (optional)"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: colors.accent }]}
          onPress={handleCreate}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.createText}>Create Deck</Text>
        </TouchableOpacity>
      </GlassModal>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  listContent: { paddingBottom: 120 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginTop: 4 },
  deckCard: { padding: 16, marginBottom: 12 },
  deckRow: { flexDirection: 'row', alignItems: 'center' },
  deckIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  deckInfo: { flex: 1 },
  deckTitle: { fontSize: 16, fontWeight: '700' },
  deckDesc: { fontSize: 12, marginTop: 2 },
  deckMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  deckCount: { fontSize: 12, fontWeight: '600' },
  deleteBtn: { padding: 8, marginRight: 4 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 14, gap: 8, marginTop: 8 },
  createText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
