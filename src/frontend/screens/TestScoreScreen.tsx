import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, FlatList
} from 'react-native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { GlassInput } from '../ui/GlassInput';
import { GlowButton } from '../ui/GlowButton';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useTestScoreStore } from '../../store/useTestScoreStore';
import { useProfileStore } from '../../store/useProfileStore';
import {
  Trophy, BookOpen, TrendingUp, Plus, Trash2, X, Atom, FlaskConical,
  Calculator, Dna, Languages, History as HistoryIcon, Coins, FileText,
  GraduationCap
} from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  PHYSICS: <Atom size={20} />,
  CHEMISTRY: <FlaskConical size={20} />,
  MATHEMATICS: <Calculator size={20} />,
  BIOLOGY: <Dna size={20} />,
  ENGLISH: <Languages size={20} />,
  HISTORY: <HistoryIcon size={20} />,
  ECONOMICS: <Coins size={20} />,
  COMPUTER: <FileText size={20} />,
  DEFAULT: <BookOpen size={20} />,
};

function getSubjectIcon(subject: string): React.ReactNode {
  const key = subject.toUpperCase();
  for (const [k, v] of Object.entries(SUBJECT_ICONS)) {
    if (key.includes(k)) return v;
  }
  return SUBJECT_ICONS.DEFAULT;
}

function getGradientColors(percentage: number): string[] {
  if (percentage >= 90) return ['#4CAF50', '#2E7D32'];
  if (percentage >= 75) return ['#8BC34A', '#558B2F'];
  if (percentage >= 60) return ['#FFC107', '#F57F17'];
  if (percentage >= 40) return ['#FF9800', '#E65100'];
  return ['#F44336', '#B71C1C'];
}

const AddScoreModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { colors } = useTheme();
  const { addScore } = useTestScoreStore();
  const { profile } = useProfileStore();
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);

  const quickSubjects = profile?.subjects?.slice(0, 6) || ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];

  const handleSave = useCallback(async () => {
    const s = parseFloat(score);
    const t = parseFloat(totalMarks);
    if (!subject.trim()) { Alert.alert('Error', 'Enter a subject'); return; }
    if (isNaN(s) || s < 0) { Alert.alert('Error', 'Enter a valid score'); return; }
    if (isNaN(t) || t <= 0) { Alert.alert('Error', 'Enter valid total marks'); return; }
    if (s > t) { Alert.alert('Error', 'Score cannot exceed total marks'); return; }
    setSaving(true);
    await addScore(subject.trim(), s, t, label.trim() || undefined);
    setSaving(false);
    setSubject('');
    setScore('');
    setTotalMarks('');
    setLabel('');
    onClose();
  }, [subject, score, totalMarks, label, addScore, onClose]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View entering={FadeInUp.springify().damping(15)} style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Test Score</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={colors.textSecondary} /></TouchableOpacity>
          </View>

          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Subject</Text>
          <View style={styles.subjectChips}>
            {quickSubjects.map(sub => (
              <TouchableOpacity
                key={sub}
                style={[styles.chip, { backgroundColor: subject === sub ? colors.accent : colors.glass, borderColor: colors.border }]}
                onPress={() => setSubject(sub)}
              >
                <Text style={[styles.chipText, { color: subject === sub ? '#FFF' : colors.textPrimary }]}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <GlassInput
            placeholder="Or type a subject..."
            value={subject}
            onChangeText={setSubject}
            containerStyle={{ marginBottom: 12 }}
          />

          <View style={styles.scoreRow}>
            <GlassInput
              label="Score"
              placeholder="e.g. 85"
              value={score}
              onChangeText={setScore}
              keyboardType="numeric"
              containerStyle={{ flex: 1, marginRight: 8 }}
            />
            <GlassInput
              label="Total Marks"
              placeholder="e.g. 100"
              value={totalMarks}
              onChangeText={setTotalMarks}
              keyboardType="numeric"
              containerStyle={{ flex: 1, marginLeft: 8 }}
            />
          </View>

          <GlassInput
            label="Label (optional)"
            placeholder="e.g. Midterm, Final Exam"
            value={label}
            onChangeText={setLabel}
            containerStyle={{ marginBottom: 16 }}
          />

          <GlowButton title={saving ? 'Saving...' : 'Save Score'} onPress={handleSave} disabled={saving} />
        </Animated.View>
      </View>
    </Modal>
  );
};

export const TestScoreScreen = () => {
  const { colors } = useTheme();
  const { contentPadding } = useResponsive();
  const { scores, loading, fetchScores, deleteScore, getSubjectTotals, getOverallTotal } = useTestScoreStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);

  useEffect(() => { fetchScores(); }, []);

  const overall = getOverallTotal();
  const subjectTotals = getSubjectTotals();
  const recentScores = [...scores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <AnimatedScreenWrapper style={styles.centered}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </AnimatedScreenWrapper>
    );
  }

  return (
    <AnimatedScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Test Scores</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Track your performance across subjects</Text>

        {scores.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <GraduationCap size={48} color={colors.accent} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No scores yet</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Add your first test score to start tracking performance.</Text>
          </GlassCard>
        ) : (
          <>
            <Animated.View entering={FadeInUp.delay(100)}>
              <GlassCard style={styles.overallCard}>
                <View style={styles.overallRow}>
                  <View style={styles.overallLeft}>
                    <Text style={[styles.overallLabel, { color: colors.textSecondary }]}>Total Score</Text>
                    <Text style={[styles.overallValue, { color: colors.textPrimary }]}>{overall.totalScore}</Text>
                    <Text style={[styles.overallSub, { color: colors.textSecondary }]}>out of {overall.totalMarks}</Text>
                  </View>
                  <View style={[styles.overallCirc, { borderColor: overall.percentage >= 60 ? colors.success : colors.error }]}>
                    <Text style={[styles.overallPct, { color: overall.percentage >= 60 ? colors.success : colors.error }]}>{overall.percentage}%</Text>
                  </View>
                </View>
                <View style={styles.overallBar}>
                  <View style={[styles.overallBarFill, { width: `${overall.percentage}%`, backgroundColor: overall.percentage >= 60 ? colors.success : colors.error, borderRadius: 4 }]} />
                </View>
              </GlassCard>
            </Animated.View>

            {subjectTotals.map((st, i) => (
              <Animated.View key={st.subject} entering={FadeInUp.delay(200 + i * 80)}>
                <GlassCard style={styles.subjectCard}>
                  <View style={styles.subjectHeader}>
                    <View style={[styles.subjectIconBox, { backgroundColor: `${colors.accent}20` }]}>
                      {getSubjectIcon(st.subject)}
                    </View>
                    <View style={styles.subjectInfo}>
                      <Text style={[styles.subjectName, { color: colors.textPrimary }]}>{st.subject}</Text>
                      <Text style={[styles.subjectCount, { color: colors.textSecondary }]}>{st.count} test{st.count > 1 ? 's' : ''}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.subjectScore, { color: colors.textPrimary }]}>{st.totalScore} / {st.totalMarks}</Text>
                      <Text style={[styles.subjectPct, { color: st.percentage >= 60 ? colors.success : colors.error }]}>{st.percentage}%</Text>
                    </View>
                  </View>
                  <View style={styles.subjectBar}>
                    <View style={[styles.subjectBarFill, { width: `${st.percentage}%`, backgroundColor: st.percentage >= 60 ? colors.success : colors.error, borderRadius: 3 }]} />
                  </View>
                </GlassCard>
              </Animated.View>
            ))}

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Entries</Text>
            {(showAllEntries ? recentScores : recentScores.slice(0, 5)).map((s, i) => (
              <Animated.View key={s.id} entering={FadeInUp.delay(300 + i * 50)}>
                <GlassCard style={styles.entryCard}>
                  <View style={styles.entryRow}>
                    <View style={[styles.entryIcon, { backgroundColor: `${colors.accent}15` }]}>
                      {getSubjectIcon(s.subject)}
                    </View>
                    <View style={styles.entryInfo}>
                      <Text style={[styles.entrySubject, { color: colors.textPrimary }]}>{s.subject}</Text>
                      {s.label ? <Text style={[styles.entryLabel, { color: colors.textSecondary }]}>{s.label}</Text> : null}
                      <Text style={[styles.entryDate, { color: colors.textSecondary }]}>
                        {new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.entryScore, { color: colors.textPrimary }]}>{s.score} / {s.totalMarks}</Text>
                      <Text style={[styles.entryPct, { color: (s.score / s.totalMarks) >= 0.6 ? colors.success : colors.error }]}>
                        {Math.round((s.score / s.totalMarks) * 100)}%
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => {
                        Alert.alert('Delete', 'Delete this score?', [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Delete', style: 'destructive', onPress: () => deleteScore(s.id) },
                        ]);
                      }}
                    >
                      <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
            {recentScores.length > 5 && !showAllEntries && (
              <TouchableOpacity onPress={() => setShowAllEntries(true)} style={styles.showAllRow}>
                <Text style={[styles.showAllText, { color: colors.accent }]}>Show all {recentScores.length} entries</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#FFF" />
      </TouchableOpacity>

      <AddScoreModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingTop: 10, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  emptyCard: { padding: 40, alignItems: 'center', borderRadius: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyDesc: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  overallCard: { padding: 20, marginBottom: 20, borderRadius: 24 },
  overallRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  overallLeft: { flex: 1 },
  overallLabel: { fontSize: 13, fontWeight: '600' },
  overallValue: { fontSize: 40, fontWeight: '900', marginTop: 4 },
  overallSub: { fontSize: 13, marginTop: 2 },
  overallCirc: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 4,
    justifyContent: 'center', alignItems: 'center',
  },
  overallPct: { fontSize: 22, fontWeight: '900' },
  overallBar: { height: 8, borderRadius: 4, marginTop: 16, overflow: 'hidden' },
  overallBarFill: { height: '100%' },
  subjectCard: { padding: 16, marginBottom: 12, borderRadius: 20 },
  subjectHeader: { flexDirection: 'row', alignItems: 'center' },
  subjectIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  subjectInfo: { flex: 1, marginLeft: 12 },
  subjectName: { fontSize: 16, fontWeight: '700' },
  subjectCount: { fontSize: 12, marginTop: 2, opacity: 0.7 },
  subjectScore: { fontSize: 16, fontWeight: '800' },
  subjectPct: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  subjectBar: { height: 6, borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  subjectBarFill: { height: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 12 },
  entryCard: { padding: 14, marginBottom: 8, borderRadius: 16 },
  entryRow: { flexDirection: 'row', alignItems: 'center' },
  entryIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  entryInfo: { flex: 1, marginLeft: 12 },
  entrySubject: { fontSize: 15, fontWeight: '600' },
  entryLabel: { fontSize: 12, marginTop: 1, opacity: 0.7 },
  entryDate: { fontSize: 11, marginTop: 2, opacity: 0.6 },
  entryScore: { fontSize: 15, fontWeight: '700' },
  entryPct: { fontSize: 12, fontWeight: '600', marginTop: 1 },
  deleteBtn: { marginLeft: 12, padding: 4 },
  showAllRow: { alignItems: 'center', padding: 12, marginBottom: 8 },
  showAllText: { fontSize: 14, fontWeight: '600' },
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: '800' },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  subjectChips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16,
    marginRight: 8, marginBottom: 8, borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  scoreRow: { flexDirection: 'row', marginBottom: 12 },
});
