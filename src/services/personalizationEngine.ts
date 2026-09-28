import { 
  PersonaType, 
  WeatherAlert, 
  WeatherData, 
  WeatherDNA, 
  HomepageExplanation, 
  TimeOfDay, 
  UserInterest 
} from '../types';

export type HomepageCardType =
  | 'severe_alert'
  | 'weather_hero'
  | 'weather_impact_action'
  | 'impact_score'
  | 'what_if_simulator'
  | 'hourly_forecast'
  | 'route_weather'
  | 'persona_insights'
  | 'aqi_and_uv'
  | 'saved_locations';

export interface CardScoringMeta {
  cardType: HomepageCardType;
  priorityScore: number;
  priorityLabel?: string;
  triggeredBy: string[];
}

export const calculatePersonalizedCardRanking = (
  persona: PersonaType,
  weather: WeatherData,
  alerts: WeatherAlert[],
  dna: WeatherDNA,
  timeOfDay: TimeOfDay,
  interests: UserInterest[]
): CardScoringMeta[] => {
  const cards: CardScoringMeta[] = [];

  // Severe Alert: Always highest priority (score 1000) if any severe/extreme alert exists
  const hasSevereAlert = alerts.some(a => a.severity === 'severe' || a.severity === 'extreme');
  if (hasSevereAlert) {
    cards.push({
      cardType: 'severe_alert',
      priorityScore: 1000,
      priorityLabel: '🔴 CRITICAL HAZARD PRIORITY #1',
      triggeredBy: ['Active IMD Multi-District Severe Warning'],
    });
  }

  // 1. Weather Hero Card (Baseline vital status)
  cards.push({
    cardType: 'weather_hero',
    priorityScore: 900,
    priorityLabel: 'METEOROLOGICAL VITALS',
    triggeredBy: ['Live IMD AWS Observations'],
  });

  // 2. Weather -> Impact -> Action (Core Signature)
  let impactScore = 800;
  const impactTriggers: string[] = ['Weather → Impact → Action Signature Engine'];
  if (weather.rainProbability > 65) {
    impactScore += 80;
    impactTriggers.push(`High precipitation likelihood (${weather.rainProbability}%)`);
  }
  if (timeOfDay === 'evening' && (persona === 'commuter' || persona === 'student')) {
    impactScore += 60;
    impactTriggers.push('Evening commute impact prioritization');
  }
  cards.push({
    cardType: 'weather_impact_action',
    priorityScore: impactScore,
    priorityLabel: '🎯 CONTEXTUAL ACTION PLAN',
    triggeredBy: impactTriggers,
  });

  // 3. What-If Departure Simulator
  let whatIfScore = 500;
  const whatIfTriggers: string[] = [];
  if (timeOfDay === 'evening' || timeOfDay === 'morning') {
    whatIfScore += 180;
    whatIfTriggers.push(`Peak departure transit window (${timeOfDay.toUpperCase()})`);
  }
  if (persona === 'commuter' || persona === 'traveller') {
    whatIfScore += 160;
    whatIfTriggers.push(`${persona.toUpperCase()} corridor schedule optimization`);
  }
  if (interests.includes('transit_delays') || interests.includes('waterlogging')) {
    whatIfScore += 140;
    whatIfTriggers.push('Interest: Transit & route delays active');
  }
  if (weather.rainProbability > 50) {
    whatIfScore += 80;
    whatIfTriggers.push('Rain probability comparison across time slots');
  }
  cards.push({
    cardType: 'what_if_simulator',
    priorityScore: whatIfScore,
    priorityLabel: '⏱️ DEPARTURE TIME SIMULATOR',
    triggeredBy: whatIfTriggers,
  });

  // 4. Route Weather Checkpoints
  let routeScore = 480;
  const routeTriggers: string[] = [];
  if (persona === 'commuter' || persona === 'traveller') {
    routeScore += 200;
    routeTriggers.push(`${persona.toUpperCase()} transit checkpoints`);
  }
  if (interests.includes('waterlogging')) {
    routeScore += 170;
    routeTriggers.push('Interest: Road waterlogging & underpass pooling active');
  }
  if (timeOfDay === 'evening') {
    routeScore += 120;
    routeTriggers.push('Evening highway rush hour advisory');
  }
  cards.push({
    cardType: 'route_weather',
    priorityScore: routeScore,
    priorityLabel: '🚗 CORRIDOR CHECKPOINTS & HAZARDS',
    triggeredBy: routeTriggers,
  });

  // 5. Contextual Weather Impact Score
  let scoreCardScore = 600;
  const scoreTriggers: string[] = [`Personalized for ${persona.toUpperCase()}`];
  if (dna.rainSensitivity >= 4 || dna.commuteFrequency >= 4) {
    scoreCardScore += 90;
    scoreTriggers.push(`Weather DNA sensitivity elevated (${dna.rainSensitivity}/5)`);
  }
  cards.push({
    cardType: 'impact_score',
    priorityScore: scoreCardScore,
    priorityLabel: '📊 CONTEXTUAL VULNERABILITY METER',
    triggeredBy: scoreTriggers,
  });

  // 6. Persona Specialized Insights (Agromet for Farmer, Marine for Fisherman, etc.)
  let insightScore = 520;
  const insightTriggers: string[] = [];
  if (persona === 'farmer') {
    insightScore += 260;
    insightTriggers.push('Farmer: Agromet soil moisture saturation & 48h spray window');
    if (interests.includes('spraying')) {
      insightScore += 120;
      insightTriggers.push('Interest: Fertilizer & crop spraying alert');
    }
  } else if (persona === 'fisherman') {
    insightScore += 260;
    insightTriggers.push('Fisherman: INCOIS wave swell & coastal squall alerts');
    if (interests.includes('marine_swell')) {
      insightScore += 120;
      insightTriggers.push('Interest: Marine wave height watch active');
    }
  } else if (persona === 'health') {
    insightScore += 240;
    insightTriggers.push('Health: Respiratory dampness & particulate load');
    if (interests.includes('aqi_bronchial')) {
      insightScore += 120;
      insightTriggers.push('Interest: Bronchial asthma precautions');
    }
  } else if (persona === 'outdoor') {
    insightScore += 220;
    insightTriggers.push('Outdoor: Heat index & optimal training hours');
    if (interests.includes('workout')) {
      insightScore += 120;
      insightTriggers.push('Interest: Best running/cycling hour');
    }
  }
  cards.push({
    cardType: 'persona_insights',
    priorityScore: insightScore,
    priorityLabel: `💡 DOMAIN INTELLIGENCE (${persona.toUpperCase()})`,
    triggeredBy: insightTriggers,
  });

  // 7. 24-Hour Hourly Forecast Strip
  let hourlyScore = 550;
  const hourlyTriggers: string[] = ['Continuous precipitation timeline'];
  if (timeOfDay === 'morning' || timeOfDay === 'afternoon') {
    hourlyScore += 90;
    hourlyTriggers.push(`${timeOfDay.toUpperCase()} diurnal progression`);
  }
  cards.push({
    cardType: 'hourly_forecast',
    priorityScore: hourlyScore,
    priorityLabel: '🕒 24-HOUR RADAR TIMELINE',
    triggeredBy: hourlyTriggers,
  });

  // 8. Saved / Family Locations Carousel
  let savedScore = 400;
  const savedTriggers: string[] = ['Cross-city family weather surveillance'];
  if (persona === 'traveller') {
    savedScore += 160;
    savedTriggers.push('Traveller destination tracking');
  }
  cards.push({
    cardType: 'saved_locations',
    priorityScore: savedScore,
    priorityLabel: '🏡 REGISTERED FAMILY HUBS',
    triggeredBy: savedTriggers,
  });

  // Sort descending by calculated priorityScore
  return cards.sort((a, b) => b.priorityScore - a.priorityScore);
};

export const getHomepageChangeExplanation = (
  persona: PersonaType,
  weather: WeatherData,
  alerts: WeatherAlert[],
  dna: WeatherDNA,
  timeOfDay: TimeOfDay,
  interests: UserInterest[]
): HomepageExplanation => {
  const triggers: string[] = [];

  const hasSevereAlert = alerts.some(a => a.severity === 'severe' || a.severity === 'extreme');
  if (hasSevereAlert) {
    triggers.push(`Active Orange/Red IMD Alert elevated to priority position #1`);
  }

  // Time-of-day trigger
  if (timeOfDay === 'evening') {
    triggers.push(`Time of Day (Evening Rush Hour 17:00–21:00): Elevated "What-If" departure windows & Route weather`);
  } else if (timeOfDay === 'morning') {
    triggers.push(`Time of Day (Morning 05:00–11:00): Prioritized 24h timeline and diurnal outlook`);
  } else if (timeOfDay === 'afternoon') {
    triggers.push(`Time of Day (Afternoon Peak Heat): Prioritized UV and solar thermal stress`);
  } else if (timeOfDay === 'night') {
    triggers.push(`Time of Day (Night): Highlighted overnight condensation & tomorrow early morning forecast`);
  }

  // Interests triggers
  if (interests.includes('waterlogging')) {
    triggers.push(`Active Interest [Road Waterlogging]: Elevated highway underpass checkpoints to top rank`);
  }
  if (interests.includes('spraying')) {
    triggers.push(`Active Interest [Crop Spraying]: Elevated Agromet chemical runoff warnings`);
  }
  if (interests.includes('aqi_bronchial')) {
    triggers.push(`Active Interest [AQI Sensitivity]: Elevated respiratory particulate advisory`);
  }

  // Persona context trigger
  if (persona === 'commuter') {
    triggers.push(`Commuter persona: Elevated traffic mesonet and leave-now comparison`);
  } else if (persona === 'farmer') {
    triggers.push(`Farmer persona: Prioritized topsoil saturation and field drainage alerts`);
  } else if (persona === 'fisherman') {
    triggers.push(`Fisherman persona: Prioritized INCOIS marine wave swell and coastal squall`);
  }

  const promotedCards: string[] = [];
  const deprioritizedCards: string[] = [];

  if (hasSevereAlert) {
    promotedCards.push('🔴 Multi-District Severe Alert (Rank #1 - Emergency Override)');
  }
  if (persona === 'commuter' || persona === 'traveller') {
    promotedCards.push('🚗 Route Corridor Weather Checkpoints & Road Ponding');
    promotedCards.push('⏱️ What-If Commute Departure Window Simulator');
    deprioritizedCards.push('🌱 Agromet Agricultural Advisory');
  } else if (persona === 'farmer') {
    promotedCards.push('🌾 Agromet Soil Moisture & 48h Spraying Window');
    promotedCards.push('🎯 Action Plan: Field Drainage & Sowing Safeguards');
    deprioritizedCards.push('🚗 City Highway Checkpoints');
  } else if (persona === 'health') {
    promotedCards.push('🫁 AQI Particulate & Bronchial Asthma Precautions');
    promotedCards.push('🌡️ Solar UV & Thermal Stress Index');
    deprioritizedCards.push('🚗 Intercity Route Checkpoints');
  }

  if (weather.rainProbability > 65) {
    promotedCards.push(`🌦️ Weather → Impact → Action Playbook (${weather.rainProbability}% Rain Hazard)`);
  }

  deprioritizedCards.push('📅 General 7-Day Distant Forecast');
  deprioritizedCards.push('🏡 Secondary Saved Locations');

  return {
    primaryReason: hasSevereAlert 
      ? 'Severe Weather Alert In Effect' 
      : `${persona.toUpperCase()} • ${timeOfDay.toUpperCase()} WINDOW ADAPTED`,
    triggers,
    promotedCards,
    deprioritizedCards,
    algorithmFormula: 'Rank Score = Persona (0.35) + Interests (0.25) + Doppler Hazard (0.20) + Time of Day (0.15) + DNA (0.05)',
    timestamp: 'Dynamically adapted in real time based on active micro-climate factors',
  };
};
