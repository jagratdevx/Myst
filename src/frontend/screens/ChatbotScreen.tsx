import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { useChatStore } from '../../store/useChatStore';
import { ChatMessage } from '../../types/chat';
import { Send, Trash2, Bot, Sparkles } from 'lucide-react-native';
import Animated, { SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { MarkdownText } from '../ui/MarkdownText';

export const ChatbotScreen = () => {
  const { colors, isDark } = useTheme();
  const { messages, loading, hydrated, error, loadMessages, sendMessage, retryLastMessage, clearChat } = useChatStore();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!inputText.trim() || loading || !hydrated) return;
    const text = inputText;
    setInputText('');
    Keyboard.dismiss();
    await sendMessage(text);
  };

  const renderMessageItem = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isUser = item.role === 'user';
    const enteringAnimation = isUser 
      ? SlideInRight.duration(300) 
      : SlideInLeft.duration(300);

    return (
      <Animated.View 
        entering={enteringAnimation}
        style={[
          styles.messageRow,
          isUser ? styles.userRow : styles.assistantRow
        ]}
      >
        {!isUser && (
          <View style={[styles.avatarBox, { backgroundColor: `${colors.accent}20` }]}>
            <Bot size={18} color={colors.accent} />
          </View>
        )}
        <View style={[
          styles.bubbleContainer,
          isUser ? styles.userBubbleContainer : styles.assistantBubbleContainer
        ]}>
          <GlassCard 
            intensity={isUser ? 30 : 15}
            style={[
              styles.bubble,
              isUser 
                ? { backgroundColor: isDark ? 'rgba(94, 235, 255, 0.15)' : 'rgba(75, 163, 255, 0.2)' }
                : { backgroundColor: colors.card },
              { borderColor: isUser ? colors.accent : colors.border }
            ]}
          >
            <MarkdownText content={item.content} textColor={colors.textPrimary} />
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </GlassCard>
        </View>
      </Animated.View>
    );
  };

  return (
    <AnimatedScreenWrapper style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Glass Header */}
        <GlassCard style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.headerIconBox, { backgroundColor: `${colors.accent}20` }]}>
                <Sparkles size={20} color={colors.accent} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Myst AI</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Groq Powered Assistant</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={clearChat} 
              style={[styles.clearButton, { backgroundColor: `${colors.error}15` }]}
              activeOpacity={0.7}
            >
              <Trash2 size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages.filter(m => m.role !== 'system')}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingRow}>
                <View style={[styles.avatarBox, { backgroundColor: `${colors.accent}20` }]}>
                  <Bot size={18} color={colors.accent} />
                </View>
                <GlassCard style={[styles.bubble, { backgroundColor: colors.card, minWidth: 80 }]}>
                  <ActivityIndicator size="small" color={colors.accent} />
                </GlassCard>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                <TouchableOpacity onPress={retryLastMessage} style={[styles.retryButton, { borderColor: colors.error }]}>
                  <Text style={[styles.retryText, { color: colors.error }]}>Try again</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />

        {/* Input Bar */}
        <View style={[styles.inputWrapper, { borderTopColor: colors.border }]}>
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={[styles.textInput, { color: colors.textPrimary }]}
              placeholder="Ask Myst anything..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity 
              onPress={handleSend} 
              disabled={!inputText.trim() || loading || !hydrated}
              style={[
                styles.sendButton, 
                { 
                  backgroundColor: inputText.trim() ? colors.accent : `${colors.accent}30` 
                }
              ]}
              activeOpacity={0.7}
            >
              <Send size={18} color={inputText.trim() ? '#081120' : colors.textSecondary} />
            </TouchableOpacity>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  assistantRow: {
    alignSelf: 'flex-start',
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  bubbleContainer: {
    flex: 1,
  },
  userBubbleContainer: {
    alignItems: 'flex-end',
  },
  assistantBubbleContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  timeText: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  loadingRow: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 12,
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
  },
  inputWrapper: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
