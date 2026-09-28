import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { calculateWeatherImpact } from '../services/impactEngine';
import { calculatePersonalizedCardRanking, CardScoringMeta } from '../services/personalizationEngine';
import { WeatherHeroCard } from '../components/WeatherHeroCard';
import { ImpactActionCard } from '../components/ImpactActionCard';
import { WeatherImpactScoreCard } from '../components/WeatherImpactScoreCard';
import { AlertIntelligenceBanner } from '../components/AlertIntelligenceBanner';
import { WhatIfSimulatorCard } from '../components/WhatIfSimulatorCard';
import { WhyHomepageChangedBanner } from '../components/WhyHomepageChangedBanner';
import { HourlyForecastStrip } from '../components/HourlyForecastStrip';
import { RouteWeatherCard } from '../components/RouteWeatherCard';
import { SavedLocationsCarousel } from '../components/SavedLocationsCarousel';
import { PersonaInsightsCard } from '../components/PersonaInsightsCard';
import { DesktopSidePanel } from '../components/DesktopSidePanel';
import { DesktopLeftRail } from '../components/DesktopLeftRail';
import { PersonalizedGreetingBar } from '../components/PersonalizedGreetingBar';
import { NetworkResilienceBanner } from '../components/NetworkResilienceBanner';
import { radii, spacing } from '../theme';

export const HomeScreen: React.FC = () => {
  const { 
    weatherData, 
    persona, 
    alerts, 
    weatherDNA, 
    timeOfDay, 
    selectedInterests,
    theme
  } = useApp();

  const { width } = useWindowDimensions();
  
  const showLeftRail = width >= 1180;
  const showRightPanel = width >= 860;

  // Performance: Memoize impact computation to avoid unnecessary re-calculations
  const impactData = useMemo(
    () => calculateWeatherImpact(weatherData, persona),
    [weatherData, persona]
  );

  // Performance: Memoize ranking sort to eliminate heavy card recalculations on unrelated re-renders
  const rankedCardMetas = useMemo(
    () => calculatePersonalizedCardRanking(
      persona, 
      weatherData, 
      alerts, 
      weatherDNA, 
      timeOfDay, 
      selectedInterests
    ),
    [persona, weatherData, alerts, weatherDNA, timeOfDay, selectedInterests]
  );

  const renderCardContent = (meta: CardScoringMeta, index: number) => {
    let cardElement: React.ReactNode = null;

    switch (meta.cardType) {
      case 'severe_alert':
        cardElement = alerts.length > 0 ? (
          <AlertIntelligenceBanner key="alert" alert={alerts[0]} />
        ) : null;
        break;

      case 'weather_hero':
        cardElement = <WeatherHeroCard key="hero" weather={weatherData} />;
        break;

      case 'weather_impact_action':
        cardElement = <ImpactActionCard key="impact_action" impactData={impactData} />;
        break;

      case 'impact_score':
        cardElement = <WeatherImpactScoreCard key="impact_score" impactData={impactData} />;
        break;

      case 'what_if_simulator':
        cardElement = <WhatIfSimulatorCard key="what_if" />;
        break;

      case 'hourly_forecast':
        cardElement = <HourlyForecastStrip key="hourly" />;
        break;

      case 'route_weather':
        cardElement = <RouteWeatherCard key="route" />;
        break;

      case 'persona_insights':
        cardElement = <PersonaInsightsCard key="insights" />;
        break;

      case 'saved_locations':
        cardElement = <SavedLocationsCarousel key="saved_locs" />;
        break;

      default:
        cardElement = null;
    }

    if (!cardElement) return null;

    // Display ranking priority tag for cards that were boosted by user interests or time of day
    const isSpecialBoosted = meta.triggeredBy.length > 0 && meta.cardType !== 'weather_hero';

    return (
      <View key={`${meta.cardType}-${index}`} style={styles.cardWrapper}>
        {isSpecialBoosted && (
          <View style={styles.boostBadgeRow}>
            <View style={[styles.boostPill, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
              <Text style={[styles.boostRank, { color: theme.primary }]}>
                #{index + 1}
              </Text>
              <Text style={[styles.boostText, { color: theme.primary }]} numberOfLines={1}>
                {meta.triggeredBy[0]}
              </Text>
            </View>
          </View>
        )}
        {cardElement}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyRow}>
        {/* Desktop Left Operations Rail (Large Screens) */}
        {showLeftRail && <DesktopLeftRail />}

        {/* Center Main Stage Feed Column */}
        <ScrollView
          style={styles.mainFeed}
          contentContainerStyle={[styles.feedContent, showRightPanel && styles.desktopFeedContent]}
          showsVerticalScrollIndicator={false}
        >
          {/* Personalized Salutation, Time Context & Active Interests */}
          <PersonalizedGreetingBar />

          {/* 📶 Low Network Resilience: Cached Data & Stale-Data Indicator */}
          <NetworkResilienceBanner />

          {/* Transparent Adaptation Explanation Layer */}
          <WhyHomepageChangedBanner />

          {/* Dynamically Scored & Re-ranked Cards */}
          {rankedCardMetas.map((meta, idx) => renderCardContent(meta, idx))}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Desktop Contextual Hazard & Telemetry Side Panel */}
        {showRightPanel && <DesktopSidePanel />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'row',
  },
  mainFeed: {
    flex: 1,
  },
  feedContent: {
    paddingBottom: spacing.xxl,
  },
  desktopFeedContent: {
    maxWidth: 740,
    width: '100%',
    alignSelf: 'center',
  },
  cardWrapper: {
    marginBottom: 2,
  },
  boostBadgeRow: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: -8,
    zIndex: 1,
    flexDirection: 'row',
  },
  boostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  boostRank: {
    fontSize: 9,
    fontWeight: '900',
  },
  boostText: {
    fontSize: 9,
    fontWeight: '700',
    maxWidth: 320,
  },
});
