import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PersonaType, LocationItem } from '../types';
import { radii, spacing, typography } from '../theme';

export const NavHeader: React.FC = () => {
  const { 
    theme, 
    themeMode, 
    toggleTheme, 
    language, 
    setLanguage, 
    persona, 
    setPersona, 
    selectedLocation, 
    setSelectedLocation, 
    savedLocations, 
    currentTab, 
    setCurrentTab,
    isOffline,
    setIsOffline
  } = useApp();

  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;

  const [personaModalVisible, setPersonaModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const personas: { type: PersonaType; label: string; icon: any; color: string }[] = [
    { type: 'farmer', label: 'Farmer (किसान)', icon: 'tractor', color: '#16A34A' },
    { type: 'commuter', label: 'Commuter (दैनिक)', icon: 'bus', color: '#0284C7' },
    { type: 'traveller', label: 'Traveller (यात्री)', icon: 'airplane', color: '#8B5CF6' },
    { type: 'student', label: 'Student (विद्यार्थी)', icon: 'school', color: '#EC4899' },
    { type: 'outdoor', label: 'Outdoor / Sports', icon: 'run', color: '#F59E0B' },
    { type: 'health', label: 'Health Sensitive', icon: 'heart-pulse', color: '#EF4444' },
    { type: 'fisherman', label: 'Fisherman (मछुआरा)', icon: 'sail-boat', color: '#0D9488' },
  ];

  const currentPersonaObj = personas.find(p => p.type === persona) || personas[1];

  const desktopNavItems: { tab: 'home' | 'forecast' | 'map' | 'ai' | 'profile'; label: string; icon: any }[] = [
    { tab: 'home', label: 'Home', icon: 'home-variant' },
    { tab: 'forecast', label: 'Forecast', icon: 'chart-bell-curve-cumulative' },
    { tab: 'map', label: 'Weather Map', icon: 'map-search' },
    { tab: 'ai', label: 'Mausam AI', icon: 'robot-outline' },
    { tab: 'profile', label: 'Profile & DNA', icon: 'account-cog-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      {/* Top Organization Brand Bar */}
      <View style={styles.brandRow}>
        <View style={styles.brandLeft}>
          <View style={[styles.imdLogoBadge, { backgroundColor: theme.primary }]}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={20} color="#FFFFFF" />
          </View>
          <View>
            <View style={styles.brandTextLine}>
              <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>MAUSAM IQ</Text>
              <View style={[styles.govBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.govBadgeText, { color: theme.primary }]}>IMD • MoES</Text>
              </View>
            </View>
            <Text style={[styles.brandSub, { color: theme.textSecondary }]}>
              Ministry of Earth Sciences, Govt. of India
            </Text>
          </View>
        </View>

        {/* Right Action Icons: Online Status, Language, Theme */}
        <View style={styles.headerRightActions}>
          {/* Offline/Online toggle pill */}
          <TouchableOpacity 
            style={[styles.statusPill, { backgroundColor: isOffline ? theme.alertOrangeBg : theme.alertGreenBg }]}
            onPress={() => setIsOffline(!isOffline)}
            accessibilityLabel="Network simulation toggle"
          >
            <View style={[styles.dot, { backgroundColor: isOffline ? theme.alertOrange : theme.alertGreen }]} />
            <Text style={[styles.statusText, { color: isOffline ? theme.alertOrange : theme.alertGreen }]}>
              {isOffline ? 'Offline Cache' : 'Live Doppler'}
            </Text>
          </TouchableOpacity>

          {/* Language Toggle (EN / HI) */}
          <TouchableOpacity 
            style={[styles.pillButton, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
            onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            <Text style={[styles.pillButtonText, { color: theme.textPrimary, fontWeight: '700' }]}>
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </Text>
          </TouchableOpacity>

          {/* Theme Toggle (Light / Dark) */}
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
            onPress={toggleTheme}
            accessibilityLabel="Toggle Light Dark Theme"
          >
            <Ionicons 
              name={themeMode === 'light' ? 'moon-outline' : 'sunny-outline'} 
              size={18} 
              color={theme.textPrimary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Second Row: Desktop Nav or Context Selectors (Location & Persona) */}
      <View style={styles.subBar}>
        {/* Location Selector Pill */}
        <TouchableOpacity 
          style={[styles.selectorPill, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
          onPress={() => setLocationModalVisible(true)}
        >
          <Ionicons name="location-sharp" size={16} color={theme.primary} />
          <Text style={[styles.selectorText, { color: theme.textPrimary }]} numberOfLines={1}>
            {selectedLocation.name}
          </Text>
          <Ionicons name="chevron-down" size={14} color={theme.textMuted} />
        </TouchableOpacity>

        {/* Persona Selector Pill */}
        <TouchableOpacity 
          style={[styles.personaPill, { backgroundColor: currentPersonaObj.color + '18', borderColor: currentPersonaObj.color + '55' }]}
          onPress={() => setPersonaModalVisible(true)}
        >
          <MaterialCommunityIcons name={currentPersonaObj.icon} size={16} color={currentPersonaObj.color} />
          <Text style={[styles.personaText, { color: currentPersonaObj.color }]}>
            {currentPersonaObj.label.split(' ')[0]}
          </Text>
          <Ionicons name="swap-vertical" size={14} color={currentPersonaObj.color} />
        </TouchableOpacity>

        {/* Desktop Navigation Links */}
        {isDesktop && (
          <View style={styles.desktopNavRow}>
            {desktopNavItems.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <TouchableOpacity
                  key={item.tab}
                  style={[
                    styles.desktopNavItem,
                    isActive && { backgroundColor: theme.primaryLight, borderRadius: radii.md }
                  ]}
                  onPress={() => setCurrentTab(item.tab)}
                >
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={18} 
                    color={isActive ? theme.primary : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.desktopNavText, 
                    { color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? '700' : '500' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Persona Selection Modal */}
      <Modal visible={personaModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Choose User Persona</Text>
              <TouchableOpacity onPress={() => setPersonaModalVisible(false)}>
                <Ionicons name="close" size={22} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
              Homepage cards, alerts, and Weather → Impact → Action models will instantly re-rank to prioritize your workflow.
            </Text>
            <ScrollView style={{ maxHeight: 380 }}>
              {personas.map((p) => {
                const isSelected = p.type === persona;
                return (
                  <TouchableOpacity
                    key={p.type}
                    style={[
                      styles.personaOption,
                      { borderColor: isSelected ? p.color : theme.border, backgroundColor: isSelected ? p.color + '15' : theme.surfaceSubtle }
                    ]}
                    onPress={() => {
                      setPersona(p.type);
                      setPersonaModalVisible(false);
                    }}
                  >
                    <View style={[styles.personaOptionIcon, { backgroundColor: p.color }]}>
                      <MaterialCommunityIcons name={p.icon} size={20} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.personaOptionTitle, { color: theme.textPrimary, fontWeight: isSelected ? '700' : '600' }]}>
                        {p.label}
                      </Text>
                      <Text style={[styles.personaOptionSub, { color: theme.textMuted }]}>
                        {p.type === 'farmer' && 'Agromet moisture, spray windows, harvest alerts'}
                        {p.type === 'commuter' && 'Route weather, departure slider, road waterlogging'}
                        {p.type === 'traveller' && 'Intercity checkpoints, destination radar, delays'}
                        {p.type === 'student' && 'Campus rain risk, umbrella alerts, AQI stress'}
                        {p.type === 'outdoor' && 'UV Index, heat stress, wind gust safety'}
                        {p.type === 'health' && 'AQI particulate caution, humidity sensitivity'}
                        {p.type === 'fisherman' && 'Coastal wave heights, squall & marine advisories'}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color={p.color} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Location Selection Modal */}
      <Modal visible={locationModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Select Saved Location</Text>
              <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                <Ionicons name="close" size={22} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
              Switch across your registered family hubs, agricultural farms, and office campuses.
            </Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {savedLocations.map((loc) => {
                const isSelected = loc.id === selectedLocation.id;
                return (
                  <TouchableOpacity
                    key={loc.id}
                    style={[
                      styles.locationOption,
                      { borderColor: isSelected ? theme.primary : theme.border, backgroundColor: isSelected ? theme.primaryLight : theme.surfaceSubtle }
                    ]}
                    onPress={() => {
                      setSelectedLocation(loc);
                      setLocationModalVisible(false);
                    }}
                  >
                    <Ionicons 
                      name={loc.type === 'farm' ? 'leaf-outline' : loc.type === 'office' ? 'briefcase-outline' : 'home-outline'} 
                      size={20} 
                      color={isSelected ? theme.primary : theme.textSecondary} 
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.locationOptionTitle, { color: theme.textPrimary, fontWeight: isSelected ? '700' : '600' }]}>
                        {loc.name}
                      </Text>
                      <Text style={[styles.locationOptionState, { color: theme.textMuted }]}>
                        {loc.state} • {loc.type.toUpperCase()}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imdLogoBadge: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTextLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  govBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  govBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 11,
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  pillButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  pillButtonText: {
    fontSize: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    flexWrap: 'wrap',
    gap: 10,
  },
  selectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1,
    gap: 6,
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 160,
  },
  personaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1,
    gap: 6,
  },
  personaText: {
    fontSize: 13,
    fontWeight: '700',
  },
  desktopNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 6,
  },
  desktopNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  desktopNavText: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalBox: {
    width: '100%',
    maxWidth: 480,
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  personaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
  },
  personaOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personaOptionTitle: {
    fontSize: 14,
  },
  personaOptionSub: {
    fontSize: 11,
    marginTop: 2,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
  },
  locationOptionTitle: {
    fontSize: 14,
  },
  locationOptionState: {
    fontSize: 11,
    marginTop: 2,
  },
});
