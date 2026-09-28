import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { WeatherImpactAnalysis } from '../types';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

interface Props {
  impactData: WeatherImpactAnalysis;
}

const ImpactActionCardComponent: React.FC<Props> = ({ impactData }) => {
  const { theme, persona, t } = useApp();
  
  // Track checked action checklist items
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const totalTasks = impactData.actionChecklist?.length || 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Signature Header Banner */}
      <View style={[styles.signatureHeader, { backgroundColor: theme.surfaceSubtle, borderBottomColor: theme.border }]}>
        <View style={styles.signatureBadge}>
          <MaterialCommunityIcons name="lightning-bolt" size={16} color={theme.accent} />
          <Text style={[styles.signatureTitle, { color: theme.textPrimary }]}>
            WEATHER → IMPACT → ACTION
          </Text>
        </View>
        <View style={styles.headerRightTags}>
          <View style={[styles.severityPill, { backgroundColor: impactData.impactLevel === 'Severe' ? theme.alertRedBg : theme.alertOrangeBg }]}>
            <Text style={[styles.severityPillText, { color: impactData.impactLevel === 'Severe' ? theme.alertRed : theme.alertOrange }]}>
              {impactData.severityBadge}
            </Text>
          </View>
          <View style={[styles.personaTag, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.personaTagText, { color: theme.primary }]}>
              {persona.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.contentBody}>
        {/* Step 1: Official Weather Fact */}
        <View style={styles.stepBlock}>
          <View style={styles.stepHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <MaterialCommunityIcons name="weather-partly-cloudy" size={16} color="#0284C7" />
            </View>
            <View style={styles.headerLabelCol}>
              <View style={styles.labelWithOfficialBadge}>
                <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>
                  1. {t.weatherFactTitle}
                </Text>
                <View style={styles.officialBadge}>
                  <Text style={styles.officialBadgeText}>IMD GROUND REALITY</Text>
                </View>
              </View>
              <Text style={[styles.stepValue, { color: theme.textPrimary }]}>
                {impactData.weatherFact}
              </Text>
            </View>
          </View>
        </View>

        {/* Step Connector Arrow */}
        <View style={styles.connectorRow}>
          <View style={[styles.connectorLine, { backgroundColor: theme.border }]} />
          <Ionicons name="arrow-down-circle" size={18} color={theme.accent} />
          <Text style={[styles.connectorLabel, { color: theme.textMuted }]}>translates to expected impact</Text>
          <View style={[styles.connectorLine, { backgroundColor: theme.border }]} />
        </View>

        {/* Step 2: Personal Impact */}
        <View style={styles.stepBlock}>
          <View style={styles.stepHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#D97706" />
            </View>
            <View style={styles.headerLabelCol}>
              <View style={styles.labelWithOfficialBadge}>
                <Text style={[styles.stepLabel, { color: '#D97706' }]}>
                  2. {t.impactTitle} (REAL-LIFE CONSEQUENCE)
                </Text>
                <View style={[styles.officialBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.officialBadgeText, { color: '#B45309' }]}>PERSONALIZED FOR {persona.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={[styles.stepValue, { color: theme.textPrimary }]}>
                {impactData.userImpact}
              </Text>
            </View>
          </View>
        </View>

        {/* Step Connector Arrow */}
        <View style={styles.connectorRow}>
          <View style={[styles.connectorLine, { backgroundColor: theme.border }]} />
          <Ionicons name="arrow-down-circle" size={18} color="#16A34A" />
          <Text style={[styles.connectorLabel, { color: theme.textMuted }]}>requires immediate concrete action</Text>
          <View style={[styles.connectorLine, { backgroundColor: theme.border }]} />
        </View>

        {/* Step 3: Recommended Action & Interactive Checklist */}
        <View style={[styles.actionHighlightBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
          <View style={styles.stepHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
            </View>
            <View style={styles.headerLabelCol}>
              <View style={styles.labelWithOfficialBadge}>
                <Text style={[styles.stepLabel, { color: '#16A34A' }]}>
                  3. {t.actionTitle} (WHAT YOU SHOULD DO)
                </Text>
                <View style={[styles.officialBadge, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.officialBadgeText, { color: '#15803D' }]}>IMMEDIATE ACTION</Text>
                </View>
              </View>
              <Text style={[styles.actionValueText, { color: theme.textPrimary }]}>
                {impactData.suggestedAction}
              </Text>
            </View>
          </View>

          {/* Interactive Checklist for Citizen */}
          {totalTasks > 0 && (
            <View style={[styles.checklistContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.checklistHeader}>
                <Text style={[styles.checklistTitle, { color: theme.textPrimary }]}>
                  Citizen Action Checklist:
                </Text>
                <Text style={[styles.checklistProgress, { color: completedCount === totalTasks ? '#16A34A' : theme.textMuted }]}>
                  {completedCount}/{totalTasks} Completed
                </Text>
              </View>

              <View style={styles.taskList}>
                {impactData.actionChecklist.map((taskItem) => {
                  const isDone = !!completedTasks[taskItem.id];
                  return (
                    <TouchableOpacity
                      key={taskItem.id}
                      style={styles.taskRow}
                      onPress={() => toggleTask(taskItem.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isDone ? "checkbox" : "square-outline"}
                        size={18}
                        color={isDone ? "#16A34A" : theme.primary}
                      />
                      <Text
                        style={[
                          styles.taskText,
                          { color: theme.textPrimary },
                          isDone && { textDecorationLine: 'line-through', opacity: 0.6 }
                        ]}
                      >
                        {taskItem.task}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Scientific Grounding Disclaimer */}
        <View style={styles.disclaimerRow}>
          <Ionicons name="information-circle-outline" size={13} color={theme.textMuted} />
          <Text style={[styles.disclaimerText, { color: theme.textMuted }]}>
            Weather facts sourced from IMD observatories; personal impact & actions calculated contextually for {persona} profiles.
          </Text>
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
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  signatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
    gap: 6,
  },
  signatureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signatureTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerRightTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  severityPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  severityPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  personaTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  personaTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contentBody: {
    padding: spacing.md,
  },
  stepBlock: {
    paddingVertical: spacing.xs,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerLabelCol: {
    flex: 1,
  },
  labelWithOfficialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  officialBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  officialBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0369A1',
    letterSpacing: 0.3,
  },
  stepValue: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    marginLeft: 8,
    gap: 6,
  },
  connectorLine: {
    flex: 1,
    height: 1,
  },
  connectorLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionHighlightBox: {
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    marginTop: spacing.xs,
  },
  actionValueText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  checklistContainer: {
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  checklistTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  checklistProgress: {
    fontSize: 10,
    fontWeight: '700',
  },
  taskList: {
    gap: 6,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.md,
    paddingTop: spacing.xs,
  },
  disclaimerText: {
    fontSize: 10,
    flex: 1,
    lineHeight: 14,
  },
});

export const ImpactActionCard = React.memo(ImpactActionCardComponent);
