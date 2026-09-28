import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  useWindowDimensions 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
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
  // --- INDIA NATIONAL METEOROLOGICAL NETWORK ---
  { id: 'delhi', name: 'New Delhi (NCR)', countryOrState: 'Delhi, India', scope: 'india', continentOrRegion: 'North', x: 38, y: 26, temp: 31, condition: 'Thunderstorm with Squall', rainProb: 82, windSpeed: 28, windDir: 'ENE', aqi: 142, humidity: 78, pressure: 1008, timeZoneOffset: 'IST (UTC+5:30)', alert: { level: 'orange', title: 'Orange Warning: Heavy Rain & Squall', advisory: 'Peak thunderstorm intensity between 18:30–21:00 IST' }, radarDbz: 52 },
  { id: 'mumbai', name: 'Mumbai Colaba', countryOrState: 'Maharashtra, India', scope: 'india', continentOrRegion: 'West', x: 26, y: 56, temp: 30, condition: 'Monsoon Showers', rainProb: 50, windSpeed: 26, windDir: 'WSW', aqi: 78, humidity: 84, pressure: 1008, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 39 },
  { id: 'bengaluru', name: 'Bengaluru IT Hub', countryOrState: 'Karnataka, India', scope: 'india', continentOrRegion: 'South', x: 38, y: 74, temp: 25, condition: 'Pleasant & Cloud Deck', rainProb: 30, windSpeed: 16, windDir: 'SW', aqi: 54, humidity: 64, pressure: 1014, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 20 },
  { id: 'kolkata', name: 'Kolkata Delta', countryOrState: 'West Bengal, India', scope: 'india', continentOrRegion: 'East', x: 67, y: 44, temp: 31, condition: 'Humid Overcast', rainProb: 65, windSpeed: 24, windDir: 'SW', aqi: 88, humidity: 86, pressure: 1006, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 42 },
  { id: 'chennai', name: 'Chennai Marina', countryOrState: 'Tamil Nadu, India', scope: 'india', continentOrRegion: 'South', x: 48, y: 73, temp: 32, condition: 'Warm & Coastal Sunshine', rainProb: 15, windSpeed: 19, windDir: 'SE', aqi: 68, humidity: 71, pressure: 1010, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 12 },
  { id: 'kochi', name: 'Kochi Harbor', countryOrState: 'Kerala, India', scope: 'india', continentOrRegion: 'South', x: 35, y: 84, temp: 29, condition: 'Squally Winds & Rough Swell', rainProb: 95, windSpeed: 42, windDir: 'SSW', aqi: 38, humidity: 92, pressure: 1005, timeZoneOffset: 'IST (UTC+5:30)', alert: { level: 'red', title: 'RED ALERT: Extreme Marine Squall', advisory: 'Deep sea fishing strictly prohibited; wave swell exceeding 3.4m' }, radarDbz: 58 },
  { id: 'srinagar', name: 'Srinagar Valley', countryOrState: 'J&K, India', scope: 'india', continentOrRegion: 'North', x: 30, y: 12, temp: 19, condition: 'Mountain Drizzle', rainProb: 45, windSpeed: 12, windDir: 'NW', aqi: 42, humidity: 62, pressure: 1014, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 28 },
  { id: 'shimla', name: 'Shimla Ridge', countryOrState: 'HP, India', scope: 'india', continentOrRegion: 'North', x: 36, y: 19, temp: 17, condition: 'Dense Fog & Mist', rainProb: 60, windSpeed: 14, windDir: 'NE', aqi: 35, humidity: 88, pressure: 1012, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 36 },
  { id: 'jaipur', name: 'Jaipur', countryOrState: 'Rajasthan, India', scope: 'india', continentOrRegion: 'West', x: 33, y: 32, temp: 33, condition: 'Partly Cloudy & Dry', rainProb: 20, windSpeed: 16, windDir: 'W', aqi: 110, humidity: 48, pressure: 1009, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 15 },
  { id: 'guwahati', name: 'Guwahati', countryOrState: 'Assam, India', scope: 'india', continentOrRegion: 'East', x: 78, y: 31, temp: 28, condition: 'Heavy Rain & Gusts', rainProb: 70, windSpeed: 20, windDir: 'NE', aqi: 48, humidity: 91, pressure: 1009, timeZoneOffset: 'IST (UTC+5:30)', alert: { level: 'yellow', title: 'Yellow Alert: Water Surge', advisory: 'Low-lying riparian banks on caution for river rise' }, radarDbz: 46 },
  { id: 'hyderabad', name: 'Hyderabad', countryOrState: 'Telangana, India', scope: 'india', continentOrRegion: 'South', x: 42, y: 60, temp: 29, condition: 'Breezy & Fair', rainProb: 25, windSpeed: 18, windDir: 'SE', aqi: 82, humidity: 59, pressure: 1011, timeZoneOffset: 'IST (UTC+5:30)', radarDbz: 18 },

  // --- GLOBAL WORLD METEOROLOGICAL NETWORK (WMO) ---
  // ASIA & MIDDLE EAST
  { id: 'tokyo', name: 'Tokyo Metropolis', countryOrState: 'Japan', scope: 'world', continentOrRegion: 'Asia-Pacific', x: 84, y: 34, temp: 22, condition: 'Passing Pacific Showers', rainProb: 60, windSpeed: 21, windDir: 'E', aqi: 24, humidity: 72, pressure: 1013, timeZoneOffset: 'JST (UTC+9)', radarDbz: 35 },
  { id: 'singapore', name: 'Singapore', countryOrState: 'Singapore', scope: 'world', continentOrRegion: 'Asia-Pacific', x: 74, y: 55, temp: 30, condition: 'Equatorial Thunderstorm', rainProb: 80, windSpeed: 18, windDir: 'NE', aqi: 32, humidity: 88, pressure: 1009, timeZoneOffset: 'SGT (UTC+8)', alert: { level: 'yellow', title: 'Lightning Risk Alert', advisory: 'Frequent cloud-to-ground lightning in Marina Bay area' }, radarDbz: 48 },
  { id: 'dubai', name: 'Dubai', countryOrState: 'United Arab Emirates', scope: 'world', continentOrRegion: 'Middle East & Africa', x: 57, y: 36, temp: 38, condition: 'Sunny & Desert Haze', rainProb: 5, windSpeed: 16, windDir: 'NW', aqi: 118, humidity: 44, pressure: 1008, timeZoneOffset: 'GST (UTC+4)', radarDbz: 10 },
  { id: 'bangkok', name: 'Bangkok', countryOrState: 'Thailand', scope: 'world', continentOrRegion: 'Asia-Pacific', x: 72, y: 44, temp: 32, condition: 'Tropical Downpour', rainProb: 75, windSpeed: 19, windDir: 'SW', aqi: 62, humidity: 85, pressure: 1007, timeZoneOffset: 'ICT (UTC+7)', radarDbz: 44 },

  // EUROPE
  { id: 'london', name: 'London', countryOrState: 'United Kingdom', scope: 'world', continentOrRegion: 'Europe', x: 44, y: 22, temp: 16, condition: 'Overcast & Light Drizzle', rainProb: 65, windSpeed: 26, windDir: 'W', aqi: 28, humidity: 81, pressure: 1016, timeZoneOffset: 'BST (UTC+1)', radarDbz: 30 },
  { id: 'paris', name: 'Paris', countryOrState: 'France', scope: 'world', continentOrRegion: 'Europe', x: 46, y: 25, temp: 18, condition: 'Partly Cloudy & Breeze', rainProb: 35, windSpeed: 18, windDir: 'WNW', aqi: 34, humidity: 66, pressure: 1018, timeZoneOffset: 'CEST (UTC+2)', radarDbz: 20 },
  { id: 'frankfurt', name: 'Frankfurt', countryOrState: 'Germany', scope: 'world', continentOrRegion: 'Europe', x: 49, y: 23, temp: 17, condition: 'Mild Rain Bands', rainProb: 50, windSpeed: 17, windDir: 'NW', aqi: 22, humidity: 74, pressure: 1017, timeZoneOffset: 'CEST (UTC+2)', radarDbz: 28 },
  { id: 'moscow', name: 'Moscow', countryOrState: 'Russia', scope: 'world', continentOrRegion: 'Europe', x: 56, y: 17, temp: 11, condition: 'Cold Breezy & Rain', rainProb: 55, windSpeed: 24, windDir: 'NNE', aqi: 19, humidity: 79, pressure: 1020, timeZoneOffset: 'MSK (UTC+3)', radarDbz: 32 },

  // NORTH AMERICA
  { id: 'newyork', name: 'New York City', countryOrState: 'United States', scope: 'world', continentOrRegion: 'North America', x: 26, y: 29, temp: 21, condition: 'Atlantic Breeze & Sun', rainProb: 20, windSpeed: 22, windDir: 'SSW', aqi: 45, humidity: 55, pressure: 1015, timeZoneOffset: 'EDT (UTC-4)', radarDbz: 14 },
  { id: 'sanfrancisco', name: 'San Francisco', countryOrState: 'United States', scope: 'world', continentOrRegion: 'North America', x: 12, y: 31, temp: 17, condition: 'Coastal Marine Fog', rainProb: 15, windSpeed: 28, windDir: 'W', aqi: 36, humidity: 82, pressure: 1014, timeZoneOffset: 'PDT (UTC-7)', radarDbz: 18 },
  { id: 'chicago', name: 'Chicago (Windy City)', countryOrState: 'United States', scope: 'world', continentOrRegion: 'North America', x: 21, y: 28, temp: 19, condition: 'Lake Breeze & Clouds', rainProb: 30, windSpeed: 32, windDir: 'NE', aqi: 52, humidity: 62, pressure: 1017, timeZoneOffset: 'CDT (UTC-5)', radarDbz: 22 },
  { id: 'miami', name: 'Miami Coast', countryOrState: 'United States', scope: 'world', continentOrRegion: 'North America', x: 24, y: 40, temp: 31, condition: 'Tropical Squalls', rainProb: 70, windSpeed: 29, windDir: 'ESE', aqi: 28, humidity: 84, pressure: 1010, timeZoneOffset: 'EDT (UTC-4)', alert: { level: 'yellow', title: 'Rip Current & Storm Advisory', advisory: 'Rough surf and coastal rain cells' }, radarDbz: 42 },

  // SOUTH AMERICA & OCEANIA & AFRICA
  { id: 'saopaulo', name: 'São Paulo', countryOrState: 'Brazil', scope: 'world', continentOrRegion: 'South America', x: 33, y: 72, temp: 24, condition: 'Scattered Showers', rainProb: 60, windSpeed: 17, windDir: 'SE', aqi: 65, humidity: 76, pressure: 1018, timeZoneOffset: 'BRT (UTC-3)', radarDbz: 32 },
  { id: 'cairo', name: 'Cairo Nile', countryOrState: 'Egypt', scope: 'world', continentOrRegion: 'Middle East & Africa', x: 51, y: 34, temp: 33, condition: 'Clear Sky & Heat', rainProb: 0, windSpeed: 19, windDir: 'NNW', aqi: 112, humidity: 38, pressure: 1012, timeZoneOffset: 'EEST (UTC+3)', radarDbz: 5 },
  { id: 'sydney', name: 'Sydney Harbor', countryOrState: 'Australia', scope: 'world', continentOrRegion: 'Oceania', x: 88, y: 77, temp: 20, condition: 'Sunny & Crisp Breeze', rainProb: 15, windSpeed: 25, windDir: 'S', aqi: 18, humidity: 58, pressure: 1021, timeZoneOffset: 'AEST (UTC+10)', radarDbz: 12 },
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
  const { theme } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;

  // Scope: 'india' vs 'world'
  const [mapScope, setMapScope] = useState<'india' | 'world'>('india');
  
  // Layer state
  const [activeLayer, setActiveLayer] = useState<'radar' | 'wind' | 'temp' | 'aqi' | 'alerts' | 'jetstream'>('radar');
  const [selectedCity, setSelectedCity] = useState<MapCityPoint>(ALL_CITIES[0]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  // Radar timeline player
  const [timeStepIndex, setTimeStepIndex] = useState<number>(2); // 2 is 'Live'
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [expandedDetails, setExpandedDetails] = useState<boolean>(false);

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
      setSelectedCity(ALL_CITIES.find(c => c.id === 'london') || ALL_CITIES[0]);
    } else {
      setSelectedCity(ALL_CITIES.find(c => c.id === 'delhi') || ALL_CITIES[0]);
    }
  };

  // Regions options based on active scope
  const regionOptions = mapScope === 'india'
    ? ['All', 'North', 'West', 'South', 'East']
    : ['All', 'Asia-Pacific', 'Europe', 'North America', 'Middle East & Africa', 'South America', 'Oceania'];

  // Filter cities by scope, region, and search query
  const filteredCities = ALL_CITIES.filter((city) => {
    const matchesScope = city.scope === mapScope;
    const matchesRegion = selectedRegion === 'All' || city.continentOrRegion === selectedRegion;
    const matchesSearch = searchQuery === '' || 
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      city.countryOrState.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesScope && matchesRegion && matchesSearch;
  });

  const layers = [
    { key: 'radar', label: 'Doppler Radar (dBZ)', icon: 'weather-pouring', legend: 'Precipitation Reflectivity (dBZ)' },
    { key: 'wind', label: 'Global Wind & Jet Streams', icon: 'weather-windy', legend: 'Atmospheric Wind Vectors' },
    { key: 'temp', label: 'Thermal Heatmap (°C)', icon: 'thermometer', legend: 'Surface Ambient Temperature' },
    { key: 'aqi', label: 'Air Quality (AQI)', icon: 'air-filter', legend: 'Air Quality Index & Particulates' },
    { key: 'alerts', label: 'Cyclone & Hazard Zones', icon: 'alert-rhombus', legend: 'WMO & IMD Disaster Alerts' },
  ];

  const currentLayerObj = layers.find(l => l.key === activeLayer) || layers[0];
  const timeOffset = (timeStepIndex - 2) * 10;

  return (
    <View style={styles.container}>
      {/* 🌍 / 🇮🇳 Primary Scope Switcher Bar */}
      <View style={[styles.scopeBar, { backgroundColor: theme.surfaceSubtle, borderBottomColor: theme.border }]}>
        <View style={styles.scopeButtonsRow}>
          <TouchableOpacity
            style={[
              styles.scopeBtn,
              mapScope === 'india' && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}
            onPress={() => handleScopeChange('india')}
          >
            <Text style={[styles.scopeBtnFlag]}>🇮🇳</Text>
            <Text style={[styles.scopeBtnText, { color: mapScope === 'india' ? '#FFFFFF' : theme.textPrimary, fontWeight: mapScope === 'india' ? '800' : '600' }]}>
              India National Radar (IMD)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.scopeBtn,
              mapScope === 'world' && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}
            onPress={() => handleScopeChange('world')}
          >
            <Text style={[styles.scopeBtnFlag]}>🌍</Text>
            <Text style={[styles.scopeBtnText, { color: mapScope === 'world' ? '#FFFFFF' : theme.textPrimary, fontWeight: mapScope === 'world' ? '800' : '600' }]}>
              All Over The World Map (WMO Global)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Regional Filter Bar */}
      <View style={[styles.searchFilterBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={16} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder={mapScope === 'india' ? "Search Indian state, city or district..." : "Search global city, country (e.g. London, Tokyo, New York)..."}
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
          {regionOptions.map((r) => {
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
                  {r === 'All' ? (mapScope === 'india' ? 'All India' : 'Whole Globe') : r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Layer Switcher Bar */}
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
                onPress={() => setActiveLayer(l.key as any)}
              >
                <MaterialCommunityIcons 
                  name={l.icon as any} 
                  size={14} 
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

      {/* Main Map Viewport */}
      <View style={[styles.mapCanvas, { backgroundColor: theme.background }]}>
        {/* Coordinates Grid Overlay */}
        <View style={styles.gridOverlay}>
          {mapScope === 'india' ? (
            <>
              <View style={[styles.latLine, { top: '20%', borderColor: theme.borderLight }]}>
                <Text style={[styles.coordTag, { color: theme.textMuted }]}>28°N (Delhi)</Text>
              </View>
              <View style={[styles.latLine, { top: '45%', borderColor: theme.borderLight }]}>
                <Text style={[styles.coordTag, { color: theme.textMuted }]}>22°N (Tropic of Cancer)</Text>
              </View>
              <View style={[styles.latLine, { top: '70%', borderColor: theme.borderLight }]}>
                <Text style={[styles.coordTag, { color: theme.textMuted }]}>13°N (Bengaluru/Chennai)</Text>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.latLine, { top: '22%', borderColor: theme.borderLight }]}>
                <Text style={[styles.coordTag, { color: theme.textMuted }]}>50°N (London / Frankfurt)</Text>
              </View>
              <View style={[styles.latLine, { top: '35%', borderColor: theme.borderLight }]}>
                <Text style={[styles.coordTag, { color: theme.textMuted }]}>23.5°N (Tropic of Cancer)</Text>
              </View>
              <View style={[styles.latLine, { top: '50%', borderColor: theme.borderLight }]}>
                <Text style={[styles.coordTag, { color: theme.textMuted }]}>0° (Equator / ITCZ Rain Belt)</Text>
              </View>
              <View style={[styles.latLine, { top: '70%', borderColor: theme.borderLight }]}>
                <Text style={[styles.coordTag, { color: theme.textMuted }]}>23.5°S (Tropic of Capricorn)</Text>
              </View>
              <View style={[styles.lonLine, { left: '25%', borderColor: theme.borderLight }]}>
                <Text style={[styles.lonTag, { color: theme.textMuted }]}>75°W (New York)</Text>
              </View>
              <View style={[styles.lonLine, { left: '46%', borderColor: theme.borderLight }]}>
                <Text style={[styles.lonTag, { color: theme.textMuted }]}>0° (Greenwich GMT)</Text>
              </View>
              <View style={[styles.lonLine, { left: '80%', borderColor: theme.borderLight }]}>
                <Text style={[styles.lonTag, { color: theme.textMuted }]}>140°E (Tokyo)</Text>
              </View>
            </>
          )}
        </View>

        {/* Dynamic Zoom Container */}
        <View style={[styles.zoomContainer, { transform: [{ scale: zoomLevel }] }]}>
          {/* Atmospheric Layer Overlays */}
          {activeLayer === 'radar' && (
            <>
              {mapScope === 'india' ? (
                <>
                  <View style={[styles.radarCloud, { left: `${30 + timeOffset * 0.4}%`, top: `${19 - timeOffset * 0.2}%`, width: 170, height: 120, backgroundColor: 'rgba(239, 68, 68, 0.4)' }]} />
                  <View style={[styles.radarCloud, { left: `${26 + timeOffset * 0.3}%`, top: `${76 - timeOffset * 0.2}%`, width: 150, height: 110, backgroundColor: 'rgba(220, 38, 38, 0.45)' }]} />
                  <View style={[styles.radarCloud, { left: `${48 + timeOffset * 0.5}%`, top: `${28 - timeOffset * 0.1}%`, width: 220, height: 140, backgroundColor: 'rgba(2, 132, 199, 0.35)' }]} />
                </>
              ) : (
                <>
                  {/* Global Intertropical Convergence Zone (ITCZ) Rain Belt */}
                  <View style={[styles.globalRainBand, { top: '48%', left: '15%', right: '15%', height: 28, backgroundColor: 'rgba(2, 132, 199, 0.25)' }]}>
                    <Text style={styles.globalBandText}>Intertropical Convergence Zone (ITCZ) Deep Convection</Text>
                  </View>
                  {/* Western Pacific Typhoon Radar Cell */}
                  <View style={[styles.radarCloud, { left: '72%', top: '40%', width: 160, height: 120, backgroundColor: 'rgba(239, 68, 68, 0.45)' }]} />
                  {/* North Atlantic Low Pressure System */}
                  <View style={[styles.radarCloud, { left: '38%', top: '20%', width: 140, height: 100, backgroundColor: 'rgba(2, 132, 199, 0.35)' }]} />
                </>
              )}
            </>
          )}

          {activeLayer === 'wind' && (
            <>
              {mapScope === 'world' ? (
                <>
                  <View style={[styles.jetStreamBox, { top: '24%', left: '15%', width: '70%' }]}>
                    <Text style={styles.jetStreamText}>✈️ Polar Jet Stream: 210 km/h West-to-East Flow</Text>
                  </View>
                  <View style={[styles.windVectorBox, { left: '22%', top: '28%' }]}>
                    <Ionicons name="arrow-forward" size={20} color="#38BDF8" />
                    <Text style={styles.windVectorText}>32 km/h W</Text>
                  </View>
                  <View style={[styles.windVectorBox, { left: '76%', top: '34%' }]}>
                    <Ionicons name="arrow-up" size={20} color="#F97316" style={{ transform: [{ rotate: '45deg' }] }} />
                    <Text style={styles.windVectorText}>24 km/h SW</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={[styles.windVectorBox, { left: '20%', top: '75%' }]}>
                    <Ionicons name="arrow-up" size={20} color="#38BDF8" style={{ transform: [{ rotate: '35deg' }] }} />
                    <Text style={styles.windVectorText}>42 km/h SSW</Text>
                  </View>
                  <View style={[styles.windVectorBox, { left: '32%', top: '22%' }]}>
                    <Ionicons name="arrow-down" size={20} color="#F97316" style={{ transform: [{ rotate: '-45deg' }] }} />
                    <Text style={styles.windVectorText}>28 km/h ENE</Text>
                  </View>
                </>
              )}
            </>
          )}

          {/* Interactive City Nodes (India or Global) */}
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

        {/* Floating Zoom & Map Controls */}
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

        {/* Legend Scale Card */}
        <View style={[styles.legendBox, { backgroundColor: theme.surface + 'EE', borderColor: theme.border }]}>
          <Text style={[styles.legendTitle, { color: theme.textPrimary }]}>{currentLayerObj.legend}</Text>
          <View style={styles.scaleBarRow}>
            <View style={[styles.scaleBlock, { backgroundColor: '#86EFAC' }]}><Text style={styles.scaleText}>Low</Text></View>
            <View style={[styles.scaleBlock, { backgroundColor: '#38BDF8' }]}><Text style={styles.scaleText}>Mod</Text></View>
            <View style={[styles.scaleBlock, { backgroundColor: '#FACC15' }]}><Text style={styles.scaleText}>High</Text></View>
            <View style={[styles.scaleBlock, { backgroundColor: '#EF4444' }]}><Text style={styles.scaleText}>Severe</Text></View>
          </View>
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
                <View style={[styles.timeZoneBadge, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.timeZoneText, { color: theme.primary }]}>{selectedCity.timeZoneOffset}</Text>
                </View>
                {selectedCity.alert && (
                  <View style={[styles.alertPill, { backgroundColor: selectedCity.alert.level === 'red' ? theme.alertRedBg : theme.alertOrangeBg }]}>
                    <Text style={[styles.alertPillText, { color: selectedCity.alert.level === 'red' ? theme.alertRed : theme.alertOrange }]}>
                      {selectedCity.alert.level.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.telemetrySub, { color: theme.textSecondary }]}>
                {selectedCity.countryOrState} • {selectedCity.condition}
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

          {/* Active Hazard Advisory */}
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
              {expandedDetails ? 'Hide Deep Meteorological Telemetry' : 'View Deep Meteorological Telemetry'}
            </Text>
            <Ionicons name={expandedDetails ? 'chevron-up' : 'chevron-down'} size={14} color={theme.primary} />
          </TouchableOpacity>

          {expandedDetails && (
            <View style={[styles.expandedDrawer, { borderTopColor: theme.border }]}>
              <Text style={[styles.drawerItem, { color: theme.textSecondary }]}>
                • Barometric Pressure: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{selectedCity.pressure} hPa</Text>
              </Text>
              <Text style={[styles.drawerItem, { color: theme.textSecondary }]}>
                • Observation Network: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{selectedCity.scope === 'india' ? 'IMD Mesonet Radar Grid' : 'WMO World Weather Watch (WWW)'}</Text>
              </Text>
              <Text style={[styles.drawerItem, { color: theme.textSecondary }]}>
                • Time Zone & Radiance: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{selectedCity.timeZoneOffset} • Top-of-Atmosphere Albedo: Normal</Text>
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
  scopeBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  scopeButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scopeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  scopeBtnFlag: {
    fontSize: 14,
  },
  scopeBtnText: {
    fontSize: 11,
  },
  searchFilterBar: {
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
    paddingTop: 8,
    paddingLeft: 4,
  },
  lonTag: {
    fontSize: 8,
    fontWeight: '600',
  },
  zoomContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  radarCloud: {
    position: 'absolute',
    borderRadius: 80,
    filter: 'blur(20px)',
  },
  globalRainBand: {
    position: 'absolute',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  globalBandText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  jetStreamBox: {
    position: 'absolute',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
  },
  jetStreamText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    textAlign: 'center',
  },
  windVectorBox: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
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
    paddingHorizontal: 6,
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
    maxWidth: 540,
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
    flexWrap: 'wrap',
  },
  telemetryCity: {
    fontSize: 15,
    fontWeight: '800',
  },
  timeZoneBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeZoneText: {
    fontSize: 9,
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
