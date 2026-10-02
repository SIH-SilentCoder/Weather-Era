import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PersonaType, LocationItem } from '../types';
import { radii, spacing } from '../theme';
import { AVAILABLE_LANGUAGES } from '../i18n';

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
  const isDesktop = width >= 960;

  const [personaModalVisible, setPersonaModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [tickerDismissed, setTickerDismissed] = useState(false);

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

  const desktopNavItems: { tab: 'home' | 'forecast' | 'map' | 'alerts' | 'ai' | 'profile'; label: string; icon: any }[] = [
    { tab: 'home', label: 'Home', icon: 'home-variant' },
    { tab: 'forecast', label: 'Forecast', icon: 'chart-bell-curve-cumulative' },
    { tab: 'map', label: 'Weather Map', icon: 'map-search' },
    { tab: 'alerts', label: 'Alerts', icon: 'alert-decagram' },
    { tab: 'ai', label: 'Mausam AI', icon: 'robot-outline' },
    { tab: 'profile', label: 'Profile & DNA', icon: 'account-cog-outline' },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.surface }]}>
      {/* 🇮🇳 Official Government of India Tri-Color Ribbon */}
      <View style={styles.tirangaBar}>
        <View style={[styles.tirangaStripe, { backgroundColor: '#FF9933' }]} />
        <View style={[styles.tirangaStripe, { backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.tirangaStripe, { backgroundColor: '#138808' }]} />
      </View>

      {/* Official IMD Emergency Weather Ticker */}
      {!tickerDismissed && (
        <View style={[styles.alertTicker, { backgroundColor: '#7F1D1D', borderBottomColor: '#991B1B' }]}>
          <View style={styles.tickerBadge}>
            <View style={styles.blinkingDot} />
            <Text style={styles.tickerBadgeText}>NOWCAST BULLETIN</Text>
          </View>
          <Text style={styles.tickerText} numberOfLines={1}>
            🔴 Severe thunderstorm, lightning & squall (50–60 km/h) over Delhi-NCR, Haryana, Western UP during next 3 hours. Citizens advised to avoid waterlogged underpasses.
          </Text>
          <TouchableOpacity onPress={() => setTickerDismissed(true)} style={styles.tickerClose}>
            <Ionicons name="close" size={14} color="#FCA5A5" />
          </TouchableOpacity>
        </View>
      )}

      {/* Primary Brand Header */}
      <View style={[styles.mainHeader, { borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          {/* Official IMD Emblem */}
          <View style={[styles.emblemBadge, { backgroundColor: theme.primaryDark }]}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={isDesktop ? 22 : 19} color="#FFFFFF" />
          </View>
          
          <View style={styles.brandTitleContainer}>
            <View style={styles.brandTitleRow}>
              <Text style={[styles.hindiBrand, { color: theme.textPrimary }]} numberOfLines={1}>
                {isDesktop ? 'भारत मौसम विज्ञान विभाग' : 'मौसम विज्ञान विभाग'}
              </Text>
              <View style={[styles.officialTag, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.officialTagText, { color: theme.primary }]}>IMD • MoES</Text>
              </View>
            </View>
            <Text style={[styles.englishBrand, { color: theme.textSecondary }]} numberOfLines={1}>
              {isDesktop 
                ? 'INDIA METEOROLOGICAL DEPARTMENT • Ministry of Earth Sciences, Govt. of India'
                : 'India Meteorological Department • MoES'
              }
            </Text>
          </View>
        </View>

        {/* Right Action Tools */}
        <View style={styles.headerRight}>
          {/* Audio Weather Bulletin Button */}
          <TouchableOpacity 
            style={[
              isDesktop ? styles.audioBulletinBtn : styles.iconButton, 
              { backgroundColor: isPlayingAudio ? theme.primary : theme.surfaceSubtle, borderColor: theme.border }
            ]}
            onPress={() => setIsPlayingAudio(!isPlayingAudio)}
            accessibilityLabel="Listen to audio bulletin"
          >
            <MaterialCommunityIcons 
              name={isPlayingAudio ? "volume-high" : "volume-medium"} 
              size={17} 
              color={isPlayingAudio ? "#FFFFFF" : theme.primary} 
            />
            {isDesktop && (
              <Text style={[styles.audioBtnText, { color: isPlayingAudio ? "#FFFFFF" : theme.textPrimary }]}>
                {isPlayingAudio ? "Playing Bulletin..." : "Voice Bulletin"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Network Radar Status - Only in mainHeader on Desktop */}
          {isDesktop && (
            <TouchableOpacity 
              style={[styles.statusPill, { backgroundColor: isOffline ? theme.alertOrangeBg : theme.alertGreenBg }]}
              onPress={() => setIsOffline(!isOffline)}
            >
              <View style={[styles.dot, { backgroundColor: isOffline ? theme.alertOrange : theme.alertGreen }]} />
              <Text style={[styles.statusText, { color: isOffline ? theme.alertOrange : theme.alertGreen }]}>
                {isOffline ? 'Offline Cache' : 'Live Doppler'}
              </Text>
            </TouchableOpacity>
          )}

          {/* India-First Regional Language Selector */}
          <TouchableOpacity 
            style={[
              isDesktop ? styles.pillButton : styles.compactLangButton, 
              { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }
            ]}
            onPress={() => setLanguageModalVisible(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Change regional language. Current: ${AVAILABLE_LANGUAGES.find(l => l.code === language)?.name || 'English'}`}
            accessibilityHint="Double tap to open regional language selection dialog"
          >
            <Ionicons name="globe-outline" size={14} color={theme.primary} style={isDesktop ? { marginRight: 4 } : { marginRight: 2 }} />
            <Text style={[isDesktop ? styles.pillButtonText : styles.compactLangText, { color: theme.textPrimary }]}>
              {isDesktop 
                ? (AVAILABLE_LANGUAGES.find(l => l.code === language)?.nativeName || 'हिन्दी')
                : language.toUpperCase()
              }
            </Text>
          </TouchableOpacity>

          {/* Theme Toggle */}
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
            onPress={toggleTheme}
            accessibilityLabel="Toggle Theme"
          >
            <Ionicons 
              name={themeMode === 'light' ? 'moon-outline' : 'sunny-outline'} 
              size={16} 
              color={theme.textPrimary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub Navigation Bar: Location, Persona & Status / Desktop Links */}
      <View style={[styles.subBar, { borderBottomColor: theme.border }]}>
        <View style={styles.subBarLeft}>
          {/* Location Selector */}
          <TouchableOpacity 
            style={[styles.selectorPill, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
            onPress={() => setLocationModalVisible(true)}
          >
            <Ionicons name="location-sharp" size={13} color={theme.primary} />
            <Text style={[styles.selectorText, { color: theme.textPrimary }]} numberOfLines={1}>
              {selectedLocation.name}
            </Text>
            <Ionicons name="chevron-down" size={11} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Persona Selector */}
          <TouchableOpacity 
            style={[styles.personaPill, { backgroundColor: currentPersonaObj.color + '15', borderColor: currentPersonaObj.color + '50' }]}
            onPress={() => setPersonaModalVisible(true)}
          >
            <MaterialCommunityIcons name={currentPersonaObj.icon} size={13} color={currentPersonaObj.color} />
            <Text style={[styles.personaText, { color: currentPersonaObj.color }]}>
              {currentPersonaObj.label.split(' ')[0]}
            </Text>
            <Ionicons name="swap-vertical" size={11} color={currentPersonaObj.color} />
          </TouchableOpacity>
        </View>

        {/* Mobile Radar Status Indicator */}
        {!isDesktop && (
          <TouchableOpacity 
            style={[styles.statusPill, { backgroundColor: isOffline ? theme.alertOrangeBg : theme.alertGreenBg }]}
            onPress={() => setIsOffline(!isOffline)}
          >
            <View style={[styles.dot, { backgroundColor: isOffline ? theme.alertOrange : theme.alertGreen }]} />
            <Text style={[styles.statusText, { color: isOffline ? theme.alertOrange : theme.alertGreen }]}>
              {isOffline ? 'Offline' : 'Doppler Live'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Desktop Top Links */}
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
                    size={17} 
                    color={isActive ? theme.primary : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.desktopNavText, 
                    { color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? '800' : '600' }
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

      {/* India-First Regional Language Selection Modal */}
      <Modal visible={languageModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 22 }}>🇮🇳</Text>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  Choose Language / भाषा चुनें
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setLanguageModalVisible(false)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Close language dialog"
              >
                <Ionicons name="close" size={22} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
              Mausam IQ India-First architecture provides localized weather advisories across official Indian regional languages.
            </Text>
            <ScrollView style={{ maxHeight: 340 }}>
              {AVAILABLE_LANGUAGES.map((langItem) => {
                const isSelected = langItem.code === language;
                return (
                  <TouchableOpacity
                    key={langItem.code}
                    style={[
                      styles.locationOption,
                      { 
                        borderColor: isSelected ? theme.primary : theme.border, 
                        backgroundColor: isSelected ? theme.primaryLight : theme.surfaceSubtle,
                        minHeight: 48,
                      }
                    ]}
                    onPress={() => {
                      setLanguage(langItem.code);
                      setLanguageModalVisible(false);
                    }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${langItem.name} (${langItem.nativeName})`}
                  >
                    <Text style={{ fontSize: 22, marginRight: 12 }}>{langItem.flag}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.locationOptionTitle, { color: theme.textPrimary, fontWeight: isSelected ? '800' : '600' }]}>
                        {langItem.nativeName} ({langItem.name})
                      </Text>
                      <Text style={[styles.locationOptionState, { color: theme.textMuted }]}>
                        {langItem.isRegional ? 'Official Regional Language • MoES Validated' : 'National Standard'}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
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
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  tirangaBar: {
    flexDirection: 'row',
    height: 3.5,
    width: '100%',
  },
  tirangaStripe: {
    flex: 1,
    height: '100%',
  },
  alertTicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderBottomWidth: 1,
    gap: 8,
  },
  tickerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#991B1B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  blinkingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F87171',
  },
  tickerBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tickerText: {
    color: '#FEE2E2',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  tickerClose: {
    padding: 2,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  emblemBadge: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
    elevation: 2,
  },
  brandTitleContainer: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'nowrap',
  },
  hindiBrand: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.1,
    flexShrink: 1,
  },
  officialTag: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: radii.xs,
    flexShrink: 0,
  },
  officialTagText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  englishBrand: {
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  compactLangButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: radii.md,
    borderWidth: 1,
    minHeight: 32,
  },
  compactLangText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  audioBulletinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  audioBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: radii.full,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  pillButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  pillButtonText: {
    fontSize: 11,
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  subBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  selectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    gap: 4,
    maxWidth: 160,
  },
  selectorText: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  personaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    gap: 4,
  },
  personaText: {
    fontSize: 11,
    fontWeight: '700',
  },
  desktopNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  desktopNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  desktopNavText: {
    fontSize: 12,
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
