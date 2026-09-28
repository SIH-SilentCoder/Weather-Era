export type PersonaType = 
  | 'farmer' 
  | 'commuter' 
  | 'traveller' 
  | 'student' 
  | 'outdoor' 
  | 'health' 
  | 'fisherman';

export interface LocationItem {
  id: string;
  name: string;
  state: string;
  type: 'home' | 'office' | 'farm' | 'village' | 'family' | 'custom';
  lat: number;
  lon: number;
  isCurrent?: boolean;
}

export interface WeatherData {
  city: string;
  state: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionCode: string; // rain, sunny, cloudy, thunderstorm, foggy
  humidity: number;      // %
  windSpeed: number;     // km/h
  windDirection: string; // NE, SW, etc.
  visibility: number;    // km
  uvIndex: number;       // 0-11+
  aqi: number;           // 0-500
  aqiCategory: string;   // Good, Satisfactory, Moderate, Poor, Very Poor, Severe
  pressure: number;      // hPa
  rainProbability: number; // %
  rainfallMm: number;    // mm in last 3h
  dewPoint: number;
  sunrise: string;
  sunset: string;
  
  // Forecast Trust Metadata
  lastUpdated: string;
  freshnessMins: number;
  confidenceScore: number; // 0-100%
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  dataSource: string; // e.g. "IMD WRF & INSAT-3DR Doppler Radar"
}

export interface HourlyForecastItem {
  time: string;
  timestamp: number;
  temperature: number;
  condition: string;
  conditionCode: string;
  rainProbability: number;
  windSpeed: number;
  isNow?: boolean;
}

export interface DailyForecastItem {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  conditionCode: string;
  rainProbability: number;
  rainfallMm: number;
  uvIndex: number;
  summary: string;
}

export interface WeatherAlert {
  id: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
  colorCode: 'red' | 'orange' | 'yellow' | 'green';
  headline: string;
  type: string; // Heavy Rain, Heatwave, Thunderstorm, Cyclone, Lightning
  affectedDistricts: string[];
  issuedAt: string;
  validTill: string;
  description: string;
  actionGuidance: string;
  source: string;
}

export interface ContributingFactor {
  factor: string;
  score: number; // 0-100
  weight: number; // 0-1
  impactLabel: string;
  description: string;
}

export interface WeatherImpactAnalysis {
  impactScore: number; // 0-100
  impactLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  summary: string;
  weatherFact: string;
  userImpact: string;
  suggestedAction: string;
  contributingFactors: ContributingFactor[];
  explanation: string;
}

export interface WhatIfScenario {
  departureLabel: string; // e.g. "Leave Now (6:00 PM)", "Leave at 7:00 PM", "Leave Tomorrow Morning"
  rainProbability: number;
  temperature: number;
  windSpeed: number;
  delayRisk: 'Low' | 'Moderate' | 'High';
  summary: string;
  actionRecommendation: string;
}

export interface RouteCheckpoint {
  id: string;
  name: string;
  distanceKm: number;
  eta: string;
  temperature: number;
  condition: string;
  conditionCode: string;
  rainProbability: number;
  windSpeed: number;
  hazardNote?: string;
  isHazardous: boolean;
}

export interface WeatherDNA {
  rainSensitivity: number;       // 1 - 5
  temperatureSensitivity: number;// 1 - 5
  aqiSensitivity: number;        // 1 - 5
  commuteFrequency: number;      // 1 - 5
  agricultureFocus: number;      // 1 - 5
  outdoorSports: number;         // 1 - 5
  learningPaused: boolean;
}

export interface HomepageExplanation {
  primaryReason: string;
  triggers: string[];
  timestamp: string;
}
