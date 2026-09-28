import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getHourlyForecast } from '../services/weatherService';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export const HourlyForecastStrip: React.FC = () => {
  const { theme, weatherData, t } = useApp();
  const hourly = getHourlyForecast(weatherData.conditionCode);

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
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={18} color={theme.primary} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {t.hourlyForecast}
          </Text>
        </View>
        <Text style={[styles.subNote, { color: theme.textMuted }]}>
          Next 12 Hours
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {hourly.map((item, idx) => (
          <View 
            key={idx} 
            style={[
              styles.hourCard, 
              { 
                backgroundColor: item.isNow ? theme.primaryLight : theme.surfaceSubtle,
                borderColor: item.isNow ? theme.primary : theme.border,
              }
            ]}
          >
            <Text style={[styles.hourTime, { color: item.isNow ? theme.primary : theme.textSecondary, fontWeight: item.isNow ? '700' : '500' }]}>
              {item.time}
            </Text>

            <MaterialCommunityIcons 
              name={getWeatherIcon(item.conditionCode)} 
              size={24} 
              color={item.isNow ? theme.primary : theme.textPrimary} 
              style={{ marginVertical: 6 }}
            />

            <Text style={[styles.hourTemp, { color: theme.textPrimary }]}>
              {item.temperature}°
            </Text>

            <View style={styles.rainRow}>
              <MaterialCommunityIcons name="water" size={11} color={item.rainProbability > 60 ? theme.alertRed : theme.primary} />
              <Text style={[styles.hourRain, { color: item.rainProbability > 60 ? theme.alertRed : theme.primary }]}>
                {item.rainProbability}%
              </Text>
            </View>

            <Text style={[styles.hourWind, { color: theme.textMuted }]}>
              {item.windSpeed}k
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
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
  subNote: {
    fontSize: 11,
  },
  scrollList: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  hourCard: {
    width: 68,
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
  },
  hourTime: {
    fontSize: 11,
  },
  hourTemp: {
    fontSize: 14,
    fontWeight: '700',
  },
  rainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  hourRain: {
    fontSize: 10,
    fontWeight: '700',
  },
  hourWind: {
    fontSize: 9,
    marginTop: 2,
  },
});
