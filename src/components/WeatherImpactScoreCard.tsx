import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { WeatherImpactAnalysis } from '../types';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

interface Props {
  impactData: WeatherImpactAnalysis;
}

export const WeatherImpactScoreCard: React.FC<Props> = ({ impactData }) => {
  const { theme, persona, t } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFactorIndex, setSelectedFactorIndex] = useState<number | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 75) return theme.impactSevere;
    if (score >= 55) return theme.impactHigh;
    if (score >= 35) return theme.impactModerate;
    return theme.impactLow;
  };

  const scoreColor = getScoreColor(impactData.impactScore);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="speedometer" size={18} color={scoreColor} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {t.impactScoreTitle}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.whyButton, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="help-circle-outline" size={14} color={theme.primary} />
          <Text style={[styles.whyButtonText, { color: theme.primary }]}>{t.whyScoreHigh}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Score Gauge Row */}
      <View style={styles.scoreRow}>
        <View style={[styles.scoreDial, { borderColor: scoreColor, backgroundColor: scoreColor + '15' }]}>
          <Text style={[styles.scoreNumber, { color: scoreColor }]}>
            {impactData.impactScore}
          </Text>
          <Text style={[styles.scoreMax, { color: theme.textMuted }]}>/ 100</Text>
          <View style={[styles.scoreMiniTag, { backgroundColor: scoreColor }]}>
            <Text style={styles.scoreMiniTagText}>{impactData.impactLevel.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.scoreDetailsCol}>
          <View style={styles.levelRow}>
            <View style={[styles.levelTag, { backgroundColor: scoreColor + '20' }]}>
              <Text style={[styles.levelTagText, { color: scoreColor }]}>
                {impactData.severityBadge}
              </Text>
            </View>
            <Text style={[styles.contextTag, { color: theme.textSecondary }]}>
              calibrated for {persona}
            </Text>
          </View>
          <Text style={[styles.scoreSummary, { color: theme.textPrimary }]}>
            {impactData.summary}
          </Text>
          <Text style={[styles.tapHint, { color: theme.textMuted }]}>
            Tap any factor below to inspect contributing vulnerability
          </Text>
        </View>
      </View>

      {/* Interactive Contributing Factors List */}
      <View style={styles.factorsList}>
        <View style={styles.factorHeaderRow}>
          <Text style={[styles.factorsTitle, { color: theme.textSecondary }]}>
            Contributing Vulnerability Factors:
          </Text>
          <Text style={[styles.weightNote, { color: theme.textMuted }]}>
            Weighted for {persona}
          </Text>
        </View>

        {impactData.contributingFactors.map((factor, index) => {
          const isSelected = selectedFactorIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.factorItem,
                isSelected && { backgroundColor: theme.surfaceSubtle, borderRadius: radii.md, padding: spacing.xs }
              ]}
              onPress={() => setSelectedFactorIndex(isSelected ? null : index)}
              activeOpacity={0.8}
            >
              <View style={styles.factorLabelRow}>
                <View style={styles.factorNameWithWeight}>
                  <Text style={[styles.factorName, { color: theme.textPrimary }]}>{factor.factor}</Text>
                  <View style={[styles.weightBadge, { backgroundColor: theme.surfaceSubtle }]}>
                    <Text style={[styles.weightBadgeText, { color: theme.textSecondary }]}>{Math.round(factor.weight * 100)}% Weight</Text>
                  </View>
                </View>
                <Text style={[styles.factorDesc, { color: factor.score > 70 ? theme.alertRed : theme.textSecondary, fontWeight: '700' }]}>
                  {factor.score}/100 ({factor.impactLabel})
                </Text>
              </View>

              <View style={[styles.progressBarTrack, { backgroundColor: theme.surfaceSubtle }]}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${factor.score}%`, 
                      backgroundColor: factor.score > 70 ? theme.impactSevere : factor.score > 40 ? theme.impactHigh : theme.impactLow 
                    }
                  ]} 
                />
              </View>

              {/* In-depth expanded explanation if factor tapped */}
              {isSelected && (
                <View style={[styles.factorDetailDrawer, { borderTopColor: theme.border }]}>
                  <Text style={[styles.factorDetailText, { color: theme.textPrimary }]}>
                    📊 Observed: <Text style={{ fontWeight: '600' }}>{factor.description}</Text>
                  </Text>
                  <Text style={[styles.factorMitigationText, { color: theme.primary }]}>
                    💡 Mitigation: Adjust schedule or protective equipment according to {factor.impactLabel} threshold.
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* "Why is my score high?" Explanation Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="analytics" size={20} color={theme.primary} />
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  Contextual Impact Score Formula
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={[styles.modalIntro, { color: theme.textSecondary }]}>
                {impactData.explanation}
              </Text>

              <View style={[styles.algorithmCallout, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <Text style={[styles.algorithmLabel, { color: theme.textPrimary }]}>
                  Scientific Formula:
                </Text>
                <Text style={[styles.algorithmDesc, { color: theme.textSecondary }]}>
                  Impact Score = Σ (Factor_Severity_i × Persona_Vulnerability_Weight_i) / Σ (Weights)
                </Text>
                <Text style={[styles.algorithmSubDesc, { color: theme.textMuted }]}>
                  Unlike generic weather apps that report raw rain percentages, Mausam IQ maps the atmospheric observation directly against your occupational exposure risks.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.modalCloseBtn, { backgroundColor: theme.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Understand & Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: spacing.md,
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
  whyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    gap: 4,
  },
  whyButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: spacing.md,
  },
  scoreDial: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 30,
  },
  scoreMax: {
    fontSize: 10,
    fontWeight: '700',
  },
  scoreMiniTag: {
    position: 'absolute',
    bottom: -6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.full,
  },
  scoreMiniTagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  scoreDetailsCol: {
    flex: 1,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  levelTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contextTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  scoreSummary: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  tapHint: {
    fontSize: 10,
    marginTop: 3,
  },
  factorsList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: spacing.sm,
    gap: 8,
  },
  factorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  factorsTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  weightNote: {
    fontSize: 10,
  },
  factorItem: {
    gap: 3,
  },
  factorLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  factorNameWithWeight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  factorName: {
    fontSize: 11,
    fontWeight: '600',
  },
  weightBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  weightBadgeText: {
    fontSize: 8,
    fontWeight: '700',
  },
  factorDesc: {
    fontSize: 10,
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  factorDetailDrawer: {
    paddingTop: 4,
    marginTop: 2,
    borderTopWidth: 1,
    gap: 2,
  },
  factorDetailText: {
    fontSize: 10,
    lineHeight: 14,
  },
  factorMitigationText: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  modalIntro: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  algorithmCallout: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  algorithmLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  algorithmDesc: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
  },
  algorithmSubDesc: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  modalCloseBtn: {
    paddingVertical: 10,
    borderRadius: radii.lg,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
