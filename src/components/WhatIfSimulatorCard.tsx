import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { WhatIfScenario } from '../types';
import { useApp } from '../context/AppContext';
import { getWhatIfScenarios } from '../services/routeEngine';
import { radii, spacing } from '../theme';

export const WhatIfSimulatorCard: React.FC = () => {
  const { theme, weatherData, t } = useApp();
  const scenarios = getWhatIfScenarios(weatherData);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedScenario = scenarios[selectedIndex];

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="timeline-clock-outline" size={18} color={theme.primary} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {t.whatIfTitle}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.badgeText, { color: theme.primary }]}>SCENARIO COMPARISON</Text>
        </View>
      </View>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {t.whatIfSubtitle}
      </Text>

      {/* Scenario Selection Tabs */}
      <View style={[styles.tabsRow, { backgroundColor: theme.surfaceSubtle }]}>
        {scenarios.map((s, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.tab,
                isSelected && { backgroundColor: theme.surface, borderRadius: radii.md, elevation: 2 }
              ]}
              onPress={() => setSelectedIndex(idx)}
            >
              <Text 
                style={[
                  styles.tabText, 
                  { color: isSelected ? theme.primary : theme.textMuted, fontWeight: isSelected ? '700' : '500' }
                ]}
                numberOfLines={1}
              >
                {idx === 0 ? 'Now' : idx === 1 ? '+1h' : idx === 2 ? '+2.5h' : 'Tomorrow'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Scenario Details & Comparison Card */}
      <View style={[styles.scenarioCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        <View style={styles.scenarioHeader}>
          <Text style={[styles.scenarioLabel, { color: theme.textPrimary }]}>
            {selectedScenario.departureLabel}
          </Text>
          <View 
            style={[
              styles.riskBadge, 
              { 
                backgroundColor: selectedScenario.delayRisk === 'High' ? theme.alertRedBg : selectedScenario.delayRisk === 'Moderate' ? theme.alertOrangeBg : theme.alertGreenBg 
              }
            ]}
          >
            <Text 
              style={[
                styles.riskBadgeText, 
                { 
                  color: selectedScenario.delayRisk === 'High' ? theme.alertRed : selectedScenario.delayRisk === 'Moderate' ? theme.alertOrange : theme.alertGreen 
                }
              ]}
            >
              {selectedScenario.delayRisk} Delay Risk
            </Text>
          </View>
        </View>

        {/* Rain Probability Comparison Bar */}
        <View style={styles.comparisonBarSection}>
          <View style={styles.comparisonBarLabelRow}>
            <Text style={[styles.barLabel, { color: theme.textSecondary }]}>Rain Probability:</Text>
            <Text style={[styles.barValue, { color: theme.textPrimary }]}>{selectedScenario.rainProbability}%</Text>
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

        {/* Temperature and Wind in Scenario */}
        <View style={styles.metricsMiniRow}>
          <View style={styles.metricMiniItem}>
            <Ionicons name="thermometer-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.metricMiniText, { color: theme.textSecondary }]}>
              {selectedScenario.temperature}°C
            </Text>
          </View>
          <View style={styles.metricMiniItem}>
            <Ionicons name="speedometer-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.metricMiniText, { color: theme.textSecondary }]}>
              {selectedScenario.windSpeed} km/h wind
            </Text>
          </View>
        </View>

        {/* Impact Summary & Recommendation */}
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryText, { color: theme.textPrimary }]}>
            {selectedScenario.summary}
          </Text>
          <View style={styles.actionRecommendationRow}>
            <Ionicons name="bulb-outline" size={16} color={theme.accent} />
            <Text style={[styles.actionRecommendationText, { color: theme.textSecondary }]}>
              {selectedScenario.actionRecommendation}
            </Text>
          </View>
        </View>
      </View>
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
    marginBottom: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: spacing.md,
  },
  tabsRow: {
    flexDirection: 'row',
    borderRadius: radii.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
  },
  tabText: {
    fontSize: 12,
  },
  scenarioCard: {
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  scenarioLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  comparisonBarSection: {
    marginVertical: spacing.xs,
  },
  comparisonBarLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
  },
  barValue: {
    fontSize: 11,
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
  metricsMiniRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  metricMiniItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricMiniText: {
    fontSize: 11,
  },
  summaryBox: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: spacing.sm,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  actionRecommendationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 6,
  },
  actionRecommendationText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
});
