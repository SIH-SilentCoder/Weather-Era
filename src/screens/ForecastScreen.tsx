import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getHourlyForecast, getDailyForecast } from '../services/weatherService';
import { radii, spacing } from '../theme';

export const ForecastScreen: React.FC = () => {
  const { theme, weatherData, t } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;

  const hourly = getHourlyForecast(weatherData.conditionCode);
  const daily = getDailyForecast();

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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
      showsVerticalScrollIndicator={false}
    >
      {/* Forecast Header with Trust System */}
      <View style={[styles.headerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              {weatherData.city} Meteorological Forecast
            </Text>
            <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
              {weatherData.state} • Validated Numerical Weather Prediction (NWP)
            </Text>
          </View>
          <View style={[styles.confidenceBadge, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="shield-checkmark" size={14} color={theme.primary} />
            <Text style={[styles.confidenceText, { color: theme.primary }]}>
              {weatherData.confidenceLevel} Confidence ({weatherData.confidenceScore}%)
            </Text>
          </View>
        </View>
      </View>

      {/* 24-Hour Hourly Timeline */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            {t.hourlyForecast}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyList}>
          {hourly.map((h, i) => (
            <View 
              key={i} 
              style={[
                styles.hourlyItem, 
                { 
                  backgroundColor: h.isNow ? theme.primaryLight : theme.surfaceSubtle,
                  borderColor: h.isNow ? theme.primary : theme.border,
                }
              ]}
            >
              <Text style={[styles.hourlyTime, { color: h.isNow ? theme.primary : theme.textSecondary, fontWeight: h.isNow ? '700' : '500' }]}>
                {h.time}
              </Text>
              <MaterialCommunityIcons 
                name={getWeatherIcon(h.conditionCode)} 
                size={22} 
                color={h.isNow ? theme.primary : theme.textPrimary} 
                style={{ marginVertical: 6 }}
              />
              <Text style={[styles.hourlyTemp, { color: theme.textPrimary }]}>{h.temperature}°</Text>
              <View style={styles.rainChanceRow}>
                <Ionicons name="rainy" size={11} color={h.rainProbability > 60 ? theme.alertRed : theme.primary} />
                <Text style={[styles.rainChanceText, { color: h.rainProbability > 60 ? theme.alertRed : theme.primary }]}>
                  {h.rainProbability}%
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 7-Day Extended Forecast */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calendar-month-outline" size={18} color={theme.secondary} />
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            {t.sevenDayForecast}
          </Text>
        </View>

        <View style={styles.dailyList}>
          {daily.map((d, idx) => (
            <View key={idx} style={[styles.dailyItem, { borderBottomColor: theme.border }]}>
              <View style={styles.dailyDayCol}>
                <Text style={[styles.dailyDay, { color: theme.textPrimary }]}>{d.day}</Text>
                <Text style={[styles.dailyDate, { color: theme.textMuted }]}>{d.date}</Text>
              </View>

              <View style={styles.dailyConditionCol}>
                <MaterialCommunityIcons name={getWeatherIcon(d.conditionCode)} size={22} color={theme.primary} />
                <Text style={[styles.dailyConditionText, { color: theme.textSecondary }]} numberOfLines={1}>
                  {d.condition}
                </Text>
              </View>

              <View style={styles.dailyRainCol}>
                {d.rainProbability > 0 && (
                  <View style={styles.dailyRainPill}>
                    <Ionicons name="water" size={10} color={theme.primary} />
                    <Text style={[styles.dailyRainText, { color: theme.primary }]}>{d.rainProbability}%</Text>
                  </View>
                )}
              </View>

              <View style={styles.dailyTempRangeCol}>
                <Text style={[styles.tempMax, { color: theme.textPrimary }]}>{d.tempMax}°</Text>
                <Text style={[styles.tempMin, { color: theme.textMuted }]}>{d.tempMin}°</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Environmental & Air Quality Telemetry Grid */}
      <View style={styles.metricsGrid}>
        {/* Air Quality (AQI) Card */}
        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.metricHeader}>
            <MaterialCommunityIcons name="air-filter" size={18} color={theme.accent} />
            <Text style={[styles.metricCardTitle, { color: theme.textPrimary }]}>{t.airQuality}</Text>
          </View>
          <View style={styles.aqiRow}>
            <Text style={[styles.aqiBigNum, { color: theme.accent }]}>{weatherData.aqi}</Text>
            <View style={[styles.aqiBadge, { backgroundColor: theme.alertYellowBg }]}>
              <Text style={[styles.aqiBadgeText, { color: theme.alertYellow }]}>{weatherData.aqiCategory}</Text>
            </View>
          </View>
          <Text style={[styles.metricAdvice, { color: theme.textSecondary }]}>
            PM2.5: 58 µg/m³ • PM10: 112 µg/m³ • Ozone: Good
          </Text>
        </View>

        {/* UV Index Card */}
        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.metricHeader}>
            <MaterialCommunityIcons name="white-balance-sunny" size={18} color={theme.accent} />
            <Text style={[styles.metricCardTitle, { color: theme.textPrimary }]}>{t.uvIndex}</Text>
          </View>
          <View style={styles.aqiRow}>
            <Text style={[styles.aqiBigNum, { color: theme.primary }]}>{weatherData.uvIndex}</Text>
            <View style={[styles.aqiBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.aqiBadgeText, { color: theme.primary }]}>Moderate Risk</Text>
            </View>
          </View>
          <Text style={[styles.metricAdvice, { color: theme.textSecondary }]}>
            Protection needed between 11:30 AM – 03:30 PM.
          </Text>
        </View>

        {/* Humidity & Dew Point */}
        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.metricHeader}>
            <MaterialCommunityIcons name="water-percent" size={18} color={theme.primary} />
            <Text style={[styles.metricCardTitle, { color: theme.textPrimary }]}>{t.humidity}</Text>
          </View>
          <Text style={[styles.aqiBigNum, { color: theme.textPrimary }]}>{weatherData.humidity}%</Text>
          <Text style={[styles.metricAdvice, { color: theme.textSecondary }]}>
            Dew point is {weatherData.dewPoint}°C; moisture saturation is high.
          </Text>
        </View>

        {/* Pressure & Visibility */}
        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.metricHeader}>
            <MaterialCommunityIcons name="gauge" size={18} color={theme.secondary} />
            <Text style={[styles.metricCardTitle, { color: theme.textPrimary }]}>{t.pressure}</Text>
          </View>
          <Text style={[styles.aqiBigNum, { color: theme.textPrimary }]}>{weatherData.pressure} <Text style={{ fontSize: 13 }}>hPa</Text></Text>
          <Text style={[styles.metricAdvice, { color: theme.textSecondary }]}>
            Visibility: {weatherData.visibility} km • Barometric trend steady.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  desktopContent: {
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
  },
  headerCard: {
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  hourlyList: {
    gap: 8,
    paddingVertical: spacing.xs,
  },
  hourlyItem: {
    width: 66,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  hourlyTime: {
    fontSize: 11,
  },
  hourlyTemp: {
    fontSize: 14,
    fontWeight: '700',
  },
  rainChanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  rainChanceText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dailyList: {
    gap: 4,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  dailyDayCol: {
    width: 80,
  },
  dailyDay: {
    fontSize: 13,
    fontWeight: '700',
  },
  dailyDate: {
    fontSize: 10,
  },
  dailyConditionCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dailyConditionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dailyRainCol: {
    width: 65,
    alignItems: 'center',
  },
  dailyRainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  dailyRainText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dailyTempRangeCol: {
    flexDirection: 'row',
    gap: 8,
    width: 60,
    justifyContent: 'flex-end',
  },
  tempMax: {
    fontSize: 13,
    fontWeight: '700',
  },
  tempMin: {
    fontSize: 13,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: 160,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  metricCardTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  aqiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  aqiBigNum: {
    fontSize: 26,
    fontWeight: '900',
  },
  aqiBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aqiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  metricAdvice: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
});
