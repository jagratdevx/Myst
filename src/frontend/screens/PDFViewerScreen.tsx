import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import * as Sharing from 'expo-sharing';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { usePDFStore } from '../../store/usePDFStore';
import { ChevronLeft, Share2, FileText } from 'lucide-react-native';

export const PDFViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const { markAsOpened } = usePDFStore();
  const { pdf } = route.params;

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPages] = useState(1);

  useEffect(() => {
    markAsOpened(pdf.id);
  }, []);

  const handleShare = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdf.uri);
    }
  };

  const source = { uri: pdf.uri, cache: true };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {pdf.name}
          </Text>
          <Text style={[styles.pageIndicator, { color: colors.textSecondary }]}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>

        <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
          <Share2 size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.pdfContainer}>
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages) => {
            setTotalPages(numberOfPages);
          }}
          onPageChanged={(page) => {
            setCurrentPages(page);
          }}
          onError={(error) => {
            console.log('PDF Error:', error);
          }}
          style={styles.pdf}
          activityIndicator={<ActivityIndicator color={colors.accent} size="large" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    height: 100,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  pageIndicator: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionBtn: {
    padding: 10,
    borderRadius: 12,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark background for PDF viewing
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#1a1a1a',
  },
});

