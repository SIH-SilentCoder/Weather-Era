import { WeatherData, PersonaType, WeatherImpactAnalysis, ContributingFactor, ActionChecklistItem } from '../types';

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
  let severityBadge = 'NORMAL';
  let actionChecklist: ActionChecklistItem[] = [];

  // Calculate rain contribution
  const rainWeight = persona === 'farmer' ? 0.35 : persona === 'commuter' ? 0.40 : persona === 'traveller' ? 0.35 : 0.25;
  const rainScore = Math.min(100, Math.round(weather.rainProbability * 1.05));
  factors.push({
    factor: 'Precipitation & Rain Risk',
    score: rainScore,
    weight: rainWeight,
    impactLabel: weather.rainProbability > 70 ? 'High Risk' : weather.rainProbability > 40 ? 'Moderate' : 'Low',
    description: `${weather.rainProbability}% probability • ${weather.rainfallMm} mm accumulation estimated`,
  });

  // Calculate wind contribution
  const windWeight = persona === 'fisherman' ? 0.45 : persona === 'outdoor' ? 0.30 : 0.20;
  const windScore = Math.min(100, Math.round((weather.windSpeed / 60) * 100));
  factors.push({
    factor: 'Wind Velocity & Convective Squall',
    score: windScore,
    weight: windWeight,
    impactLabel: weather.windSpeed > 35 ? 'Severe Squall' : weather.windSpeed > 22 ? 'Gusty' : 'Calm',
    description: `${weather.windSpeed} km/h from ${weather.windDirection} • sudden crosswind gusts`,
  });

  // Calculate visibility / road conditions
  const visWeight = persona === 'commuter' || persona === 'traveller' ? 0.25 : 0.15;
  const visScore = Math.max(0, Math.round((1 - weather.visibility / 10) * 100));
  factors.push({
    factor: 'Road Surface & Underpass Waterlogging',
    score: visScore,
    weight: visWeight,
    impactLabel: weather.visibility < 3 ? 'Submerged/Poor' : weather.visibility < 6 ? 'Reduced Speed' : 'Good',
    description: `${weather.visibility} km visual horizon • high hydroplaning and water accumulation risk`,
  });

  // Calculate Air Quality (AQI)
  const aqiWeight = persona === 'health' ? 0.40 : persona === 'student' ? 0.25 : 0.15;
  const aqiScore = Math.min(100, Math.round((weather.aqi / 300) * 100));
  factors.push({
    factor: 'Air Quality (AQI) Respiratory Load',
    score: aqiScore,
    weight: aqiWeight,
    impactLabel: weather.aqi > 200 ? 'Unhealthy' : weather.aqi > 100 ? 'Moderate' : 'Good',
    description: `AQI ${weather.aqi} (${weather.aqiCategory}) • elevated particulate suspension in damp air`,
  });

  // Weighted total score
  const totalWeighted = factors.reduce((acc, f) => acc + (f.score * f.weight), 0);
  const normalizedWeight = factors.reduce((acc, f) => acc + f.weight, 0);
  score = Math.min(100, Math.max(10, Math.round(totalWeighted / normalizedWeight)));

  let impactLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  if (score >= 75) {
    impactLevel = 'Severe';
    severityBadge = 'CRITICAL DISRUPTION RISK';
  } else if (score >= 55) {
    impactLevel = 'High';
    severityBadge = 'HIGH IMPACT RISK';
  } else if (score >= 35) {
    impactLevel = 'Moderate';
    severityBadge = 'MODERATE CAUTION';
  } else {
    severityBadge = 'LOW DISRUPTION';
  }

  // Persona-specific Weather -> Impact -> Action + Action Checklist
  switch (persona) {
    case 'farmer':
      weatherFact = `IMD Doppler ground observations confirm rain likelihood of ${weather.rainProbability}% with ${weather.rainfallMm} mm precipitation and ${weather.humidity}% relative humidity.`;
      if (weather.rainProbability > 65) {
        userImpact = 'Excessive soil moisture saturation in root zones; foliar pesticide & urea fertilizers will wash into runoff channels, leading to high chemical waste and nutrient leaching.';
        suggestedAction = 'Strictly suspend foliar spraying and nitrogen broadcasting for 48 hours; clear drainage furrows to protect standing crops.';
        summary = 'Critical moisture saturation alert for open agricultural fields.';
        actionChecklist = [
          { id: 'f-1', task: 'Halt all pesticide & chemical spray operations for 48 hours' },
          { id: 'f-2', task: 'Open secondary drainage trenches along low-lying furrows' },
          { id: 'f-3', task: 'Cover harvested grain stacks with waterproof silpaulin sheets' },
          { id: 'f-4', task: 'Check tensiometer soil water tension before next pump cycle' },
        ];
      } else {
        userImpact = 'Favorable soil and ambient moisture balance for field bed tilling and nursery preparation.';
        suggestedAction = 'Proceed with scheduled agronomic activities and standard drip/sprinkler cycles.';
        summary = 'Favorable weather for standard agricultural tasks.';
        actionChecklist = [
          { id: 'f-5', task: 'Verify irrigation canal water discharge schedule' },
          { id: 'f-6', task: 'Inspect crop canopy for pest incubation in warm humidity' },
        ];
      }
      break;

    case 'commuter':
      weatherFact = `Precipitation likelihood is ${weather.rainProbability}% with gusty squall winds of ${weather.windSpeed} km/h and reduced surface visibility of ${weather.visibility} km.`;
      if (weather.rainProbability > 60 || weather.windSpeed > 25) {
        userImpact = 'Evening transit velocities on arterial expressways expected to plummet by 35–45%; localized water pooling likely at low underpasses (e.g. Mahipalpur, Dhaula Kuan, South Extension).';
        suggestedAction = 'Depart 25–35 minutes earlier before 6:15 PM peak storm cells, or divert to elevated Metro lines; ensure vehicle wiper blades are operational.';
        summary = 'Severe commute delay risk: Convective downpours coinciding with rush hour.';
        actionChecklist = [
          { id: 'c-1', task: 'Leave before 6:15 PM or delay departure past 9:15 PM' },
          { id: 'c-2', task: 'Use elevated rapid metro corridor instead of surface arterial roads' },
          { id: 'c-3', task: 'Check live underpass waterlogging status on Route Weather screen' },
          { id: 'c-4', task: 'Keep raincoats, umbrellas, and waterproof phone pouches ready' },
        ];
      } else {
        userImpact = 'Clear asphalt surface conditions with steady corridor vehicle throughput.';
        suggestedAction = 'Standard departure timings recommended; maintain normal vehicle speeds.';
        summary = 'Commute corridors clear with steady transit speeds.';
        actionChecklist = [
          { id: 'c-5', task: 'Standard commute departure schedule' },
        ];
      }
      break;

    case 'traveller':
      weatherFact = `Destination transit sector experiencing ${weather.condition} (${weather.temperature}°C) with wind squalls of ${weather.windSpeed} km/h.`;
      if (weather.rainProbability > 60 || weather.windSpeed > 30) {
        userImpact = 'Intercity highway transit slowed by heavy tire spray; airport ground handling and runway turnarounds subject to 20–30 min convective weather delays.';
        suggestedAction = 'Check airline or railway live running status before departing your hotel; maintain extra 45-minute transit buffer.';
        summary = 'Intercity travel warning: Heavy road spray & airport flow control.';
        actionChecklist = [
          { id: 't-1', task: 'Verify flight/train delay status before checking out' },
          { id: 't-2', task: 'Maintain double following distance on wet expressways' },
          { id: 't-3', task: 'Switch vehicle headlamps to low-beam during heavy precipitation' },
          { id: 't-4', task: 'Pre-book sheltered airport drop-offs' },
        ];
      } else {
        userImpact = 'Stable highway corridors and on-time flight operations.';
        suggestedAction = 'Optimal travel conditions for road trips and scenic transit.';
        summary = 'Optimal intercity travel conditions.';
        actionChecklist = [
          { id: 't-5', task: 'Normal travel departure schedule' },
        ];
      }
      break;

    case 'student':
      weatherFact = `Temperature is ${weather.temperature}°C, rain risk is ${weather.rainProbability}%, and particulate AQI is ${weather.aqi}.`;
      if (weather.rainProbability > 65) {
        userImpact = 'Walking transit between academic blocks and outdoor campus labs exposed to intense convective downpours.';
        suggestedAction = 'Encase laptop and textbooks in water-resistant backpack covers; verify whether outdoor sports practicals are relocated indoors.';
        summary = 'Campus rain advisory: High risk of luggage & gadget water damage.';
        actionChecklist = [
          { id: 's-1', task: 'Put electronics/notebooks into waterproof inner plastic sleeve' },
          { id: 's-2', task: 'Check college notification board for indoor lecture shift' },
          { id: 's-3', task: 'Carry an umbrella and wear non-slip footwear' },
        ];
      } else {
        userImpact = 'Comfortable campus weather for library visits, lectures, and outdoor study sessions.';
        suggestedAction = 'Regular academic schedule recommended.';
        summary = 'Favorable conditions for college campus activities.';
        actionChecklist = [
          { id: 's-4', task: 'Standard academic day schedule' },
        ];
      }
      break;

    case 'outdoor':
      weatherFact = `UV Index is ${weather.uvIndex}, heat index feels like ${weather.feelsLike}°C, with squally winds of ${weather.windSpeed} km/h.`;
      if (weather.rainProbability > 60 || weather.windSpeed > 30) {
        userImpact = 'Wet running tracks cause slip injuries; sudden 35+ km/h crosswinds make outdoor road cycling dangerous.';
        suggestedAction = 'Shift workouts to indoor gyms or covered badminton/squash courts; avoid open ground exposure during convective cells.';
        summary = 'Athletic caution: Shift to indoor fitness alternatives.';
        actionChecklist = [
          { id: 'o-1', task: 'Move evening run to indoor treadmill or gym facility' },
          { id: 'o-2', task: 'Avoid cycling under large tree canopies during squalls' },
          { id: 'o-3', task: 'Hydrate adequately to counter high humidity sweating' },
        ];
      } else {
        userImpact = 'Comfortable outdoor athletic conditions.';
        suggestedAction = 'Optimal training window: Morning 06:00–08:30 AM or Evening after 17:30 PM.';
        summary = 'Favorable athletic window for outdoor sports.';
        actionChecklist = [
          { id: 'o-4', task: 'Maintain hydration balance during field drills' },
        ];
      }
      break;

    case 'health':
      weatherFact = `Air Quality Index is ${weather.aqi} (${weather.aqiCategory}) with high humidity of ${weather.humidity}% and ${weather.condition}.`;
      if (weather.aqi > 150 || weather.humidity > 80) {
        userImpact = 'Suspended PM2.5 particles trapped in high-humidity ambient air trigger bronchospasms, allergic rhinitis, and breathing fatigue.';
        suggestedAction = 'Wear certified N95 respirators outdoors; keep prescribed bronchodilator inhalers handy; run indoor HEPA filtration.';
        summary = 'Respiratory & particulate warning for sensitive individuals.';
        actionChecklist = [
          { id: 'h-1', task: 'Wear snug N95 particulate mask before stepping outdoors' },
          { id: 'h-2', task: 'Keep fast-acting inhaler / antihistamine medication accessible' },
          { id: 'h-3', task: 'Seal room windows facing high-traffic corridors' },
          { id: 'h-4', task: 'Avoid strenuous cardio exercises in humid outdoor air' },
        ];
      } else {
        userImpact = 'Ambient air quality within tolerable threshold.';
        suggestedAction = 'Normal precautions; moderate outdoor exposure safe for sensitive citizens.';
        summary = 'Air quality within acceptable baseline range.';
        actionChecklist = [
          { id: 'h-5', task: 'Standard health precautions' },
        ];
      }
      break;

    case 'fisherman':
      weatherFact = `Coastal wind velocity is ${weather.windSpeed} km/h with squalls; sea swell heights reaching 2.8–3.4 meters.`;
      if (weather.windSpeed > 35 || weather.rainProbability > 70) {
        userImpact = 'Severe turbulence, breaking wave chop, and dangerous rip currents offshore.';
        suggestedAction = 'Strictly obey IMD-INCOIS Marine Warning: Suspend all mechanized and motorized fishing boat operations in coastal & deep-sea zones.';
        summary = 'RED MARINE WARNING: Deep sea operations strictly prohibited.';
        actionChecklist = [
          { id: 'm-1', task: 'Anchor and lash all boats firmly to harbor moorings' },
          { id: 'm-2', task: 'Do NOT venture into sea beyond coastal breakwater' },
          { id: 'm-3', task: 'Keep VHF radio receiver tuned to emergency channel 16' },
        ];
      } else {
        userImpact = 'Moderate coastal sea state suitable for artisanal near-shore craft.';
        suggestedAction = 'Maintain standard VHF radio watch and observe harbor flag signals.';
        summary = 'Near-shore fishing conditions manageable with routine caution.';
        actionChecklist = [
          { id: 'm-4', task: 'Check harbor warning flags before cast-off' },
        ];
      }
      break;
  }

  const explanation = `Your impact score (${score}/100) is calculated by prioritizing ${persona.toUpperCase()} vulnerabilities: precipitation risk (${Math.round(rainWeight * 100)}%), wind stress (${Math.round(windWeight * 100)}%), visibility factors (${Math.round(visWeight * 100)}%), and environmental air factors (${Math.round(aqiWeight * 100)}%).`;

  return {
    impactScore: score,
    impactLevel,
    severityBadge,
    summary,
    weatherFact,
    userImpact,
    suggestedAction,
    actionChecklist,
    contributingFactors: factors,
    explanation,
  };
};
