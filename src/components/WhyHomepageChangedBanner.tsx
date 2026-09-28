import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export const WhyHomepageChangedBanner: React.FC = () => {
  const { theme, explanation, setCurrentTab, persona, timeOfDay, t } = useApp();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View style={[styles.banner, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
      {/* Tap-to-toggle Header */}
      <TouchableOpacity 
        style={styles.headerRow} 
        onPress={() => setCollapsed(!collapsed)}
        activeOpacity={0.7}
      >
        <View style={styles.leftTitleRow}>
          <MaterialCommunityIcons name="help-rhombus-outline" size={18} color={theme.accent} />
          <View>
            <View style={styles.titleBadgeRow}>
              <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>
                WHY HOMEPAGE CHANGED?
              </Text>
              <View style={[styles.reasonBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.reasonBadgeText, { color: theme.primary }]}>
                  {explanation.primaryReason}
                </Text>
              </View>
            </View>
            <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
              Tap to inspect live algorithmic card ranking audit
            </Text>
          </View>
        </View>

        <View style={styles.rightActionsRow}>
          <Ionicons 
            name={collapsed ? 'chevron-down-circle-outline' : 'chevron-up-circle-outline'} 
            size={20} 
            color={theme.primary} 
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Algorithmic Audit Details */}
      {!collapsed && (
        <View style={[styles.expandedSection, { borderTopColor: theme.border }]}>
          <Text style={[styles.introText, { color: theme.textSecondary }]}>
            Unlike static weather dashboards, your Mausam homepage is deterministically re-ranked in real time based on active meteorological triggers & personal vulnerability:
          </Text>

          {/* Active Triggers List */}
          <View style={styles.triggersList}>
            <Text style={[styles.subSectionTitle, { color: theme.textMuted }]}>
              DETECTED METEOROLOGICAL TRIGGERS:
            </Text>
            {explanation.triggers.map((trigger, idx) => (
              <View key={idx} style={styles.triggerItem}>
                <Ionicons name="flash" size={13} color={theme.accent} />
                <Text style={[styles.triggerText, { color: theme.textPrimary }]}>
                  {trigger}
                </Text>
              </View>
            ))}
          </View>

          {/* Card Hierarchy Shift (Promoted vs Deprioritized) */}
          <View style={styles.shiftContainer}>
            {explanation.promotedCards && explanation.promotedCards.length > 0 && (
              <View style={[styles.shiftBox, { backgroundColor: theme.surface, borderColor: theme.alertGreen }]}>
                <View style={styles.shiftHeader}>
                  <Ionicons name="arrow-up-circle" size={15} color={theme.alertGreen} />
                  <Text style={[styles.shiftTitle, { color: theme.alertGreen }]}>
                    PROMOTED TO TOP CARDS:
                  </Text>
                </View>
                {explanation.promotedCards.map((c, i) => (
                  <Text key={i} style={[styles.shiftItemText, { color: theme.textPrimary }]}>
                    • {c}
                  </Text>
                ))}
              </View>
            )}

            {explanation.deprioritizedCards && explanation.deprioritizedCards.length > 0 && (
              <View style={[styles.shiftBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.shiftHeader}>
                  <Ionicons name="arrow-down-circle" size={15} color={theme.textMuted} />
                  <Text style={[styles.shiftTitle, { color: theme.textMuted }]}>
                    DEPRIORITIZED (LOWER RANK):
                  </Text>
                </View>
                {explanation.deprioritizedCards.map((c, i) => (
                  <Text key={i} style={[styles.shiftItemText, { color: theme.textSecondary }]}>
                    • {c}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Mathematical Formula Transparency */}
          {explanation.algorithmFormula && (
            <View style={[styles.formulaBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.formulaTitleRow}>
                <MaterialCommunityIcons name="calculator-variant-outline" size={14} color={theme.primary} />
                <Text style={[styles.formulaTitle, { color: theme.primary }]}>
                  Deterministic Ranking Formula:
                </Text>
              </View>
              <Text style={[styles.formulaText, { color: theme.textSecondary }]}>
                {explanation.algorithmFormula}
              </Text>
            </View>
          )}

          {/* Footer Management & DNA link */}
          <View style={[styles.bottomManageRow, { borderTopColor: theme.border }]}>
            <Text style={[styles.timestampText, { color: theme.textMuted }]}>
              {explanation.timestamp}
            </Text>
            <TouchableOpacity 
              style={[styles.manageButton, { borderColor: theme.primary, backgroundColor: theme.primaryLight }]}
              onPress={() => setCurrentTab('profile')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="dna" size={14} color={theme.primary} />
              <Text style={[styles.manageButtonText, { color: theme.primary }]}>
                Tune Weather DNA
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: radii.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  leftTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  headerSub: {
    fontSize: 10,
    marginTop: 1,
  },
  rightActionsRow: {
    marginLeft: 8,
  },
  reasonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  reasonBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  expandedSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
  },
  introText: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  subSectionTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  triggersList: {
    gap: 4,
    marginVertical: spacing.xs,
  },
  triggerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  triggerText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  shiftContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: spacing.sm,
  },
  shiftBox: {
    flex: 1,
    padding: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  shiftTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  shiftItemText: {
    fontSize: 10,
    lineHeight: 15,
  },
  formulaBox: {
    padding: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  formulaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  formulaTitle: {
    fontSize: 10,
    fontWeight: '700',
  },
  formulaText: {
    fontSize: 10,
    fontFamily: 'monospace',
    lineHeight: 14,
  },
  bottomManageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
  },
  timestampText: {
    fontSize: 9,
    flex: 1,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  manageButtonText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
