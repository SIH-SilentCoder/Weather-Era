import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      {/* Top Header: City & Trust Metadata */}
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

      {/* Trust & Scientific Model Consensus Footer */}
      <View style={styles.trustFooter}>
        <View style={styles.trustBadge}>
          <Ionicons name="shield-checkmark-sharp" size={13} color="#38BDF8" />
          <Text style={styles.trustText}>
            Confidence: <Text style={{ fontWeight: '800' }}>{weather.confidenceLevel} ({weather.confidenceScore}%)</Text>
          </Text>
        </View>
        <Text style={styles.sourceText} numberOfLines={1}>
          Consensus: WRF-9km + GFS-12km + NCUM Validated
        </Text>
      </View>
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
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    gap: 4,
  },
  refreshText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  degreeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tempNumber: {
    fontSize: 58,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 62,
    letterSpacing: -2,
  },
  degreeSymbol: {
    fontSize: 22,
    fontWeight: '600',
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
    fontSize: 11,
    color: '#BAE6FD',
  },
  conditionRight: {
    alignItems: 'flex-end',
    maxWidth: 160,
  },
  conditionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
    marginTop: 2,
  },
  pressureTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  pressureTrendText: {
    fontSize: 10,
    color: '#BAE6FD',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 9,
    color: '#BAE6FD',
    marginTop: 1,
  },
  daylightTrackBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: radii.md,
    padding: spacing.xs,
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
    gap: 3,
  },
  sunText: {
    fontSize: 9,
    color: '#E0F2FE',
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
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    paddingTop: spacing.xs,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 10,
    color: '#BAE6FD',
  },
  sourceText: {
    fontSize: 9,
    color: '#E0F2FE',
    maxWidth: 220,
  },
});
