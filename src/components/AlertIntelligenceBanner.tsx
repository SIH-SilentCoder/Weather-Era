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
  const { theme } = useApp();
  const [expanded, setExpanded] = useState(false);

  const isRed = alert.colorCode === 'red';
  const alertColor = isRed ? theme.alertRed : theme.alertOrange;
  const alertBg = isRed ? theme.alertRedBg : theme.alertOrangeBg;

  return (
    <View style={[styles.container, { backgroundColor: alertBg, borderColor: alertColor }]}>
      <TouchableOpacity 
        style={styles.headerRow} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={[styles.badge, { backgroundColor: alertColor }]}>
          <MaterialCommunityIcons 
            name={isRed ? 'alert-octagon' : 'alert-rhombus'} 
            size={18} 
            color="#FFFFFF" 
          />
        </View>

        <View style={styles.titleArea}>
          <View style={styles.topMeta}>
            <Text style={[styles.alertTag, { color: alertColor }]}>
              PRIORITY WARNING • {alert.issuedAt}
            </Text>
          </View>
          <Text style={[styles.headline, { color: theme.textPrimary }]} numberOfLines={expanded ? undefined : 2}>
            {alert.headline}
          </Text>
        </View>

        <Ionicons 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={alertColor} 
        />
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.expandedContent, { borderTopColor: alertColor + '40' }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Hazard Details:</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {alert.description}
          </Text>

          <View style={[styles.actionBox, { backgroundColor: theme.surface, borderColor: alertColor + '50' }]}>
            <View style={styles.actionHeader}>
              <Ionicons name="shield-checkmark" size={16} color={alertColor} />
              <Text style={[styles.actionHeading, { color: alertColor }]}>IMD Advisory & Action:</Text>
            </View>
            <Text style={[styles.actionText, { color: theme.textPrimary }]}>
              {alert.actionGuidance}
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Districts: {alert.affectedDistricts.join(', ')}
            </Text>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Source: {alert.source}
            </Text>
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: 12,
  },
  badge: {
    width: 34,
    height: 34,
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
    marginBottom: 2,
  },
  alertTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  expandedContent: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  actionBox: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  actionHeading: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  footerRow: {
    gap: 4,
  },
  footerText: {
    fontSize: 10,
  },
});
