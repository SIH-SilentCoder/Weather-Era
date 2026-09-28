import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export const BottomNav: React.FC = () => {
  const { theme, currentTab, setCurrentTab, t } = useApp();
  const { width } = useWindowDimensions();

  // Hide on wide desktop screens because desktop nav is in top header
  if (width >= 840) return null;

  const tabs: { key: 'home' | 'forecast' | 'map' | 'ai' | 'profile'; label: string; icon: any }[] = [
    { key: 'home', label: t.home, icon: 'home-variant' },
    { key: 'forecast', label: t.forecast, icon: 'chart-bell-curve-cumulative' },
    { key: 'map', label: t.map, icon: 'map-search' },
    { key: 'ai', label: t.ai, icon: 'robot-outline' },
    { key: 'profile', label: t.profile, icon: 'account-cog-outline' },
  ];

  return (
    <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => setCurrentTab(tab.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <View style={[styles.iconWrapper, isActive && { backgroundColor: theme.primaryLight }]}>
              <MaterialCommunityIcons
                name={tab.icon}
                size={22}
                color={isActive ? theme.primary : theme.textMuted}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? theme.primary : theme.textMuted, fontWeight: isActive ? '700' : '500' }
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  iconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radii.full,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
