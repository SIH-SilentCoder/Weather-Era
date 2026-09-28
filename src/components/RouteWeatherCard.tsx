import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { calculateRouteWeather, POPULAR_ROUTES } from '../services/routeEngine';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export const RouteWeatherCard: React.FC = () => {
  const { theme, t } = useApp();
  const [origin, setOrigin] = useState('Connaught Place, Delhi');
  const [destination, setDestination] = useState('Cyber City, Gurugram');
  const [routeData, setRouteData] = useState(() => calculateRouteWeather(origin, destination));

  const handleRouteSelect = (preset: { origin: string; destination: string }) => {
    setOrigin(preset.origin);
    setDestination(preset.destination);
    setRouteData(calculateRouteWeather(preset.origin, preset.destination));
  };

  const handleAnalyze = () => {
    setRouteData(calculateRouteWeather(origin, destination));
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="routes" size={18} color={theme.secondary} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {t.routeTitle}
          </Text>
        </View>
        <View style={[styles.demoTag, { backgroundColor: theme.surfaceSubtle }]}>
          <Text style={[styles.demoTagText, { color: theme.textMuted }]}>CORRIDOR MESONET</Text>
        </View>
      </View>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {t.routeSubtitle}
      </Text>

      {/* Preset Quick Route Chips */}
      <View style={styles.presetsRow}>
        {POPULAR_ROUTES.slice(0, 3).map((r, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.presetChip, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
            onPress={() => handleRouteSelect(r)}
          >
            <Text style={[styles.presetText, { color: theme.primary }]} numberOfLines={1}>
              {r.destination.split(',')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Origin & Destination Inputs */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Ionicons name="radio-button-on" size={16} color={theme.primary} />
          <TextInput
            style={[styles.textInput, { color: theme.textPrimary, borderColor: theme.border }]}
            value={origin}
            onChangeText={setOrigin}
            placeholder={t.fromLocation}
            placeholderTextColor={theme.textMuted}
          />
        </View>
        <View style={styles.inputRow}>
          <Ionicons name="location" size={16} color={theme.alertRed} />
          <TextInput
            style={[styles.textInput, { color: theme.textPrimary, borderColor: theme.border }]}
            value={destination}
            onChangeText={setDestination}
            placeholder={t.toLocation}
            placeholderTextColor={theme.textMuted}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.analyzeButton, { backgroundColor: theme.primary }]}
        onPress={handleAnalyze}
      >
        <MaterialCommunityIcons name="radar" size={16} color="#FFFFFF" />
        <Text style={styles.analyzeButtonText}>{t.checkRoute}</Text>
      </TouchableOpacity>

      {/* Route Corridor Alert */}
      {routeData.routeAlert && (
        <View style={[styles.corridorAlert, { backgroundColor: theme.alertOrangeBg, borderColor: theme.alertOrange }]}>
          <Ionicons name="warning-outline" size={16} color={theme.alertOrange} />
          <Text style={[styles.corridorAlertText, { color: theme.textPrimary }]}>
            {routeData.routeAlert}
          </Text>
        </View>
      )}

      {/* Checkpoints Timeline */}
      <View style={styles.checkpointsContainer}>
        {routeData.checkpoints.map((cp, idx) => {
          const isLast = idx === routeData.checkpoints.length - 1;
          return (
            <View key={cp.id} style={styles.checkpointItem}>
              {/* Timeline Connector Graphic */}
              <View style={styles.timelineCol}>
                <View 
                  style={[
                    styles.nodeDot, 
                    { 
                      backgroundColor: cp.isHazardous ? theme.alertRed : theme.primary,
                      borderColor: theme.surface 
                    }
                  ]} 
                />
                {!isLast && <View style={[styles.nodeLine, { backgroundColor: theme.border }]} />}
              </View>

              {/* Checkpoint Meteorological Data */}
              <View style={[styles.checkpointContent, { backgroundColor: cp.isHazardous ? theme.alertOrangeBg + '25' : theme.surfaceSubtle }]}>
                <View style={styles.checkpointTopRow}>
                  <Text style={[styles.checkpointName, { color: theme.textPrimary }]}>
                    {cp.name}
                  </Text>
                  <Text style={[styles.checkpointEta, { color: theme.textMuted }]}>
                    {cp.distanceKm} km • {cp.eta}
                  </Text>
                </View>

                <View style={styles.checkpointStatsRow}>
                  <View style={styles.statPill}>
                    <Ionicons name="thermometer-outline" size={13} color={theme.textSecondary} />
                    <Text style={[styles.statPillText, { color: theme.textSecondary }]}>{cp.temperature}°C</Text>
                  </View>
                  <View style={styles.statPill}>
                    <Ionicons name="rainy-outline" size={13} color={cp.rainProbability > 70 ? theme.alertRed : theme.primary} />
                    <Text style={[styles.statPillText, { color: theme.textSecondary }]}>{cp.rainProbability}% Rain</Text>
                  </View>
                  <View style={styles.statPill}>
                    <Ionicons name="speedometer-outline" size={13} color={theme.textSecondary} />
                    <Text style={[styles.statPillText, { color: theme.textSecondary }]}>{cp.windSpeed} km/h</Text>
                  </View>
                </View>

                {cp.hazardNote && (
                  <Text style={[styles.hazardText, { color: cp.isHazardous ? theme.alertOrange : theme.textMuted }]}>
                    {cp.hazardNote}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
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
  demoTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  demoTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.sm,
  },
  presetChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    maxWidth: 120,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '600',
  },
  inputContainer: {
    gap: 6,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radii.md,
    gap: 6,
    marginBottom: spacing.sm,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  corridorAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  corridorAlertText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
    fontWeight: '600',
  },
  checkpointsContainer: {
    marginTop: spacing.xs,
  },
  checkpointItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineCol: {
    width: 20,
    alignItems: 'center',
  },
  nodeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 4,
    zIndex: 1,
  },
  nodeLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  checkpointContent: {
    flex: 1,
    marginLeft: 8,
    padding: spacing.sm,
    borderRadius: radii.md,
  },
  checkpointTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkpointName: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  checkpointEta: {
    fontSize: 10,
    fontWeight: '500',
  },
  checkpointStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 2,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  hazardText: {
    fontSize: 10,
    marginTop: 3,
    fontWeight: '500',
  },
});
