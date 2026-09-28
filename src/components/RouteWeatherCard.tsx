import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { calculateRouteWeather, POPULAR_ROUTES } from '../services/routeEngine';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

const RouteWeatherCardComponent: React.FC = () => {
  const { theme, t } = useApp();
  const [selectedRouteId, setSelectedRouteId] = useState(POPULAR_ROUTES[0].id);
  const [origin, setOrigin] = useState(POPULAR_ROUTES[0].origin);
  const [destination, setDestination] = useState(POPULAR_ROUTES[0].destination);
  const [routeData, setRouteData] = useState(() => calculateRouteWeather(origin, destination));
  const [expandedCheckpointId, setExpandedCheckpointId] = useState<string | null>(null);

  const handleRouteSelect = (preset: typeof POPULAR_ROUTES[0]) => {
    setSelectedRouteId(preset.id);
    setOrigin(preset.origin);
    setDestination(preset.destination);
    setRouteData(calculateRouteWeather(preset.origin, preset.destination));
    setExpandedCheckpointId(null);
  };

  const handleAnalyze = () => {
    setRouteData(calculateRouteWeather(origin, destination));
    setExpandedCheckpointId(null);
  };

  const toggleCheckpoint = (id: string) => {
    setExpandedCheckpointId(prev => (prev === id ? null : id));
  };

  const hazardousCount = routeData.checkpoints.filter(cp => cp.isHazardous).length;

  const getStatusColor = (status?: 'clear' | 'caution' | 'danger') => {
    if (status === 'danger') return theme.alertRed;
    if (status === 'caution') return theme.alertOrange;
    return theme.alertGreen;
  };

  const getStatusBg = (status?: 'clear' | 'caution' | 'danger') => {
    if (status === 'danger') return theme.alertRedBg;
    if (status === 'caution') return theme.alertOrangeBg;
    return theme.alertGreenBg;
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="routes" size={20} color={theme.secondary} />
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              START ➔ DESTINATION WEATHER CHECKPOINTS
            </Text>
            <Text style={[styles.subhead, { color: theme.textSecondary }]}>
              {t.routeSubtitle}
            </Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.badgeText, { color: theme.primary }]}>CORRIDOR RADAR</Text>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Live micro-climate telemetry at key highway checkpoints. Detects underpass flooding, localized squalls, crosswinds, and visibility drop between origin and destination nodes.
      </Text>

      {/* Preset Corridor Selector Buttons */}
      <View style={styles.presetsContainer}>
        <Text style={[styles.presetsHeading, { color: theme.textMuted }]}>
          POPULAR NATIONAL HIGHWAY & TRANSIT CORRIDORS:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
          {POPULAR_ROUTES.map((r) => {
            const isSelected = r.id === selectedRouteId;
            return (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.presetChip,
                  { 
                    backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle,
                    borderColor: isSelected ? theme.primary : theme.border,
                  }
                ]}
                onPress={() => handleRouteSelect(r)}
                activeOpacity={0.8}
              >
                <Text style={[styles.presetText, { color: isSelected ? '#FFFFFF' : theme.textPrimary, fontWeight: isSelected ? '700' : '600' }]}>
                  {r.name}
                </Text>
                <Text style={[styles.presetSubtext, { color: isSelected ? 'rgba(255,255,255,0.85)' : theme.textMuted }]}>
                  {r.totalDistanceKm} km • {r.estimatedDurationMins}m
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Origin & Destination Inputs */}
      <View style={[styles.inputBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        <View style={styles.inputRow}>
          <Ionicons name="radio-button-on" size={16} color={theme.alertGreen} />
          <View style={styles.inputCol}>
            <Text style={[styles.inputFieldLabel, { color: theme.textMuted }]}>ORIGIN NODE (START)</Text>
            <TextInput
              style={[styles.textInput, { color: theme.textPrimary }]}
              value={origin}
              onChangeText={setOrigin}
              placeholder={t.fromLocation}
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>

        <View style={[styles.inputDivider, { backgroundColor: theme.border }]} />

        <View style={styles.inputRow}>
          <Ionicons name="location" size={16} color={theme.alertRed} />
          <View style={styles.inputCol}>
            <Text style={[styles.inputFieldLabel, { color: theme.textMuted }]}>DESTINATION NODE (END)</Text>
            <TextInput
              style={[styles.textInput, { color: theme.textPrimary }]}
              value={destination}
              onChangeText={setDestination}
              placeholder={t.toLocation}
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.analyzeButton, { backgroundColor: theme.primary }]}
        onPress={handleAnalyze}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="radar" size={16} color="#FFFFFF" />
        <Text style={styles.analyzeButtonText}>ANALYZE CORRIDOR CHECKPOINTS & WEATHER</Text>
      </TouchableOpacity>

      {/* Corridor Summary Banner */}
      <View style={[styles.corridorSummaryRow, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        <View style={styles.summaryMetricItem}>
          <Text style={[styles.summaryMetricLabel, { color: theme.textMuted }]}>Total Corridor Distance</Text>
          <Text style={[styles.summaryMetricValue, { color: theme.textPrimary }]}>{routeData.totalDistanceKm} km</Text>
        </View>
        <View style={styles.summaryMetricDivider} />
        <View style={styles.summaryMetricItem}>
          <Text style={[styles.summaryMetricLabel, { color: theme.textMuted }]}>Transit Travel ETA</Text>
          <Text style={[styles.summaryMetricValue, { color: theme.textPrimary }]}>~{routeData.estimatedDurationMins} mins</Text>
        </View>
        <View style={styles.summaryMetricDivider} />
        <View style={styles.summaryMetricItem}>
          <Text style={[styles.summaryMetricLabel, { color: theme.textMuted }]}>High Hazard Nodes</Text>
          <Text style={[styles.summaryMetricValue, { color: hazardousCount > 0 ? theme.alertRed : theme.alertGreen }]}>
            {hazardousCount} Landmark{hazardousCount === 1 ? '' : 's'}
          </Text>
        </View>
      </View>

      {/* Corridor Convective Warning Banner */}
      {routeData.routeAlert && (
        <View style={[styles.corridorAlert, { backgroundColor: theme.alertOrangeBg, borderColor: theme.alertOrange }]}>
          <Ionicons name="warning" size={18} color={theme.alertOrange} />
          <View style={styles.alertContentCol}>
            <Text style={[styles.alertHeading, { color: theme.alertOrange }]}>
              IMD HIGHWAY MESONET NOWCAST ALERT:
            </Text>
            <Text style={[styles.corridorAlertText, { color: theme.textPrimary }]}>
              {routeData.routeAlert}
            </Text>
          </View>
        </View>
      )}

      {/* Checkpoints Step Timeline */}
      <View style={styles.checkpointsSection}>
        <View style={styles.checkpointsHeaderRow}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
            Micro-Climate Nodes Along Corridor:
          </Text>
          <Text style={[styles.tapHintText, { color: theme.textMuted }]}>
            Tap any checkpoint to inspect safety guidance
          </Text>
        </View>

        <View style={styles.checkpointsTimeline}>
          {routeData.checkpoints.map((cp, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === routeData.checkpoints.length - 1;
            const isExpanded = expandedCheckpointId === cp.id;
            const statusColor = getStatusColor(cp.corridorStatus);
            const statusBg = getStatusBg(cp.corridorStatus);

            return (
              <View key={cp.id} style={styles.checkpointItem}>
                {/* Vertical Timeline Node Graphic */}
                <View style={styles.timelineCol}>
                  <View 
                    style={[
                      styles.nodeDot, 
                      { 
                        backgroundColor: isFirst ? theme.alertGreen : isLast ? theme.primary : statusColor,
                        borderColor: theme.surface 
                      }
                    ]} 
                  >
                    {isFirst && <Ionicons name="radio-button-on" size={10} color="#FFFFFF" />}
                    {isLast && <Ionicons name="flag" size={10} color="#FFFFFF" />}
                    {!isFirst && !isLast && (
                      <View style={[styles.innerDot, { backgroundColor: '#FFFFFF' }]} />
                    )}
                  </View>
                  {!isLast && <View style={[styles.nodeLine, { backgroundColor: theme.border }]} />}
                </View>

                {/* Checkpoint Detail Card */}
                <TouchableOpacity
                  style={[
                    styles.checkpointContent, 
                    { 
                      backgroundColor: cp.isHazardous ? theme.alertOrangeBg + '20' : theme.surfaceSubtle,
                      borderColor: isExpanded ? theme.primary : cp.isHazardous ? theme.alertOrange : theme.border,
                    }
                  ]}
                  onPress={() => toggleCheckpoint(cp.id)}
                  activeOpacity={0.8}
                >
                  {/* Top Row: Name, Distance & ETA */}
                  <View style={styles.checkpointTopRow}>
                    <View style={styles.checkpointTitleCol}>
                      <View style={styles.badgeLabelRow}>
                        <Text style={[styles.checkpointNodeBadge, { color: isFirst ? theme.alertGreen : isLast ? theme.primary : theme.textSecondary }]}>
                          {isFirst ? 'START NODE' : isLast ? 'DESTINATION' : `CHECKPOINT #${idx}`}
                        </Text>
                        <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
                          <Text style={[styles.statusPillText, { color: statusColor }]}>
                            {(cp.corridorStatus || (cp.isHazardous ? 'danger' : 'clear')).toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.checkpointName, { color: theme.textPrimary }]}>
                        {cp.name}
                      </Text>
                    </View>

                    <View style={styles.etaBadge}>
                      <Text style={[styles.etaText, { color: theme.textPrimary }]}>{cp.eta}</Text>
                      <Text style={[styles.distanceText, { color: theme.textMuted }]}>{cp.distanceKm} km</Text>
                    </View>
                  </View>

                  {/* Middle Row: Weather Parameters */}
                  <View style={styles.checkpointStatsRow}>
                    <View style={styles.statPill}>
                      <Ionicons name="thermometer-outline" size={13} color={theme.textSecondary} />
                      <Text style={[styles.statPillText, { color: theme.textSecondary }]}>{cp.temperature}°C</Text>
                    </View>
                    <View style={styles.statPill}>
                      <Ionicons name="rainy-outline" size={13} color={cp.rainProbability > 70 ? theme.alertRed : theme.primary} />
                      <Text style={[styles.statPillText, { color: cp.rainProbability > 70 ? theme.alertRed : theme.textSecondary, fontWeight: '700' }]}>
                        {cp.rainProbability}% Rain
                      </Text>
                    </View>
                    <View style={styles.statPill}>
                      <Ionicons name="speedometer-outline" size={13} color={theme.textSecondary} />
                      <Text style={[styles.statPillText, { color: theme.textSecondary }]}>{cp.windSpeed} km/h</Text>
                    </View>
                    {cp.visibilityKm !== undefined && (
                      <View style={styles.statPill}>
                        <Ionicons name="eye-outline" size={13} color={cp.visibilityKm < 2.0 ? theme.alertRed : theme.textSecondary} />
                        <Text style={[styles.statPillText, { color: cp.visibilityKm < 2.0 ? theme.alertRed : theme.textSecondary }]}>
                          {cp.visibilityKm} km Vis
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Road Condition / Water Ponding Bar */}
                  {cp.roadWaterLevel && (
                    <View style={styles.roadStatusRow}>
                      <MaterialCommunityIcons 
                        name={cp.roadWaterLevel.includes('Ponding') ? "waves" : "road-variant"} 
                        size={14} 
                        color={cp.isHazardous ? theme.alertRed : theme.primary} 
                      />
                      <Text style={[styles.roadStatusText, { color: cp.isHazardous ? theme.alertRed : theme.textSecondary }]}>
                        Road Surface: <Text style={{ fontWeight: '700' }}>{cp.roadWaterLevel}</Text>
                      </Text>
                    </View>
                  )}

                  {/* Hazard Callout */}
                  {cp.hazardNote && (
                    <View style={[styles.hazardCallout, { backgroundColor: cp.isHazardous ? theme.alertOrangeBg : theme.surfaceSubtle }]}>
                      <Ionicons name="warning-outline" size={14} color={cp.isHazardous ? theme.alertOrange : theme.textMuted} />
                      <Text style={[styles.hazardText, { color: cp.isHazardous ? theme.alertOrange : theme.textSecondary }]}>
                        {cp.hazardNote}
                      </Text>
                    </View>
                  )}

                  {/* Expanded Tap-to-Inspect Guidance */}
                  {isExpanded && cp.safeTransitAdvice && (
                    <View style={[styles.expandedAdviceBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <View style={styles.adviceTitleRow}>
                        <Ionicons name="shield-checkmark" size={14} color={theme.alertGreen} />
                        <Text style={[styles.adviceTitle, { color: theme.textPrimary }]}>
                          IMD Highway Safety Protocol:
                        </Text>
                      </View>
                      <Text style={[styles.adviceBody, { color: theme.textPrimary }]}>
                        {cp.safeTransitAdvice}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {/* Corridor Safe Departure Advisory Footer */}
      <View style={[styles.footerAdvisoryBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <View style={styles.footerHeaderRow}>
          <Ionicons name="car-sport" size={16} color={theme.primary} />
          <Text style={[styles.footerHeading, { color: theme.primary }]}>
            Recommended Corridor Departure Strategy:
          </Text>
        </View>
        <Text style={[styles.footerText, { color: theme.textPrimary }]}>
          {routeData.safeDepartureAdvisory}
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
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  presetsContainer: {
    marginBottom: spacing.sm,
  },
  presetsHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  presetsScroll: {
    flexDirection: 'row',
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 11,
  },
  presetSubtext: {
    fontSize: 9,
    marginTop: 1,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.xs,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  inputCol: {
    flex: 1,
  },
  inputFieldLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  textInput: {
    height: 28,
    fontSize: 12,
    fontWeight: '600',
    padding: 0,
  },
  inputDivider: {
    height: 1,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: radii.md,
    gap: 8,
    marginBottom: spacing.sm,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  corridorSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  summaryMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryMetricLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryMetricValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  summaryMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  corridorAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  alertContentCol: {
    flex: 1,
  },
  alertHeading: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  corridorAlertText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
  },
  checkpointsSection: {
    marginTop: spacing.xs,
  },
  checkpointsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingHorizontal: 2,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
  },
  tapHintText: {
    fontSize: 9,
  },
  checkpointsTimeline: {
    marginTop: 4,
  },
  checkpointItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  timelineCol: {
    width: 24,
    alignItems: 'center',
  },
  nodeDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
    borderWidth: 1,
  },
  checkpointTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  checkpointTitleCol: {
    flex: 1,
  },
  badgeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  checkpointNodeBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  statusPill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radii.sm,
  },
  statusPillText: {
    fontSize: 8,
    fontWeight: '800',
  },
  checkpointName: {
    fontSize: 13,
    fontWeight: '700',
  },
  etaBadge: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '800',
  },
  distanceText: {
    fontSize: 9,
    marginTop: 1,
  },
  checkpointStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
    flexWrap: 'wrap',
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
  roadStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  roadStatusText: {
    fontSize: 10,
    lineHeight: 14,
  },
  hazardCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
    marginTop: 5,
  },
  hazardText: {
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  expandedAdviceBox: {
    marginTop: 6,
    padding: spacing.xs,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  adviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  adviceTitle: {
    fontSize: 10,
    fontWeight: '700',
  },
  adviceBody: {
    fontSize: 11,
    lineHeight: 15,
  },
  footerAdvisoryBox: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  footerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  footerHeading: {
    fontSize: 11,
    fontWeight: '800',
  },
  footerText: {
    fontSize: 11,
    lineHeight: 16,
  },
});

export const RouteWeatherCard = React.memo(RouteWeatherCardComponent);
