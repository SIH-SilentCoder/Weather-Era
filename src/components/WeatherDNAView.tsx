import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { WeatherDNA } from '../types';
import { radii, spacing } from '../theme';

interface DnaArchetype {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  values: Partial<WeatherDNA>;
}

export const WeatherDNAView: React.FC = () => {
  const { theme, weatherDNA, updateDNA, resetDNA, t } = useApp();
  const [activeArchetype, setActiveArchetype] = useState<string | null>(null);

  // 1-Tap Preset DNA Archetypes
  const ARCHETYPES: DnaArchetype[] = [
    {
      id: 'commuter',
      name: 'Urban Commuter',
      icon: 'car-multiple',
      tagline: 'Prioritizes highway routes, underpasses & departure delays',
      values: {
        commuteFrequency: 5,
        rainSensitivity: 4,
        windSquallSensitivity: 4,
        aqiSensitivity: 3,
        agricultureFocus: 1,
        outdoorSports: 2,
        lightningStormSensitivity: 4,
      }
    },
    {
      id: 'farmer',
      name: 'Kisan / Agro Care',
      icon: 'sprout',
      tagline: 'Prioritizes soil moisture, rain, spraying & lightning',
      values: {
        agricultureFocus: 5,
        rainSensitivity: 5,
        lightningStormSensitivity: 5,
        windSquallSensitivity: 4,
        commuteFrequency: 1,
        aqiSensitivity: 2,
        outdoorSports: 1,
      }
    },
    {
      id: 'clean_air',
      name: 'Sensitive Health / AQI',
      icon: 'air-filter',
      tagline: 'Prioritizes PM2.5, respiratory alerts & heat index',
      values: {
        aqiSensitivity: 5,
        temperatureSensitivity: 4,
        rainSensitivity: 3,
        commuteFrequency: 3,
        agricultureFocus: 1,
        outdoorSports: 1,
        lightningStormSensitivity: 3,
      }
    },
    {
      id: 'athlete',
      name: 'Outdoor Athlete',
      icon: 'run-fast',
      tagline: 'Prioritizes workout hours, uv index & gusty winds',
      values: {
        outdoorSports: 5,
        temperatureSensitivity: 4,
        rainSensitivity: 4,
        windSquallSensitivity: 4,
        aqiSensitivity: 4,
        commuteFrequency: 2,
        agricultureFocus: 1,
      }
    },
    {
      id: 'disaster_watch',
      name: 'Storm Watcher',
      icon: 'weather-lightning',
      tagline: 'Maximum safety priority on lightning, squalls & downpours',
      values: {
        lightningStormSensitivity: 5,
        windSquallSensitivity: 5,
        rainSensitivity: 5,
        commuteFrequency: 4,
        aqiSensitivity: 3,
        outdoorSports: 1,
        agricultureFocus: 2,
      }
    }
  ];

  // 8 Granular Controllable Weather Dimensions
  const SLIDERS = [
    { 
      key: 'rainSensitivity' as const, 
      label: 'Precipitation & Rain Risk', 
      desc: 'Controls downpours, waterlogging & waterproof gear advisories',
      icon: 'weather-pouring', 
      color: '#0284C7' 
    },
    { 
      key: 'commuteFrequency' as const, 
      label: 'Daily Commute & Transit Routes', 
      desc: 'Controls highway checkpoints, underpass pooling & What-If simulators',
      icon: 'car-multiple', 
      color: '#8B5CF6' 
    },
    { 
      key: 'aqiSensitivity' as const, 
      label: 'Air Quality (AQI) & PM2.5', 
      desc: 'Controls bronchial health precautions, mask guidance & dust alerts',
      icon: 'air-filter', 
      color: '#EF4444' 
    },
    { 
      key: 'temperatureSensitivity' as const, 
      label: 'Temperature & Heat / Cold Stress', 
      desc: 'Controls solar UV warnings, hydration reminders & cold wave alerts',
      icon: 'thermometer', 
      color: '#F97316' 
    },
    { 
      key: 'agricultureFocus' as const, 
      label: 'Agriculture, Soil & Spraying', 
      desc: 'Controls agromet crop advisories, evapotranspiration & spray windows',
      icon: 'sprout', 
      color: '#16A34A' 
    },
    { 
      key: 'outdoorSports' as const, 
      label: 'Outdoor Sports & Recreation', 
      desc: 'Controls optimal running/cycling hours & athletic heat index',
      icon: 'run', 
      color: '#F59E0B' 
    },
    { 
      key: 'lightningStormSensitivity' as const, 
      label: 'Lightning & Convective Storms', 
      desc: 'Controls cloud-to-ground strike warnings & immediate indoor shelter',
      icon: 'weather-lightning', 
      color: '#EAB308' 
    },
    { 
      key: 'windSquallSensitivity' as const, 
      label: 'High Winds & Squall Hazards', 
      desc: 'Controls flyover crosswind warnings, two-wheeler stability & coastal gales',
      icon: 'weather-windy', 
      color: '#06B6D4' 
    },
  ];

  const getPriorityLabel = (val: number) => {
    if (val >= 5) return 'Critical (5/5)';
    if (val === 4) return 'High (4/5)';
    if (val === 3) return 'Medium (3/5)';
    if (val === 2) return 'Low (2/5)';
    return 'Ignored (1/5)';
  };

  const applyArchetype = (arc: DnaArchetype) => {
    setActiveArchetype(arc.id);
    Object.entries(arc.values).forEach(([k, v]) => {
      updateDNA(k as keyof WeatherDNA, v);
    });
  };

  // Compute live homepage impact description
  const getActiveImpactSummary = () => {
    const highlights: string[] = [];
    if (weatherDNA.rainSensitivity >= 4) highlights.push('Rain & Waterlogging');
    if (weatherDNA.commuteFrequency >= 4) highlights.push('Highway Commute Checkpoints');
    if (weatherDNA.aqiSensitivity >= 4) highlights.push('Air Quality & Health Guidance');
    if (weatherDNA.agricultureFocus >= 4) highlights.push('Agromet Crop Advisories');
    if (weatherDNA.outdoorSports >= 4) highlights.push('Outdoor Activity Windows');
    if ((weatherDNA.lightningStormSensitivity || 3) >= 4) highlights.push('Convective Lightning Warnings');

    if (highlights.length === 0) return 'Standard balanced IMD homepage sequence active.';
    return `Your homepage directly prioritizes: ${highlights.join(', ')}. Cards matching these dimensions are automatically elevated to top rank.`;
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="dna" size={22} color={theme.accent} />
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              🧬 WEATHER DNA PROFILE
            </Text>
            <Text style={[styles.subhead, { color: theme.textSecondary }]}>
              {t.weatherDnaTitle} • Controllable User Priority Profile
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.resetBtn, { borderColor: theme.border, backgroundColor: theme.surfaceSubtle }]}
          onPress={() => {
            setActiveArchetype(null);
            resetDNA();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={13} color={theme.textMuted} />
          <Text style={[styles.resetBtnText, { color: theme.textMuted }]}>{t.resetDna}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Customize exactly what weather parameters matter to your daily life. Your Weather DNA mathematically adjusts homepage card sequencing, alert sensitivities, and What-If departure thresholds.
      </Text>

      {/* 1-Tap Preset DNA Archetypes */}
      <View style={styles.archetypesSection}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
          1-TAP PRESET PROFILES:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.archetypesScroll}>
          {ARCHETYPES.map((arc) => {
            const isSelected = activeArchetype === arc.id;
            return (
              <TouchableOpacity
                key={arc.id}
                style={[
                  styles.archetypeChip,
                  { 
                    backgroundColor: isSelected ? theme.primaryLight : theme.surfaceSubtle,
                    borderColor: isSelected ? theme.primary : theme.border,
                  }
                ]}
                onPress={() => applyArchetype(arc)}
                activeOpacity={0.8}
              >
                <View style={styles.archetypeTop}>
                  <MaterialCommunityIcons name={arc.icon as any} size={16} color={isSelected ? theme.primary : theme.textPrimary} />
                  <Text style={[styles.archetypeName, { color: isSelected ? theme.primary : theme.textPrimary, fontWeight: isSelected ? '800' : '600' }]}>
                    {arc.name}
                  </Text>
                </View>
                <Text style={[styles.archetypeTagline, { color: theme.textMuted }]} numberOfLines={1}>
                  {arc.tagline}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Live Homepage Transformation Banner */}
      <View style={[styles.liveImpactBanner, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        <View style={styles.liveImpactTitleRow}>
          <Ionicons name="sparkles" size={15} color={theme.primary} />
          <Text style={[styles.liveImpactHeading, { color: theme.primary }]}>
            How Your DNA Shapes Your Homepage:
          </Text>
        </View>
        <Text style={[styles.liveImpactText, { color: theme.textPrimary }]}>
          {getActiveImpactSummary()}
        </Text>
      </View>

      {/* 8 Controllable Weather Dimensions List */}
      <View style={styles.slidersList}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted, marginBottom: 4 }]}>
          FINE-GRAINED PARAMETER CONTROLS (TAP 1-5 TO ADJUST):
        </Text>

        {SLIDERS.map((s) => {
          const currentVal = (weatherDNA[s.key] as number) || 3;
          return (
            <View key={s.key} style={[styles.sliderRow, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
              <View style={[styles.sliderIconBox, { backgroundColor: s.color + '18' }]}>
                <MaterialCommunityIcons name={s.icon as any} size={20} color={s.color} />
              </View>

              <View style={styles.sliderInfoCol}>
                <View style={styles.sliderLabelRow}>
                  <Text style={[styles.sliderName, { color: theme.textPrimary }]}>{s.label}</Text>
                  <View style={[styles.priorityPill, { backgroundColor: s.color + '20' }]}>
                    <Text style={[styles.sliderPriority, { color: s.color }]}>
                      {getPriorityLabel(currentVal)}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.sliderDesc, { color: theme.textMuted }]}>
                  {s.desc}
                </Text>

                {/* 5-step interactive rating bar */}
                <View style={styles.stepRatingRow}>
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isFilled = lvl <= currentVal;
                    return (
                      <TouchableOpacity
                        key={lvl}
                        style={[
                          styles.stepPill,
                          {
                            backgroundColor: isFilled ? s.color : theme.border,
                          }
                        ]}
                        onPress={() => {
                          setActiveArchetype(null);
                          updateDNA(s.key, lvl);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.stepNumber, { color: isFilled ? '#FFFFFF' : theme.textMuted }]}>
                          {lvl}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Automated Learning Control & Privacy */}
      <View style={[styles.pauseRow, { borderColor: theme.border, backgroundColor: theme.surfaceSubtle }]}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={styles.pauseHeaderRow}>
            <Ionicons name="pause-circle-outline" size={16} color={weatherDNA.learningPaused ? theme.alertOrange : theme.primary} />
            <Text style={[styles.pauseTitle, { color: theme.textPrimary }]}>
              {t.pauseLearning}
            </Text>
          </View>
          <Text style={[styles.pauseSub, { color: theme.textMuted }]}>
            Freeze your profile so automated behavioral adaptations and algorithmic weight shifts are paused.
          </Text>
        </View>
        <Switch
          value={weatherDNA.learningPaused}
          onValueChange={(val) => updateDNA('learningPaused', val)}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Data Sovereignty Guarantee */}
      <View style={styles.privacyRow}>
        <Ionicons name="lock-closed" size={13} color={theme.alertGreen} />
        <Text style={[styles.privacyText, { color: theme.textMuted }]}>
          100% On-Device Storage • Encrypted in local AsyncStorage • Zero Cloud Profiling (DPDP & MoES Compliant)
        </Text>
      </View>
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
    marginBottom: spacing.xs,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subhead: {
    fontSize: 11,
    marginTop: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radii.md,
  },
  resetBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  archetypesSection: {
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  archetypesScroll: {
    flexDirection: 'row',
  },
  archetypeChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.md,
    borderWidth: 1,
    marginRight: 8,
    width: 170,
  },
  archetypeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  archetypeName: {
    fontSize: 11,
  },
  archetypeTagline: {
    fontSize: 9,
    lineHeight: 13,
  },
  liveImpactBanner: {
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  liveImpactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  liveImpactHeading: {
    fontSize: 11,
    fontWeight: '800',
  },
  liveImpactText: {
    fontSize: 11,
    lineHeight: 16,
  },
  slidersList: {
    gap: 8,
    marginBottom: spacing.sm,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 12,
  },
  sliderIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderInfoCol: {
    flex: 1,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  sliderName: {
    fontSize: 12,
    fontWeight: '700',
  },
  priorityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  sliderPriority: {
    fontSize: 10,
    fontWeight: '800',
  },
  sliderDesc: {
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 6,
  },
  stepRatingRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepPill: {
    flex: 1,
    height: 18,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 9,
    fontWeight: '800',
  },
  pauseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  pauseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  pauseTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  pauseSub: {
    fontSize: 10,
    lineHeight: 14,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  privacyText: {
    fontSize: 9,
    lineHeight: 13,
  },
});
