import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { answerWeatherQuery, SUGGESTED_QUESTIONS, AIMessage } from '../services/aiAssistant';
import { radii, spacing } from '../theme';

export const AIScreen: React.FC = () => {
  const { theme, weatherData, persona, alerts, t } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Namaste! I am **Mausam AI**, your personal weather copilot calibrated with **India Meteorological Department (IMD)** observations. I am currently contextualized for your **${persona.toUpperCase()}** profile in **${weatherData.city}**.`,
      actionBullet: `Ask me about precipitation timing, commute routes, agricultural spraying windows, or scenario comparisons!`,
      timestamp: 'Just now',
    }
  ]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: AIMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const reply = answerWeatherQuery(q, weatherData, persona, alerts);

    setMessages(prev => [...prev, userMsg, reply]);
    setInputQuery('');
  };

  const suggestedList = SUGGESTED_QUESTIONS[persona] || SUGGESTED_QUESTIONS.commuter;

  return (
    <View style={styles.container}>
      <View style={[styles.mainWrapper, isDesktop && styles.desktopWrapper]}>
        {/* Assistant Header */}
        <View style={[styles.headerBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.aiIcon, { backgroundColor: theme.primary }]}>
              <MaterialCommunityIcons name="robot" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t.aiAssistantTitle}</Text>
              <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                Domain Context: {persona.toUpperCase()} • Location: {weatherData.city}
              </Text>
            </View>
          </View>
          <View style={[styles.verifiedBadge, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="shield-checkmark" size={13} color={theme.primary} />
            <Text style={[styles.verifiedText, { color: theme.primary }]}>IMD Validated Ground Data</Text>
          </View>
        </View>

        {/* Suggested Scenario Chips Carousel */}
        <View style={styles.suggestedContainer}>
          <Text style={[styles.suggestedLabel, { color: theme.textMuted }]}>
            {t.suggestedQuestions}:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestedScroll}>
            {suggestedList.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.suggestedChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => handleSend(q)}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={13} color={theme.primary} />
                <Text style={[styles.suggestedChipText, { color: theme.textPrimary }]} numberOfLines={1}>
                  {q}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat History Messages */}
        <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <View 
                key={m.id} 
                style={[
                  styles.messageBubble, 
                  isUser 
                    ? [styles.userBubble, { backgroundColor: theme.primary }] 
                    : [styles.assistantBubble, { backgroundColor: theme.surface, borderColor: theme.border }]
                ]}
              >
                <Text 
                  style={[
                    styles.messageText, 
                    { color: isUser ? '#FFFFFF' : theme.textPrimary }
                  ]}
                >
                  {m.text.replace(/\*\*/g, '')}
                </Text>

                {m.actionBullet && (
                  <View style={[styles.actionCallout, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name="bulb-outline" size={14} color={theme.primary} />
                    <Text style={[styles.actionCalloutText, { color: theme.primary }]}>
                      {m.actionBullet}
                    </Text>
                  </View>
                )}

                <Text 
                  style={[
                    styles.messageTime, 
                    { color: isUser ? 'rgba(255,255,255,0.7)' : theme.textMuted }
                  ]}
                >
                  {m.timestamp}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Query Input */}
        <View style={[styles.inputBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.inputField, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surfaceSubtle }]}
            value={inputQuery}
            onChangeText={setInputQuery}
            placeholder={t.aiPlaceholder}
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: theme.primary }]}
            onPress={() => handleSend()}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
  },
  desktopWrapper: {
    maxWidth: 780,
    width: '100%',
    alignSelf: 'center',
  },
  headerBox: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIcon: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 11,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.md,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
  },
  suggestedContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  suggestedLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  suggestedScroll: {
    gap: 8,
  },
  suggestedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  suggestedChipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: spacing.md,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: radii.xl,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: radii.xs,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: radii.xs,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  actionCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: spacing.sm,
    borderRadius: radii.md,
    marginTop: spacing.sm,
  },
  actionCalloutText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
    fontWeight: '700',
  },
  messageTime: {
    fontSize: 9,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    gap: 8,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: radii.full,
    paddingHorizontal: 14,
    fontSize: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
