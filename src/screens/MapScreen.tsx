import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  useWindowDimensions,
  Animated,
  Easing
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export interface MapCityPoint {
  id: string;
  name: string;
  countryOrState: string;
  scope: 'india' | 'world';
  continentOrRegion: string;
  x: number; // percentage across canvas
  y: number; // percentage down canvas
  temp: number;
  condition: string;
  rainProb: number;
  windSpeed: number;
  windDir: string;
  aqi: number;
  humidity: number;
  pressure: number;
  timeZoneOffset: string;
  alert?: { level: 'orange' | 'red' | 'yellow'; title: string; advisory: string };
  radarDbz: number;
}

const ALL_CITIES: MapCityPoint[] = [
  // --- INDIA NATIONAL METEOROLOGICAL NETWORK (IMD DWR Mesonet) ---
  // Coordinates meticulously calibrated for non-overlapping clarity across mobile screens
  { id: 'srinagar', name: 'Srinagar Valley', countryOrState: 'J&K, India', scope: 'india', continentOrRegion: 'North', x: 34, y: 10, temp: 19, condition: 'Mountain Drizzle', rainProb: 45, windSpeed: 12, windDir: 'NW', aqi: 42, humidity: 62, pressure: 1014, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 28 },
  { id: 'shimla', name: 'Shimla Ridge', countryOrState: 'HP, India', scope: 'india', continentOrRegion: 'North', x: 45, y: 17, temp: 17, condition: 'Dense Fog & Mist', rainProb: 60, windSpeed: 14, windDir: 'NE', aqi: 35, humidity: 88, pressure: 1012, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 36 },
  { id: 'delhi', name: 'New Delhi (NCR)', countryOrState: 'Delhi, India', scope: 'india', continentOrRegion: 'North', x: 36, y: 26, temp: 31, condition: 'Thunderstorm & Squall', rainProb: 82, windSpeed: 28, windDir: 'ENE', aqi: 142, humidity: 78, pressure: 1008, timeZoneOffset: 'IST (UTC+5:30)', alert: { level: 'orange', title: 'Orange Warning: Heavy Rain & Squall', advisory: 'Peak thunderstorm intensity between 18:30–21:00 IST' }, radarDbz: 52 },
  { id: 'jaipur', name: 'Jaipur', countryOrState: 'Rajasthan, India', scope: 'india', continentOrRegion: 'West', x: 24, y: 33, temp: 33, condition: 'Partly Cloudy & Dry', rainProb: 20, windSpeed: 16, windDir: 'W', aqi: 110, humidity: 48, pressure: 1009, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 15 },
  { id: 'guwahati', name: 'Guwahati', countryOrState: 'Assam, India', scope: 'india', continentOrRegion: 'East', x: 82, y: 29, temp: 28, condition: 'Heavy Rain & Gusts', rainProb: 70, windSpeed: 20, windDir: 'NE', aqi: 48, humidity: 91, pressure: 1009, timeZoneOffset: 'IST (UTC+5:30)', alert: { level: 'yellow', title: 'Yellow Alert: Water Surge', advisory: 'Low-lying riparian banks on caution for river rise' }, radarDbz: 46 },
  { id: 'kolkata', name: 'Kolkata Delta', countryOrState: 'West Bengal, India', scope: 'india', continentOrRegion: 'East', x: 72, y: 44, temp: 31, condition: 'Humid Overcast', rainProb: 65, windSpeed: 24, windDir: 'SW', aqi: 88, humidity: 86, pressure: 1006, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 42 },
  { id: 'mumbai', name: 'Mumbai Colaba', countryOrState: 'Maharashtra, India', scope: 'india', continentOrRegion: 'West', x: 23, y: 54, temp: 30, condition: 'Monsoon Showers', rainProb: 50, windSpeed: 26, windDir: 'WSW', aqi: 78, humidity: 84, pressure: 1008, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 39 },
  { id: 'hyderabad', name: 'Hyderabad', countryOrState: 'Telangana, India', scope: 'india', continentOrRegion: 'South', x: 46, y: 60, temp: 29, condition: 'Breezy & Fair', rainProb: 25, windSpeed: 18, windDir: 'SE', aqi: 82, humidity: 59, pressure: 1011, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 18 },
  { id: 'bengaluru', name: 'Bengaluru IT Hub', countryOrState: 'Karnataka, India', scope: 'india', continentOrRegion: 'South', x: 38, y: 68, temp: 25, condition: 'Pleasant & Cloud Deck', rainProb: 30, windSpeed: 16, windDir: 'SW', aqi: 54, humidity: 64, pressure: 1014, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 20 },
  { id: 'chennai', name: 'Chennai Marina', countryOrState: 'Tamil Nadu, India', scope: 'india', continentOrRegion: 'South', x: 58, y: 68, temp: 32, condition: 'Warm Coastal Sunshine', rainProb: 15, windSpeed: 19, windDir: 'SE', aqi: 68, humidity: 71, pressure: 1010, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 12 },
  { id: 'kochi', name: 'Kochi Harbor', countryOrState: 'Kerala, India', scope: 'india', continentOrRegion: 'South', x: 34, y: 76, temp: 29, condition: 'Squally Winds & Rough Swell', rainProb: 95, windSpeed: 42, windDir: 'SSW', aqi: 38, humidity: 92, pressure: 1005, timeZoneOffset: 'IST (UTC+5:30)', alert: { level: 'red', title: 'RED ALERT: Extreme Marine Squall', advisory: 'Deep sea fishing strictly prohibited; wave swell exceeding 3.4m' }, radarDbz: 58 },

  // --- GLOBAL WORLD METEOROLOGICAL NETWORK (WMO) ---
  { id: 'tokyo', name: 'Tokyo Metropolis', countryOrState: 'Japan', scope: 'world', continentOrRegion: 'Asia-Pacific', x: 84, y: 32, temp: 22, condition: 'Passing Pacific Showers', rainProb: 60, windSpeed: 21, windDir: 'E', aqi: 24, humidity: 72, pressure: 1013, timeZoneOffset: 'JST (UTC+9)', radarDbz: 35 },
  { id: 'singapore', name: 'Singapore', countryOrState: 'Singapore', scope: 'world', continentOrRegion: 'Asia-Pacific', x: 74, y: 54, temp: 30, condition: 'Equatorial Thunderstorm', rainProb: 80, windSpeed: 18, windDir: 'NE', aqi: 32, humidity: 88, pressure: 1009, timeZoneOffset: 'SGT (UTC+8)', alert: { level: 'yellow', title: 'Lightning Risk Alert', advisory: 'Frequent cloud-to-ground lightning in Marina Bay area' }, radarDbz: 48 },
  { id: 'dubai', name: 'Dubai', countryOrState: 'United Arab Emirates', scope: 'world', continentOrRegion: 'Middle East & Africa', x: 58, y: 36, temp: 38, condition: 'Sunny & Desert Haze', rainProb: 5, windSpeed: 16, windDir: 'NW', aqi: 118, humidity: 44, pressure: 1008, timeZoneOffset: 'GST (UTC+4)', radarDbz: 10 },
  { id: 'bangkok', name: 'Bangkok', countryOrState: 'Thailand', scope: 'world', continentOrRegion: 'Asia-Pacific', x: 70, y: 44, temp: 32, condition: 'Tropical Downpour', rainProb: 75, windSpeed: 19, windDir: 'SW', aqi: 62, humidity: 85, pressure: 1007, timeZoneOffset: 'ICT (UTC+7)', radarDbz: 44 },
  { id: 'london', name: 'London', countryOrState: 'United Kingdom', scope: 'world', continentOrRegion: 'Europe', x: 44, y: 20, temp: 16, condition: 'Overcast & Light Drizzle', rainProb: 65, windSpeed: 26, windDir: 'W', aqi: 28, humidity: 81, pressure: 1016, timeZoneOffset: 'BST (UTC+1)', radarDbz: 30 },
  { id: 'paris', name: 'Paris', countryOrState: 'France', scope: 'world', continentOrRegion: 'Europe', x: 46, y: 26, temp: 18, condition: 'Partly Cloudy & Breeze', rainProb: 35, windSpeed: 18, windDir: 'WNW', aqi: 34, humidity: 66, pressure: 1018, timeZoneOffset: 'CEST (UTC+2)', radarDbz: 20 },
  { id: 'frankfurt', name: 'Frankfurt', countryOrState: 'Germany', scope: 'world', continentOrRegion: 'Europe', x: 50, y: 21, temp: 17, condition: 'Mild Rain Bands', rainProb: 50, windSpeed: 17, windDir: 'NW', aqi: 22, humidity: 74, pressure: 1017, timeZoneOffset: 'CEST (UTC+2)', radarDbz: 28 },
  { id: 'moscow', name: 'Moscow', countryOrState: 'Russia', scope: 'world', continentOrRegion: 'Europe', x: 56, y: 16, temp: 11, condition: 'Cold Breezy & Rain', rainProb: 55, windSpeed: 24, windDir: 'NNE', aqi: 19, humidity: 79, pressure: 1020, timeZoneOffset: 'MSK (UTC+3)', radarDbz: 32 },
  { id: 'newyork', name: 'New York City', countryOrState: 'United States', scope: 'world', continentOrRegion: 'North America', x: 25, y: 27, temp: 21, condition: 'Atlantic Breeze & Sun', rainProb: 20, windSpeed: 22, windDir: 'SSW', aqi: 45, humidity: 55, pressure: 1015, timeZoneOffset: 'EDT (UTC-4)', radarDbz: 14 },
  { id: 'sanfrancisco', name: 'San Francisco', countryOrState: 'United States', scope: 'world', continentOrRegion: 'North America', x: 12, y: 29, temp: 17, condition: 'Coastal Marine Fog', rainProb: 15, windSpeed: 28, windDir: 'W', aqi: 36, humidity: 82, pressure: 1014, timeZoneOffset: 'PDT (UTC-7)', radarDbz: 18 },
  { id: 'chicago', name: 'Chicago', countryOrState: 'United States', scope: 'world', continentOrRegion: 'North America', x: 19, y: 26, temp: 19, condition: 'Lake Breeze & Clouds', rainProb: 30, windSpeed: 32, windDir: 'NE', aqi: 52, humidity: 62, pressure: 1017, timeZoneOffset: 'CDT (UTC-5)', radarDbz: 22 },
  { id: 'miami', name: 'Miami Coast', countryOrState: 'United States', scope: 'world', continentOrRegion: 'North America', x: 23, y: 39, temp: 31, condition: 'Tropical Squalls', rainProb: 70, windSpeed: 29, windDir: 'ESE', aqi: 28, humidity: 84, pressure: 1010, timeZoneOffset: 'EDT (UTC-4)', alert: { level: 'yellow', title: 'Rip Current & Storm Advisory', advisory: 'Rough surf and coastal rain cells' }, radarDbz: 42 },
  { id: 'saopaulo', name: 'São Paulo', countryOrState: 'Brazil', scope: 'world', continentOrRegion: 'South America', x: 33, y: 70, temp: 24, condition: 'Scattered Showers', rainProb: 60, windSpeed: 17, windDir: 'SE', aqi: 65, humidity: 76, pressure: 1018, timeZoneOffset: 'BRT (UTC-3)', radarDbz: 32 },
  { id: 'cairo', name: 'Cairo Nile', countryOrState: 'Egypt', scope: 'world', continentOrRegion: 'Middle East & Africa', x: 51, y: 34, temp: 33, condition: 'Clear Sky & Heat', rainProb: 0, windSpeed: 19, windDir: 'NNW', aqi: 112, humidity: 38, pressure: 1012, timeZoneOffset: 'EEST (UTC+3)', radarDbz: 5 },
  { id: 'sydney', name: 'Sydney Harbor', countryOrState: 'Australia', scope: 'world', continentOrRegion: 'Oceania', x: 88, y: 75, temp: 20, condition: 'Sunny & Crisp Breeze', rainProb: 15, windSpeed: 25, windDir: 'S', aqi: 18, humidity: 58, pressure: 1021, timeZoneOffset: 'AEST (UTC+10)', radarDbz: 12 },
  { id: 'nairobi', name: 'Nairobi', countryOrState: 'Kenya', scope: 'world', continentOrRegion: 'Middle East & Africa', x: 53, y: 55, temp: 25, condition: 'Highland Mild Sun', rainProb: 30, windSpeed: 14, windDir: 'E', aqi: 29, humidity: 60, pressure: 1016, timeZoneOffset: 'EAT (UTC+3)', radarDbz: 20 },
];

const TIME_STEPS = [
  { label: '-2h', title: '2 Hours Ago' },
  { label: '-1h', title: '1 Hour Ago' },
  { label: 'Live', title: 'Live Composite Feed' },
  { label: '+1h', title: '+1h Nowcast' },
  { label: '+2h', title: '+2h Forecast' },
];

export const MapScreen: React.FC = () => {
  const { theme, themeMode } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;

  // Scope: 'india' vs 'world'
  const [mapScope, setMapScope] = useState<'india' | 'world'>('india');
  
  // Layer state
  const [activeLayer, setActiveLayer] = useState<'radar' | 'wind' | 'temp' | 'aqi' | 'alerts'>('radar');
  const [selectedCity, setSelectedCity] = useState<MapCityPoint>(ALL_CITIES[2]); // Default Delhi
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  // Radar timeline player
  const [timeStepIndex, setTimeStepIndex] = useState<number>(2); // 2 is 'Live'
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [expandedDetails, setExpandedDetails] = useState<boolean>(false);

  // Radar continuous sweep animation
  const sweepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sweepLoop = Animated.loop(
      Animated.timing(sweepAnim, {
        toValue: 1,
        duration: 3800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    sweepLoop.start();
    return () => sweepLoop.stop();
  }, [sweepAnim]);

  const spin = sweepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Auto timeline loop
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

  // Adjust default city and region when scope changes
  const handleScopeChange = (newScope: 'india' | 'world') => {
    setMapScope(newScope);
    setSelectedRegion('All');
    setZoomLevel(1);
    if (newScope === 'world') {
      setSelectedCity(ALL_CITIES.find(c => c.id === 'london') || ALL_CITIES[11]);
    } else {
      setSelectedCity(ALL_CITIES.find(c => c.id === 'delhi') || ALL_CITIES[2]);
    }
  };

  const regionOptions = mapScope === 'india'
    ? ['All', 'North', 'West', 'South', 'East']
    : ['All', 'Asia-Pacific', 'Europe', 'North America', 'Middle East', 'South America', 'Oceania'];

  const filteredCities = ALL_CITIES.filter((city) => {
    const matchesScope = city.scope === mapScope;
    const matchesRegion = selectedRegion === 'All' || city.continentOrRegion === selectedRegion;
    const matchesSearch = searchQuery === '' || 
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      city.countryOrState.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesScope && matchesRegion && matchesSearch;
  });

  const layers: { key: 'radar' | 'wind' | 'temp' | 'aqi' | 'alerts'; label: string; icon: any; legend: string }[] = [
    { key: 'radar', label: 'Doppler dBZ', icon: 'weather-pouring', legend: 'Precipitation Reflectivity (dBZ)' },
    { key: 'wind', label: 'Wind Vectors', icon: 'weather-windy', legend: 'Atmospheric Wind Surface Flow' },
    { key: 'temp', label: 'Heatmap °C', icon: 'thermometer', legend: 'Ambient Surface Temperature' },
    { key: 'aqi', label: 'AQI Quality', icon: 'air-filter', legend: 'Air Quality Index & Particulates' },
    { key: 'alerts', label: 'IMD Warnings', icon: 'alert-rhombus', legend: 'Severe Weather Warning Zones' },
  ];

  const currentLayerObj = layers.find(l => l.key === activeLayer) || layers[0];
  const timeOffset = (timeStepIndex - 2) * 12;

  // City pin color resolver with guaranteed high contrast (no white-on-white)
  const getPinColors = (city: MapCityPoint, isSelected: boolean) => {
    if (city.alert?.level === 'red') {
      return { bg: '#DC2626', border: '#991B1B', text: '#FFFFFF', dot: '#FCA5A5' };
    }
    if (city.alert?.level === 'orange') {
      return { bg: '#EA580C', border: '#C2410C', text: '#FFFFFF', dot: '#FDBA74' };
    }
    if (city.alert?.level === 'yellow') {
      // Yellow alert with dark legible text
      return { bg: '#FEF08A', border: '#EAB308', text: '#713F12', dot: '#CA8A04' };
    }
    if (isSelected) {
      return { bg: theme.primary, border: '#FFFFFF', text: '#FFFFFF', dot: '#FFFFFF' };
    }
    return { 
      bg: themeMode === 'dark' ? '#1E293B' : '#FFFFFF', 
      border: theme.primary, 
      text: themeMode === 'dark' ? '#F8FAFC' : '#0F172A',
      dot: theme.primary
    };
  };

  return (
    <View style={styles.container}>
      {/* 🇮🇳 / 🌍 Top Controls Toolbar */}
      <View style={[styles.topControlToolbar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {/* Responsive Segmented Scope Switcher */}
        <View style={styles.segmentedRow}>
          <TouchableOpacity
            style={[
              styles.segmentedTab,
              mapScope === 'india' && { backgroundColor: theme.primary, shadowColor: theme.primary, shadowOpacity: 0.3, shadowRadius: 4 }
            ]}
            onPress={() => handleScopeChange('india')}
          >
            <Text style={styles.segmentedFlag}>🇮🇳</Text>
            <Text style={[styles.segmentedText, { color: mapScope === 'india' ? '#FFFFFF' : theme.textPrimary, fontWeight: mapScope === 'india' ? '800' : '600' }]}>
              India IMD Radar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentedTab,
              mapScope === 'world' && { backgroundColor: theme.primary, shadowColor: theme.primary, shadowOpacity: 0.3, shadowRadius: 4 }
            ]}
            onPress={() => handleScopeChange('world')}
          >
            <Text style={styles.segmentedFlag}>🌍</Text>
            <Text style={[styles.segmentedText, { color: mapScope === 'world' ? '#FFFFFF' : theme.textPrimary, fontWeight: mapScope === 'world' ? '800' : '600' }]}>
              Global WMO Map
            </Text>
          </TouchableOpacity>
        </View>

        {/* Compact Region & Layer Scroll Filter */}
        <View style={styles.filterPillsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsScroll}>
            {/* Layers */}
            {layers.map((l) => {
              const isSelected = activeLayer === l.key;
              return (
                <TouchableOpacity
                  key={l.key}
                  style={[
                    styles.compactLayerChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle,
                      borderColor: isSelected ? theme.primary : theme.border,
                    }
                  ]}
                  onPress={() => setActiveLayer(l.key)}
                >
                  <MaterialCommunityIcons 
                    name={l.icon} 
                    size={13} 
                    color={isSelected ? '#FFFFFF' : theme.textSecondary} 
                  />
                  <Text style={[styles.compactChipText, { color: isSelected ? '#FFFFFF' : theme.textPrimary, fontWeight: isSelected ? '700' : '500' }]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />

            {/* Region Filter */}
            {regionOptions.map((r) => {
              const isSel = selectedRegion === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.compactRegionChip,
                    {
                      backgroundColor: isSel ? theme.primaryDark : theme.surfaceSubtle,
                      borderColor: isSel ? theme.primaryDark : theme.border,
                    }
                  ]}
                  onPress={() => setSelectedRegion(r)}
                >
                  <Text style={[styles.compactChipText, { color: isSel ? '#FFFFFF' : theme.textSecondary, fontWeight: isSel ? '700' : '500' }]}>
                    {r === 'All' ? (mapScope === 'india' ? 'All India' : 'Globe') : r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Main Meteorological Radar Viewport Canvas */}
      <View style={[styles.mapCanvas, { backgroundColor: themeMode === 'dark' ? '#090D16' : '#EFF6FF' }]}>
        
        {/* Dynamic Zoom & Pan Container */}
        <View style={[styles.zoomContainer, { transform: [{ scale: zoomLevel }] }]}>
          
          {/* Coordinates Grid Lines */}
          <View style={styles.gridOverlay}>
            {mapScope === 'india' ? (
              <>
                <View style={[styles.latLine, { top: '14%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.coordTag, { color: theme.textMuted }]}>32°N (Himalayas)</Text>
                </View>
                <View style={[styles.latLine, { top: '26%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.coordTag, { color: theme.textMuted }]}>28°N (Delhi DWR)</Text>
                </View>
                <View style={[styles.latLine, { top: '48%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.coordTag, { color: theme.textMuted }]}>22°N (Tropic of Cancer)</Text>
                </View>
                <View style={[styles.latLine, { top: '74%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.coordTag, { color: theme.textMuted }]}>13°N (Bengaluru / Chennai)</Text>
                </View>
                <View style={[styles.lonLine, { left: '36%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.lonTag, { color: theme.textMuted }]}>77°E</Text>
                </View>
                <View style={[styles.lonLine, { left: '72%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.lonTag, { color: theme.textMuted }]}>88°E</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[styles.latLine, { top: '22%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.coordTag, { color: theme.textMuted }]}>50°N (Europe / Canada)</Text>
                </View>
                <View style={[styles.latLine, { top: '35%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.coordTag, { color: theme.textMuted }]}>23.5°N (Tropic of Cancer)</Text>
                </View>
                <View style={[styles.latLine, { top: '50%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.coordTag, { color: theme.textMuted }]}>0° (Equator / ITCZ)</Text>
                </View>
                <View style={[styles.latLine, { top: '70%', borderColor: theme.borderLight }]}>
                  <Text style={[styles.coordTag, { color: theme.textMuted }]}>23.5°S (Tropic of Capricorn)</Text>
                </View>
              </>
            )}
          </View>

          {/* GEOGRAPHIC BASEMAP: India Silhouette & Water Bodies */}
          {mapScope === 'india' && (
            <View style={styles.geoMapLayer}>
              {/* Himalayan Orographic Ridge Graphic */}
              <View style={[styles.himalayaRidge, { backgroundColor: themeMode === 'dark' ? 'rgba(71, 85, 105, 0.25)' : 'rgba(203, 213, 225, 0.5)' }]}>
                <Text style={[styles.watermarkLabel, { color: themeMode === 'dark' ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.45)' }]}>
                  🏔️ HIMALAYAN HIGH OROGRAPHIC RIDGE
                </Text>
              </View>

              {/* India Peninsular Silhouette Mass (Stylized Coastline) */}
              <View style={styles.peninsulaShapeContainer}>
                {/* North & Central Dome */}
                <View style={[styles.geoRegionNorthern, { backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.7)' }]} />
                {/* Gujarat Kutch Bulge */}
                <View style={[styles.geoRegionGujarat, { backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.35)' : 'rgba(241, 245, 249, 0.65)' }]} />
                {/* Deccan Peninsula Taper */}
                <View style={[styles.geoRegionDeccan, { backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.35)' : 'rgba(241, 245, 249, 0.65)' }]} />
                {/* Northeast Seven Sisters */}
                <View style={[styles.geoRegionNortheast, { backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.35)' : 'rgba(241, 245, 249, 0.65)' }]} />
              </View>

              {/* Maritime Ocean Watermarks */}
              <View style={[styles.seaLabelBox, { left: '8%', top: '58%' }]}>
                <Text style={[styles.seaName, { color: themeMode === 'dark' ? '#38BDF8' : '#0284C7' }]}>
                  ARABIAN SEA
                </Text>
                <Text style={[styles.seaSub, { color: theme.textMuted }]}>
                  अरब सागर • 1008 hPa
                </Text>
              </View>

              <View style={[styles.seaLabelBox, { right: '8%', top: '56%' }]}>
                <Text style={[styles.seaName, { color: themeMode === 'dark' ? '#38BDF8' : '#0284C7' }]}>
                  BAY OF BENGAL
                </Text>
                <Text style={[styles.seaSub, { color: theme.textMuted }]}>
                  बंगाल की खाड़ी • Low Shear
                </Text>
              </View>

              <View style={[styles.seaLabelBox, { alignSelf: 'center', top: '88%' }]}>
                <Text style={[styles.seaName, { color: themeMode === 'dark' ? '#38BDF8' : '#0284C7', textAlign: 'center' }]}>
                  INDIAN OCEAN • हिन्द महासागर
                </Text>
              </View>

              {/* Island Territories */}
              <View style={[styles.islandPin, { left: '20%', top: '78%' }]}>
                <Text style={styles.islandText}>🌴 Lakshadweep</Text>
              </View>
              <View style={[styles.islandPin, { right: '14%', top: '72%' }]}>
                <Text style={styles.islandText}>🏝️ Andaman & Nicobar</Text>
              </View>

              {/* IMD Doppler Weather Radar Range Rings centered on Delhi (36%, 26%) */}
              <View style={[styles.radarRing, { left: '36%', top: '26%', width: 140, height: 140, marginLeft: -70, marginTop: -70 }]}>
                <Text style={[styles.rangeRingTag, { color: theme.textMuted }]}>100 km DWR</Text>
              </View>
              <View style={[styles.radarRing, { left: '36%', top: '26%', width: 260, height: 260, marginLeft: -130, marginTop: -130 }]}>
                <Text style={[styles.rangeRingTag, { color: theme.textMuted }]}>250 km DWR</Text>
              </View>

              {/* Rotating Doppler Radar Sweep Beam */}
              <Animated.View 
                style={[
                  styles.radarSweepContainer, 
                  { 
                    left: '36%', 
                    top: '26%', 
                    transform: [{ rotate: spin }] 
                  }
                ]}
              >
                <LinearGradient
                  colors={['rgba(56, 189, 248, 0.28)', 'rgba(56, 189, 248, 0.05)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sweepCone}
                />
              </Animated.View>
            </View>
          )}

          {/* World Mode Continents Graphic */}
          {mapScope === 'world' && (
            <View style={styles.geoMapLayer}>
              <View style={[styles.worldContinent, { left: '16%', top: '24%', width: '18%', height: '24%', backgroundColor: 'rgba(56, 189, 248, 0.08)' }]}>
                <Text style={[styles.continentText, { color: theme.textMuted }]}>NORTH AMERICA</Text>
              </View>
              <View style={[styles.worldContinent, { left: '24%', top: '56%', width: '16%', height: '28%', backgroundColor: 'rgba(56, 189, 248, 0.08)' }]}>
                <Text style={[styles.continentText, { color: theme.textMuted }]}>SOUTH AMERICA</Text>
              </View>
              <View style={[styles.worldContinent, { left: '44%', top: '18%', width: '18%', height: '20%', backgroundColor: 'rgba(56, 189, 248, 0.08)' }]}>
                <Text style={[styles.continentText, { color: theme.textMuted }]}>EUROPE</Text>
              </View>
              <View style={[styles.worldContinent, { left: '46%', top: '42%', width: '18%', height: '30%', backgroundColor: 'rgba(56, 189, 248, 0.08)' }]}>
                <Text style={[styles.continentText, { color: theme.textMuted }]}>AFRICA</Text>
              </View>
              <View style={[styles.worldContinent, { left: '66%', top: '22%', width: '26%', height: '32%', backgroundColor: 'rgba(56, 189, 248, 0.08)' }]}>
                <Text style={[styles.continentText, { color: theme.textMuted }]}>ASIA</Text>
              </View>
              <View style={[styles.worldContinent, { left: '78%', top: '64%', width: '16%', height: '22%', backgroundColor: 'rgba(56, 189, 248, 0.08)' }]}>
                <Text style={[styles.continentText, { color: theme.textMuted }]}>AUSTRALIA</Text>
              </View>
            </View>
          )}

          {/* ATMOSPHERIC RADAR ECHOES & PRECIPITATION REFLECTIVITY CELLS */}
          {activeLayer === 'radar' && (
            <>
              {mapScope === 'india' ? (
                <>
                  {/* Delhi-NCR / Western UP Squall Cell (52 dBZ - Red/Amber) */}
                  <View 
                    style={[
                      styles.stormCell, 
                      { 
                        left: `${33 + timeOffset * 0.4}%`, 
                        top: `${23 - timeOffset * 0.2}%`, 
                        width: 140, 
                        height: 100 
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={['rgba(220, 38, 38, 0.65)', 'rgba(234, 88, 12, 0.45)', 'rgba(34, 197, 94, 0.25)', 'transparent']}
                      style={styles.cellFill}
                    />
                  </View>

                  {/* Kochi / Kerala Coastal Squall Surge (58 dBZ - Severe Red) */}
                  <View 
                    style={[
                      styles.stormCell, 
                      { 
                        left: `${28 + timeOffset * 0.3}%`, 
                        top: `${79 - timeOffset * 0.2}%`, 
                        width: 120, 
                        height: 90 
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={['rgba(239, 68, 68, 0.7)', 'rgba(249, 115, 22, 0.4)', 'rgba(56, 189, 248, 0.2)', 'transparent']}
                      style={styles.cellFill}
                    />
                  </View>

                  {/* Kolkata / Bengal Monsoon Showers (42 dBZ - Yellow/Green) */}
                  <View 
                    style={[
                      styles.stormCell, 
                      { 
                        left: `${66 + timeOffset * 0.3}%`, 
                        top: `${41 - timeOffset * 0.1}%`, 
                        width: 130, 
                        height: 95 
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={['rgba(234, 179, 8, 0.55)', 'rgba(34, 197, 94, 0.4)', 'rgba(2, 132, 199, 0.2)', 'transparent']}
                      style={styles.cellFill}
                    />
                  </View>

                  {/* Assam Riparian Rain Belt (46 dBZ - Orange) */}
                  <View 
                    style={[
                      styles.stormCell, 
                      { 
                        left: `${76 + timeOffset * 0.2}%`, 
                        top: `${26 - timeOffset * 0.1}%`, 
                        width: 120, 
                        height: 75 
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={['rgba(249, 115, 22, 0.55)', 'rgba(234, 179, 8, 0.35)', 'transparent']}
                      style={styles.cellFill}
                    />
                  </View>
                </>
              ) : (
                <>
                  {/* Global Intertropical Convergence Zone (ITCZ) Rain Belt */}
                  <View style={[styles.globalRainBand, { top: '48%', left: '10%', right: '10%', height: 26, backgroundColor: 'rgba(2, 132, 199, 0.22)' }]}>
                    <Text style={styles.globalBandText}>ITCZ Deep Convective Rain Belt (Equatorial Monsoons)</Text>
                  </View>
                  {/* Pacific Typhoon Radar Eye */}
                  <View style={[styles.stormCell, { left: '72%', top: '38%', width: 140, height: 110 }]}>
                    <LinearGradient
                      colors={['rgba(220, 38, 38, 0.65)', 'rgba(234, 88, 12, 0.45)', 'transparent']}
                      style={styles.cellFill}
                    />
                  </View>
                </>
              )}
            </>
          )}

          {/* WIND VECTORS LAYER */}
          {activeLayer === 'wind' && (
            <>
              {mapScope === 'india' ? (
                <>
                  {/* Arabian Sea Southwest Monsoon Flow */}
                  <View style={[styles.windVectorCard, { left: '16%', top: '64%' }]}>
                    <Ionicons name="arrow-up" size={18} color="#38BDF8" style={{ transform: [{ rotate: '40deg' }] }} />
                    <Text style={styles.windVectorText}>42 km/h SSW</Text>
                    <Text style={styles.windVectorSub}>Monsoon Surge</Text>
                  </View>
                  {/* Northern Squall Gusts */}
                  <View style={[styles.windVectorCard, { left: '30%', top: '22%' }]}>
                    <Ionicons name="arrow-down" size={18} color="#EF4444" style={{ transform: [{ rotate: '-45deg' }] }} />
                    <Text style={styles.windVectorText}>28 km/h ENE</Text>
                    <Text style={styles.windVectorSub}>Squall Front</Text>
                  </View>
                  {/* Bay of Bengal Easterly Flow */}
                  <View style={[styles.windVectorCard, { left: '68%', top: '62%' }]}>
                    <Ionicons name="arrow-back" size={18} color="#22C55E" style={{ transform: [{ rotate: '25deg' }] }} />
                    <Text style={styles.windVectorText}>24 km/h SE</Text>
                    <Text style={styles.windVectorSub}>Coastal Sea Breeze</Text>
                  </View>
                </>
              ) : (
                <View style={[styles.jetStreamBox, { top: '24%', left: '15%', width: '70%' }]}>
                  <Text style={styles.jetStreamText}>✈️ Polar Jet Stream: 220 km/h Trans-Continental Flow</Text>
                </View>
              )}
            </>
          )}

          {/* THERMAL HEATMAP LAYER */}
          {activeLayer === 'temp' && (
            <View style={styles.overlayContainer}>
              <View style={[styles.thermalBlob, { left: '18%', top: '30%', width: 180, height: 140, backgroundColor: 'rgba(234, 88, 12, 0.28)' }]} />
              <View style={[styles.thermalBlob, { left: '36%', top: '55%', width: 220, height: 180, backgroundColor: 'rgba(234, 179, 8, 0.22)' }]} />
              <View style={[styles.thermalBlob, { left: '30%', top: '8%', width: 140, height: 80, backgroundColor: 'rgba(56, 189, 248, 0.3)' }]} />
            </View>
          )}

          {/* AQI LAYER */}
          {activeLayer === 'aqi' && (
            <View style={styles.overlayContainer}>
              <View style={[styles.aqiBlob, { left: '30%', top: '24%', width: 160, height: 110, backgroundColor: 'rgba(239, 68, 68, 0.35)' }]}>
                <Text style={styles.aqiBlobText}>AQI 142 (Moderate/Poor)</Text>
              </View>
              <View style={[styles.aqiBlob, { left: '28%', top: '78%', width: 150, height: 90, backgroundColor: 'rgba(34, 197, 94, 0.28)' }]}>
                <Text style={styles.aqiBlobText}>AQI 38 (Good / Clean)</Text>
              </View>
            </View>
          )}

          {/* CYCLONE & HAZARD ZONES LAYER */}
          {activeLayer === 'alerts' && (
            <View style={styles.overlayContainer}>
              <View style={[styles.hazardZoneBox, { left: '26%', top: '22%', width: 180, height: 120, borderColor: '#EA580C' }]}>
                <Text style={styles.hazardZoneTitle}>⚠️ Orange Warning: Thunderstorm Squall</Text>
              </View>
              <View style={[styles.hazardZoneBox, { left: '26%', top: '78%', width: 160, height: 100, borderColor: '#DC2626' }]}>
                <Text style={[styles.hazardZoneTitle, { color: '#DC2626' }]}>🔴 RED ALERT: Marine Squall Surge</Text>
              </View>
            </View>
          )}

          {/* INTERACTIVE WEATHER STATION PINS */}
          {filteredCities.map((city) => {
            const isSelected = selectedCity.id === city.id;
            const colors = getPinColors(city, isSelected);

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
                {/* Active Pulsing Halo Ring */}
                {isSelected && (
                  <View style={[styles.pinHalo, { borderColor: theme.primary }]} />
                )}

                <View 
                  style={[
                    styles.pinMarker,
                    {
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                    }
                  ]}
                >
                  <View style={[styles.pinStatusDot, { backgroundColor: colors.dot }]} />
                  <Text style={[styles.pinText, { color: colors.text }]}>
                    {city.temp}°
                  </Text>
                </View>

                {/* City Name Badge below */}
                <View style={[styles.pinLabelContainer, { backgroundColor: themeMode === 'dark' ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)' }]}>
                  <Text 
                    style={[
                      styles.pinLabel, 
                      { 
                        color: isSelected ? theme.primary : theme.textPrimary,
                        fontWeight: isSelected ? '800' : '600' 
                      }
                    ]} 
                    numberOfLines={1}
                  >
                    {city.name.split(' ')[0]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Floating Zoom & Map Centering Controls */}
        <View style={styles.floatingControls}>
          <TouchableOpacity 
            style={[styles.floatingBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setZoomLevel((z) => Math.min(2.4, z + 0.3))}
            accessibilityLabel="Zoom in"
          >
            <Ionicons name="add" size={17} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.floatingBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setZoomLevel((z) => Math.max(1, z - 0.3))}
            accessibilityLabel="Zoom out"
          >
            <Ionicons name="remove" size={17} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.floatingBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => { setZoomLevel(1); setSelectedRegion('All'); }}
            accessibilityLabel="Reset map view"
          >
            <Ionicons name="scan-outline" size={15} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Legend Scale Card (Top Left Glassmorphism) */}
        <View style={[styles.legendBox, { backgroundColor: theme.surface === '#FFFFFF' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(30, 41, 59, 0.92)', borderColor: theme.border }]}>
          <Text style={[styles.legendTitle, { color: theme.textPrimary }]}>{currentLayerObj.legend}</Text>
          <View style={styles.scaleBarRow}>
            <View style={[styles.scaleBlock, { backgroundColor: '#22C55E' }]}><Text style={styles.scaleText}>20 Low</Text></View>
            <View style={[styles.scaleBlock, { backgroundColor: '#38BDF8' }]}><Text style={styles.scaleText}>35 Mod</Text></View>
            <View style={[styles.scaleBlock, { backgroundColor: '#EAB308' }]}><Text style={styles.scaleText}>45 High</Text></View>
            <View style={[styles.scaleBlock, { backgroundColor: '#EF4444' }]}><Text style={[styles.scaleText, { color: '#FFFFFF' }]}>55+ Sev</Text></View>
          </View>
        </View>

        {/* Radar Timeline Player Bar (Floats above Telemetry Sheet) */}
        <View 
          style={[
            styles.timelinePlayerBar, 
            { 
              backgroundColor: theme.surface === '#FFFFFF' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)', 
              borderColor: theme.border,
              bottom: expandedDetails ? 210 : 124
            }
          ]}
        >
          <TouchableOpacity 
            style={[styles.playBtn, { backgroundColor: theme.primary }]}
            onPress={() => setIsPlaying(!isPlaying)}
            accessibilityLabel={isPlaying ? "Pause timeline" : "Play radar loop"}
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={14} color="#FFFFFF" />
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
                  <Text style={[styles.timeStepText, { color: isCurrentStep ? theme.primary : theme.textMuted, fontWeight: isCurrentStep ? '800' : '600' }]}>
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

        {/* Collapsible Telemetry Bottom Sheet (Floats safely above BottomNav at bottom: 68) */}
        <View 
          style={[
            styles.telemetryOverlay, 
            isDesktop && styles.desktopTelemetry, 
            { 
              backgroundColor: theme.surface === '#FFFFFF' ? 'rgba(255, 255, 255, 0.97)' : 'rgba(30, 41, 59, 0.97)', 
              borderColor: theme.border 
            }
          ]}
        >
          {/* Compact Telemetry Header */}
          <View style={styles.telemetryHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.telemetryTitleRow}>
                <Ionicons name="location-sharp" size={15} color={theme.primary} />
                <Text style={[styles.telemetryCity, { color: theme.textPrimary }]} numberOfLines={1}>
                  {selectedCity.name}
                </Text>
                {selectedCity.alert && (
                  <View style={[styles.alertPill, { backgroundColor: selectedCity.alert.level === 'red' ? '#FEE2E2' : selectedCity.alert.level === 'orange' ? '#FFEDD5' : '#FEF9C3' }]}>
                    <Text style={[styles.alertPillText, { color: selectedCity.alert.level === 'red' ? '#DC2626' : selectedCity.alert.level === 'orange' ? '#EA580C' : '#CA8A04' }]}>
                      {selectedCity.alert.level.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.telemetrySub, { color: theme.textSecondary }]} numberOfLines={1}>
                {selectedCity.countryOrState} • {selectedCity.condition}
              </Text>
            </View>

            {/* Right Temp & Radar Badge */}
            <View style={styles.telemetryTempBlock}>
              <Text style={[styles.telemetryTemp, { color: theme.primary }]}>{selectedCity.temp}°C</Text>
              <Text style={[styles.telemetryDbz, { color: theme.textMuted }]}>{selectedCity.radarDbz} dBZ</Text>
            </View>

            {/* Expand / Minimize Toggle */}
            <TouchableOpacity 
              style={[styles.expandToggleBtn, { backgroundColor: theme.surfaceSubtle }]}
              onPress={() => setExpandedDetails(!expandedDetails)}
              accessibilityLabel="Toggle deep weather details"
            >
              <Ionicons name={expandedDetails ? 'chevron-down' : 'chevron-up'} size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Deep Meteorological Details (Revealed on tap) */}
          {expandedDetails && (
            <View style={styles.expandedContent}>
              {/* Key Atmospheric Telemetry Row */}
              <View style={styles.telemetryMetricsRow}>
                <View style={styles.telemetryMetricItem}>
                  <Ionicons name="rainy-outline" size={13} color={selectedCity.rainProb > 60 ? '#EF4444' : theme.primary} />
                  <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>{selectedCity.rainProb}% Rain</Text>
                </View>
                <View style={styles.telemetryMetricItem}>
                  <Ionicons name="speedometer-outline" size={13} color={theme.textSecondary} />
                  <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>{selectedCity.windSpeed} km/h {selectedCity.windDir}</Text>
                </View>
                <View style={styles.telemetryMetricItem}>
                  <Ionicons name="leaf-outline" size={13} color={theme.accent} />
                  <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>AQI {selectedCity.aqi}</Text>
                </View>
                <View style={styles.telemetryMetricItem}>
                  <Ionicons name="water-outline" size={13} color={theme.primary} />
                  <Text style={[styles.telemetryMetricVal, { color: theme.textPrimary }]}>{selectedCity.humidity}% Hum</Text>
                </View>
              </View>

              {/* Active Hazard Advisory Banner */}
              {selectedCity.alert && (
                <View style={[styles.cityAdvisoryBox, { backgroundColor: selectedCity.alert.level === 'red' ? '#FEE2E2' : '#FFEDD5', borderColor: selectedCity.alert.level === 'red' ? '#F87171' : '#FDBA74' }]}>
                  <MaterialCommunityIcons name="shield-alert-outline" size={15} color={selectedCity.alert.level === 'red' ? '#DC2626' : '#EA580C'} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cityAdvisoryTitle, { color: selectedCity.alert.level === 'red' ? '#DC2626' : '#EA580C' }]}>
                      {selectedCity.alert.title}
                    </Text>
                    <Text style={[styles.cityAdvisoryDesc, { color: '#0F172A' }]}>
                      {selectedCity.alert.advisory}
                    </Text>
                  </View>
                </View>
              )}

              {/* Barometric Pressure & Observation Network */}
              <View style={styles.radarMetaRow}>
                <Text style={[styles.radarMetaText, { color: theme.textSecondary }]}>
                  Pressure: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{selectedCity.pressure} hPa</Text> • Network: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{selectedCity.scope === 'india' ? 'IMD Doppler Mesonet' : 'WMO Radar Grid'}</Text>
                </Text>
              </View>
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
  topControlToolbar: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderBottomWidth: 1,
    gap: 5,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.2)',
  },
  segmentedFlag: {
    fontSize: 13,
  },
  segmentedText: {
    fontSize: 11,
  },
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterPillsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  compactLayerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  compactRegionChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  compactChipText: {
    fontSize: 10,
  },
  verticalDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 3,
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  latLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.25,
    paddingLeft: 8,
  },
  coordTag: {
    fontSize: 8.5,
    marginTop: 2,
    fontWeight: '600',
  },
  lonLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.25,
    paddingTop: 8,
    paddingLeft: 4,
  },
  lonTag: {
    fontSize: 8,
    fontWeight: '600',
  },
  zoomContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  geoMapLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  himalayaRidge: {
    position: 'absolute',
    top: '4%',
    left: '20%',
    right: '15%',
    height: 38,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderStyle: 'dashed',
  },
  watermarkLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  peninsulaShapeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  geoRegionNorthern: {
    position: 'absolute',
    top: '12%',
    left: '28%',
    width: '42%',
    height: '24%',
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },
  geoRegionGujarat: {
    position: 'absolute',
    top: '36%',
    left: '14%',
    width: '24%',
    height: '18%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },
  geoRegionDeccan: {
    position: 'absolute',
    top: '44%',
    left: '25%',
    width: '44%',
    height: '44%',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },
  geoRegionNortheast: {
    position: 'absolute',
    top: '24%',
    right: '8%',
    width: '22%',
    height: '16%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },
  seaLabelBox: {
    position: 'absolute',
    padding: 6,
    borderRadius: radii.sm,
  },
  seaName: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  seaSub: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 1,
  },
  islandPin: {
    position: 'absolute',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  islandText: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '700',
  },
  radarRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.28)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rangeRingTag: {
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  radarSweepContainer: {
    position: 'absolute',
    width: 280,
    height: 280,
    marginLeft: -140,
    marginTop: -140,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  sweepCone: {
    position: 'absolute',
    top: 0,
    left: 140,
    width: 140,
    height: 140,
    borderTopRightRadius: 140,
  },
  worldContinent: {
    position: 'absolute',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continentText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stormCell: {
    position: 'absolute',
    borderRadius: 60,
    overflow: 'hidden',
  },
  cellFill: {
    flex: 1,
    borderRadius: 60,
  },
  globalRainBand: {
    position: 'absolute',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  globalBandText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0284C7',
  },
  windVectorCard: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  windVectorText: {
    color: '#F8FAFC',
    fontSize: 8.5,
    fontWeight: '800',
  },
  windVectorSub: {
    color: '#94A3B8',
    fontSize: 7.5,
    marginTop: 1,
  },
  jetStreamBox: {
    position: 'absolute',
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
  },
  jetStreamText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0284C7',
    textAlign: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  thermalBlob: {
    position: 'absolute',
    borderRadius: 90,
  },
  aqiBlob: {
    position: 'absolute',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  aqiBlobText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  hazardZoneBox: {
    position: 'absolute',
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 6,
  },
  hazardZoneTitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#EA580C',
  },
  cityPin: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 10,
  },
  pinHalo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    top: -8,
    opacity: 0.6,
  },
  pinMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: radii.full,
    borderWidth: 1.5,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  pinStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  pinText: {
    fontSize: 10,
    fontWeight: '800',
  },
  pinLabelContainer: {
    marginTop: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  pinLabel: {
    fontSize: 9,
  },
  floatingControls: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    gap: 6,
    zIndex: 20,
  },
  floatingBtn: {
    width: 32,
    height: 32,
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
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radii.md,
    borderWidth: 1,
    zIndex: 20,
  },
  legendTitle: {
    fontSize: 8.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  scaleBarRow: {
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scaleBlock: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    alignItems: 'center',
  },
  scaleText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  timelinePlayerBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    borderRadius: radii.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 30,
  },
  playBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineStepsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  timeStepBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  timeStepText: {
    fontSize: 9.5,
  },
  timeStepTitle: {
    fontSize: 9,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    paddingRight: 4,
  },
  telemetryOverlay: {
    position: 'absolute',
    bottom: 68,
    left: spacing.md,
    right: spacing.md,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderWidth: 1,
    elevation: 9,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 40,
  },
  desktopTelemetry: {
    maxWidth: 540,
    left: spacing.xl,
  },
  telemetryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  telemetryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  telemetryCity: {
    fontSize: 13,
    fontWeight: '800',
    maxWidth: 160,
  },
  alertPill: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  alertPillText: {
    fontSize: 8,
    fontWeight: '800',
  },
  telemetrySub: {
    fontSize: 10,
    marginTop: 1,
  },
  telemetryTempBlock: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  telemetryTemp: {
    fontSize: 18,
    fontWeight: '900',
  },
  telemetryDbz: {
    fontSize: 8,
  },
  expandToggleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContent: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    gap: 5,
  },
  telemetryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  telemetryMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  telemetryMetricVal: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  cityAdvisoryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: 6,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  cityAdvisoryTitle: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  cityAdvisoryDesc: {
    fontSize: 9,
    lineHeight: 13,
    marginTop: 1,
  },
  radarMetaRow: {
    paddingVertical: 2,
  },
  radarMetaText: {
    fontSize: 9,
  },
});
