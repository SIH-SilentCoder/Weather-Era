import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, useWindowDimensions, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { WeatherDNAView } from '../components/WeatherDNAView';
import { PersonaType } from '../types';
import { radii, spacing } from '../theme';

export const ProfileScreen: React.FC = () => {
  const { 
    theme, 
    themeMode, 
    toggleTheme, 
    language, 
    setLanguage, 
    persona, 
    setPersona, 
    resetDNA,
    t 
  } = useApp();

  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;

  const [severeAlertsPush, setSevereAlertsPush] = useState(true);
  const [commuteRainAlerts, setCommuteRainAlerts] = useState(true);
  const [airQualityAlerts, setAirQualityAlerts] = useState(false);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  const personas: { type: PersonaType; label: string; icon: any; color: string }[] = [
    { type: 'farmer', label: 'Farmer (किसान)', icon: 'tractor', color: '#16A34A' },
    { type: 'commuter', label: 'Commuter (दैनिक)', icon: 'bus', color: '#0284C7' },
    { type: 'traveller', label: 'Traveller (यात्री)', icon: 'airplane', color: '#8B5CF6' },
    { type: 'student', label: 'Student (विद्यार्थी)', icon: 'school', color: '#EC4899' },
    { type: 'outdoor', label: 'Outdoor / Sports', icon: 'run', color: '#F59E0B' },
    { type: 'health', label: 'Health Sensitive', icon: 'heart-pulse', color: '#EF4444' },
    { type: 'fisherman', label: 'Fisherman (मछुआरा)', icon: 'sail-boat', color: '#0D9488' },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
      showsVerticalScrollIndicator={false}
    >
      {/* User Header Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.profileHeaderRow}>
          <View style={[styles.avatarBox, { backgroundColor: theme.primary }]}>
            <MaterialCommunityIcons name="account" size={32} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>Citizen User • Delhi NCR</Text>
            <Text style={[styles.userRole, { color: theme.textSecondary }]}>
              Active Persona: <Text style={{ color: theme.primary, fontWeight: '700' }}>{persona.toUpperCase()}</Text>
            </Text>
            <Text style={[styles.moesReg, { color: theme.textMuted }]}>
              IMD Integrated Citizen Alert Network
            </Text>
          </View>
        </View>
      </View>

      {/* Persona Switcher Section */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="account-convert" size={18} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Switch Operational Persona
          </Text>
        </View>
        <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
          Re-aligns the AI impact scoring algorithms and card ranking hierarchy.
        </Text>

        <View style={styles.personasGrid}>
          {personas.map((p) => {
            const isSelected = p.type === persona;
            return (
              <TouchableOpacity
                key={p.type}
                style={[
                  styles.personaBtn,
                  {
                    backgroundColor: isSelected ? p.color + '20' : theme.surfaceSubtle,
                    borderColor: isSelected ? p.color : theme.border,
                  }
                ]}
                onPress={() => setPersona(p.type)}
              >
                <MaterialCommunityIcons name={p.icon} size={20} color={isSelected ? p.color : theme.textSecondary} />
                <Text style={[styles.personaBtnText, { color: isSelected ? p.color : theme.textPrimary, fontWeight: isSelected ? '700' : '500' }]}>
                  {p.label.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Signature Feature #5: Personal Weather DNA Editor */}
      <WeatherDNAView />

      {/* App & Regional Preferences */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="cog-outline" size={18} color={theme.secondary} />
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Regional & Display Preferences
          </Text>
        </View>

        {/* Language Selection */}
        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
          <View>
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Application Language</Text>
            <Text style={[styles.settingSub, { color: theme.textMuted }]}>English / हिन्दी</Text>
          </View>
          <View style={styles.toggleGroup}>
            <TouchableOpacity 
              style={[styles.toggleBtn, language === 'en' && { backgroundColor: theme.primary }]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.toggleBtnText, { color: language === 'en' ? '#FFFFFF' : theme.textSecondary }]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, language === 'hi' && { backgroundColor: theme.primary }]}
              onPress={() => setLanguage('hi')}
            >
              <Text style={[styles.toggleBtnText, { color: language === 'hi' ? '#FFFFFF' : theme.textSecondary }]}>हिन्दी</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Selection */}
        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
          <View>
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Appearance Theme</Text>
            <Text style={[styles.settingSub, { color: theme.textMuted }]}>
              {themeMode === 'dark' ? 'Midnight Sapphire (Dark)' : 'Clear Day (Light)'}
            </Text>
          </View>
          <Switch
            value={themeMode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Units Selection */}
        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
          <View>
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Measurement Units</Text>
            <Text style={[styles.settingSub, { color: theme.textMuted }]}>Metric standard: °C, km/h, mm</Text>
          </View>
          <View style={styles.toggleGroup}>
            <TouchableOpacity 
              style={[styles.toggleBtn, unitSystem === 'metric' && { backgroundColor: theme.primary }]}
              onPress={() => setUnitSystem('metric')}
            >
              <Text style={[styles.toggleBtnText, { color: unitSystem === 'metric' ? '#FFFFFF' : theme.textSecondary }]}>Metric</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, unitSystem === 'imperial' && { backgroundColor: theme.primary }]}
              onPress={() => setUnitSystem('imperial')}
            >
              <Text style={[styles.toggleBtnText, { color: unitSystem === 'imperial' ? '#FFFFFF' : theme.textSecondary }]}>Imperial</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Push Notification Controls */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="bell-ring-outline" size={18} color={theme.accent} />
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Disaster & Weather Alert Subscriptions
          </Text>
        </View>

        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>IMD Severe & Extreme Warnings</Text>
            <Text style={[styles.settingSub, { color: theme.textMuted }]}>Red & Orange alerts for cyclones, squalls, and cloudbursts</Text>
          </View>
          <Switch
            value={severeAlertsPush}
            onValueChange={setSevereAlertsPush}
            trackColor={{ false: theme.border, true: theme.alertOrange }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Commute Departure Rain Alerts</Text>
            <Text style={[styles.settingSub, { color: theme.textMuted }]}>Push notification 30 minutes before heavy showers on your route</Text>
          </View>
          <Switch
            value={commuteRainAlerts}
            onValueChange={setCommuteRainAlerts}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Air Quality (AQI) Surge Warnings</Text>
            <Text style={[styles.settingSub, { color: theme.textMuted }]}>Alert when AQI crosses 200 (Poor category)</Text>
          </View>
          <Switch
            value={airQualityAlerts}
            onValueChange={setAirQualityAlerts}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Privacy & Governance Reset */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="shield-lock-outline" size={18} color={theme.textMuted} />
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Privacy & Data Sovereignty
          </Text>
        </View>
        <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
          Mausam respects user privacy. Your preferences and Weather DNA weights are stored strictly on-device in secure storage and never commercialized.
        </Text>

        <TouchableOpacity 
          style={[styles.dangerBtn, { borderColor: theme.alertRed }]}
          onPress={() => {
            resetDNA();
            Alert.alert('Personalization Reset', 'All learned preference weights have been reset to factory defaults.');
          }}
        >
          <Ionicons name="trash-outline" size={16} color={theme.alertRed} />
          <Text style={[styles.dangerBtnText, { color: theme.alertRed }]}>
            Purge Cache & Reset Personalization
          </Text>
        </TouchableOpacity>
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
  profileCard: {
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
  },
  userRole: {
    fontSize: 12,
    marginTop: 2,
  },
  moesReg: {
    fontSize: 10,
    marginTop: 2,
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
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: spacing.md,
  },
  personasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  personaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  personaBtnText: {
    fontSize: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 11,
    marginTop: 2,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderRadius: radii.md,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.sm,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  dangerBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
