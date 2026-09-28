import { WeatherData, PersonaType, WeatherImpactAnalysis, ContributingFactor } from '../types';

export const calculateWeatherImpact = (
  weather: WeatherData,
  persona: PersonaType
): WeatherImpactAnalysis => {
  let score = 20;
  const factors: ContributingFactor[] = [];
  let weatherFact = '';
  let userImpact = '';
  let suggestedAction = '';
  let summary = '';

  // Calculate rain contribution
  const rainWeight = persona === 'farmer' ? 0.35 : persona === 'commuter' ? 0.40 : persona === 'traveller' ? 0.35 : 0.25;
  const rainScore = Math.min(100, Math.round(weather.rainProbability * 1.05));
  factors.push({
    factor: 'Precipitation & Rain Risk',
    score: rainScore,
    weight: rainWeight,
    impactLabel: weather.rainProbability > 70 ? 'High Risk' : weather.rainProbability > 40 ? 'Moderate' : 'Low',
    description: `${weather.rainProbability}% probability with ${weather.rainfallMm} mm accumulation`,
  });

  // Calculate wind contribution
  const windWeight = persona === 'fisherman' ? 0.45 : persona === 'outdoor' ? 0.30 : 0.20;
  const windScore = Math.min(100, Math.round((weather.windSpeed / 60) * 100));
  factors.push({
    factor: 'Wind Velocity & Gusts',
    score: windScore,
    weight: windWeight,
    impactLabel: weather.windSpeed > 35 ? 'Severe Squall' : weather.windSpeed > 22 ? 'Breezy/Gusty' : 'Calm',
    description: `${weather.windSpeed} km/h from ${weather.windDirection}`,
  });

  // Calculate visibility / road conditions
  const visWeight = persona === 'commuter' || persona === 'traveller' ? 0.25 : 0.15;
  const visScore = Math.max(0, Math.round((1 - weather.visibility / 10) * 100));
  factors.push({
    factor: 'Road Visibility & Waterlogging',
    score: visScore,
    weight: visWeight,
    impactLabel: weather.visibility < 3 ? 'Poor Visibility' : weather.visibility < 6 ? 'Reduced' : 'Good',
    description: `${weather.visibility} km visual horizon with wet asphalt risks`,
  });

  // Calculate Air Quality (AQI)
  const aqiWeight = persona === 'health' ? 0.40 : persona === 'student' ? 0.25 : 0.15;
  const aqiScore = Math.min(100, Math.round((weather.aqi / 300) * 100));
  factors.push({
    factor: 'Air Quality (AQI) Stress',
    score: aqiScore,
    weight: aqiWeight,
    impactLabel: weather.aqi > 200 ? 'Unhealthy' : weather.aqi > 100 ? 'Moderate' : 'Good',
    description: `AQI index ${weather.aqi} (${weather.aqiCategory})`,
  });

  // Weighted total score
  const totalWeighted = factors.reduce((acc, f) => acc + (f.score * f.weight), 0);
  const normalizedWeight = factors.reduce((acc, f) => acc + f.weight, 0);
  score = Math.min(100, Math.max(10, Math.round(totalWeighted / normalizedWeight)));

  let impactLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  if (score >= 75) impactLevel = 'Severe';
  else if (score >= 55) impactLevel = 'High';
  else if (score >= 35) impactLevel = 'Moderate';

  // Persona-specific Weather -> Impact -> Action
  switch (persona) {
    case 'farmer':
      weatherFact = `Current rain probability is ${weather.rainProbability}% with ${weather.rainfallMm} mm rainfall and ${weather.humidity}% humidity.`;
      if (weather.rainProbability > 65) {
        userImpact = 'Heavy topsoil moisture saturation likely; pesticide and fertilizer spraying will wash off, leading to chemical waste.';
        suggestedAction = 'Postpone chemical spraying and nitrogen application for 48 hours; clear drainage channels to avoid root waterlogging.';
        summary = 'High moisture saturation alert for open fields.';
      } else {
        userImpact = 'Favorable soil conditions for field preparation and crop growth.';
        suggestedAction = 'Proceed with planned irrigation cycles according to soil tensiometer readings.';
        summary = 'Favorable weather for standard agricultural tasks.';
      }
      break;

    case 'commuter':
      weatherFact = `Rain probability is ${weather.rainProbability}% with gusty winds of ${weather.windSpeed} km/h and ${weather.visibility} km visibility.`;
      if (weather.rainProbability > 60 || weather.windSpeed > 25) {
        userImpact = 'Peak hour commute speeds expected to decrease by 30–45%; high risk of localized waterlogging on arterial underpasses.';
        suggestedAction = 'Leave 25–35 minutes earlier than usual or utilize elevated metro routes; carry rain-proof gear.';
        summary = 'Commute disruption probable due to convective downpours.';
      } else {
        userImpact = 'Normal traffic transit speeds with dry road corridors.';
        suggestedAction = 'Standard departure schedule recommended.';
        summary = 'Commute corridors clear.';
      }
      break;

    case 'traveller':
      weatherFact = `Destination experiencing ${weather.condition} (${weather.temperature}°C) with wind gusts of ${weather.windSpeed} km/h.`;
      if (weather.rainProbability > 60 || weather.windSpeed > 30) {
        userImpact = 'Highway transit speeds reduced; airport ground movement and departure queues experiencing minor weather hold-ups.';
        suggestedAction = 'Check live flight/train operational status before departing hotel; maintain extra buffer time for road legs.';
        summary = 'Travel advisory: Allow extra transit buffer.';
      } else {
        userImpact = 'Mild travel weather suitable for scenic routes and sightseeing.';
        suggestedAction = 'Ideal window for intercity travel and outdoor tours.';
        summary = 'Optimal travel conditions.';
      }
      break;

    case 'student':
      weatherFact = `Current temperature is ${weather.temperature}°C, rain risk is ${weather.rainProbability}%, and AQI is ${weather.aqi}.`;
      if (weather.rainProbability > 65) {
        userImpact = 'Campus transit between blocks and sports grounds will be affected by sudden rain spells.';
        suggestedAction = 'Carry waterproof bag cover and umbrella; verify whether outdoor practicals or sports sessions are shifted indoors.';
        summary = 'Campus rain alert: Pack waterproof backpack cover.';
      } else {
        userImpact = 'Comfortable weather for transit to library, classes, and campus grounds.';
        suggestedAction = 'Normal schedule for academic activities and campus commutes.';
        summary = 'Good conditions for college campus activities.';
      }
      break;

    case 'outdoor':
      weatherFact = `UV Index is ${weather.uvIndex}, temperature is ${weather.temperature}°C (feels like ${weather.feelsLike}°C) with ${weather.windSpeed} km/h wind.`;
      if (weather.rainProbability > 60 || weather.windSpeed > 30) {
        userImpact = 'Ground slickness, gusty headwinds, and sudden downpours pose injury and equipment risks.';
        suggestedAction = 'Reschedule outdoor workout or turf sports to morning indoor courts; avoid open ground exposure during squalls.';
        summary = 'Outdoor sports advisory: Indoor alternatives recommended.';
      } else {
        userImpact = 'Acceptable running and field sports conditions.';
        suggestedAction = 'Optimal training hours: Before 10:30 AM or after 5:15 PM.';
        summary = 'Favorable window for outdoor exercise.';
      }
      break;

    case 'health':
      weatherFact = `Air Quality Index is ${weather.aqi} (${weather.aqiCategory}), humidity is ${weather.humidity}%, with ${weather.condition}.`;
      if (weather.aqi > 150 || weather.humidity > 80) {
        userImpact = 'Elevated particulate load (PM2.5) combined with high moisture may trigger bronchial sensitivity or respiratory fatigue.';
        suggestedAction = 'Wear N95 protective mask if outdoors; keep rescue inhalers accessible; utilize indoor HEPA filtration where available.';
        summary = 'Respiratory & humidity caution for sensitive individuals.';
      } else {
        userImpact = 'Air quality within acceptable baseline range.';
        suggestedAction = 'Standard precautions; moderate outdoor exposure is safe.';
        summary = 'Air quality within comfortable limits.';
      }
      break;

    case 'fisherman':
      weatherFact = `Coastal wind speed is ${weather.windSpeed} km/h with squally gusts; wave heights and swell elevated.`;
      if (weather.windSpeed > 35 || weather.rainProbability > 70) {
        userImpact = 'Rough sea conditions with offshore chop and high squall risk beyond 5 nautical miles.';
        suggestedAction = 'Adhere strictly to IMD-INCOIS marine advisory: Suspend mechanized boat operations in offshore zones.';
        summary = 'Marine advisory: Deep sea operations suspended.';
      } else {
        userImpact = 'Moderate sea state suitable for artisanal and near-shore fishing craft.';
        suggestedAction = 'Maintain standard VHF radio watch and observe coastal flag warnings.';
        summary = 'Near-shore fishing conditions manageable.';
      }
      break;
  }

  const explanation = `Your impact score (${score}/100) is calculated by prioritizing ${persona.toUpperCase()} vulnerabilities: precipitation risk (${Math.round(rainWeight * 100)}%), wind stress (${Math.round(windWeight * 100)}%), visibility factors (${Math.round(visWeight * 100)}%), and environmental air factors (${Math.round(aqiWeight * 100)}%).`;

  return {
    impactScore: score,
    impactLevel,
    summary,
    weatherFact,
    userImpact,
    suggestedAction,
    contributingFactors: factors,
    explanation,
  };
};
