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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Namaste! I am **Mausam AI**, your weather intelligence assistant grounded in official **India Meteorological Department (IMD)** Doppler observations. I am currently contextualized for your **${persona.toUpperCase()}** profile in **${weatherData.city}**.`,
      actionBullet: `Ask me about: "Abhi niklu ya 7 PM?", underpass waterlogging, spraying feasibility, or tomorrow's weather comparison!`,
      confidenceBadge: `92% Confidence • IMD Palam Radar Validated`,
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

  const toggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
  };

  const suggestedList = SUGGESTED_QUESTIONS[persona] || SUGGESTED_QUESTIONS.commuter;

  return (
    <View style={styles.container}>
      <View style={[styles.mainWrapper, isDesktop && styles.desktopWrapper]}>
        {/* Assistant Top Header */}
        <View style={[styles.headerBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.aiIcon, { backgroundColor: theme.primary }]}>
              <MaterialCommunityIcons name="robot" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleBadgeRow}>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>MAUSAM AI COPILOT</Text>
                <View style={[styles.verifiedBadge, { backgroundColor: theme.primaryLight }]}>
                  <Ionicons name="shield-checkmark" size={12} color={theme.primary} />
                  <Text style={[styles.verifiedText, { color: theme.primary }]}>IMD GROUND VERIFIED</Text>
                </View>
              </View>
              <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                Weather-Context-Aware Assistant • Active Profile: <Text style={{ fontWeight: '700', color: theme.primary }}>{persona.toUpperCase()}</Text>
              </Text>
            </View>
          </View>

          {/* Voice Audio Weather Bulletin Toggle */}
          <TouchableOpacity 
            style={[styles.audioBulletinBtn, { backgroundColor: isPlayingAudio ? theme.alertGreenBg : theme.surfaceSubtle, borderColor: isPlayingAudio ? theme.alertGreen : theme.border }]}
            onPress={toggleAudio}
            activeOpacity={0.8}
          >
            <Ionicons name={isPlayingAudio ? "volume-high" : "volume-medium-outline"} size={16} color={isPlayingAudio ? theme.alertGreen : theme.primary} />
            <Text style={[styles.audioBulletinText, { color: isPlayingAudio ? theme.alertGreen : theme.primary }]}>
              {isPlayingAudio ? "Playing Voice Bulletin 🎙️ (Simulated)" : "Listen to Weather Bulletin (Audio)"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Live Weather Telemetry Context Ribbon */}
        <View style={[styles.telemetryRibbon, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.telemetryScroll}>
            <View style={styles.telemetryPill}>
              <Ionicons name="location" size={13} color={theme.primary} />
              <Text style={[styles.telemetryText, { color: theme.textPrimary }]}>{weatherData.city}</Text>
            </View>
            <View style={styles.telemetryPill}>
              <Ionicons name="thermometer-outline" size={13} color="#F97316" />
              <Text style={[styles.telemetryText, { color: theme.textPrimary }]}>{weatherData.temperature}°C ({weatherData.condition})</Text>
            </View>
            <View style={styles.telemetryPill}>
              <Ionicons name="rainy-outline" size={13} color="#0284C7" />
              <Text style={[styles.telemetryText, { color: theme.textPrimary }]}>{weatherData.rainProbability}% Rain</Text>
            </View>
            <View style={styles.telemetryPill}>
              <Ionicons name="speedometer-outline" size={13} color="#8B5CF6" />
              <Text style={[styles.telemetryText, { color: theme.textPrimary }]}>{weatherData.windSpeed} km/h</Text>
            </View>
            <View style={styles.telemetryPill}>
              <Ionicons name="filter-outline" size={13} color="#EF4444" />
              <Text style={[styles.telemetryText, { color: theme.textPrimary }]}>AQI {weatherData.aqi}</Text>
            </View>
            <View style={styles.telemetryPill}>
              <Ionicons name="shield-checkmark-outline" size={13} color={theme.alertGreen} />
              <Text style={[styles.telemetryText, { color: theme.alertGreen }]}>92% Confident</Text>
            </View>
          </ScrollView>
        </View>

        {/* Suggested Scenario Chips Carousel */}
        <View style={styles.suggestedContainer}>
          <Text style={[styles.suggestedLabel, { color: theme.textMuted }]}>
            CONTEXTUAL PROMPTS FOR {persona.toUpperCase()}:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestedScroll}>
            {suggestedList.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.suggestedChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => handleSend(q)}
                activeOpacity={0.7}
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
                {!isUser && (
                  <View style={styles.assistantHeaderRow}>
                    <View style={[styles.miniAvatar, { backgroundColor: theme.primary }]}>
                      <MaterialCommunityIcons name="robot" size={12} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.assistantName, { color: theme.primary }]}>Mausam AI</Text>
                    {m.confidenceBadge && (
                      <View style={[styles.confPill, { backgroundColor: theme.surfaceSubtle }]}>
                        <Text style={[styles.confPillText, { color: theme.textSecondary }]}>
                          🎯 {m.confidenceBadge}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <Text 
                  style={[
                    styles.messageText, 
                    { color: isUser ? '#FFFFFF' : theme.textPrimary }
                  ]}
                >
                  {m.text.replace(/\*\*/g, '')}
                </Text>

                {m.actionBullet && (
                  <View style={[styles.actionCallout, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                    <Ionicons name="bulb-outline" size={15} color={theme.primary} />
                    <Text style={[styles.actionCalloutText, { color: theme.textPrimary }]}>
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
            placeholder={t.aiPlaceholder || "Ask Mausam AI (e.g. Abhi niklu ya 7 PM wait karu?)..."}
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: theme.primary }]}
            onPress={() => handleSend()}
            activeOpacity={0.8}
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
    maxWidth: '100%',
  },
  desktopWrapper: {
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
  },
  headerBox: {
    padding: spacing.md,
    borderBottomWidth: 1,
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 11,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  audioBulletinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  audioBulletinText: {
    fontSize: 11,
    fontWeight: '700',
  },
  telemetryRibbon: {
    borderBottomWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  telemetryScroll: {
    gap: 8,
    alignItems: 'center',
  },
  telemetryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  telemetryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  suggestedContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  suggestedLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 6,
    marginTop: 4,
  },
  suggestedScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  suggestedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    maxWidth: 280,
  },
  suggestedChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: spacing.md,
    gap: 12,
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: radii.lg,
    maxWidth: '88%',
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
  assistantHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  miniAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantName: {
    fontSize: 11,
    fontWeight: '800',
  },
  confPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.sm,
  },
  confPillText: {
    fontSize: 9,
    fontWeight: '600',
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
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  actionCalloutText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    flex: 1,
  },
  messageTime: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputBar: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderTopWidth: 1,
    gap: 8,
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
