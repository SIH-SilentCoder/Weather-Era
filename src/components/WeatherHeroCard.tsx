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
      colors={['#0284C7', '#0369A1']}
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
              <Text style={styles.liveText}>Live Radar</Text>
            </View>
          </View>
          <Text style={styles.stateName}>{weather.state}</Text>
        </View>

        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshWeather}
          disabled={isRefreshing}
        >
          <Ionicons 
            name={isRefreshing ? 'refresh-circle' : 'sync'} 
            size={18} 
            color="#FFFFFF" 
          />
          <Text style={styles.refreshText}>{isRefreshing ? 'Updating...' : weather.lastUpdated}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Temperature & Condition Display */}
      <View style={styles.tempSection}>
        <View>
          <View style={styles.degreeRow}>
            <Text style={styles.tempNumber}>{weather.temperature}</Text>
            <Text style={styles.degreeSymbol}>°C</Text>
          </View>
          <Text style={styles.feelsLikeText}>Feels like {weather.feelsLike}°C</Text>
        </View>

        <View style={styles.conditionRight}>
          <MaterialCommunityIcons 
            name={getWeatherIcon(weather.conditionCode)} 
            size={68} 
            color="#FFFFFF" 
          />
          <Text style={styles.conditionText} numberOfLines={2}>
            {weather.condition}
          </Text>
        </View>
      </View>

      {/* Meteorological Micro-Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="weather-rainy" size={18} color="#BAE6FD" />
          <Text style={styles.metricValue}>{weather.rainProbability}%</Text>
          <Text style={styles.metricLabel}>Rain Prob</Text>
        </View>

        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="weather-windy" size={18} color="#BAE6FD" />
          <Text style={styles.metricValue}>{weather.windSpeed} km/h</Text>
          <Text style={styles.metricLabel}>Wind ({weather.windDirection})</Text>
        </View>

        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="water-percent" size={18} color="#BAE6FD" />
          <Text style={styles.metricValue}>{weather.humidity}%</Text>
          <Text style={styles.metricLabel}>Humidity</Text>
        </View>

        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="air-filter" size={18} color="#BAE6FD" />
          <Text style={styles.metricValue}>{weather.aqi}</Text>
          <Text style={styles.metricLabel}>AQI ({weather.aqiCategory})</Text>
        </View>
      </View>

      {/* Trust & Verification Footer (Signature Feature #7) */}
      <View style={styles.trustFooter}>
        <View style={styles.trustBadge}>
          <Ionicons name="shield-checkmark-sharp" size={13} color="#38BDF8" />
          <Text style={styles.trustText}>
            Confidence: <Text style={{ fontWeight: '700' }}>{weather.confidenceLevel} ({weather.confidenceScore}%)</Text>
          </Text>
        </View>
        <Text style={styles.sourceText} numberOfLines={1}>
          {weather.dataSource}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    elevation: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
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
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 5,
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
    letterSpacing: 0.3,
  },
  stateName: {
    fontSize: 12,
    color: '#E0F2FE',
    marginTop: 2,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    gap: 5,
  },
  refreshText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  degreeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tempNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 68,
    letterSpacing: -2,
  },
  degreeSymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#BAE6FD',
    marginTop: 6,
  },
  feelsLikeText: {
    fontSize: 13,
    color: '#E0F2FE',
    fontWeight: '500',
  },
  conditionRight: {
    alignItems: 'flex-end',
    maxWidth: 160,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#BAE6FD',
    marginTop: 1,
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: spacing.xs,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 11,
    color: '#BAE6FD',
  },
  sourceText: {
    fontSize: 10,
    color: '#E0F2FE',
    maxWidth: 180,
  },
});
