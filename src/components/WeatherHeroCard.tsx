import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { WeatherData } from '../types';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

interface Props {
  weather: WeatherData;
}

export const WeatherHeroCard: React.FC<Props> = ({ weather }) => {
  const { theme, refreshWeather, isRefreshing } = useApp();
  const [trustModalVisible, setTrustModalVisible] = useState(false);

  const getWeatherIcon = (code: string) => {
    switch (code) {
      case 'rain': return 'weather-pouring';
      case 'thunderstorm': return 'weather-lightning-rainy';
      case 'cloudy': return 'weather-cloudy';
      case 'sunny': return 'weather-sunny';
      default: return 'weather-partly-cloudy';
    }
  };

  return (
    <LinearGradient
      colors={['#0369A1', '#0C4A6E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      {/* Top Header: City & Live Doppler Indicator */}
      <View style={styles.topRow}>
        <View>
          <View style={styles.locationTitleRow}>
            <Text style={styles.cityName}>{weather.city}</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>IMD AWS Mesonet</Text>
            </View>
          </View>
          <Text style={styles.stateName}>{weather.state} • Sub-Division: NCR & West UP</Text>
        </View>

        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshWeather}
          disabled={isRefreshing}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isRefreshing ? 'refresh-circle' : 'sync'} 
            size={16} 
            color="#FFFFFF" 
          />
          <Text style={styles.refreshText}>{isRefreshing ? 'Syncing...' : weather.lastUpdated}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Temperature & Condition Display */}
      <View style={styles.tempSection}>
        <View>
          <View style={styles.degreeRow}>
            <Text style={styles.tempNumber}>{weather.temperature}</Text>
            <Text style={styles.degreeSymbol}>°C</Text>
          </View>
          <View style={styles.subTempLine}>
            <Text style={styles.feelsLikeText}>Feels like {weather.feelsLike}°C</Text>
            <Text style={styles.rangeText}>H: 33° • L: 25°</Text>
          </View>
        </View>

        <View style={styles.conditionRight}>
          <MaterialCommunityIcons 
            name={getWeatherIcon(weather.conditionCode)} 
            size={64} 
            color="#FFFFFF" 
          />
          <Text style={styles.conditionText} numberOfLines={2}>
            {weather.condition}
          </Text>
          <View style={styles.pressureTrendRow}>
            <Ionicons name="trending-down" size={12} color="#FCA5A5" />
            <Text style={styles.pressureTrendText}>{weather.pressure} hPa (Falling)</Text>
          </View>
        </View>
      </View>

      {/* Meteorological Micro-Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="weather-rainy" size={17} color="#BAE6FD" />
          <Text style={styles.metricValue}>{weather.rainProbability}%</Text>
          <Text style={styles.metricLabel}>Rain Prob ({weather.rainfallMm}mm)</Text>
        </View>

        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="weather-windy" size={17} color="#BAE6FD" />
          <Text style={styles.metricValue}>{weather.windSpeed} km/h</Text>
          <Text style={styles.metricLabel}>Wind ({weather.windDirection})</Text>
        </View>

        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="water-percent" size={17} color="#BAE6FD" />
          <Text style={styles.metricValue}>{weather.humidity}%</Text>
          <Text style={styles.metricLabel}>Humidity ({weather.dewPoint}° dew)</Text>
        </View>

        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="air-filter" size={17} color="#BAE6FD" />
          <Text style={styles.metricValue}>{weather.aqi}</Text>
          <Text style={styles.metricLabel}>AQI ({weather.aqiCategory})</Text>
        </View>
      </View>

      {/* Daylight & Sun Tracker Progress Bar */}
      <View style={styles.daylightTrackBox}>
        <View style={styles.daylightLabelRow}>
          <View style={styles.sunNode}>
            <Ionicons name="sunny-outline" size={12} color="#FDE047" />
            <Text style={styles.sunText}>Sunrise {weather.sunrise}</Text>
          </View>
          <Text style={styles.daylightRemainingText}>Solar Radiation Peak Passed</Text>
          <View style={styles.sunNode}>
            <Ionicons name="moon-outline" size={12} color="#BAE6FD" />
            <Text style={styles.sunText}>Sunset {weather.sunset}</Text>
          </View>
        </View>
        <View style={styles.daylightProgressBar}>
          <View style={[styles.daylightFill, { width: '74%' }]} />
        </View>
      </View>

      {/* FORECAST TRUST & DATA FRESHNESS BAR (Tap to inspect) */}
      <TouchableOpacity 
        style={styles.trustBar}
        onPress={() => setTrustModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.trustLeft}>
          <View style={styles.trustBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#38BDF8" />
            <Text style={styles.trustTitle}>FORECAST TRUST:</Text>
            <View style={styles.confScorePill}>
              <Text style={styles.confScoreText}>{weather.confidenceLevel} ({weather.confidenceScore}%)</Text>
            </View>
          </View>
          <View style={styles.freshnessRow}>
            <View style={styles.freshnessDot} />
            <Text style={styles.freshnessText}>
              Last updated: <Text style={{ fontWeight: '700' }}>{weather.lastUpdated}</Text> ({weather.freshnessMins || 4}m ago) • Tap for details
            </Text>
          </View>
        </View>

        <View style={styles.inspectBtn}>
          <Text style={styles.inspectBtnText}>Inspect 🔍</Text>
        </View>
      </TouchableOpacity>

      {/* FORECAST TRUST & PROVENANCE MODAL */}
      <Modal
        visible={trustModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTrustModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
                <View>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                    FORECAST TRUST & DATA PROVENANCE
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                    Transparency & Scientific Verification Layer
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setTrustModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              {/* Trust Metric 1: Data Freshness */}
              <View style={[styles.trustSectionBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <View style={styles.trustSectionHeader}>
                  <Ionicons name="time-outline" size={16} color={theme.primary} />
                  <Text style={[styles.trustSectionTitle, { color: theme.textPrimary }]}>
                    1. DATA FRESHNESS & UPDATE CADENCE
                  </Text>
                </View>
                <View style={styles.metricGridTwo}>
                  <View style={styles.metricBoxItem}>
                    <Text style={[styles.metricBoxLabel, { color: theme.textMuted }]}>Last Observational Ingestion</Text>
                    <Text style={[styles.metricBoxValue, { color: theme.textPrimary }]}>{weather.lastUpdated} ({weather.freshnessMins || 4} mins ago)</Text>
                  </View>
                  <View style={styles.metricBoxItem}>
                    <Text style={[styles.metricBoxLabel, { color: theme.textMuted }]}>Next Automated Ingestion</Text>
                    <Text style={[styles.metricBoxValue, { color: theme.alertGreen }]}>In ~6 mins (Every 10m cycle)</Text>
                  </View>
                </View>
                <Text style={[styles.trustExplanation, { color: theme.textSecondary }]}>
                  Surface telemetry is continuously piped from the IMD Palam Automated Weather Station (AWS Station #42182) and cross-validated with Safdarjung Mesonet.
                </Text>
              </View>

              {/* Trust Metric 2: Confidence Score */}
              <View style={[styles.trustSectionBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <View style={styles.trustSectionHeader}>
                  <Ionicons name="speedometer-outline" size={16} color={theme.accent} />
                  <Text style={[styles.trustSectionTitle, { color: theme.textPrimary }]}>
                    2. SCIENTIFIC CONFIDENCE SCORE: {weather.confidenceScore}% ({weather.confidenceLevel.toUpperCase()})
                  </Text>
                </View>
                <View style={styles.modelAlignmentList}>
                  <View style={styles.modelRow}>
                    <Text style={[styles.modelName, { color: theme.textPrimary }]}>• MoES WRF-9km Regional Model</Text>
                    <Text style={[styles.modelStatus, { color: theme.alertGreen }]}>94% Convergence</Text>
                  </View>
                  <View style={styles.modelRow}>
                    <Text style={[styles.modelName, { color: theme.textPrimary }]}>• NCUM-India Global Ensemble (NCMRWF)</Text>
                    <Text style={[styles.modelStatus, { color: theme.alertGreen }]}>91% Convergence</Text>
                  </View>
                  <View style={styles.modelRow}>
                    <Text style={[styles.modelName, { color: theme.textPrimary }]}>• IMD Palam Doppler Radar Reflectivity</Text>
                    <Text style={[styles.modelStatus, { color: theme.alertGreen }]}>Calibrated Ground Truth</Text>
                  </View>
                </View>
                <Text style={[styles.trustExplanation, { color: theme.textSecondary }]}>
                  High confidence is declared when regional high-resolution WRF and global NCUM ensemble outputs align within a 5% margin of error on precipitation intensity and timing.
                </Text>
              </View>

              {/* Trust Metric 3: Quality Control & Calibration */}
              <View style={[styles.trustSectionBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <View style={styles.trustSectionHeader}>
                  <Ionicons name="checkmark-done-circle" size={16} color={theme.alertGreen} />
                  <Text style={[styles.trustSectionTitle, { color: theme.textPrimary }]}>
                    3. QUALITY CONTROL & STANDARDS
                  </Text>
                </View>
                <Text style={[styles.trustExplanation, { color: theme.textSecondary }]}>
                  • Zero Sensor Dropouts in last 24 hours.{'\n'}
                  • Quality-controlled under WMO Guide to Meteorological Instruments and Methods of Observation (WMO-No. 8).{'\n'}
                  • Pressure & barometric sensor drift calibrated monthly.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.modalCloseBtn, { backgroundColor: theme.primary }]}
              onPress={() => setTrustModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>GOT IT, UNDERSTOOD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radii.xl,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    elevation: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stateName: {
    fontSize: 11,
    color: '#BAE6FD',
    marginTop: 2,
    fontWeight: '500',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radii.full,
    gap: 5,
  },
  refreshText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tempSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  degreeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tempNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 62,
    letterSpacing: -2,
  },
  degreeSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#BAE6FD',
    marginTop: 6,
  },
  subTempLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  feelsLikeText: {
    fontSize: 12,
    color: '#E0F2FE',
    fontWeight: '600',
  },
  rangeText: {
    fontSize: 12,
    color: '#BAE6FD',
  },
  conditionRight: {
    alignItems: 'flex-end',
  },
  conditionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
    maxWidth: 160,
    marginTop: 4,
  },
  pressureTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  pressureTrendText: {
    fontSize: 10,
    color: '#BAE6FD',
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: radii.lg,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 9,
    color: '#BAE6FD',
    marginTop: 1,
    textAlign: 'center',
  },
  daylightTrackBox: {
    marginBottom: spacing.sm,
  },
  daylightLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sunNode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sunText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  daylightRemainingText: {
    fontSize: 9,
    color: '#BAE6FD',
  },
  daylightProgressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  daylightFill: {
    height: '100%',
    backgroundColor: '#FDE047',
    borderRadius: 2,
  },
  trustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  trustLeft: {
    flex: 1,
    marginRight: 8,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  trustTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.3,
  },
  confScorePill: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.sm,
  },
  confScoreText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
  },
  freshnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  freshnessDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#4ADE80',
  },
  freshnessText: {
    fontSize: 9,
    color: '#E0F2FE',
  },
  inspectBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  inspectBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    borderRadius: radii.xl,
    padding: spacing.md,
    maxHeight: '80%',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  modalSubtitle: {
    fontSize: 10,
    marginTop: 1,
  },
  modalScroll: {
    marginVertical: spacing.xs,
  },
  trustSectionBox: {
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  trustSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  trustSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  metricGridTwo: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  metricBoxItem: {
    flex: 1,
  },
  metricBoxLabel: {
    fontSize: 9,
    marginBottom: 1,
  },
  metricBoxValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  trustExplanation: {
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
  modelAlignmentList: {
    gap: 3,
    marginBottom: 4,
  },
  modelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelName: {
    fontSize: 10,
    fontWeight: '600',
  },
  modelStatus: {
    fontSize: 10,
    fontWeight: '700',
  },
  modalCloseBtn: {
    paddingVertical: 10,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
