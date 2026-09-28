import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { WhatIfScenario } from '../types';
import { useApp } from '../context/AppContext';
import { getWhatIfScenarios } from '../services/routeEngine';
import { radii, spacing } from '../theme';

export const WhatIfSimulatorCard: React.FC = () => {
  const { theme, weatherData, persona, t } = useApp();
  const scenarios = getWhatIfScenarios(weatherData);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'detail' | 'matrix'>('detail');

  const selectedScenario = scenarios[selectedIndex] || scenarios[0];

  const getRiskColor = (risk: 'Low' | 'Moderate' | 'High') => {
    if (risk === 'High') return theme.alertRed;
    if (risk === 'Moderate') return theme.alertOrange;
    return theme.alertGreen;
  };

  const getRiskBg = (risk: 'Low' | 'Moderate' | 'High') => {
    if (risk === 'High') return theme.alertRedBg;
    if (risk === 'Moderate') return theme.alertOrangeBg;
    return theme.alertGreenBg;
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="timeline-clock-outline" size={20} color={theme.accent} />
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              🔮 WHAT-IF SIMULATOR
            </Text>
            <Text style={[styles.subhead, { color: theme.textSecondary }]}>
              {t.whatIfTitle} • "Abhi niklu vs 7 PM vs Kal Subah"
            </Text>
          </View>
        </View>

        {/* View Mode Switcher */}
        <View style={[styles.modeToggle, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'detail' && { backgroundColor: theme.primary, borderRadius: radii.sm }]}
            onPress={() => setViewMode('detail')}
          >
            <Text style={[styles.toggleBtnText, { color: viewMode === 'detail' ? '#FFFFFF' : theme.textSecondary }]}>
              Focus View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'matrix' && { backgroundColor: theme.primary, borderRadius: radii.sm }]}
            onPress={() => setViewMode('matrix')}
          >
            <Text style={[styles.toggleBtnText, { color: viewMode === 'matrix' ? '#FFFFFF' : theme.textSecondary }]}>
              Matrix 📊
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Comparative departure timing advisory calibrated for <Text style={{ fontWeight: '700', color: theme.primary }}>{persona.toUpperCase()}</Text>. Compare transit risk, expected congestion delay & road waterlogging before stepping out.
      </Text>

      {/* Scenario Selection Chips */}
      <View style={styles.chipsContainer}>
        {scenarios.map((s, idx) => {
          const isSelected = idx === selectedIndex;
          const isRec = s.isRecommended;
          const isAvoid = s.delayRisk === 'High';
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.chip,
                { 
                  backgroundColor: isSelected ? theme.primaryLight : theme.surfaceSubtle,
                  borderColor: isSelected ? theme.primary : theme.border,
                }
              ]}
              onPress={() => setSelectedIndex(idx)}
              activeOpacity={0.8}
            >
              <View style={styles.chipTopRow}>
                <Text 
                  style={[
                    styles.chipLabel, 
                    { color: isSelected ? theme.primary : theme.textPrimary, fontWeight: isSelected ? '700' : '600' }
                  ]}
                  numberOfLines={1}
                >
                  {s.departureLabel.split('(')[0].trim()}
                </Text>
                {isRec && (
                  <View style={[styles.miniStatusDot, { backgroundColor: theme.alertGreen }]}>
                    <Text style={styles.miniDotText}>BEST</Text>
                  </View>
                )}
                {isAvoid && (
                  <View style={[styles.miniStatusDot, { backgroundColor: theme.alertRed }]}>
                    <Text style={styles.miniDotText}>AVOID</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.chipTime, { color: isSelected ? theme.primary : theme.textMuted }]}>
                {s.timeSubtitle.replace('Current window: ', '').replace('Peak squall window: ', '').replace('Post-storm window: ', '').replace('Next day: ', '')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* VIEW MODE 1: DETAIL FOCUS VIEW */}
      {viewMode === 'detail' && (
        <View style={[styles.detailCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
          {/* AI Verdict Banner */}
          <View 
            style={[
              styles.verdictBanner, 
              { 
                backgroundColor: selectedScenario.isRecommended 
                  ? theme.alertGreenBg 
                  : selectedScenario.delayRisk === 'High' 
                    ? theme.alertRedBg 
                    : theme.alertOrangeBg,
                borderColor: selectedScenario.isRecommended 
                  ? theme.alertGreen 
                  : selectedScenario.delayRisk === 'High' 
                    ? theme.alertRed 
                    : theme.alertOrange
              }
            ]}
          >
            <View style={styles.verdictLeft}>
              <Ionicons 
                name={selectedScenario.isRecommended ? "checkmark-circle" : selectedScenario.delayRisk === 'High' ? "alert-circle" : "shield-checkmark-outline"} 
                size={18} 
                color={selectedScenario.isRecommended ? theme.alertGreen : selectedScenario.delayRisk === 'High' ? theme.alertRed : theme.alertOrange} 
              />
              <Text 
                style={[
                  styles.verdictText, 
                  { 
                    color: selectedScenario.isRecommended 
                      ? theme.alertGreen 
                      : selectedScenario.delayRisk === 'High' 
                        ? theme.alertRed 
                        : theme.alertOrange 
                  }
                ]}
              >
                {selectedScenario.verdictBadge}
              </Text>
            </View>
            <View style={[styles.delayPill, { backgroundColor: theme.surface }]}>
              <Text style={[styles.delayPillText, { color: getRiskColor(selectedScenario.delayRisk) }]}>
                ⏱️ {selectedScenario.delayMins}
              </Text>
            </View>
          </View>

          {/* Departure Slot Header */}
          <View style={styles.slotHeader}>
            <View>
              <Text style={[styles.slotTitle, { color: theme.textPrimary }]}>
                {selectedScenario.departureLabel}
              </Text>
              <Text style={[styles.slotSubtitle, { color: theme.textSecondary }]}>
                {selectedScenario.timeSubtitle}
              </Text>
            </View>
            <View style={[styles.riskTag, { backgroundColor: getRiskBg(selectedScenario.delayRisk) }]}>
              <Text style={[styles.riskTagText, { color: getRiskColor(selectedScenario.delayRisk) }]}>
                {selectedScenario.delayRisk.toUpperCase()} DELAY RISK
              </Text>
            </View>
          </View>

          {/* Metric Indicators Grid */}
          <View style={styles.metricsGrid}>
            {/* Rain Probability Bar */}
            <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.metricCardHeader}>
                <Text style={[styles.metricCardLabel, { color: theme.textSecondary }]}>Rain Probability</Text>
                <Text style={[styles.metricCardValue, { color: selectedScenario.rainProbability > 70 ? theme.alertRed : theme.textPrimary }]}>
                  {selectedScenario.rainProbability}%
                </Text>
              </View>
              <View style={[styles.progressBarTrack, { backgroundColor: theme.border }]}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${selectedScenario.rainProbability}%`,
                      backgroundColor: selectedScenario.rainProbability > 70 ? theme.impactSevere : selectedScenario.rainProbability > 40 ? theme.impactHigh : theme.impactLow
                    }
                  ]} 
                />
              </View>
            </View>

            {/* Conditions: Temperature & Wind */}
            <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.metricCardLabel, { color: theme.textSecondary }]}>Atmospheric</Text>
              <View style={styles.weatherParamsRow}>
                <Text style={[styles.weatherParam, { color: theme.textPrimary }]}>
                  🌡️ {selectedScenario.temperature}°C
                </Text>
                <Text style={[styles.weatherParam, { color: theme.textPrimary }]}>
                  💨 {selectedScenario.windSpeed} km/h
                </Text>
              </View>
            </View>
          </View>

          {/* Waterlogging & Lightning Warning Row */}
          <View style={styles.hazardsRow}>
            <View style={[styles.hazardItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="waves" size={16} color={selectedScenario.delayRisk === 'High' ? theme.alertRed : theme.primary} />
              <View style={styles.hazardTextCol}>
                <Text style={[styles.hazardLabel, { color: theme.textMuted }]}>Waterlogging Risk</Text>
                <Text style={[styles.hazardValue, { color: theme.textPrimary }]}>{selectedScenario.waterloggingSeverity}</Text>
              </View>
            </View>

            <View style={[styles.hazardItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="flash-outline" size={16} color={selectedScenario.delayRisk === 'High' ? theme.alertRed : theme.alertOrange} />
              <View style={styles.hazardTextCol}>
                <Text style={[styles.hazardLabel, { color: theme.textMuted }]}>Lightning Hazard</Text>
                <Text style={[styles.hazardValue, { color: theme.textPrimary }]}>{selectedScenario.lightningHazard}</Text>
              </View>
            </View>
          </View>

          {/* AI Observation Summary */}
          <View style={[styles.summaryBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.summaryTitleRow}>
              <MaterialCommunityIcons name="robot-outline" size={16} color={theme.primary} />
              <Text style={[styles.summaryHeading, { color: theme.primary }]}>IMD AI Impact Observation:</Text>
            </View>
            <Text style={[styles.summaryText, { color: theme.textPrimary }]}>
              {selectedScenario.summary}
            </Text>
          </View>

          {/* Concrete Action Guidance */}
          <View style={[styles.actionBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
            <View style={styles.actionHeaderRow}>
              <Ionicons name="bulb-outline" size={16} color={theme.accent} />
              <Text style={[styles.actionHeading, { color: theme.textPrimary }]}>Recommended Action Playbook:</Text>
            </View>
            <Text style={[styles.actionText, { color: theme.textPrimary }]}>
              {selectedScenario.actionRecommendation}
            </Text>
          </View>
        </View>
      )}

      {/* VIEW MODE 2: SIDE-BY-SIDE MATRIX COMPARISON */}
      {viewMode === 'matrix' && (
        <View style={[styles.matrixContainer, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
          <Text style={[styles.matrixHeaderNote, { color: theme.textSecondary }]}>
            Side-by-Side Commute Matrix: Abhi Niklu vs 7 PM vs 9:30 PM vs Kal Subah
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.matrixScrollView}>
            <View style={styles.matrixTable}>
              {/* Matrix Table Header */}
              <View style={[styles.matrixRow, styles.matrixHeaderRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <Text style={[styles.matrixCell, styles.matrixColSlot, { color: theme.textMuted, fontWeight: '700' }]}>TIMING WINDOW</Text>
                <Text style={[styles.matrixCell, styles.matrixColRain, { color: theme.textMuted, fontWeight: '700' }]}>RAIN PROB</Text>
                <Text style={[styles.matrixCell, styles.matrixColDelay, { color: theme.textMuted, fontWeight: '700' }]}>EXPECTED DELAY</Text>
                <Text style={[styles.matrixCell, styles.matrixColWater, { color: theme.textMuted, fontWeight: '700' }]}>WATERLOGGING</Text>
                <Text style={[styles.matrixCell, styles.matrixColVerdict, { color: theme.textMuted, fontWeight: '700' }]}>AI VERDICT</Text>
              </View>

              {/* Matrix Table Rows */}
              {scenarios.map((sc, i) => {
                const isSelected = i === selectedIndex;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.matrixRow,
                      { 
                        backgroundColor: isSelected ? theme.primaryLight + '50' : i % 2 === 0 ? theme.surface : theme.surfaceSubtle,
                        borderBottomColor: theme.border
                      }
                    ]}
                    onPress={() => {
                      setSelectedIndex(i);
                      setViewMode('detail');
                    }}
                  >
                    <View style={[styles.matrixCell, styles.matrixColSlot]}>
                      <Text style={[styles.matrixSlotName, { color: theme.textPrimary, fontWeight: isSelected ? '700' : '600' }]}>
                        {sc.departureLabel.split('(')[0]}
                      </Text>
                      <Text style={[styles.matrixSlotSub, { color: theme.textSecondary }]}>
                        {sc.timeSubtitle.replace('Current window: ', '').replace('Peak squall window: ', '').replace('Post-storm window: ', '').replace('Next day: ', '')}
                      </Text>
                    </View>

                    <View style={[styles.matrixCell, styles.matrixColRain]}>
                      <Text style={[styles.matrixRainText, { color: sc.rainProbability > 70 ? theme.alertRed : theme.textPrimary, fontWeight: '700' }]}>
                        {sc.rainProbability}%
                      </Text>
                    </View>

                    <View style={[styles.matrixCell, styles.matrixColDelay]}>
                      <View style={[styles.matrixDelayBadge, { backgroundColor: getRiskBg(sc.delayRisk) }]}>
                        <Text style={[styles.matrixDelayText, { color: getRiskColor(sc.delayRisk) }]}>
                          {sc.delayMins}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.matrixCell, styles.matrixColWater]}>
                      <Text style={[styles.matrixWaterText, { color: theme.textSecondary }]} numberOfLines={2}>
                        {sc.waterloggingSeverity}
                      </Text>
                    </View>

                    <View style={[styles.matrixCell, styles.matrixColVerdict]}>
                      <View 
                        style={[
                          styles.matrixVerdictBadge, 
                          { 
                            backgroundColor: sc.isRecommended 
                              ? theme.alertGreenBg 
                              : sc.delayRisk === 'High' 
                                ? theme.alertRedBg 
                                : theme.alertOrangeBg 
                          }
                        ]}
                      >
                        <Text 
                          style={[
                            styles.matrixVerdictText, 
                            { 
                              color: sc.isRecommended 
                                ? theme.alertGreen 
                                : sc.delayRisk === 'High' 
                                  ? theme.alertRed 
                                  : theme.alertOrange 
                            }
                          ]}
                          numberOfLines={1}
                        >
                          {sc.verdictBadge.split(':')[0]}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <Text style={[styles.matrixHint, { color: theme.textMuted }]}>
            👆 Tap any row to open full departure playbook & route mitigation guidance
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subhead: {
    fontSize: 11,
    marginTop: 1,
  },
  modeToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radii.md,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  chipTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipLabel: {
    fontSize: 11,
  },
  miniStatusDot: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  miniDotText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  chipTime: {
    fontSize: 10,
    marginTop: 2,
  },
  detailCard: {
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
  },
  verdictBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  verdictLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  verdictText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  delayPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  delayPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  slotTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  slotSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  riskTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  riskTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.sm,
  },
  metricCard: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricCardLabel: {
    fontSize: 11,
  },
  metricCardValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  weatherParamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  weatherParam: {
    fontSize: 11,
    fontWeight: '600',
  },
  hazardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.sm,
  },
  hazardItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  hazardTextCol: {
    flex: 1,
  },
  hazardLabel: {
    fontSize: 10,
  },
  hazardValue: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  summaryBox: {
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  summaryHeading: {
    fontSize: 11,
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 18,
  },
  actionBox: {
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  actionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  actionHeading: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  matrixContainer: {
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1,
  },
  matrixHeaderNote: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: spacing.xs,
    paddingHorizontal: 4,
  },
  matrixScrollView: {
    width: '100%',
  },
  matrixTable: {
    minWidth: 540,
  },
  matrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  matrixHeaderRow: {
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
  },
  matrixCell: {
    paddingHorizontal: 6,
  },
  matrixColSlot: {
    width: 140,
  },
  matrixColRain: {
    width: 80,
    alignItems: 'center',
  },
  matrixColDelay: {
    width: 110,
  },
  matrixColWater: {
    width: 150,
  },
  matrixColVerdict: {
    width: 120,
    alignItems: 'flex-start',
  },
  matrixSlotName: {
    fontSize: 11,
  },
  matrixSlotSub: {
    fontSize: 10,
  },
  matrixRainText: {
    fontSize: 12,
  },
  matrixDelayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  matrixDelayText: {
    fontSize: 10,
    fontWeight: '700',
  },
  matrixWaterText: {
    fontSize: 10,
    lineHeight: 14,
  },
  matrixVerdictBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  matrixVerdictText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  matrixHint: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
