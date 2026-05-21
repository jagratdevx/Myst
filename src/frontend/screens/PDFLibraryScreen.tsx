import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';
import { FloatingActionButton } from '../ui/FloatingActionButton';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { usePDFStore } from '../../store/usePDFStore';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { PDFCard } from '../components/PDFCard';
import { Search, Plus, Filter, FileText } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export const PDFLibraryScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { isTablet, contentPadding } = useResponsive();
  const { pdfs, loading, fetchPDFs, importPDF, deletePDF, toggleFavorite } = usePDFStore();
  const { profile } = useOnboardingStore();
  
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    fetchPDFs();
  }, []);

  const filteredPDFs = useMemo(() => {
    return pdfs.filter(pdf => {
      const matchesSearch = pdf.name.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || pdf.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [pdfs, search, selectedSubject]);

  const subjects = useMemo(() => ['All', ...(profile?.subjects || [])], [profile]);

  const handleImport = async () => {
    await importPDF(selectedSubject !== 'All' ? selectedSubject : 'General');
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete PDF", "Are you sure you want to remove this document?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deletePDF(id) }
    ]);
  };

  const ListHeader = useMemo(() => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Study Library</Text>
      
      <GlassCard style={styles.searchBar}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput 
          placeholder="Search documents..." 
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.textPrimary }]}
          value={search}
          onChangeText={setSearch}
        />
      </GlassCard>

      <SectionHeader title="Subjects" />
      <FlatList 
        horizontal
        data={subjects}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subjectList}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => setSelectedSubject(item)}
            activeOpacity={0.7}
          >
            <GlassCard style={[
              styles.subjectTag,
              selectedSubject === item && { backgroundColor: colors.accent, borderColor: colors.accent }
            ]}>
              <Text style={[
                styles.subjectTagText, 
                { color: selectedSubject === item ? '#FFF' : colors.textSecondary }
              ]}>{item}</Text>
            </GlassCard>
          </TouchableOpacity>
        )}
      />

      <SectionHeader 
        title={search ? "Search Results" : selectedSubject === 'All' ? "Recently Imported" : `${selectedSubject} Materials`} 
      />
    </View>
  ), [colors, search, subjects, selectedSubject]);

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.glass }]}>
        <FileText size={48} color={colors.textSecondary} />
      </View>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {search ? "No documents found matching your search." : "Your library is empty. Import your first study material!"}
      </Text>
      {!search && (
        <TouchableOpacity style={[styles.importBtn, { backgroundColor: colors.accent }]} onPress={handleImport}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.importBtnText}>Import PDF</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <AnimatedScreenWrapper>
      <FlatList
        data={filteredPDFs}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <PDFCard 
            pdf={item} 
            index={index} 
            onPress={(pdf) => navigation.navigate('PDFViewer', { pdf })}
            onFavorite={toggleFavorite}
            onDelete={handleDelete}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />

      <FloatingActionButton onPress={handleImport} />
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 20,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  subjectList: {
    paddingBottom: 24,
    gap: 12,
  },
  subjectTag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  subjectTagText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  importBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
