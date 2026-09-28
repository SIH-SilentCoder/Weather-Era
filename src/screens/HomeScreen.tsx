import React from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { calculateWeatherImpact } from '../services/impactEngine';
import { getRankedCardsForPersona } from '../services/personalizationEngine';
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
import { spacing } from '../theme';

export const HomeScreen: React.FC = () => {
  const { weatherData, persona, alerts, weatherDNA } = useApp();
  const { width } = useWindowDimensions();
  
  const showLeftRail = width >= 1180;
  const showRightPanel = width >= 860;

  const impactData = calculateWeatherImpact(weatherData, persona);
  const rankedCards = getRankedCardsForPersona(persona, weatherData, alerts, weatherDNA);

  const renderCard = (cardType: string) => {
    switch (cardType) {
      case 'severe_alert':
        return alerts.length > 0 ? (
          <AlertIntelligenceBanner key="alert" alert={alerts[0]} />
        ) : null;

      case 'weather_hero':
        return <WeatherHeroCard key="hero" weather={weatherData} />;

      case 'weather_impact_action':
        return <ImpactActionCard key="impact_action" impactData={impactData} />;

      case 'impact_score':
        return <WeatherImpactScoreCard key="impact_score" impactData={impactData} />;

      case 'what_if_simulator':
        return <WhatIfSimulatorCard key="what_if" />;

      case 'hourly_forecast':
        return <HourlyForecastStrip key="hourly" />;

      case 'route_weather':
        return <RouteWeatherCard key="route" />;

      case 'persona_insights':
        return <PersonaInsightsCard key="insights" />;

      case 'saved_locations':
        return <SavedLocationsCarousel key="saved_locs" />;

      default:
        return null;
    }
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
          {/* Explanation Layer Banner */}
          <WhyHomepageChangedBanner />

          {/* Persona-Ranked Cards */}
          {rankedCards.map((c) => renderCard(c))}

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
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
});
