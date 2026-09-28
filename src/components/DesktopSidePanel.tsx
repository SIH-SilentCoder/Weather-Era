import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { answerWeatherQuery } from '../services/aiAssistant';
import { radii, spacing } from '../theme';

export const DesktopSidePanel: React.FC = () => {
  const { theme, weatherData, persona, alerts, setCurrentTab } = useApp();
  const [quickQuery, setQuickQuery] = useState('');
  const [quickReply, setQuickReply] = useState<string | null>(null);

  const handleAsk = () => {
    if (!quickQuery.trim()) return;
    const res = answerWeatherQuery(quickQuery, weatherData, persona, alerts);
    setQuickReply(res.text.replace(/\*\*/g, ''));
  };

  return (
    <View style={[styles.sidePanel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* IMD Doppler Radar Status Widget */}
      <View style={[styles.widgetBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        <View style={styles.widgetHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>DOPPLER RADAR ONLINE</Text>
          </View>
          <Text style={[styles.radarDist, { color: theme.textMuted }]}>Palam AWS • 2.4 km</Text>
        </View>
        <Text style={[styles.radarScanNote, { color: theme.textSecondary }]}>
          Sweep elevation 0.5° shows dense reflectivity (48 dBZ) approaching over southwest boundary.
        </Text>
        <TouchableOpacity 
          style={[styles.mapLinkBtn, { borderColor: theme.primary }]}
          onPress={() => setCurrentTab('map')}
        >
          <MaterialCommunityIcons name="map-marker-radius" size={14} color={theme.primary} />
          <Text style={[styles.mapLinkText, { color: theme.primary }]}>View Live Geospatial Radar</Text>
        </TouchableOpacity>
      </View>

      {/* Quick AI Assistant Widget */}
      <View style={[styles.widgetBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        <View style={styles.widgetHeader}>
          <MaterialCommunityIcons name="robot-happy" size={18} color={theme.primary} />
          <Text style={[styles.widgetTitle, { color: theme.textPrimary }]}>Mausam AI Copilot</Text>
        </View>
        <Text style={[styles.widgetSubtitle, { color: theme.textMuted }]}>
          Ask contextual questions for your {persona} workflow:
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.quickInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surface }]}
            value={quickQuery}
            onChangeText={setQuickQuery}
            placeholder="e.g. Will rain affect my commute?"
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={handleAsk}
          />
          <TouchableOpacity 
            style={[styles.quickSendBtn, { backgroundColor: theme.primary }]}
            onPress={handleAsk}
          >
            <Ionicons name="send" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {quickReply && (
          <View style={[styles.quickReplyBox, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.quickReplyText, { color: theme.textPrimary }]}>
              {quickReply}
            </Text>
          </View>
        )}
      </View>

      {/* MoES / IMD Credibility Card */}
      <View style={[styles.credibilityCard, { backgroundColor: theme.surfaceSubtle }]}>
        <Ionicons name="shield-checkmark-sharp" size={18} color={theme.secondary} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.credTitle, { color: theme.textPrimary }]}>Official IMD Protocol</Text>
          <Text style={[styles.credDesc, { color: theme.textMuted }]}>
            WMO-standard atmospheric calibrations with INSAT-3DR geo-stationary multispectral radiance.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidePanel: {
    width: 320,
    borderLeftWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  widgetBox: {
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    gap: 8,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#22C55E',
    letterSpacing: 0.5,
  },
  radarDist: {
    fontSize: 10,
  },
  radarScanNote: {
    fontSize: 11,
    lineHeight: 16,
    marginVertical: spacing.xs,
  },
  mapLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.xs,
  },
  mapLinkText: {
    fontSize: 11,
    fontWeight: '700',
  },
  widgetTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  widgetSubtitle: {
    fontSize: 11,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
  },
  quickInput: {
    flex: 1,
    height: 34,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 11,
  },
  quickSendBtn: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickReplyBox: {
    padding: spacing.sm,
    borderRadius: radii.md,
    marginTop: spacing.sm,
  },
  quickReplyText: {
    fontSize: 11,
    lineHeight: 16,
  },
  credibilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: spacing.sm,
    borderRadius: radii.lg,
  },
  credTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  credDesc: {
    fontSize: 10,
    lineHeight: 14,
    marginTop: 1,
  },
});
