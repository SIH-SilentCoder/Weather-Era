import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export const BottomNav: React.FC = () => {
  const { theme, currentTab, setCurrentTab, alerts } = useApp();
  const { width } = useWindowDimensions();

  // Hide on wide desktop screens (desktop uses header nav)
  if (width >= 860) return null;

  const tabs: { 
    key: 'home' | 'forecast' | 'map' | 'alerts' | 'ai' | 'profile'; 
    label: string; 
    icon: any; 
    activeIcon: any;
    badgeCount?: number;
  }[] = [
    { key: 'home', label: 'Today', icon: 'home-outline', activeIcon: 'home' },
    { key: 'forecast', label: 'Forecast', icon: 'chart-box-outline', activeIcon: 'chart-box' },
    { key: 'map', label: 'Radar Map', icon: 'radar', activeIcon: 'radar' },
    { key: 'alerts', label: 'Alerts', icon: 'alert-decagram-outline', activeIcon: 'alert-decagram', badgeCount: alerts.length },
    { key: 'ai', label: 'Mausam AI', icon: 'robot-outline', activeIcon: 'robot' },
    { key: 'profile', label: 'DNA & Tools', icon: 'tune-vertical', activeIcon: 'tune-vertical-variant' },
  ];

  return (
    <View style={styles.floatingContainer}>
      <View 
        style={[
          styles.bottomBar, 
          { 
            backgroundColor: theme.surface === '#FFFFFF' ? 'rgba(255, 255, 255, 0.96)' : 'rgba(15, 23, 42, 0.94)', 
            borderColor: theme.surface === '#FFFFFF' ? 'rgba(226, 232, 240, 0.9)' : 'rgba(51, 65, 85, 0.7)',
          }
        ]}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          const activeColor = tab.key === 'alerts' && (tab.badgeCount ?? 0) > 0 ? '#EF4444' : theme.primary;
          const inactiveColor = theme.surface === '#FFFFFF' ? '#64748B' : theme.textMuted;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setCurrentTab(tab.key)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tab`}
            >
              <View 
                style={[
                  styles.iconWrapper, 
                  isActive && { 
                    backgroundColor: tab.key === 'alerts' && (tab.badgeCount ?? 0) > 0 
                      ? 'rgba(239, 68, 68, 0.16)' 
                      : (theme.surface === '#FFFFFF' ? 'rgba(2, 132, 199, 0.12)' : 'rgba(56, 189, 248, 0.16)')
                  }
                ]}
              >
                <MaterialCommunityIcons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={20}
                  color={isActive ? activeColor : inactiveColor}
                />
                
                {/* Active alert red notification badge */}
                {tab.badgeCount && tab.badgeCount > 0 ? (
                  <View style={styles.alertBadge}>
                    <Text style={styles.alertBadgeText}>
                      {tab.badgeCount > 9 ? '9+' : tab.badgeCount}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  { 
                    color: isActive ? activeColor : inactiveColor, 
                    fontWeight: isActive ? '800' : '500',
                  }
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>

              {/* Active Underline Pill */}
              {isActive ? (
                <View style={[styles.activeIndicator, { backgroundColor: activeColor }]} />
              ) : (
                <View style={styles.inactiveIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 14 : 8,
    paddingTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 22,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  iconWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 2,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  alertBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  tabLabel: {
    fontSize: 9,
    letterSpacing: -0.1,
  },
  activeIndicator: {
    width: 14,
    height: 3,
    borderRadius: 2,
    marginTop: 2,
  },
  inactiveIndicator: {
    width: 14,
    height: 3,
    marginTop: 2,
    backgroundColor: 'transparent',
  },
});
