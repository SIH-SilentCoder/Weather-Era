import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export const PersonaInsightsCard: React.FC = () => {
  const { theme, persona, weatherData } = useApp();

  const getPersonaData = () => {
    switch (persona) {
      case 'farmer':
        return {
          title: 'IMD Agromet Advisory & Crop Health',
          icon: 'sprout',
          color: '#16A34A',
          badge: 'ICAR-IMD Agro AWS',
          metrics: [
            { label: 'Soil Moisture', value: `${weatherData.humidity + 5}%`, status: 'Saturated', isRisk: true },
            { label: 'Spray Window', value: 'Unfavorable', status: 'Next 36h Rain', isRisk: true },
            { label: 'Pest Risk', value: 'Moderate', status: 'High Humidity', isRisk: false },
          ],
          note: 'Postpone chemical spraying and nitrogen broadcasting. Excess runoff will contaminate irrigation furrows and waste inputs.',
        };

      case 'commuter':
        return {
          title: 'Transit & Corridor Mobility Intelligence',
          icon: 'traffic-light',
          color: '#0284C7',
          badge: 'Traffic Mesonet',
          metrics: [
            { label: 'Arterial Speed', value: '-35%', status: 'Heavy Rain Delays', isRisk: true },
            { label: 'Underpass Hazard', value: 'Elevated', status: 'Water accumulation', isRisk: true },
            { label: 'Safest Mode', value: 'Metro Rail', status: 'Grade-separated', isRisk: false },
          ],
          note: 'Surface transit corridors along Ring Road and Expressway underpasses are operating at reduced velocity. Allow 25 extra minutes.',
        };

      case 'traveller':
        return {
          title: 'Intercity Highway & Aviation Advisory',
          icon: 'airplane-takeoff',
          color: '#8B5CF6',
          badge: 'Regional Aviation Met',
          metrics: [
            { label: 'Highway Visibility', value: `${weatherData.visibility} km`, status: 'Wet spray', isRisk: weatherData.visibility < 4 },
            { label: 'Airport Status', value: 'Minor Holds', status: 'Convective cells', isRisk: false },
            { label: 'Crosswind Risk', value: `${weatherData.windSpeed} km/h`, status: 'Gusty', isRisk: weatherData.windSpeed > 30 },
          ],
          note: 'High-speed expressways experiencing severe rainwater spray. Maintain safe following distances and activate low-beam headlamps.',
        };

      case 'student':
        return {
          title: 'Campus Life & Commute Advisory',
          icon: 'school-outline',
          color: '#EC4899',
          badge: 'Campus Weather',
          metrics: [
            { label: 'Rain Pack Check', value: 'Umbrella + Cover', status: 'Essential', isRisk: true },
            { label: 'Campus Sports', value: 'Shift Indoors', status: 'Wet ground', isRisk: true },
            { label: 'Transit Air', value: `AQI ${weatherData.aqi}`, status: 'Moderate', isRisk: false },
          ],
          note: 'Evening lectures and library transit coincide with peak shower cells. Keep electronic items in water-resistant sleeves.',
        };

      case 'outdoor':
        return {
          title: 'Outdoor Athletic & Heat Stress Matrix',
          icon: 'run-fast',
          color: '#F59E0B',
          badge: 'Sports Biomet',
          metrics: [
            { label: 'Heat Index', value: `${weatherData.feelsLike}°C`, status: 'Moderate', isRisk: false },
            { label: 'UV Index', value: `${weatherData.uvIndex} / 11`, status: 'Moderate', isRisk: false },
            { label: 'Best Hour', value: '06:00 - 08:30 AM', status: 'Cool & Dry', isRisk: false },
          ],
          note: 'Evening squall winds gusting to 35+ km/h make track running and cycling hazardous. Morning workouts recommended.',
        };

      case 'health':
        return {
          title: 'Environmental Health & Respiratory Monitor',
          icon: 'heart-pulse',
          color: '#EF4444',
          badge: 'National AQI Index',
          metrics: [
            { label: 'AQI Level', value: `${weatherData.aqi}`, status: weatherData.aqiCategory, isRisk: weatherData.aqi > 150 },
            { label: 'Moisture Load', value: `${weatherData.humidity}%`, status: 'High Dampness', isRisk: weatherData.humidity > 80 },
            { label: 'Mask Advisory', value: 'Recommended', status: 'Sensitive groups', isRisk: true },
          ],
          note: 'Particulate matter in humid air tends to suspend longer near breathing zones. Asthmatic and senior citizens should minimize outdoor exertion.',
        };

      case 'fisherman':
        return {
          title: 'INCOIS Marine & Coastal Squall Advisory',
          icon: 'sail-boat',
          color: '#0D9488',
          badge: 'INCOIS Coastal Buoys',
          metrics: [
            { label: 'Wave Swell', value: '2.8 - 3.4 m', status: 'Rough Seas', isRisk: true },
            { label: 'Wind Velocity', value: `${weatherData.windSpeed} km/h`, status: 'Squally Gusts', isRisk: true },
            { label: 'Advisory Status', value: 'Venturing Banned', status: 'Strict Warning', isRisk: true },
          ],
          note: 'Sea condition very rough with turbulent rip currents. Deep sea and artisanal fishing craft operations are suspended for 24 hours.',
        };
    }
  };

  const pData = getPersonaData();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: pData.color + '20' }]}>
            <MaterialCommunityIcons name={pData.icon as any} size={18} color={pData.color} />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
            {pData.title}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.surfaceSubtle }]}>
          <Text style={[styles.badgeText, { color: theme.textSecondary }]}>{pData.badge}</Text>
        </View>
      </View>

      {/* 3 Metrics Cards */}
      <View style={styles.metricsRow}>
        {pData.metrics.map((m, idx) => (
          <View 
            key={idx} 
            style={[
              styles.metricCard, 
              { 
                backgroundColor: m.isRisk ? theme.alertOrangeBg + '30' : theme.surfaceSubtle,
                borderColor: m.isRisk ? theme.alertOrange + '50' : theme.border,
              }
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{m.label}</Text>
            <Text style={[styles.metricVal, { color: m.isRisk ? theme.alertOrange : theme.textPrimary }]}>
              {m.value}
            </Text>
            <Text style={[styles.metricStatus, { color: m.isRisk ? theme.alertOrange : theme.textSecondary }]}>
              {m.status}
            </Text>
          </View>
        ))}
      </View>

      {/* Advisory Note */}
      <View style={[styles.noteBox, { backgroundColor: theme.surfaceSubtle }]}>
        <Ionicons name="information-circle" size={16} color={pData.color} style={{ marginTop: 1 }} />
        <Text style={[styles.noteText, { color: theme.textPrimary }]}>
          {pData.note}
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
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  metricCard: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    marginVertical: 2,
    textAlign: 'center',
  },
  metricStatus: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: spacing.sm,
    borderRadius: radii.md,
    marginTop: spacing.xs,
  },
  noteText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
    fontWeight: '500',
  },
});
