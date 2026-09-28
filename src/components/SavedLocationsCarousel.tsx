import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

export const SavedLocationsCarousel: React.FC = () => {
  const { theme, savedLocations, selectedLocation, setSelectedLocation, t } = useApp();

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'home': return 'home-variant-outline';
      case 'office': return 'briefcase-outline';
      case 'farm': return 'leaf';
      case 'family': return 'heart-outline';
      default: return 'map-marker-outline';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="home-group" size={18} color={theme.primary} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {t.savedLocations}
          </Text>
        </View>
        <Text style={[styles.badgeText, { color: theme.primary }]}>
          {savedLocations.length} Registered
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {savedLocations.map((loc) => {
          const isSelected = loc.id === selectedLocation.id;
          return (
            <TouchableOpacity
              key={loc.id}
              style={[
                styles.locationCard,
                {
                  backgroundColor: isSelected ? theme.primaryLight : theme.surfaceSubtle,
                  borderColor: isSelected ? theme.primary : theme.border,
                }
              ]}
              onPress={() => setSelectedLocation(loc)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.iconWrapper, { backgroundColor: isSelected ? theme.primary : theme.surface }]}>
                  <MaterialCommunityIcons 
                    name={getLocationIcon(loc.type)} 
                    size={16} 
                    color={isSelected ? '#FFFFFF' : theme.textSecondary} 
                  />
                </View>
                {isSelected && (
                  <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
                )}
              </View>

              <Text style={[styles.locationName, { color: theme.textPrimary, fontWeight: isSelected ? '700' : '600' }]} numberOfLines={1}>
                {loc.name}
              </Text>
              <Text style={[styles.locationState, { color: theme.textMuted }]} numberOfLines={1}>
                {loc.state}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    marginBottom: spacing.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: 10,
  },
  locationCard: {
    width: 130,
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  locationName: {
    fontSize: 12,
  },
  locationState: {
    fontSize: 10,
    marginTop: 2,
  },
});
