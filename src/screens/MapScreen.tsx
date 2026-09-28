import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

interface CityPoint {
  id: string;
  name: string;
  state: string;
  x: number; // percentage across India canvas
  y: number; // percentage down India canvas
  temp: number;
  condition: string;
  rainProb: number;
  windSpeed: number;
  aqi: number;
  alert?: string;
}

const INDIAN_CITIES: CityPoint[] = [
  { id: 'delhi', name: 'Delhi NCR', state: 'Delhi', x: 38, y: 26, temp: 31, condition: 'Thunderstorm', rainProb: 82, windSpeed: 28, aqi: 142, alert: 'Orange Alert' },
  { id: 'srinagar', name: 'Srinagar', state: 'J&K', x: 30, y: 12, temp: 19, condition: 'Showers', rainProb: 45, windSpeed: 12, aqi: 42 },
  { id: 'shimla', name: 'Shimla', state: 'HP', x: 36, y: 19, temp: 17, condition: 'Fog & Mist', rainProb: 60, windSpeed: 14, aqi: 35 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', x: 33, y: 32, temp: 33, condition: 'Partly Cloudy', rainProb: 20, windSpeed: 16, aqi: 110 },
  { id: 'lucknow', name: 'Lucknow', state: 'UP', x: 48, y: 32, temp: 30, condition: 'Heavy Rain', rainProb: 75, windSpeed: 22, aqi: 95 },
  { id: 'patna', name: 'Patna', state: 'Bihar', x: 58, y: 34, temp: 29, condition: 'Scattered Showers', rainProb: 55, windSpeed: 18, aqi: 125 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', x: 67, y: 44, temp: 31, condition: 'Humid & Overcast', rainProb: 65, windSpeed: 24, aqi: 88 },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', x: 78, y: 31, temp: 28, condition: 'Rain & Gusts', rainProb: 70, windSpeed: 20, aqi: 48 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', x: 26, y: 56, temp: 30, condition: 'Passing Showers', rainProb: 50, windSpeed: 26, aqi: 78 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', x: 30, y: 60, temp: 27, condition: 'Cloudy', rainProb: 35, windSpeed: 14, aqi: 72 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', x: 42, y: 60, temp: 29, condition: 'Breezy & Fair', rainProb: 25, windSpeed: 18, aqi: 82 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', x: 38, y: 74, temp: 25, condition: 'Pleasant & Cloudy', rainProb: 30, windSpeed: 16, aqi: 54 },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', x: 48, y: 73, temp: 32, condition: 'Warm & Sunny', rainProb: 15, windSpeed: 19, aqi: 68 },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', x: 35, y: 84, temp: 29, condition: 'Squally Winds', rainProb: 95, windSpeed: 42, aqi: 38, alert: 'Red Marine Alert' },
];

export const MapScreen: React.FC = () => {
  const { theme } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;

  const [activeLayer, setActiveLayer] = useState<'radar' | 'wind' | 'temp' | 'aqi' | 'alerts'>('radar');
  const [selectedCity, setSelectedCity] = useState<CityPoint>(INDIAN_CITIES[0]);

  const layers: { key: 'radar' | 'wind' | 'temp' | 'aqi' | 'alerts'; label: string; icon: any }[] = [
    { key: 'radar', label: 'Doppler Radar', icon: 'weather-pouring' },
    { key: 'wind', label: 'Wind Vectors', icon: 'weather-windy' },
    { key: 'temp', label: 'Thermal Heatmap', icon: 'thermometer' },
    { key: 'aqi', label: 'Air Quality (AQI)', icon: 'air-filter' },
    { key: 'alerts', label: 'Warning Zones', icon: 'alert-rhombus' },
  ];

  return (
    <View style={styles.container}>
      {/* Top Map Layer Selector Bar */}
      <View style={[styles.layerBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.layerScroll}>
          {layers.map((l) => {
            const isSelected = activeLayer === l.key;
            return (
              <TouchableOpacity
                key={l.key}
                style={[
                  styles.layerChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle,
                    borderColor: isSelected ? theme.primary : theme.border,
                  }
                ]}
                onPress={() => setActiveLayer(l.key)}
              >
                <MaterialCommunityIcons 
                  name={l.icon} 
                  size={15} 
                  color={isSelected ? '#FFFFFF' : theme.textSecondary} 
                />
                <Text style={[styles.layerChipText, { color: isSelected ? '#FFFFFF' : theme.textPrimary, fontWeight: isSelected ? '700' : '500' }]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Geospatial Map Canvas Area */}
      <View style={[styles.mapCanvas, { backgroundColor: theme.background }]}>
        {/* Radar / Geospatial Grid Lines */}
        <View style={styles.gridOverlay}>
          <View style={[styles.latLine, { top: '25%', borderColor: theme.borderLight }]} />
          <View style={[styles.latLine, { top: '50%', borderColor: theme.borderLight }]} />
          <View style={[styles.latLine, { top: '75%', borderColor: theme.borderLight }]} />
          <View style={[styles.lonLine, { left: '33%', borderColor: theme.borderLight }]} />
          <View style={[styles.lonLine, { left: '66%', borderColor: theme.borderLight }]} />
        </View>

        {/* Visual Weather Layer Clouds / Atmospheric Cells */}
        {activeLayer === 'radar' && (
          <>
            <View style={[styles.radarCell, { left: '32%', top: '20%', width: 140, height: 110, backgroundColor: 'rgba(239, 68, 68, 0.25)' }]} />
            <View style={[styles.radarCell, { left: '30%', top: '78%', width: 130, height: 90, backgroundColor: 'rgba(239, 68, 68, 0.3)' }]} />
            <View style={[styles.radarCell, { left: '50%', top: '30%', width: 160, height: 120, backgroundColor: 'rgba(2, 132, 199, 0.2)' }]} />
          </>
        )}

        {activeLayer === 'alerts' && (
          <>
            <View style={[styles.alertZone, { left: '30%', top: '22%', borderColor: '#EA580C', backgroundColor: 'rgba(234, 88, 12, 0.22)' }]}>
              <Text style={styles.alertZoneText}>ORANGE WARNING</Text>
            </View>
            <View style={[styles.alertZone, { left: '28%', top: '80%', borderColor: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.22)' }]}>
              <Text style={[styles.alertZoneText, { color: '#DC2626' }]}>RED MARINE SQUALL</Text>
            </View>
          </>
        )}

        {/* Interactive City Node Markers */}
        {INDIAN_CITIES.map((city) => {
          const isSelected = selectedCity.id === city.id;
          return (
            <TouchableOpacity
              key={city.id}
              style={[
                styles.cityPin,
                { left: `${city.x}%`, top: `${city.y}%` }
              ]}
              onPress={() => setSelectedCity(city)}
              activeOpacity={0.8}
            >
              <View 
                style={[
                  styles.pinMarker,
                  {
                    backgroundColor: city.alert ? theme.alertOrange : isSelected ? theme.primary : theme.surface,
                    borderColor: isSelected ? '#FFFFFF' : theme.primary,
                  }
                ]}
              >
                <Text style={[styles.pinText, { color: city.alert || isSelected ? '#FFFFFF' : theme.textPrimary }]}>
                  {city.temp}°
                </Text>
              </View>
              <Text style={[styles.pinLabel, { color: theme.textPrimary, fontWeight: isSelected ? '800' : '600' }]} numberOfLines={1}>
                {city.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Selected City Telemetry Bottom Card */}
        <View style={[styles.telemetryOverlay, isDesktop && styles.desktopTelemetry, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.telemetryHeader}>
            <View>
              <View style={styles.telemetryTitleRow}>
                <Text style={[styles.telemetryCity, { color: theme.textPrimary }]}>{selectedCity.name}</Text>
                {selectedCity.alert && (
                  <View style={[styles.alertPill, { backgroundColor: theme.alertOrangeBg }]}>
                    <Text style={[styles.alertPillText, { color: theme.alertOrange }]}>{selectedCity.alert}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.telemetrySub, { color: theme.textSecondary }]}>
                {selectedCity.state} • {selectedCity.condition}
              </Text>
            </View>

            <View style={styles.telemetryTempBlock}>
              <Text style={[styles.telemetryTemp, { color: theme.primary }]}>{selectedCity.temp}°C</Text>
            </View>
          </View>

          <View style={styles.telemetryMetricsRow}>
            <View style={styles.telemetryMetricItem}>
              <Ionicons name="rainy-outline" size={14} color={selectedCity.rainProb > 60 ? theme.alertRed : theme.primary} />
              <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>{selectedCity.rainProb}% Rain</Text>
            </View>
            <View style={styles.telemetryMetricItem}>
              <Ionicons name="speedometer-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>{selectedCity.windSpeed} km/h</Text>
            </View>
            <View style={styles.telemetryMetricItem}>
              <Ionicons name="leaf-outline" size={14} color={theme.accent} />
              <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>AQI {selectedCity.aqi}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layerBar: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  layerScroll: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  layerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  layerChipText: {
    fontSize: 11,
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  latLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.4,
  },
  lonLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.4,
  },
  radarCell: {
    position: 'absolute',
    borderRadius: 60,
    filter: 'blur(16px)',
  },
  alertZone: {
    position: 'absolute',
    padding: 8,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  alertZoneText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EA580C',
  },
  cityPin: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  pinMarker: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.md,
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  pinText: {
    fontSize: 11,
    fontWeight: '800',
  },
  pinLabel: {
    fontSize: 10,
    marginTop: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFFFFF',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  telemetryOverlay: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  desktopTelemetry: {
    maxWidth: 420,
    left: spacing.xl,
  },
  telemetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  telemetryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  telemetryCity: {
    fontSize: 16,
    fontWeight: '800',
  },
  alertPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  alertPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  telemetrySub: {
    fontSize: 12,
    marginTop: 2,
  },
  telemetryTempBlock: {
    alignItems: 'flex-end',
  },
  telemetryTemp: {
    fontSize: 24,
    fontWeight: '900',
  },
  telemetryMetricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  telemetryMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  telemetryMetricVal: {
    fontSize: 11,
    fontWeight: '600',
  },
});
