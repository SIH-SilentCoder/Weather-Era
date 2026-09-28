import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { radii, spacing } from '../theme';

interface NetworkResilienceBannerProps {
  onRetrySync?: () => void;
}

export const NetworkResilienceBanner: React.FC<NetworkResilienceBannerProps> = ({ onRetrySync }) => {
  const { isOffline, setIsOffline, weatherData, refreshWeather, theme, isRefreshing } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // If user is online and not toggled to low network, show a compact reassurance bar or hide
  const handleManualSync = async () => {
    setSyncing(true);
    if (onRetrySync) {
      await onRetrySync();
    } else {
      await refreshWeather();
    }
    setTimeout(() => {
      setSyncing(false);
    }, 600);
  };

  const staleTime = weatherData.lastUpdated || '18 mins ago';

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: isOffline ? '#FEF3C7' : theme.surfaceSubtle, 
          borderColor: isOffline ? '#F59E0B' : theme.border 
        }
      ]}
      accessible={true}
      accessibilityRole="region"
      accessibilityLabel={isOffline ? "Low Network Mode: Showing cached weather data" : "Network status: Online Live Doppler"}
    >
      <View style={styles.topRow}>
        <View style={styles.leftMeta}>
          <View style={[styles.iconContainer, { backgroundColor: isOffline ? '#FDE68A' : theme.primaryLight }]}>
            <MaterialCommunityIcons 
              name={isOffline ? "wifi-strength-1-alert" : "wifi-check"} 
              size={20} 
              color={isOffline ? "#B45309" : theme.primary} 
            />
          </View>
          <View style={styles.textColumn}>
            <View style={styles.headlineRow}>
              <Text style={[styles.title, { color: isOffline ? '#92400E' : theme.textPrimary }]}>
                {isOffline ? '📶 Low Network / Cached Mode' : '🟢 Live Doppler Sync Active'}
              </Text>
              <View style={[styles.badge, { backgroundColor: isOffline ? '#D97706' : '#059669' }]}>
                <Text style={styles.badgeText}>
                  {isOffline ? 'STALE DATA' : 'FRESH'}
                </Text>
              </View>
            </View>
            <Text style={[styles.subtitle, { color: isOffline ? '#78350F' : theme.textSecondary }]}>
              {isOffline 
                ? `⚠️ Showing cached telemetry from ${staleTime} • Zero data loss`
                : 'Real-time telemetry streamed via MoES Secure Reverse-Proxy'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {/* Refresh / Reconnect Button */}
          <TouchableOpacity
            style={[
              styles.actionButton, 
              { 
                backgroundColor: isOffline ? '#B45309' : theme.surface, 
                borderColor: isOffline ? '#92400E' : theme.border 
              }
            ]}
            onPress={handleManualSync}
            disabled={syncing || isRefreshing}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Retry network connection and refresh weather data"
            accessibilityHint="Double tap to test connection and download latest Doppler updates"
          >
            {syncing || isRefreshing ? (
              <ActivityIndicator size="small" color={isOffline ? '#FFFFFF' : theme.primary} />
            ) : (
              <Ionicons 
                name="refresh" 
                size={16} 
                color={isOffline ? '#FFFFFF' : theme.textPrimary} 
              />
            )}
            <Text style={[styles.actionButtonText, { color: isOffline ? '#FFFFFF' : theme.textPrimary }]}>
              {syncing ? 'Syncing...' : 'Sync'}
            </Text>
          </TouchableOpacity>

          {/* Toggle Offline Simulation Button */}
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: isOffline ? '#FDE68A' : theme.surface,
                borderColor: isOffline ? '#D97706' : theme.border,
              }
            ]}
            onPress={() => setIsOffline(!isOffline)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isOffline ? "Switch to Online Mode" : "Simulate Low Network Mode"}
          >
            <Text style={[styles.toggleText, { color: isOffline ? '#92400E' : theme.textSecondary }]}>
              {isOffline ? 'Go Online' : 'Simulate 2G'}
            </Text>
          </TouchableOpacity>

          {/* Expand Details Trigger */}
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setShowDetails(!showDetails)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Toggle Low Network advisory details"
          >
            <Ionicons 
              name={showDetails ? "chevron-up" : "chevron-down"} 
              size={18} 
              color={isOffline ? '#92400E' : theme.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanded Resilience Details */}
      {showDetails && (
        <View style={[styles.detailSection, { borderTopColor: isOffline ? '#FCD34D' : theme.border }]}>
          <View style={styles.gridRow}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="database-check" size={16} color={isOffline ? '#92400E' : theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureTitle, { color: isOffline ? '#92400E' : theme.textPrimary }]}>
                  IndexedDB Local Cache
                </Text>
                <Text style={[styles.featureDesc, { color: isOffline ? '#78350F' : theme.textSecondary }]}>
                  All Doppler radar tiles & hourly projections remain offline-readable.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="phone-classic" size={16} color={isOffline ? '#92400E' : theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureTitle, { color: isOffline ? '#92400E' : theme.textPrimary }]}>
                  Offline IVRS / SMS Helpline
                </Text>
                <Text style={[styles.featureDesc, { color: isOffline ? '#78350F' : theme.textSecondary }]}>
                  No internet? Dial <Text style={{ fontWeight: '800' }}>1070</Text> or SMS <Text style={{ fontWeight: '800' }}>"MAUSAM &lt;PIN&gt;" to 51969</Text>.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.emergencyRow}>
            <View style={styles.emergencyPill}>
              <Text style={styles.emergencyPillText}>2G / EDGE Optimized</Text>
            </View>
            <View style={styles.emergencyPill}>
              <Text style={styles.emergencyPillText}>Zero Heavy Assets in Low-Net</Text>
            </View>
            <View style={styles.emergencyPill}>
              <Text style={styles.emergencyPillText}>IMD Synoptic Cache v2.4</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.sm,
    borderWidth: 1,
    minHeight: 36, // Ensure accessible touch target
    minWidth: 44,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
  toggleButton: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: radii.sm,
    borderWidth: 1,
    minHeight: 36,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  expandButton: {
    padding: 6,
    minWidth: 32,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
    minWidth: 200,
  },
  featureTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 10,
    lineHeight: 14,
  },
  emergencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  emergencyPill: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  emergencyPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4B5563',
  },
});
