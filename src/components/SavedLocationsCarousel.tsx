import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { LocationItem } from '../types';
import { MOCK_WEATHER_DATABASE } from '../services/weatherService';
import { radii, spacing } from '../theme';

const SavedLocationsCarouselComponent: React.FC = () => {
  const { theme, savedLocations, selectedLocation, setSelectedLocation, addSavedLocation, t } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceState, setNewPlaceState] = useState('');
  const [newPlaceType, setNewPlaceType] = useState<LocationItem['type']>('home');

  const PLACE_CATEGORIES: { type: LocationItem['type']; label: string; icon: string; color: string }[] = [
    { type: 'home', label: 'Home', icon: 'home-variant', color: '#0284C7' },
    { type: 'college', label: 'College', icon: 'school', color: '#8B5CF6' },
    { type: 'office', label: 'Office', icon: 'briefcase', color: '#0D9488' },
    { type: 'village', label: 'Village', icon: 'home-flood', color: '#F59E0B' },
    { type: 'farm', label: 'Farm', icon: 'sprout', color: '#16A34A' },
    { type: 'destination', label: 'Destination', icon: 'airplane-takeoff', color: '#EC4899' },
  ];

  const getCategoryMeta = (type: string) => {
    return PLACE_CATEGORIES.find(c => c.type === type) || PLACE_CATEGORIES[0];
  };

  const handleAddPlace = () => {
    if (!newPlaceName.trim()) return;
    const newLoc: LocationItem = {
      id: `loc-${Date.now()}`,
      name: newPlaceName.trim(),
      state: newPlaceState.trim() || 'India',
      type: newPlaceType,
      lat: 28.6139,
      lon: 77.2090,
    };
    addSavedLocation(newLoc);
    setNewPlaceName('');
    setNewPlaceState('');
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="map-marker-multiple" size={20} color={theme.accent} />
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              📍 SAVED PLACES & FAMILY HUBS
            </Text>
            <Text style={[styles.subhead, { color: theme.textSecondary }]}>
              Home, college, office, village, farm & destination tracking
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={14} color={theme.primary} />
          <Text style={[styles.addBtnText, { color: theme.primary }]}>Add Place</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Continuous multi-location weather surveillance. Tap any place to switch your active homepage telemetry and radar alerts:
      </Text>

      {/* Horizontal Carousel of Saved Places */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {savedLocations.map((loc) => {
          const isSelected = loc.id === selectedLocation.id;
          const meta = getCategoryMeta(loc.type);
          const weather = MOCK_WEATHER_DATABASE[loc.id] || MOCK_WEATHER_DATABASE['delhi'];

          return (
            <TouchableOpacity
              key={loc.id}
              style={[
                styles.locationCard,
                {
                  backgroundColor: isSelected ? theme.primaryLight + '50' : theme.surfaceSubtle,
                  borderColor: isSelected ? theme.primary : theme.border,
                }
              ]}
              onPress={() => setSelectedLocation(loc)}
              activeOpacity={0.8}
            >
              {/* Category Badge & Active Pin */}
              <View style={styles.cardTopRow}>
                <View style={[styles.categoryPill, { backgroundColor: meta.color + '20' }]}>
                  <MaterialCommunityIcons 
                    name={meta.icon as any} 
                    size={13} 
                    color={meta.color} 
                  />
                  <Text style={[styles.categoryPillText, { color: meta.color }]}>
                    {meta.label.toUpperCase()}
                  </Text>
                </View>

                {isSelected ? (
                  <View style={[styles.activeStatusPill, { backgroundColor: theme.primary }]}>
                    <Text style={styles.activeStatusText}>ACTIVE</Text>
                  </View>
                ) : (
                  <Ionicons name="radio-button-off" size={14} color={theme.textMuted} />
                )}
              </View>

              {/* Name & State */}
              <Text style={[styles.locationName, { color: theme.textPrimary, fontWeight: isSelected ? '800' : '700' }]} numberOfLines={1}>
                {loc.name}
              </Text>
              <Text style={[styles.locationState, { color: theme.textMuted }]} numberOfLines={1}>
                {loc.state}
              </Text>

              {/* Live Weather Micro-Snapshot */}
              <View style={[styles.weatherSnapshot, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.snapshotTempRow}>
                  <Text style={[styles.snapshotTemp, { color: theme.textPrimary }]}>
                    {weather.temperature}°C
                  </Text>
                  <Text style={[styles.snapshotRain, { color: weather.rainProbability > 60 ? theme.alertRed : theme.primary }]}>
                    🌧️ {weather.rainProbability}%
                  </Text>
                </View>
                <Text style={[styles.snapshotCondition, { color: theme.textSecondary }]} numberOfLines={1}>
                  {weather.condition}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Add New Saved Place Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <MaterialCommunityIcons name="map-marker-plus" size={20} color={theme.primary} />
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  ADD NEW SAVED PLACE
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
              Select place category and enter location name:
            </Text>

            {/* Category Selection Chips */}
            <View style={styles.categoriesGrid}>
              {PLACE_CATEGORIES.map((cat) => {
                const isCatSelected = newPlaceType === cat.type;
                return (
                  <TouchableOpacity
                    key={cat.type}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: isCatSelected ? cat.color : theme.surfaceSubtle,
                        borderColor: isCatSelected ? cat.color : theme.border,
                      }
                    ]}
                    onPress={() => setNewPlaceType(cat.type)}
                  >
                    <MaterialCommunityIcons 
                      name={cat.icon as any} 
                      size={14} 
                      color={isCatSelected ? '#FFFFFF' : theme.textPrimary} 
                    />
                    <Text style={[styles.categoryChipText, { color: isCatSelected ? '#FFFFFF' : theme.textPrimary }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Place Inputs */}
            <View style={styles.modalInputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>PLACE NAME / LANDMARK:</Text>
              <TextInput
                style={[styles.modalInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surfaceSubtle }]}
                value={newPlaceName}
                onChangeText={setNewPlaceName}
                placeholder="e.g. My College Campus / Village Farm"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.inputLabel, { color: theme.textMuted, marginTop: 8 }]}>CITY / STATE:</Text>
              <TextInput
                style={[styles.modalInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surfaceSubtle }]}
                value={newPlaceState}
                onChangeText={setNewPlaceState}
                placeholder="e.g. Haryana / Uttar Pradesh / Delhi"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            <TouchableOpacity 
              style={[styles.savePlaceBtn, { backgroundColor: theme.primary }]}
              onPress={handleAddPlace}
            >
              <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              <Text style={styles.savePlaceBtnText}>SAVE PLACE TO SURVEILLANCE FEED</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subhead: {
    fontSize: 10,
    marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.md,
  },
  addBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 16,
    paddingHorizontal: spacing.md,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: 10,
  },
  locationCard: {
    width: 175,
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  categoryPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  activeStatusPill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radii.sm,
  },
  activeStatusText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  locationName: {
    fontSize: 12,
    marginBottom: 1,
  },
  locationState: {
    fontSize: 10,
    marginBottom: 6,
  },
  weatherSnapshot: {
    padding: 6,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  snapshotTempRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snapshotTemp: {
    fontSize: 12,
    fontWeight: '800',
  },
  snapshotRain: {
    fontSize: 10,
    fontWeight: '700',
  },
  snapshotCondition: {
    fontSize: 9,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  modalInputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  modalInput: {
    height: 38,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  savePlaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radii.md,
  },
  savePlaceBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});

export const SavedLocationsCarousel = React.memo(SavedLocationsCarouselComponent);
