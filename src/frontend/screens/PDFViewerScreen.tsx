import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { usePDFStore } from '../../store/usePDFStore';
import { ChevronLeft, Share2, ExternalLink } from 'lucide-react-native';

export const PDFViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const { markAsOpened } = usePDFStore();
  const { pdf } = route.params;

  useEffect(() => {
    markAsOpened(pdf.id);
  }, []);

  const handleShare = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdf.uri);
    }
  };

  // For Android, Webview doesn't support local PDF viewing directly as easily as iOS
  // A common trick is to use Google Docs viewer for remote URLs, 
  // but for local files, expo-sharing is the most reliable fallback if WebView fails.
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {pdf.name}
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
          <Share2 size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {Platform.OS === 'ios' ? (
        <WebView 
          source={{ uri: pdf.uri }} 
          style={styles.webview} 
          scalesPageToFit
        />
      ) : (
        <View style={styles.androidFallback}>
          <ExternalLink size={48} color={colors.accent} />
          <Text style={[styles.fallbackText, { color: colors.textPrimary }]}>
            PDF Preview is optimized for iOS.
          </Text>
          <Text style={[styles.fallbackSub, { color: colors.textSecondary }]}>
            Use the system viewer to read this document on Android.
          </Text>
          <TouchableOpacity 
            style={[styles.openBtn, { backgroundColor: colors.accent }]}
            onPress={handleShare}
          >
            <Text style={styles.openBtnText}>Open Document</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 12,
  },
  actionBtn: {
    padding: 8,
  },
  webview: {
    flex: 1,
  },
  androidFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  fallbackSub: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 32,
  },
  openBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  openBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
