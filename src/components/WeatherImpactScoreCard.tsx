import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
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
        <View style={[styles.scoreDial, { borderColor: scoreColor, backgroundColor: scoreColor + '12' }]}>
          <Text style={[styles.scoreNumber, { color: scoreColor }]}>
            {impactData.impactScore}
          </Text>
          <Text style={[styles.scoreMax, { color: theme.textMuted }]}>/ 100</Text>
        </View>

        <View style={styles.scoreDetailsCol}>
          <View style={styles.levelRow}>
            <View style={[styles.levelTag, { backgroundColor: scoreColor + '20' }]}>
              <Text style={[styles.levelTagText, { color: scoreColor }]}>
                {impactData.impactLevel.toUpperCase()} RISK
              </Text>
            </View>
            <Text style={[styles.contextTag, { color: theme.textSecondary }]}>
              for {persona}
            </Text>
          </View>
          <Text style={[styles.scoreSummary, { color: theme.textPrimary }]}>
            {impactData.summary}
          </Text>
        </View>
      </View>

      {/* Contributing Factors Visual Bars */}
      <View style={styles.factorsList}>
        <Text style={[styles.factorsTitle, { color: theme.textSecondary }]}>
          Contributing Factor Breakdown:
        </Text>
        {impactData.contributingFactors.map((factor, index) => (
          <View key={index} style={styles.factorItem}>
            <View style={styles.factorLabelRow}>
              <Text style={[styles.factorName, { color: theme.textPrimary }]}>{factor.factor}</Text>
              <Text style={[styles.factorDesc, { color: theme.textMuted }]}>{factor.description}</Text>
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
          </View>
        ))}
      </View>

      {/* "Why is my score high?" Explanation Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="analytics" size={20} color={theme.primary} />
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  Impact Score Algorithm
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalIntro, { color: theme.textSecondary }]}>
              {impactData.explanation}
            </Text>

            <View style={[styles.algorithmCallout, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
              <Text style={[styles.algorithmLabel, { color: theme.textPrimary }]}>
                Persona Vulnerability Model:
              </Text>
              <Text style={[styles.algorithmDesc, { color: theme.textSecondary }]}>
                Unlike static weather indexes, this score adjusts dynamically based on your selected persona ({persona}), active IMD radar advisories, and the sensitivity sliders in your Personal Weather DNA.
              </Text>
            </View>

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
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 28,
  },
  scoreMax: {
    fontSize: 10,
    fontWeight: '600',
  },
  scoreDetailsCol: {
    flex: 1,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  levelTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contextTag: {
    fontSize: 11,
    fontWeight: '500',
  },
  scoreSummary: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  factorsList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: spacing.sm,
    gap: 8,
  },
  factorsTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  factorItem: {
    gap: 4,
  },
  factorLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  factorName: {
    fontSize: 11,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 440,
    borderRadius: radii.xl,
    padding: spacing.xl,
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
    fontSize: 16,
    fontWeight: '700',
  },
  modalIntro: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  algorithmCallout: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  algorithmLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  algorithmDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  modalCloseBtn: {
    paddingVertical: 12,
    borderRadius: radii.lg,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
