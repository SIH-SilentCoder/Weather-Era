import { RouteCheckpoint, WhatIfScenario, WeatherData } from '../types';

export const getWhatIfScenarios = (baseWeather: WeatherData): WhatIfScenario[] => {
  return [
    {
      departureLabel: 'Leave Now (Current Window)',
      rainProbability: baseWeather.rainProbability,
      temperature: baseWeather.temperature,
      windSpeed: baseWeather.windSpeed,
      delayRisk: baseWeather.rainProbability > 70 ? 'High' : 'Moderate',
      summary: `${baseWeather.rainProbability}% rain risk, gusty squall currently building up.`,
      actionRecommendation: 'Depart now before localized street waterlogging expands further.',
    },
    {
      departureLabel: 'Wait +1 Hour (7:30 PM)',
      rainProbability: Math.min(95, baseWeather.rainProbability + 10),
      temperature: baseWeather.temperature - 1,
      windSpeed: baseWeather.windSpeed + 5,
      delayRisk: 'High',
      summary: 'Peak convective storm cell overhead; heavy lightning activity expected.',
      actionRecommendation: 'High delay risk. Postpone departure or shift to elevated rapid metro line.',
    },
    {
      departureLabel: 'Wait +2.5 Hours (9:00 PM)',
      rainProbability: 40,
      temperature: baseWeather.temperature - 3,
      windSpeed: 16,
      delayRisk: 'Low',
      summary: 'Storm cell dissipating eastwards; light drizzle with road clearance.',
      actionRecommendation: 'Optimal delayed departure window. Significantly reduced traffic hazard.',
    },
    {
      departureLabel: 'Tomorrow Morning (07:30 AM)',
      rainProbability: 15,
      temperature: 26,
      windSpeed: 12,
      delayRisk: 'Low',
      summary: 'Clear morning skies with pleasant ambient temperatures and dry corridors.',
      actionRecommendation: 'Safest travel window if your journey is non-urgent.',
    }
  ];
};

export const POPULAR_ROUTES = [
  { origin: 'Connaught Place, Central Delhi', destination: 'Cyber City, Gurugram' },
  { origin: 'Noida Electronic City, Sec 62', destination: 'IGI Airport Terminal 3' },
  { origin: 'New Delhi Railway Station', destination: 'Karnal Agri Hub (NH-44)' },
  { origin: 'Pune Station', destination: 'Hinjawadi IT Park' },
];

export const calculateRouteWeather = (
  origin: string,
  destination: string
): { checkpoints: RouteCheckpoint[]; totalDistanceKm: number; estimatedDurationMins: number; routeAlert?: string } => {
  // Checkpoints along representative Delhi-Gurugram highway corridor or generic corridor
  const checkpoints: RouteCheckpoint[] = [
    {
      id: 'cp-1',
      name: origin || 'Connaught Place, Delhi',
      distanceKm: 0,
      eta: '00 mins',
      temperature: 31,
      condition: 'Overcast & Drizzle',
      conditionCode: 'rain',
      rainProbability: 65,
      windSpeed: 22,
      hazardNote: 'Wet asphalt; moderate surface spray',
      isHazardous: false,
    },
    {
      id: 'cp-2',
      name: 'Dhaula Kuan Junction Flyover',
      distanceKm: 9.2,
      eta: '+18 mins',
      temperature: 30,
      condition: 'Heavy Downpour',
      conditionCode: 'rain',
      rainProbability: 85,
      windSpeed: 34,
      hazardNote: 'Caution: Slow-moving traffic & gusty crosswinds on flyover',
      isHazardous: true,
    },
    {
      id: 'cp-3',
      name: 'Mahipalpur / Aerocity Underpass',
      distanceKm: 18.5,
      eta: '+34 mins',
      temperature: 29,
      condition: 'Intense Rain & Low Visibility',
      conditionCode: 'thunderstorm',
      rainProbability: 92,
      windSpeed: 38,
      hazardNote: 'Water pooling alert near underpass exit ramp; visibility < 2.0 km',
      isHazardous: true,
    },
    {
      id: 'cp-4',
      name: 'Sirhaul Border (Delhi-Haryana)',
      distanceKm: 24.8,
      eta: '+46 mins',
      temperature: 30,
      condition: 'Moderate Rain Showers',
      conditionCode: 'rain',
      rainProbability: 78,
      windSpeed: 28,
      hazardNote: 'Toll bottleneck; road surface wet but draining smoothly',
      isHazardous: false,
    },
    {
      id: 'cp-5',
      name: destination || 'Cyber City, Gurugram',
      distanceKm: 31.4,
      eta: '+58 mins',
      temperature: 30,
      condition: 'Light Rain & Overcast',
      conditionCode: 'rain',
      rainProbability: 70,
      windSpeed: 24,
      hazardNote: 'Destination approach normal; sheltered basement parking accessible',
      isHazardous: false,
    },
  ];

  return {
    checkpoints,
    totalDistanceKm: 31.4,
    estimatedDurationMins: 58,
    routeAlert: 'Route Weather Alert: Severe convective rain cell detected between km 15–22 (Aerocity to Sirhaul corridor). Expect 15–20 min delay.',
  };
};
