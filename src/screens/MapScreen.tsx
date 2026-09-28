import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  useWindowDimensions, 
  Animated 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

interface CityPoint {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central';
  x: number; // percentage across India canvas
  y: number; // percentage down India canvas
  temp: number;
  condition: string;
  rainProb: number;
  windSpeed: number;
  windDir: string;
  aqi: number;
  humidity: number;
  pressure: number;
  alert?: { level: 'orange' | 'red' | 'yellow'; title: string; advisory: string };
  radarDbz: number; // Doppler reflectivity (10 - 65 dBZ)
}

const INDIAN_CITIES: CityPoint[] = [
  { id: 'delhi', name: 'New Delhi (NCR)', state: 'Delhi', region: 'North', x: 38, y: 26, temp: 31, condition: 'Thunderstorm with Squall', rainProb: 82, windSpeed: 28, windDir: 'ENE', aqi: 142, humidity: 78, pressure: 1008, alert: { level: 'orange', title: 'Orange Warning: Heavy Rain & Gusts', advisory: 'Avoid underpasses on NH-48; peak rain between 18:30–21:00 IST' }, radarDbz: 52 },
  { id: 'srinagar', name: 'Srinagar', state: 'J&K', region: 'North', x: 30, y: 12, temp: 19, condition: 'Light Mountain Showers', rainProb: 45, windSpeed: 12, windDir: 'NW', aqi: 42, humidity: 62, pressure: 1014, radarDbz: 28 },
  { id: 'shimla', name: 'Shimla Ridge', state: 'HP', region: 'North', x: 36, y: 19, temp: 17, condition: 'Dense Fog & Mountain Mist', rainProb: 60, windSpeed: 14, windDir: 'NE', aqi: 35, humidity: 88, pressure: 1012, radarDbz: 36 },
  { id: 'jaipur', name: 'Jaipur Pink City', state: 'Rajasthan', region: 'West', x: 33, y: 32, temp: 33, condition: 'Partly Cloudy & Dry', rainProb: 20, windSpeed: 16, windDir: 'W', aqi: 110, humidity: 48, pressure: 1009, radarDbz: 15 },
  { id: 'lucknow', name: 'Lucknow', state: 'UP', region: 'North', x: 48, y: 32, temp: 30, condition: 'Intense Convective Rain', rainProb: 75, windSpeed: 22, windDir: 'SE', aqi: 95, humidity: 82, pressure: 1007, alert: { level: 'yellow', title: 'Yellow Watch: Lightning Activity', advisory: 'Farmers advised to seek sheltered structures away from tall trees' }, radarDbz: 48 },
  { id: 'patna', name: 'Patna', state: 'Bihar', region: 'East', x: 58, y: 34, temp: 29, condition: 'Scattered Monsoon Showers', rainProb: 55, windSpeed: 18, windDir: 'E', aqi: 125, humidity: 79, pressure: 1008, radarDbz: 38 },
  { id: 'kolkata', name: 'Kolkata Delta', state: 'West Bengal', region: 'East', x: 67, y: 44, temp: 31, condition: 'Humid Overcast & Drizzle', rainProb: 65, windSpeed: 24, windDir: 'SW', aqi: 88, humidity: 86, pressure: 1006, radarDbz: 42 },
  { id: 'guwahati', name: 'Guwahati Brahmaputra', state: 'Assam', region: 'East', x: 78, y: 31, temp: 28, condition: 'Heavy Rain & Gusty squall', rainProb: 70, windSpeed: 20, windDir: 'NE', aqi: 48, humidity: 91, pressure: 1009, alert: { level: 'yellow', title: 'Yellow Alert: Riverine Water Surge', advisory: 'Low-lying riparian banks on caution for swift river rise' }, radarDbz: 46 },
  { id: 'mumbai', name: 'Mumbai Colaba', state: 'Maharashtra', region: 'West', x: 26, y: 56, temp: 30, condition: 'Passing Monsoon Bands', rainProb: 50, windSpeed: 26, windDir: 'WSW', aqi: 78, humidity: 84, pressure: 1008, radarDbz: 39 },
  { id: 'pune', name: 'Pune Western Ghats', state: 'Maharashtra', region: 'West', x: 30, y: 60, temp: 27, condition: 'Overcast & Cool Breeze', rainProb: 35, windSpeed: 14, windDir: 'WNW', aqi: 72, humidity: 68, pressure: 1012, radarDbz: 22 },
  { id: 'hyderabad', name: 'Hyderabad Deccan', state: 'Telangana', region: 'South', x: 42, y: 60, temp: 29, condition: 'Breezy & Intermittent Sun', rainProb: 25, windSpeed: 18, windDir: 'SE', aqi: 82, humidity: 59, pressure: 1011, radarDbz: 18 },
  { id: 'bengaluru', name: 'Bengaluru IT Corridor', state: 'Karnataka', region: 'South', x: 38, y: 74, temp: 25, condition: 'Pleasant & Cloud Deck', rainProb: 30, windSpeed: 16, windDir: 'SW', aqi: 54, humidity: 64, pressure: 1014, radarDbz: 20 },
  { id: 'chennai', name: 'Chennai Marina', state: 'Tamil Nadu', region: 'South', x: 48, y: 73, temp: 32, condition: 'Warm & Coastal Sunshine', rainProb: 15, windSpeed: 19, windDir: 'SE', aqi: 68, humidity: 71, pressure: 1010, radarDbz: 12 },
  { id: 'kochi', name: 'Kochi Harbor', state: 'Kerala', region: 'South', x: 35, y: 84, temp: 29, condition: 'Squally Winds & Rough Swell', rainProb: 95, windSpeed: 42, windDir: 'SSW', aqi: 38, humidity: 92, pressure: 1005, alert: { level: 'red', title: 'RED ALERT: Extreme Marine Squall', advisory: 'Deep sea fishing strictly prohibited; wave swell exceeding 3.4m' }, radarDbz: 58 },
  { id: 'bhopal', name: 'Bhopal Plateau', state: 'Madhya Pradesh', region: 'Central', x: 40, y: 44, temp: 30, condition: 'Scattered Thunder Clouds', rainProb: 40, windSpeed: 17, windDir: 'W', aqi: 62, humidity: 70, pressure: 1010, radarDbz: 25 },
];

const TIME_STEPS = [
  { label: '-2h', title: '2 Hours Ago (Observed)' },
  { label: '-1h', title: '1 Hour Ago (Observed)' },
  { label: 'Now', title: 'Live Doppler Radar (Current)' },
  { label: '+1h', title: '+1 Hour Nowcast (WRF)' },
  { label: '+2h', title: '+2 Hours Nowcast (WRF)' },
];

export const MapScreen: React.FC = () => {
  const { theme } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;

  // Layer state
  const [activeLayer, setActiveLayer] = useState<'radar' | 'wind' | 'temp' | 'aqi' | 'alerts' | 'satellite'>('radar');
  const [selectedCity, setSelectedCity] = useState<CityPoint>(INDIAN_CITIES[0]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive zoom & pan scale
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  // Radar timeline player
  const [timeStepIndex, setTimeStepIndex] = useState<number>(2); // 2 is 'Now'
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [expandedDetails, setExpandedDetails] = useState<boolean>(false);

  // Playback timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeStepIndex((prev) => (prev + 1) % TIME_STEPS.length);
      }, 1600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Filter cities by region & search
  const filteredCities = INDIAN_CITIES.filter((city) => {
    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          city.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const layers: { key: 'radar' | 'wind' | 'temp' | 'aqi' | 'alerts' | 'satellite'; label: string; icon: any; legend: string }[] = [
    { key: 'radar', label: 'Doppler Radar', icon: 'weather-pouring', legend: 'Precipitation Reflectivity (dBZ)' },
    { key: 'wind', label: 'Wind Flow & Squalls', icon: 'weather-windy', legend: 'Velocity (km/h & direction)' },
    { key: 'temp', label: 'Thermal Heatmap', icon: 'thermometer', legend: 'Surface Ambient Temperature (°C)' },
    { key: 'aqi', label: 'Air Quality (AQI)', icon: 'air-filter', legend: 'CPCB AQI & Particulate Index' },
    { key: 'alerts', label: 'Warning Zones', icon: 'alert-rhombus', legend: 'IMD Multi-Hazard Disaster Alerts' },
    { key: 'satellite', label: 'INSAT-3DR Multispectral', icon: 'satellite-variant', legend: 'Cloud Top Radiance (Thermal IR)' },
  ];

  const currentLayerObj = layers.find(l => l.key === activeLayer) || layers[0];

  // Dynamic cloud offset for timeline player
  const timeOffset = (timeStepIndex - 2) * 12;

  return (
    <View style={styles.container}>
      {/* Search & Top Action Bar */}
      <View style={[styles.topActionBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={16} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search state, district, or Indian city..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Region Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionScroll}>
          {['All', 'North', 'West', 'South', 'East', 'Central'].map((r) => {
            const isSel = selectedRegion === r;
            return (
              <TouchableOpacity
                key={r}
                style={[
                  styles.regionChip,
                  {
                    backgroundColor: isSel ? theme.primary : theme.surfaceSubtle,
                    borderColor: isSel ? theme.primary : theme.border,
                  }
                ]}
                onPress={() => setSelectedRegion(r)}
              >
                <Text style={[styles.regionChipText, { color: isSel ? '#FFFFFF' : theme.textPrimary, fontWeight: isSel ? '700' : '500' }]}>
                  {r === 'All' ? '🇮🇳 All India' : r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Weather Layer Switcher Chips */}
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

      {/* Main Geospatial Map Canvas Area */}
      <View style={[styles.mapCanvas, { backgroundColor: theme.background }]}>
        {/* Map Grid & Longitude/Latitude Coordinates */}
        <View style={styles.gridOverlay}>
          <View style={[styles.latLine, { top: '20%', borderColor: theme.borderLight }]}>
            <Text style={[styles.coordTag, { color: theme.textMuted }]}>28°N (Delhi)</Text>
          </View>
          <View style={[styles.latLine, { top: '45%', borderColor: theme.borderLight }]}>
            <Text style={[styles.coordTag, { color: theme.textMuted }]}>22°N (Tropic of Cancer)</Text>
          </View>
          <View style={[styles.latLine, { top: '70%', borderColor: theme.borderLight }]}>
            <Text style={[styles.coordTag, { color: theme.textMuted }]}>13°N (Bengaluru/Chennai)</Text>
          </View>
          <View style={[styles.latLine, { top: '88%', borderColor: theme.borderLight }]}>
            <Text style={[styles.coordTag, { color: theme.textMuted }]}>8°N (Kanyakumari / Indian Ocean)</Text>
          </View>
          <View style={[styles.lonLine, { left: '30%', borderColor: theme.borderLight }]} />
          <View style={[styles.lonLine, { left: '55%', borderColor: theme.borderLight }]} />
          <View style={[styles.lonLine, { left: '80%', borderColor: theme.borderLight }]} />
        </View>

        {/* Dynamic Zoom & Pan Container */}
        <View style={[styles.zoomContainer, { transform: [{ scale: zoomLevel }] }]}>
          {/* Layer Overlay: Doppler Radar Rain Reflectivity Bands */}
          {activeLayer === 'radar' && (
            <>
              {/* Northern Convective Storm Cell (Delhi-NCR / Haryana) */}
              <View 
                style={[
                  styles.radarCloud, 
                  { 
                    left: `${30 + timeOffset * 0.4}%`, 
                    top: `${19 - timeOffset * 0.2}%`, 
                    width: 170, 
                    height: 120, 
                    backgroundColor: 'rgba(239, 68, 68, 0.4)' 
                  }
                ]} 
              >
                <View style={styles.radarCore} />
              </View>

              {/* Kerala / Arabian Sea High Squall Cell */}
              <View 
                style={[
                  styles.radarCloud, 
                  { 
                    left: `${26 + timeOffset * 0.3}%`, 
                    top: `${76 - timeOffset * 0.2}%`, 
                    width: 150, 
                    height: 110, 
                    backgroundColor: 'rgba(220, 38, 38, 0.45)' 
                  }
                ]} 
              />

              {/* Eastern Gangetic Monsoon Trough (UP / Bihar / Bengal) */}
              <View 
                style={[
                  styles.radarCloud, 
                  { 
                    left: `${48 + timeOffset * 0.5}%`, 
                    top: `${28 - timeOffset * 0.1}%`, 
                    width: 220, 
                    height: 140, 
                    backgroundColor: 'rgba(2, 132, 199, 0.35)' 
                  }
                ]} 
              />
            </>
          )}

          {/* Layer Overlay: Wind Flow Vectors */}
          {activeLayer === 'wind' && (
            <>
              <View style={[styles.windVectorBox, { left: '20%', top: '75%' }]}>
                <Ionicons name="arrow-up" size={24} color="#38BDF8" style={{ transform: [{ rotate: '35deg' }] }} />
                <Text style={styles.windVectorText}>42 km/h SSW</Text>
              </View>
              <View style={[styles.windVectorBox, { left: '32%', top: '22%' }]}>
                <Ionicons name="arrow-down" size={24} color="#F97316" style={{ transform: [{ rotate: '-45deg' }] }} />
                <Text style={styles.windVectorText}>28 km/h ENE</Text>
              </View>
              <View style={[styles.windVectorBox, { left: '60%', top: '40%' }]}>
                <Ionicons name="arrow-up" size={24} color="#38BDF8" style={{ transform: [{ rotate: '55deg' }] }} />
                <Text style={styles.windVectorText}>24 km/h SW</Text>
              </View>
            </>
          )}

          {/* Layer Overlay: Thermal Heatmap */}
          {activeLayer === 'temp' && (
            <>
              <View style={[styles.thermalBand, { left: '25%', top: '28%', width: 180, height: 120, backgroundColor: 'rgba(245, 158, 11, 0.25)' }]}>
                <Text style={styles.thermalText}>Warm Plains (31–33°C)</Text>
              </View>
              <View style={[styles.thermalBand, { left: '28%', top: '10%', width: 140, height: 80, backgroundColor: 'rgba(56, 189, 248, 0.25)' }]}>
                <Text style={styles.thermalText}>Himalayan Valley (17–19°C)</Text>
              </View>
            </>
          )}

          {/* Layer Overlay: Air Quality (AQI) */}
          {activeLayer === 'aqi' && (
            <>
              <View style={[styles.aqiPolygon, { left: '34%', top: '24%', width: 130, height: 90, backgroundColor: 'rgba(249, 115, 22, 0.3)', borderColor: '#F97316' }]}>
                <Text style={styles.aqiPolygonText}>AQI 142 (Moderate/Poor)</Text>
              </View>
              <View style={[styles.aqiPolygon, { left: '32%', top: '70%', width: 120, height: 100, backgroundColor: 'rgba(34, 197, 94, 0.25)', borderColor: '#22C55E' }]}>
                <Text style={styles.aqiPolygonText}>AQI 38 (Good / Marine)</Text>
              </View>
            </>
          )}

          {/* Layer Overlay: Severe IMD Alert Zones */}
          {activeLayer === 'alerts' && (
            <>
              <View style={[styles.alertZone, { left: '29%', top: '21%', borderColor: '#EA580C', backgroundColor: 'rgba(234, 88, 12, 0.25)' }]}>
                <MaterialCommunityIcons name="alert" size={16} color="#EA580C" />
                <Text style={styles.alertZoneText}>ORANGE WARNING: Convective Squall</Text>
              </View>
              <View style={[styles.alertZone, { left: '24%', top: '78%', borderColor: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.28)' }]}>
                <MaterialCommunityIcons name="alert-octagon" size={16} color="#DC2626" />
                <Text style={[styles.alertZoneText, { color: '#DC2626' }]}>RED ALERT: INCOIS Sea Squall (3.4m Swell)</Text>
              </View>
            </>
          )}

          {/* Layer Overlay: INSAT-3DR Satellite Cloud Tops */}
          {activeLayer === 'satellite' && (
            <>
              <View style={[styles.satelliteCloud, { left: '25%', top: '18%', width: 260, height: 170 }]} />
              <View style={[styles.satelliteCloud, { left: '20%', top: '65%', width: 220, height: 180 }]} />
            </>
          )}

          {/* Interactive Indian City Markers */}
          {filteredCities.map((city) => {
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
                      backgroundColor: city.alert?.level === 'red' 
                        ? theme.alertRed 
                        : city.alert?.level === 'orange' 
                        ? theme.alertOrange 
                        : isSelected 
                        ? theme.primary 
                        : theme.surface,
                      borderColor: isSelected ? '#FFFFFF' : theme.primary,
                    }
                  ]}
                >
                  <Text style={[styles.pinText, { color: city.alert || isSelected ? '#FFFFFF' : theme.textPrimary }]}>
                    {city.temp}°
                  </Text>
                </View>
                <Text style={[styles.pinLabel, { color: theme.textPrimary, fontWeight: isSelected ? '800' : '600' }]} numberOfLines={1}>
                  {city.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Floating Zoom & Map Controls (Top-Right) */}
        <View style={styles.floatingControls}>
          <TouchableOpacity 
            style={[styles.floatingBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setZoomLevel((z) => Math.min(2.4, z + 0.3))}
            accessibilityLabel="Zoom in"
          >
            <Ionicons name="add" size={18} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.floatingBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setZoomLevel((z) => Math.max(1, z - 0.3))}
            accessibilityLabel="Zoom out"
          >
            <Ionicons name="remove" size={18} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.floatingBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => { setZoomLevel(1); setSelectedRegion('All'); }}
            accessibilityLabel="Reset map view"
          >
            <Ionicons name="scan-outline" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Legend Scale Card (Top-Left) */}
        <View style={[styles.legendBox, { backgroundColor: theme.surface + 'EE', borderColor: theme.border }]}>
          <Text style={[styles.legendTitle, { color: theme.textPrimary }]}>{currentLayerObj.legend}</Text>
          {activeLayer === 'radar' && (
            <View style={styles.scaleBarRow}>
              <View style={[styles.scaleBlock, { backgroundColor: '#86EFAC' }]}><Text style={styles.scaleText}>15</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#38BDF8' }]}><Text style={styles.scaleText}>30</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#FACC15' }]}><Text style={styles.scaleText}>45</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#F97316' }]}><Text style={styles.scaleText}>55</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#EF4444' }]}><Text style={styles.scaleText}>65 dBZ</Text></View>
            </View>
          )}
          {activeLayer === 'temp' && (
            <View style={styles.scaleBarRow}>
              <View style={[styles.scaleBlock, { backgroundColor: '#93C5FD' }]}><Text style={styles.scaleText}>15°C</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#FDE047' }]}><Text style={styles.scaleText}>25°C</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#FB923C' }]}><Text style={styles.scaleText}>35°C</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#DC2626' }]}><Text style={styles.scaleText}>45°C</Text></View>
            </View>
          )}
          {activeLayer === 'aqi' && (
            <View style={styles.scaleBarRow}>
              <View style={[styles.scaleBlock, { backgroundColor: '#22C55E' }]}><Text style={styles.scaleText}>Good</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#EAB308' }]}><Text style={styles.scaleText}>Mod</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#F97316' }]}><Text style={styles.scaleText}>Poor</Text></View>
              <View style={[styles.scaleBlock, { backgroundColor: '#EF4444' }]}><Text style={styles.scaleText}>Severe</Text></View>
            </View>
          )}
        </View>

        {/* Timeline Radar Player Bar */}
        <View style={[styles.timelinePlayerBar, isDesktop && styles.desktopTimeline, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.playBtn, { backgroundColor: theme.primary }]}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.timelineStepsRow}>
            {TIME_STEPS.map((step, idx) => {
              const isCurrentStep = idx === timeStepIndex;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.timeStepBtn,
                    isCurrentStep && { backgroundColor: theme.primaryLight, borderColor: theme.primary, borderWidth: 1 }
                  ]}
                  onPress={() => { setIsPlaying(false); setTimeStepIndex(idx); }}
                >
                  <Text style={[styles.timeStepText, { color: isCurrentStep ? theme.primary : theme.textMuted, fontWeight: isCurrentStep ? '800' : '500' }]}>
                    {step.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.timeStepTitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {TIME_STEPS[timeStepIndex].title}
          </Text>
        </View>

        {/* Selected City Telemetry Bottom Card / Drawer */}
        <View style={[styles.telemetryOverlay, isDesktop && styles.desktopTelemetry, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.telemetryHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.telemetryTitleRow}>
                <Text style={[styles.telemetryCity, { color: theme.textPrimary }]}>{selectedCity.name}</Text>
                {selectedCity.alert && (
                  <View style={[styles.alertPill, { backgroundColor: selectedCity.alert.level === 'red' ? theme.alertRedBg : theme.alertOrangeBg }]}>
                    <Text style={[styles.alertPillText, { color: selectedCity.alert.level === 'red' ? theme.alertRed : theme.alertOrange }]}>
                      {selectedCity.alert.level.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.telemetrySub, { color: theme.textSecondary }]}>
                {selectedCity.state} • {selectedCity.condition}
              </Text>
            </View>

            <View style={styles.telemetryTempBlock}>
              <Text style={[styles.telemetryTemp, { color: theme.primary }]}>{selectedCity.temp}°C</Text>
              <Text style={[styles.telemetryDbz, { color: theme.textMuted }]}>{selectedCity.radarDbz} dBZ radar</Text>
            </View>
          </View>

          {/* Key Atmospheric Telemetry Row */}
          <View style={styles.telemetryMetricsRow}>
            <View style={styles.telemetryMetricItem}>
              <Ionicons name="rainy-outline" size={14} color={selectedCity.rainProb > 60 ? theme.alertRed : theme.primary} />
              <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>{selectedCity.rainProb}% Rain</Text>
            </View>
            <View style={styles.telemetryMetricItem}>
              <Ionicons name="speedometer-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>{selectedCity.windSpeed} km/h ({selectedCity.windDir})</Text>
            </View>
            <View style={styles.telemetryMetricItem}>
              <Ionicons name="leaf-outline" size={14} color={theme.accent} />
              <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>AQI {selectedCity.aqi}</Text>
            </View>
            <View style={styles.telemetryMetricItem}>
              <Ionicons name="water-outline" size={14} color={theme.primary} />
              <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>{selectedCity.humidity}% Hum</Text>
            </View>
          </View>

          {/* Active IMD Warning Advisory */}
          {selectedCity.alert && (
            <View style={[styles.cityAdvisoryBox, { backgroundColor: selectedCity.alert.level === 'red' ? theme.alertRedBg : theme.alertOrangeBg, borderColor: selectedCity.alert.level === 'red' ? theme.alertRed : theme.alertOrange }]}>
              <MaterialCommunityIcons name="shield-alert-outline" size={16} color={selectedCity.alert.level === 'red' ? theme.alertRed : theme.alertOrange} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.cityAdvisoryTitle, { color: selectedCity.alert.level === 'red' ? theme.alertRed : theme.alertOrange }]}>
                  {selectedCity.alert.title}
                </Text>
                <Text style={[styles.cityAdvisoryDesc, { color: theme.textPrimary }]}>
                  {selectedCity.alert.advisory}
                </Text>
              </View>
            </View>
          )}

          {/* Expand Deep Forecast & Radar Telemetry Link */}
          <TouchableOpacity 
            style={[styles.expandBtn, { borderColor: theme.border }]}
            onPress={() => setExpandedDetails(!expandedDetails)}
          >
            <Text style={[styles.expandBtnText, { color: theme.primary }]}>
              {expandedDetails ? 'Hide Deep Radar Telemetry' : 'View Deep Mesonet Telemetry'}
            </Text>
            <Ionicons name={expandedDetails ? 'chevron-up' : 'chevron-down'} size={14} color={theme.primary} />
          </TouchableOpacity>

          {expandedDetails && (
            <View style={[styles.expandedDrawer, { borderTopColor: theme.border }]}>
              <Text style={[styles.drawerItem, { color: theme.textSecondary }]}>
                • Barometric Pressure: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{selectedCity.pressure} hPa</Text>
              </Text>
              <Text style={[styles.drawerItem, { color: theme.textSecondary }]}>
                • Doppler Sweep Elevation: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>0.5° & 1.5° Composite</Text>
              </Text>
              <Text style={[styles.drawerItem, { color: theme.textSecondary }]}>
                • Ground Station: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>IMD {selectedCity.name} AWS Mesonet</Text>
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topActionBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    gap: 6,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: radii.full,
    paddingHorizontal: 12,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    height: '100%',
  },
  regionScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  regionChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  regionChipText: {
    fontSize: 10,
  },
  layerBar: {
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
  },
  layerScroll: {
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  layerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    opacity: 0.35,
    paddingLeft: 8,
  },
  coordTag: {
    fontSize: 9,
    marginTop: 2,
    fontWeight: '600',
  },
  lonLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.35,
  },
  zoomContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  radarCloud: {
    position: 'absolute',
    borderRadius: 80,
    filter: 'blur(20px)',
  },
  radarCore: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    width: '40%',
    height: '40%',
    backgroundColor: '#7F1D1D',
    borderRadius: 30,
    filter: 'blur(10px)',
  },
  windVectorBox: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: radii.md,
  },
  windVectorText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  thermalBand: {
    position: 'absolute',
    borderRadius: 60,
    filter: 'blur(22px)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thermalText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  aqiPolygon: {
    position: 'absolute',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aqiPolygonText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  alertZone: {
    position: 'absolute',
    padding: 8,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertZoneText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EA580C',
  },
  satelliteCloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 90,
    filter: 'blur(30px)',
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    color: '#FFFFFF',
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  floatingControls: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    gap: 8,
  },
  floatingBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  legendBox: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  legendTitle: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 4,
  },
  scaleBarRow: {
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scaleBlock: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: 'center',
  },
  scaleText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#0F172A',
  },
  timelinePlayerBar: {
    position: 'absolute',
    bottom: 175,
    left: spacing.md,
    right: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.xs,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 6,
  },
  desktopTimeline: {
    maxWidth: 520,
    left: spacing.xl,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineStepsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  timeStepBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radii.md,
  },
  timeStepText: {
    fontSize: 10,
  },
  timeStepTitle: {
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    paddingRight: 6,
  },
  telemetryOverlay: {
    position: 'absolute',
    bottom: spacing.md,
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
    maxWidth: 520,
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
    fontSize: 15,
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
    fontSize: 11,
    marginTop: 2,
  },
  telemetryTempBlock: {
    alignItems: 'flex-end',
  },
  telemetryTemp: {
    fontSize: 22,
    fontWeight: '900',
  },
  telemetryDbz: {
    fontSize: 9,
  },
  telemetryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  telemetryMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  telemetryMetricVal: {
    fontSize: 10,
    fontWeight: '600',
  },
  cityAdvisoryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: 4,
  },
  cityAdvisoryTitle: {
    fontSize: 10,
    fontWeight: '800',
  },
  cityAdvisoryDesc: {
    fontSize: 10,
    lineHeight: 14,
    marginTop: 1,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
  },
  expandBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  expandedDrawer: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    gap: 3,
  },
  drawerItem: {
    fontSize: 10,
  },
});
