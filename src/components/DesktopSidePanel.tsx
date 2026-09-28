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
      {/* Official IMD 4-Color Hazard Warning Matrix */}
      <View style={[styles.widgetBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        <View style={styles.widgetHeader}>
          <MaterialCommunityIcons name="shield-alert-outline" size={17} color={theme.alertOrange} />
          <Text style={[styles.widgetTitle, { color: theme.textPrimary }]}>
            IMD 4-Tier Disaster Alert Matrix
          </Text>
        </View>
        <Text style={[styles.matrixSub, { color: theme.textMuted }]}>
          National Meteorological Warning Division (Valid next 24h)
        </Text>

        <View style={styles.matrixGrid}>
          {/* Red Alert */}
          <View style={[styles.matrixItem, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
            <View style={styles.matrixTop}>
              <View style={[styles.matrixDot, { backgroundColor: '#DC2626' }]} />
              <Text style={[styles.matrixColorLabel, { color: '#991B1B' }]}>RED (WARNING)</Text>
            </View>
            <Text style={styles.matrixAction}>Take Action: Cyclone / Heavy Squall</Text>
            <Text style={styles.matrixZones}>Kerala Offshore, Lakshadweep</Text>
          </View>

          {/* Orange Alert */}
          <View style={[styles.matrixItem, { backgroundColor: '#FFEDD5', borderColor: '#F97316' }]}>
            <View style={styles.matrixTop}>
              <View style={[styles.matrixDot, { backgroundColor: '#EA580C' }]} />
              <Text style={[styles.matrixColorLabel, { color: '#9A3412' }]}>ORANGE (ALERT)</Text>
            </View>
            <Text style={styles.matrixAction}>Be Prepared: Convective Lightning & Rain</Text>
            <Text style={styles.matrixZones}>Delhi-NCR, Haryana, West UP</Text>
          </View>

          {/* Yellow Watch */}
          <View style={[styles.matrixItem, { backgroundColor: '#FEF9C3', borderColor: '#CA8A04' }]}>
            <View style={styles.matrixTop}>
              <View style={[styles.matrixDot, { backgroundColor: '#CA8A04' }]} />
              <Text style={[styles.matrixColorLabel, { color: '#854D0E' }]}>YELLOW (WATCH)</Text>
            </View>
            <Text style={styles.matrixAction}>Be Aware: Isolated Heavy Showers</Text>
            <Text style={styles.matrixZones}>Bihar, East UP, Assam, Bengal</Text>
          </View>

          {/* Green No Warning */}
          <View style={[styles.matrixItem, { backgroundColor: '#DCFCE7', borderColor: '#16A34A' }]}>
            <View style={styles.matrixTop}>
              <View style={[styles.matrixDot, { backgroundColor: '#16A34A' }]} />
              <Text style={[styles.matrixColorLabel, { color: '#166534' }]}>GREEN (NO WARNING)</Text>
            </View>
            <Text style={styles.matrixAction}>No Advisory: Clear / Fair Weather</Text>
            <Text style={styles.matrixZones}>Punjab, West Rajasthan, Gujarat</Text>
          </View>
        </View>
      </View>

      {/* Doppler Radar Live Telemetry Widget */}
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
          <Text style={[styles.mapLinkText, { color: theme.primary }]}>View Geospatial Radar Map</Text>
        </TouchableOpacity>
      </View>

      {/* Quick AI Assistant Widget */}
      <View style={[styles.widgetBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        <View style={styles.widgetHeader}>
          <MaterialCommunityIcons name="robot-happy" size={17} color={theme.primary} />
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

      {/* Central Pollution Control Board (CPCB) AQI Telemetry */}
      <View style={[styles.credibilityCard, { backgroundColor: theme.surfaceSubtle }]}>
        <Ionicons name="leaf-outline" size={18} color={theme.accent} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.credTitle, { color: theme.textPrimary }]}>CPCB Ambient Air Quality</Text>
          <Text style={[styles.credDesc, { color: theme.textMuted }]}>
            Continuous Ambient Air Quality Monitoring (CAAQM): PM2.5: 58 µg/m³ • PM10: 112 µg/m³.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidePanel: {
    width: 340,
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
    marginBottom: 2,
    gap: 8,
  },
  widgetTitle: {
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  matrixSub: {
    fontSize: 10,
    marginBottom: spacing.sm,
  },
  matrixGrid: {
    gap: 6,
  },
  matrixItem: {
    padding: 6,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  matrixTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  matrixDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  matrixColorLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  matrixAction: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  matrixZones: {
    fontSize: 9,
    color: '#475569',
    marginTop: 1,
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
  widgetSubtitle: {
    fontSize: 10,
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
