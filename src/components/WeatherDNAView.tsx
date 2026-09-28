import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export const WeatherDNAView: React.FC = () => {
  const { theme, weatherDNA, updateDNA, resetDNA, t } = useApp();

  const sliders = [
    { key: 'rainSensitivity' as const, label: t.rainSensitivity, icon: 'weather-pouring', color: '#0284C7' },
    { key: 'temperatureSensitivity' as const, label: t.tempSensitivity, icon: 'thermometer', color: '#F97316' },
    { key: 'aqiSensitivity' as const, label: t.aqiSensitivity, icon: 'air-filter', color: '#EF4444' },
    { key: 'commuteFrequency' as const, label: t.commuteFactor, icon: 'car-multiple', color: '#8B5CF6' },
    { key: 'agricultureFocus' as const, label: t.agriFocus, icon: 'sprout', color: '#16A34A' },
    { key: 'outdoorSports' as const, label: 'Outdoor Activities & Sports', icon: 'run', color: '#F59E0B' },
  ];

  const getPriorityLabel = (val: number) => {
    if (val >= 5) return 'Critical (5/5)';
    if (val === 4) return 'High (4/5)';
    if (val === 3) return 'Medium (3/5)';
    if (val === 2) return 'Low (2/5)';
    return 'Ignored (1/5)';
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="dna" size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {t.weatherDnaTitle}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.resetBtn, { borderColor: theme.border }]}
          onPress={resetDNA}
        >
          <Ionicons name="refresh" size={13} color={theme.textMuted} />
          <Text style={[styles.resetBtnText, { color: theme.textMuted }]}>{t.resetDna}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {t.weatherDnaDesc}
      </Text>

      {/* Transparent Sliders / Steppers */}
      <View style={styles.slidersList}>
        {sliders.map((s) => {
          const currentVal = weatherDNA[s.key] as number;
          return (
            <View key={s.key} style={[styles.sliderRow, { backgroundColor: theme.surfaceSubtle }]}>
              <View style={[styles.sliderIconBox, { backgroundColor: s.color + '18' }]}>
                <MaterialCommunityIcons name={s.icon as any} size={18} color={s.color} />
              </View>

              <View style={styles.sliderInfoCol}>
                <View style={styles.sliderLabelRow}>
                  <Text style={[styles.sliderName, { color: theme.textPrimary }]}>{s.label}</Text>
                  <Text style={[styles.sliderPriority, { color: s.color }]}>
                    {getPriorityLabel(currentVal)}
                  </Text>
                </View>

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
                        onPress={() => updateDNA(s.key, lvl)}
                      />
                    );
                  })}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Pause Learning Control */}
      <View style={[styles.pauseRow, { borderColor: theme.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.pauseTitle, { color: theme.textPrimary }]}>
            {t.pauseLearning}
          </Text>
          <Text style={[styles.pauseSub, { color: theme.textMuted }]}>
            Freeze your personal weather profile and stop automatic behavioral adjustments.
          </Text>
        </View>
        <Switch
          value={weatherDNA.learningPaused}
          onValueChange={(val) => updateDNA('learningPaused', val)}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor="#FFFFFF"
        />
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
    marginBottom: 2,
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
  subtitle: {
    fontSize: 12,
    marginBottom: spacing.md,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  resetBtnText: {
    fontSize: 10,
    fontWeight: '600',
  },
  slidersList: {
    gap: 10,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radii.lg,
    gap: 12,
  },
  sliderIconBox: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
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
    marginBottom: 6,
  },
  sliderName: {
    fontSize: 12,
    fontWeight: '600',
  },
  sliderPriority: {
    fontSize: 10,
    fontWeight: '700',
  },
  stepRatingRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepPill: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  pauseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  pauseTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  pauseSub: {
    fontSize: 11,
    marginTop: 2,
  },
});
