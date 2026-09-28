import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PersonaType } from '../types';
import { radii, spacing } from '../theme';

export const DesktopLeftRail: React.FC = () => {
  const { 
    theme, 
    persona, 
    setPersona, 
    currentTab, 
    setCurrentTab, 
    savedLocations, 
    selectedLocation, 
    setSelectedLocation 
  } = useApp();

  const personas: { type: PersonaType; label: string; icon: any; color: string }[] = [
    { type: 'farmer', label: 'Farmer (किसान)', icon: 'tractor', color: '#16A34A' },
    { type: 'commuter', label: 'Commuter (दैनिक)', icon: 'bus', color: '#0284C7' },
    { type: 'traveller', label: 'Traveller (यात्री)', icon: 'airplane', color: '#8B5CF6' },
    { type: 'student', label: 'Student (विद्यार्थी)', icon: 'school', color: '#EC4899' },
    { type: 'outdoor', label: 'Outdoor / Sports', icon: 'run', color: '#F59E0B' },
    { type: 'health', label: 'Health Sensitive', icon: 'heart-pulse', color: '#EF4444' },
    { type: 'fisherman', label: 'Fisherman (मछुआरा)', icon: 'sail-boat', color: '#0D9488' },
  ];

  const operationalDivisions = [
    { name: 'National NWP Radar', icon: 'radar', actionTab: 'map' as const },
    { name: 'Agromet Crop Advisory', icon: 'sprout', actionTab: 'home' as const, personaType: 'farmer' as const },
    { name: 'Marine & High Seas', icon: 'sail-boat', actionTab: 'home' as const, personaType: 'fisherman' as const },
    { name: 'Aviation Weather', icon: 'airplane-takeoff', actionTab: 'home' as const, personaType: 'traveller' as const },
    { name: 'Mausam Conversational AI', icon: 'robot-outline', actionTab: 'ai' as const },
  ];

  return (
    <View style={[styles.leftRail, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.railContent}>
        {/* Operations Division Title */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>OPERATIONAL DIVISIONS</Text>
        </View>

        <View style={styles.divisionsList}>
          {operationalDivisions.map((div, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.divItem, { backgroundColor: theme.surfaceSubtle }]}
              onPress={() => {
                if (div.personaType) setPersona(div.personaType);
                setCurrentTab(div.actionTab);
              }}
            >
              <MaterialCommunityIcons name={div.icon as any} size={16} color={theme.primary} />
              <Text style={[styles.divItemText, { color: theme.textPrimary }]} numberOfLines={1}>
                {div.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Persona Quick Switcher */}
        <View style={[styles.sectionHeader, { marginTop: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>CITIZEN PERSONA</Text>
        </View>

        <View style={styles.personasList}>
          {personas.map((p) => {
            const isSelected = p.type === persona;
            return (
              <TouchableOpacity
                key={p.type}
                style={[
                  styles.personaBtn,
                  {
                    backgroundColor: isSelected ? p.color + '18' : 'transparent',
                    borderColor: isSelected ? p.color : 'transparent',
                  }
                ]}
                onPress={() => setPersona(p.type)}
              >
                <MaterialCommunityIcons name={p.icon} size={16} color={p.color} />
                <Text style={[styles.personaBtnText, { color: isSelected ? p.color : theme.textPrimary, fontWeight: isSelected ? '800' : '500' }]}>
                  {p.label}
                </Text>
                {isSelected && (
                  <View style={[styles.activeDot, { backgroundColor: p.color }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Saved Hubs */}
        <View style={[styles.sectionHeader, { marginTop: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>REGISTERED HUBS</Text>
        </View>

        <View style={styles.savedList}>
          {savedLocations.slice(0, 4).map((loc) => {
            const isSel = loc.id === selectedLocation.id;
            return (
              <TouchableOpacity
                key={loc.id}
                style={[
                  styles.hubItem,
                  {
                    backgroundColor: isSel ? theme.primaryLight : theme.surfaceSubtle,
                    borderColor: isSel ? theme.primary : 'transparent',
                  }
                ]}
                onPress={() => setSelectedLocation(loc)}
              >
                <Ionicons name="location" size={14} color={isSel ? theme.primary : theme.textMuted} />
                <Text style={[styles.hubText, { color: isSel ? theme.primary : theme.textPrimary, fontWeight: isSel ? '700' : '500' }]} numberOfLines={1}>
                  {loc.name.split(' ')[0]} ({loc.type.toUpperCase()})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 24x7 IMD Emergency Meteorological Helpline */}
        <View style={[styles.helplineBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
          <Ionicons name="call-outline" size={16} color={theme.alertRed} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.helplineTitle, { color: theme.textPrimary }]}>24x7 IMD Helpline</Text>
            <Text style={[styles.helplinePhone, { color: theme.alertRed }]}>1070 • 1800-180-1717</Text>
            <Text style={[styles.helplineSub, { color: theme.textMuted }]}>Toll-free disaster assistance</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  leftRail: {
    width: 250,
    borderRightWidth: 1,
    padding: spacing.md,
  },
  railContent: {
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divisionsList: {
    gap: 5,
  },
  divItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: radii.md,
  },
  divItemText: {
    fontSize: 11,
    fontWeight: '600',
  },
  personasList: {
    gap: 3,
  },
  personaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  personaBtnText: {
    fontSize: 11,
    flex: 1,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  savedList: {
    gap: 4,
  },
  hubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  hubText: {
    fontSize: 11,
  },
  helplineBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.lg,
  },
  helplineTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  helplinePhone: {
    fontSize: 11,
    fontWeight: '800',
    marginVertical: 1,
  },
  helplineSub: {
    fontSize: 9,
  },
});
