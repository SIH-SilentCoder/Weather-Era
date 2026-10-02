import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';
import { WeatherAlert } from '../types';

export const AlertsScreen: React.FC = () => {
  const { theme, alerts, dismissAlert, weatherData } = useApp();
  const { width } = useWindowDimensions();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'severe' | 'lightning' | 'flood'>('all');

  const filteredAlerts = alerts.filter(a => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'severe') return a.severity === 'severe' || a.severity === 'extreme';
    if (selectedFilter === 'lightning') return a.type.toLowerCase().includes('lightning');
    if (selectedFilter === 'flood') return a.type.toLowerCase().includes('flood') || a.type.toLowerCase().includes('rain');
    return true;
  });

  const emergencyContacts = [
    { title: 'National Disaster Helpline (NDRF)', number: '1078', icon: 'shield-alert' },
    { title: 'State Disaster Response (SDMA)', number: '1070', icon: 'office-building-marker' },
    { title: 'Emergency Services (All-in-One)', number: '112', icon: 'phone-alert' },
    { title: 'Medical / Ambulance', number: '108', icon: 'ambulance' },
  ];

  const safetyGuidelines = [
    {
      title: '⚡ Lightning & Thunderstorm Safety',
      rules: [
        'Stay indoors away from windows, open verandas, and electrical appliances.',
        'Never take shelter under tall isolated trees or metal sheds.',
        'If caught in open fields, crouch low on the balls of your feet ("lightning squat").',
      ],
      color: '#F59E0B',
    },
    {
      title: '🌊 Urban Waterlogging & Flash Floods',
      rules: [
        'Avoid driving or walking through waterlogged underpasses.',
        'Keep emergency battery torches, powerbanks, and drinking water ready.',
        'Follow official IMD Doppler radar bulletins before road transit.',
      ],
      color: '#3B82F6',
    },
    {
      title: '🔥 Heatwave & Extreme Temperature',
      rules: [
        'Stay hydrated with ORS, coconut water, or lemon water.',
        'Avoid direct sun exposure between 12:00 PM and 3:30 PM.',
        'Wear lightweight, loose-fitting, light-colored cotton clothing.',
      ],
      color: '#EF4444',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'extreme':
      case 'severe':
        return '#EF4444';
      case 'moderate':
        return '#F97316';
      default:
        return '#EAB308';
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Banner */}
      <View style={[styles.headerBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerIconCircle}>
            <MaterialCommunityIcons name="alert-decagram" size={28} color="#EF4444" />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              IMD Disaster & Severe Weather Center
            </Text>
            <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
              Real-time Early Warnings for {weatherData.city}, {weatherData.state}
            </Text>
          </View>
        </View>
        
        {/* Status Pill */}
        <View style={styles.statusRow}>
          <View style={[styles.statusPill, { backgroundColor: alerts.length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)' }]}>
            <View style={[styles.dot, { backgroundColor: alerts.length > 0 ? '#EF4444' : '#22C55E' }]} />
            <Text style={[styles.statusText, { color: alerts.length > 0 ? '#EF4444' : '#22C55E' }]}>
              {alerts.length > 0 ? `${alerts.length} Active Warnings in Region` : 'Normal Synoptic Conditions'}
            </Text>
          </View>
          <Text style={[styles.dataSource, { color: theme.textMuted }]}>
            Source: IMD Radar AWS Mesonet
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'severe', 'lightning', 'flood'] as const).map(tabKey => (
          <TouchableOpacity
            key={tabKey}
            onPress={() => setSelectedFilter(tabKey)}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedFilter === tabKey ? theme.primary : theme.surface,
                borderColor: selectedFilter === tabKey ? theme.primary : theme.border,
              }
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: selectedFilter === tabKey ? '#FFFFFF' : theme.textSecondary }
              ]}
            >
              {tabKey === 'all' ? 'All Alerts' : tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Alerts List */}
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="broadcast" size={20} color={theme.primary} />
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Active Meteorological Bulletins</Text>
      </View>

      {filteredAlerts.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="checkmark-circle-outline" size={44} color="#22C55E" />
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Severe Alerts in This Category</Text>
          <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
            Atmospheric conditions remain within normal thresholds for your area.
          </Text>
        </View>
      ) : (
        filteredAlerts.map(alert => {
          const color = getSeverityColor(alert.severity);
          return (
            <View 
              key={alert.id} 
              style={[styles.alertCard, { backgroundColor: theme.surface, borderLeftColor: color, borderColor: theme.border }]}
            >
              <View style={styles.alertCardHeader}>
                <View style={styles.alertBadgeRow}>
                  <View style={[styles.severityBadge, { backgroundColor: color }]}>
                    <Text style={styles.severityBadgeText}>{alert.severity.toUpperCase()} WARNING</Text>
                  </View>
                  <Text style={[styles.alertTime, { color: theme.textMuted }]}>{alert.issuedAt || 'Valid: Next 6 Hours'}</Text>
                </View>
                <TouchableOpacity onPress={() => dismissAlert(alert.id)} style={styles.dismissBtn}>
                  <Ionicons name="close" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.alertHeadline, { color: theme.textPrimary }]}>{alert.headline}</Text>
              <Text style={[styles.alertDesc, { color: theme.textSecondary }]}>{alert.description}</Text>

              {alert.affectedDistricts && alert.affectedDistricts.length > 0 ? (
                <View style={styles.districtRow}>
                  <Text style={[styles.districtLabel, { color: theme.textMuted }]}>Affected: </Text>
                  <Text style={[styles.districtText, { color: theme.textSecondary }]}>
                    {alert.affectedDistricts.join(', ')}
                  </Text>
                </View>
              ) : null}

              {alert.actionGuidance ? (
                <View style={[styles.instructionBox, { backgroundColor: theme.surfaceSubtle }]}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={color} />
                  <Text style={[styles.instructionText, { color: theme.textPrimary }]}>
                    {alert.actionGuidance}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })
      )}

      {/* Emergency Helpline Grid */}
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="phone-classic" size={20} color="#EF4444" />
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Emergency Quick Call Helplines</Text>
      </View>

      <View style={styles.helplineGrid}>
        {emergencyContacts.map((contact, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.helplineCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => Linking.openURL(`tel:${contact.number}`)}
            activeOpacity={0.8}
          >
            <View style={styles.helplineIcon}>
              <MaterialCommunityIcons name={contact.icon as any} size={22} color={theme.primary} />
            </View>
            <View style={styles.helplineTextCol}>
              <Text style={[styles.helplineTitle, { color: theme.textPrimary }]} numberOfLines={1}>{contact.title}</Text>
              <Text style={[styles.helplineNumber, { color: theme.primary }]}>Dial {contact.number}</Text>
            </View>
            <Ionicons name="call" size={18} color="#22C55E" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Safety Do's and Don'ts */}
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="book-open-page-variant" size={20} color={theme.primary} />
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>IMD Disaster Preparedness SOPs</Text>
      </View>

      {safetyGuidelines.map((guide, idx) => (
        <View key={idx} style={[styles.guideCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.guideTitle, { color: guide.color }]}>{guide.title}</Text>
          {guide.rules.map((rule, rIdx) => (
            <View key={rIdx} style={styles.ruleRow}>
              <Ionicons name="checkmark-circle" size={14} color={guide.color} style={{ marginTop: 2 }} />
              <Text style={[styles.ruleText, { color: theme.textSecondary }]}>{rule}</Text>
            </View>
          ))}
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  headerBanner: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dataSource: {
    fontSize: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCard: {
    padding: spacing.xl,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  alertCard: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderLeftWidth: 5,
    marginBottom: spacing.sm,
  },
  alertCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  severityBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  alertTime: {
    fontSize: 11,
  },
  dismissBtn: {
    padding: 4,
  },
  alertHeadline: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  districtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  districtLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  districtText: {
    fontSize: 11,
    flex: 1,
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: spacing.sm,
    borderRadius: radii.sm,
  },
  instructionText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
  helplineGrid: {
    gap: 8,
    marginBottom: spacing.md,
  },
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  helplineIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  helplineTextCol: {
    flex: 1,
  },
  helplineTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  helplineNumber: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  guideCard: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  ruleText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});
