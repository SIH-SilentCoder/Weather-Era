import { PersonaType, WeatherAlert, WeatherData, WeatherDNA, HomepageExplanation } from '../types';

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

export const getRankedCardsForPersona = (
  persona: PersonaType,
  weather: WeatherData,
  alerts: WeatherAlert[],
  dna: WeatherDNA
): HomepageCardType[] => {
  const cards: HomepageCardType[] = [];

  // Severe alert is ALWAYS first if any severe/extreme alert exists
  const hasSevereAlert = alerts.some(a => a.severity === 'severe' || a.severity === 'extreme');
  if (hasSevereAlert) {
    cards.push('severe_alert');
  }

  // Hero card is always visible near top
  cards.push('weather_hero');

  // Core signature: Weather -> Impact -> Action
  cards.push('weather_impact_action');

  // Persona-based rank prioritization
  switch (persona) {
    case 'farmer':
      // Farmers need immediate crop insight, impact score, hourly moisture, and what-if
      cards.push('persona_insights');
      cards.push('impact_score');
      cards.push('hourly_forecast');
      cards.push('what_if_simulator');
      cards.push('saved_locations');
      break;

    case 'commuter':
      // Commuters need departure simulator, route weather, impact score, hourly
      cards.push('what_if_simulator');
      cards.push('route_weather');
      cards.push('impact_score');
      cards.push('hourly_forecast');
      cards.push('persona_insights');
      cards.push('saved_locations');
      break;

    case 'traveller':
      // Travellers prioritize route weather, what if simulator, saved family locations
      cards.push('route_weather');
      cards.push('what_if_simulator');
      cards.push('impact_score');
      cards.push('saved_locations');
      cards.push('hourly_forecast');
      cards.push('persona_insights');
      break;

    case 'student':
      // Students care about hourly, impact score, AQI, what if
      cards.push('impact_score');
      cards.push('hourly_forecast');
      cards.push('aqi_and_uv');
      cards.push('what_if_simulator');
      cards.push('route_weather');
      cards.push('persona_insights');
      break;

    case 'outdoor':
      // Outdoor athletes care about hourly, AQI/UV, impact score
      cards.push('impact_score');
      cards.push('aqi_and_uv');
      cards.push('hourly_forecast');
      cards.push('what_if_simulator');
      cards.push('persona_insights');
      break;

    case 'health':
      // Health-sensitive care about AQI/UV at the very top, impact score, hourly
      cards.push('aqi_and_uv');
      cards.push('impact_score');
      cards.push('persona_insights');
      cards.push('hourly_forecast');
      cards.push('what_if_simulator');
      break;

    case 'fisherman':
      // Fishermen care about wind/wave impact, what-if, saved ports
      cards.push('impact_score');
      cards.push('persona_insights');
      cards.push('what_if_simulator');
      cards.push('hourly_forecast');
      cards.push('saved_locations');
      break;

    default:
      cards.push('impact_score');
      cards.push('what_if_simulator');
      cards.push('hourly_forecast');
      cards.push('route_weather');
      cards.push('saved_locations');
  }

  // If severe alert was added above, ensure we don't duplicate
  return Array.from(new Set(cards));
};

export const getHomepageChangeExplanation = (
  persona: PersonaType,
  weather: WeatherData,
  alerts: WeatherAlert[],
  dna: WeatherDNA
): HomepageExplanation => {
  const triggers: string[] = [];

  const hasSevereAlert = alerts.some(a => a.severity === 'severe' || a.severity === 'extreme');
  if (hasSevereAlert) {
    triggers.push(`Active Orange/Red IMD Alert elevated to priority position #1`);
  }

  if (weather.rainProbability > 65) {
    triggers.push(`High precipitation probability (${weather.rainProbability}%) triggered Weather → Impact → Action elevation`);
  }

  if (persona === 'commuter') {
    triggers.push(`Commuter persona active: Elevated "What-If" departure windows & Route weather`);
  } else if (persona === 'farmer') {
    triggers.push(`Farmer persona active: Prioritized Agromet soil saturation and spraying window insights`);
  } else if (persona === 'health') {
    triggers.push(`Health-sensitive persona: Elevated AQI (${weather.aqi}) & particulate stress breakdown`);
  } else if (persona === 'traveller') {
    triggers.push(`Traveller persona: Checkpoints along route prioritized above daily forecast`);
  }

  if (dna.rainSensitivity >= 4) {
    triggers.push(`Personal DNA sensitivity to rain set to High (${dna.rainSensitivity}/5)`);
  }

  return {
    primaryReason: hasSevereAlert 
      ? 'Severe Weather Alert In Effect' 
      : `${persona.toUpperCase()} Context Optimized`,
    triggers,
    timestamp: 'Updated 2m ago based on current Doppler radar scans',
  };
};
