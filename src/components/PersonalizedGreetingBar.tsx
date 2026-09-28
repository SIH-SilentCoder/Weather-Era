import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { TimeOfDay, UserInterest } from '../types';
import { radii, spacing } from '../theme';

export const PersonalizedGreetingBar: React.FC = () => {
  const { 
    theme, 
    persona, 
    selectedLocation, 
    timeOfDay, 
    setTimeOfDayOverride, 
    selectedInterests, 
    toggleInterest,
    setCurrentTab
  } = useApp();

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning': return 'Good Morning';
      case 'afternoon': return 'Good Afternoon';
      case 'evening': return 'Good Evening';
      case 'night': return 'Good Night';
    }
  };

  const getTimeOfDayIcon = (tod: TimeOfDay) => {
    switch (tod) {
      case 'morning': return 'weather-sunny';
      case 'afternoon': return 'white-balance-sunny';
      case 'evening': return 'weather-sunset';
      case 'night': return 'weather-night';
    }
  };

  const allInterests: { key: UserInterest; label: string; icon: any }[] = [
    { key: 'waterlogging', label: 'Road Waterlogging', icon: 'car-wash' },
    { key: 'spraying', label: 'Agromet Spraying', icon: 'sprout' },
    { key: 'lightning', label: 'Lightning Convective', icon: 'flash' },
    { key: 'transit_delays', label: 'Transit & Flight Delays', icon: 'clock-alert-outline' },
    { key: 'workout', label: 'Outdoor Workout / UV', icon: 'run' },
    { key: 'aqi_bronchial', label: 'AQI & Inhaler Alert', icon: 'air-filter' },
    { key: 'marine_swell', label: 'Marine Swell & High Seas', icon: 'sail-boat' },
  ];

  const timeOptions: { key: TimeOfDay; label: string }[] = [
    { key: 'morning', label: 'Morning (05–11h)' },
    { key: 'afternoon', label: 'Afternoon (12–16h)' },
    { key: 'evening', label: 'Evening (17–21h)' },
    { key: 'night', label: 'Night (22–04h)' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Salutation Line */}
      <View style={styles.topRow}>
        <View style={styles.greetingLeft}>
          <View style={[styles.avatarBadge, { backgroundColor: theme.primaryLight }]}>
            <MaterialCommunityIcons name={getTimeOfDayIcon(timeOfDay)} size={18} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.greetingText, { color: theme.textPrimary }]}>
              {getGreeting()}, <Text style={{ color: theme.primary }}>{persona.toUpperCase()}</Text>
            </Text>
            <Text style={[styles.contextSubText, { color: theme.textSecondary }]}>
              Location: {selectedLocation.name} • {timeOfDay.toUpperCase()} WINDOW
            </Text>
          </View>
        </View>

        <View style={styles.topRightActions}>
          <TouchableOpacity 
            style={[styles.dnaQuickBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
            onPress={() => setCurrentTab('profile')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="dna" size={13} color={theme.primary} />
            <Text style={[styles.dnaQuickBtnText, { color: theme.primary }]}>DNA PROFILE</Text>
          </TouchableOpacity>

          <View style={[styles.liveBadge, { backgroundColor: theme.alertGreenBg }]}>
            <View style={[styles.liveDot, { backgroundColor: theme.alertGreen }]} />
            <Text style={[styles.liveBadgeText, { color: theme.alertGreen }]}>DOPPLER</Text>
          </View>
        </View>
      </View>

      {/* Time-of-Day Quick Switcher Simulator */}
      <View style={styles.timeOfDaySection}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="time-outline" size={13} color={theme.textMuted} />
          <Text style={[styles.sectionTitleText, { color: theme.textMuted }]}>
            TIME CONTEXT (Tap to simulate real-time diurnal shift):
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeScroll}>
          {timeOptions.map((t) => {
            const isSelected = timeOfDay === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.timeChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle,
                    borderColor: isSelected ? theme.primary : theme.border,
                  }
                ]}
                onPress={() => setTimeOfDayOverride(t.key)}
              >
                <Text style={[styles.timeChipText, { color: isSelected ? '#FFFFFF' : theme.textPrimary, fontWeight: isSelected ? '700' : '500' }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active User Interests Interactive Chips */}
      <View style={styles.interestsSection}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="bulb-outline" size={13} color={theme.accent} />
          <Text style={[styles.sectionTitleText, { color: theme.textMuted }]}>
            MY ACTIVE INTERESTS (Tap to elevate related cards):
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.interestsScroll}>
          {allInterests.map((interest) => {
            const isActive = selectedInterests.includes(interest.key);
            return (
              <TouchableOpacity
                key={interest.key}
                style={[
                  styles.interestChip,
                  {
                    backgroundColor: isActive ? theme.primaryLight : theme.surfaceSubtle,
                    borderColor: isActive ? theme.primary : theme.border,
                  }
                ]}
                onPress={() => toggleInterest(interest.key)}
              >
                <MaterialCommunityIcons 
                  name={interest.icon} 
                  size={14} 
                  color={isActive ? theme.primary : theme.textSecondary} 
                />
                <Text 
                  style={[
                    styles.interestChipText, 
                    { color: isActive ? theme.primary : theme.textPrimary, fontWeight: isActive ? '700' : '500' }
                  ]}
                >
                  {interest.label}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark-circle" size={13} color={theme.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    elevation: 3,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '800',
  },
  contextSubText: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: '600',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dnaQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  dnaQuickBtnText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  timeOfDaySection: {
    gap: 4,
    marginTop: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionTitleText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  timeScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  timeChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  timeChipText: {
    fontSize: 10,
  },
  interestsSection: {
    gap: 4,
    marginTop: 4,
  },
  interestsScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  interestChipText: {
    fontSize: 10,
  },
});
