import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { GlassModal } from '../ui/GlassModal';
import { useTheme } from '../../hooks/useTheme';
import { useFlashcardStore } from '../../store/useFlashcardStore';
import { Flashcard } from '../../types/flashcard';
import { Plus, Play, Trash2, ChevronLeft } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type RouteParams = { deckId: string };

export const DeckDetailScreen = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation();
  const { deckId } = route.params;
  const { colors } = useTheme();
  const { decks, cards, fetchData, addCard, deleteCard } = useFlashcardStore();
  const [showAdd, setShowAdd] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hints, setHints] = useState('');

  const deck = decks.find(d => d.id === deckId);
  const deckCards = cards.filter(c => c.deckId === deckId);

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!front.trim() || !back.trim()) return;
    await addCard(deckId, front.trim(), back.trim(), hints.trim() || undefined);
    setFront('');
    setBack('');
    setHints('');
    setShowAdd(false);
  };

  const renderCard = ({ item, index }: { item: Flashcard; index: number }) => (
    <Animated.View entering={FadeIn.delay(100 * index)}>
      <GlassCard style={styles.cardItem}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardNum, { color: colors.textSecondary }]}>#{index + 1}</Text>
          <TouchableOpacity onPress={() => deleteCard(item.id)}>
            <Trash2 size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.cardFront, { color: colors.textPrimary }]}>{item.front}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.cardBack, { color: colors.textSecondary }]}>{item.back}</Text>
        {item.hints && <Text style={[styles.cardHints, { color: colors.warning }]}>💡 {item.hints}</Text>}
      </GlassCard>
    </Animated.View>
  );

  if (!deck) return <AnimatedScreenWrapper><ActivityIndicator size="large" color={colors.accent} /></AnimatedScreenWrapper>;

  return (
    <AnimatedScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.deckTitle, { color: colors.textPrimary }]}>{deck.title}</Text>
          <Text style={[styles.deckCount, { color: colors.textSecondary }]}>{deckCards.length} cards</Text>
        </View>
        {deckCards.length > 0 && (
          <TouchableOpacity style={[styles.quizBtn, { backgroundColor: colors.accent }]} onPress={() => navigation.navigate('FlashcardQuiz' as never, { deckId } as never)}>
            <Play size={18} color="#fff" />
            <Text style={styles.quizText}>Quiz</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={deckCards}
        keyExtractor={i => i.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No cards yet. Add one!</Text>
          </View>
        )}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent }]} onPress={() => setShowAdd(true)} activeOpacity={0.7}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <GlassModal visible={showAdd} onClose={() => setShowAdd(false)} title="Add Card">
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.secondary }]}
          placeholder="Front (question)"
          placeholderTextColor={colors.textSecondary}
          value={front}
          onChangeText={setFront}
          multiline
        />
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.secondary }]}
          placeholder="Back (answer)"
          placeholderTextColor={colors.textSecondary}
          value={back}
          onChangeText={setBack}
          multiline
        />
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.secondary }]}
          placeholder="Hint (optional)"
          placeholderTextColor={colors.textSecondary}
          value={hints}
          onChangeText={setHints}
        />
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.accent }]} onPress={handleAdd}>
          <Text style={[styles.addText, { color: '#fff' }]}>Add Card</Text>
        </TouchableOpacity>
      </GlassModal>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  backBtn: { padding: 8, marginRight: 8 },
  headerInfo: { flex: 1 },
  deckTitle: { fontSize: 22, fontWeight: '800' },
  deckCount: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  quizBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 6 },
  quizText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  cardItem: { padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardNum: { fontSize: 12, fontWeight: '600' },
  cardFront: { fontSize: 16, fontWeight: '700' },
  divider: { height: 1, marginVertical: 10 },
  cardBack: { fontSize: 14, fontWeight: '500' },
  cardHints: { fontSize: 12, fontWeight: '500', marginTop: 6 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 14, fontWeight: '500' },
  fab: { position: 'absolute', bottom: 110, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12, minHeight: 60, textAlignVertical: 'top' },
  addBtn: { alignItems: 'center', padding: 16, borderRadius: 14, marginTop: 8 },
  addText: { fontSize: 16, fontWeight: '700' },
});
