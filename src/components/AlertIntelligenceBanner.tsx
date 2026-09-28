import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { WeatherAlert } from '../types';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

interface Props {
  alert: WeatherAlert;
}

export const AlertIntelligenceBanner: React.FC<Props> = ({ alert }) => {
  const { theme, dismissAlert } = useApp();
  const [expanded, setExpanded] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);

  const isRed = alert.colorCode === 'red';
  const alertColor = isRed ? theme.alertRed : theme.alertOrange;
  const alertBg = isRed ? theme.alertRedBg : theme.alertOrangeBg;

  return (
    <View style={[styles.container, { backgroundColor: alertBg, borderColor: alertColor }]}>
      {/* Priority Rank #1 Banner Tag */}
      <View style={[styles.priorityRibbon, { backgroundColor: alertColor }]}>
        <View style={styles.ribbonLeft}>
          <MaterialCommunityIcons name="alert-decagram" size={14} color="#FFFFFF" />
          <Text style={styles.ribbonText}>
            SMART ALERT • AUTOMATIC TOP PRIORITY RANK #1
          </Text>
        </View>
        <Text style={styles.validTillText}>
          Valid Till: {alert.validTill}
        </Text>
      </View>

      {/* Header Row */}
      <TouchableOpacity 
        style={styles.headerRow} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={[styles.badge, { backgroundColor: alertColor }]}>
          <MaterialCommunityIcons 
            name={isRed ? 'alert-octagon' : 'alert-rhombus'} 
            size={20} 
            color="#FFFFFF" 
          />
        </View>

        <View style={styles.titleArea}>
          <View style={styles.topMeta}>
            <View style={[styles.severityTag, { backgroundColor: alertColor + '25' }]}>
              <Text style={[styles.severityTagText, { color: alertColor }]}>
                {alert.colorCode.toUpperCase()} WARNING
              </Text>
            </View>
            <Text style={[styles.alertTime, { color: theme.textSecondary }]}>
              Issued: {alert.issuedAt}
            </Text>
          </View>
          <Text style={[styles.headline, { color: theme.textPrimary }]}>
            {alert.headline}
          </Text>
        </View>

        <Ionicons 
          name={expanded ? 'chevron-up-circle' : 'chevron-down-circle'} 
          size={22} 
          color={alertColor} 
        />
      </TouchableOpacity>

      {/* Expanded Hazard Details & Action Plan */}
      {expanded && (
        <View style={[styles.expandedContent, { borderTopColor: alertColor + '35' }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>IMD Doppler Threat Assessment:</Text>
          <Text style={[styles.description, { color: theme.textPrimary }]}>
            {alert.description}
          </Text>

          {/* Action Guidance Callout */}
          <View style={[styles.actionBox, { backgroundColor: theme.surface, borderColor: alertColor + '60' }]}>
            <View style={styles.actionHeader}>
              <Ionicons name="shield-checkmark" size={16} color={alertColor} />
              <Text style={[styles.actionHeading, { color: alertColor }]}>IMD Advisory & Citizen Safety Action:</Text>
            </View>
            <Text style={[styles.actionText, { color: theme.textPrimary }]}>
              {alert.actionGuidance}
            </Text>
          </View>

          {/* Affected Districts Chips */}
          <View style={styles.districtsRow}>
            <Text style={[styles.districtsLabel, { color: theme.textMuted }]}>Affected Districts:</Text>
            <View style={styles.districtsChips}>
              {alert.affectedDistricts.map((dist, idx) => (
                <View key={idx} style={[styles.districtChip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.districtChipText, { color: theme.textPrimary }]}>{dist}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Emergency Helpline & Acknowledge Row */}
          <View style={[styles.footerRow, { borderTopColor: alertColor + '30' }]}>
            <View style={styles.helplineBox}>
              <Ionicons name="call" size={13} color={alertColor} />
              <Text style={[styles.helplineText, { color: alertColor }]}>
                24x7 Disaster Helpline: <Text style={{ fontWeight: '800' }}>1070 / 112</Text>
              </Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.ackButton, 
                { backgroundColor: acknowledged ? theme.alertGreen : theme.surface, borderColor: alertColor }
              ]}
              onPress={() => setAcknowledged(!acknowledged)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={acknowledged ? "checkmark-circle" : "checkmark-circle-outline"} 
                size={14} 
                color={acknowledged ? "#FFFFFF" : alertColor} 
              />
              <Text style={[styles.ackButtonText, { color: acknowledged ? "#FFFFFF" : alertColor }]}>
                {acknowledged ? "Acknowledged" : "Mark Acknowledged"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.xl,
    borderWidth: 1.5,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    overflow: 'hidden',
    elevation: 4,
  },
  priorityRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  ribbonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ribbonText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  validTillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: 12,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: {
    flex: 1,
  },
  topMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  severityTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.sm,
  },
  severityTagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  alertTime: {
    fontSize: 10,
  },
  headline: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  expandedContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  actionBox: {
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  actionHeading: {
    fontSize: 11,
    fontWeight: '800',
  },
  actionText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  districtsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  districtsLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  districtsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  districtChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  districtChipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
  },
  helplineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  helplineText: {
    fontSize: 10,
    fontWeight: '600',
  },
  ackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  ackButtonText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
