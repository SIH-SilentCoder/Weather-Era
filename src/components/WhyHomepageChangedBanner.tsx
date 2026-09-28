import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export const WhyHomepageChangedBanner: React.FC = () => {
  const { theme, explanation, setCurrentTab, t } = useApp();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View style={[styles.banner, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
      <TouchableOpacity 
        style={styles.headerRow} 
        onPress={() => setCollapsed(!collapsed)}
        activeOpacity={0.7}
      >
        <View style={styles.leftTitleRow}>
          <Ionicons name="sparkles" size={16} color={theme.primary} />
          <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>
            {t.whyHomepageChanged}
          </Text>
        </View>

        <View style={styles.rightActionsRow}>
          <Text style={[styles.reasonBadge, { color: theme.primary, backgroundColor: theme.primaryLight }]}>
            {explanation.primaryReason}
          </Text>
          <Ionicons 
            name={collapsed ? 'chevron-down' : 'chevron-up'} 
            size={16} 
            color={theme.textMuted} 
          />
        </View>
      </TouchableOpacity>

      {!collapsed && (
        <View style={styles.expandedSection}>
          <Text style={[styles.introText, { color: theme.textSecondary }]}>
            Mausam dynamically prioritized your homepage feed based on active micro-climate triggers:
          </Text>

          <View style={styles.triggersList}>
            {explanation.triggers.map((trigger, idx) => (
              <View key={idx} style={styles.triggerItem}>
                <Ionicons name="checkmark-circle" size={14} color={theme.primary} />
                <Text style={[styles.triggerText, { color: theme.textPrimary }]}>
                  {trigger}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.bottomManageRow}>
            <Text style={[styles.timestampText, { color: theme.textMuted }]}>
              {explanation.timestamp}
            </Text>
            <TouchableOpacity 
              style={[styles.manageButton, { borderColor: theme.primary }]}
              onPress={() => setCurrentTab('profile')}
            >
              <Ionicons name="options-outline" size={13} color={theme.primary} />
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
    borderRadius: radii.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
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
    gap: 6,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reasonBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  expandedSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
    paddingTop: spacing.sm,
  },
  introText: {
    fontSize: 11,
    marginBottom: spacing.xs,
  },
  triggersList: {
    gap: 6,
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
  bottomManageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  timestampText: {
    fontSize: 10,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  manageButtonText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
