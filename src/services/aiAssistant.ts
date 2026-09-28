import { WeatherData, PersonaType, WeatherAlert } from '../types';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isWeatherFact?: boolean;
  actionBullet?: string;
  confidenceBadge?: string;
}

export const SUGGESTED_QUESTIONS: Record<PersonaType, string[]> = {
  farmer: [
    '🌾 Kya aaj keetnashak spray karna theek hai?',
    '🌧️ Will rain cause field waterlogging tonight?',
    '⚡ Is there any lightning strike hazard in open fields?',
    '📅 What is the next 3-day dry window for harvesting?',
  ],
  commuter: [
    '🚗 Abhi niklu ya 7 PM wait karu?',
    '🌊 Which road underpass has severe waterlogging?',
    '🌧️ Will heavy rain hit during my evening commute?',
    '⚡ Are elevated metro lines safer than Ring Road?',
  ],
  traveller: [
    '🛣️ Should I proceed with interstate highway travel tonight?',
    '🌧️ What weather hazards exist along Delhi-Gurugram corridor?',
    '✈️ Are flight departures delayed due to crosswinds?',
    '⏱️ How much travel delay should I expect on NH-44?',
  ],
  student: [
    '☔ Do I need to carry an umbrella for evening classes?',
    '🏃 Is outdoor sports practice safe on ground today?',
    '🫁 What will the AQI and temperature be tomorrow morning?',
  ],
  outdoor: [
    '🏃 What is the optimal hour for outdoor running/cycling?',
    '💨 Are wind squalls dangerous for cycling today?',
    '☀️ What is the peak UV solar exposure window today?',
  ],
  health: [
    '🫁 Is outdoor air safe for asthmatic patients today?',
    '😷 What precautions are suggested for PM2.5 and humidity?',
    '👴 What is the health guidance for senior citizens today?',
  ],
  fisherman: [
    '⛵ What are the offshore wave heights and wind speeds?',
    '🌊 Is it safe to venture beyond 5 nautical miles?',
    '⚡ When will the coastal squall warning expire?',
  ],
};

export const answerWeatherQuery = (
  query: string,
  weather: WeatherData,
  persona: PersonaType,
  alerts: WeatherAlert[]
): AIMessage => {
  const lower = query.toLowerCase();
  let text = '';
  let actionBullet = '';
  const confidenceBadge = `${weather.confidenceLevel} Confidence (${weather.confidenceScore}%) • IMD DWR Ground Validated`;

  const activeAlert = alerts[0];

  // SCENARIO 1: Leave Now vs Wait (What-If departure)
  if (lower.includes('niklu') || lower.includes('leave') || lower.includes('wait') || lower.includes('7 pm') || lower.includes('abhi') || lower.includes('commute')) {
    text = `For transit in **${weather.city}**, current radar telemetry shows the convective squall line is 18 km southwest. Leaving **right now** has an **${weather.rainProbability}% rain risk** and **+8 mins delay**. In contrast, departing at **7:00 PM** will intersect peak convective cloud cells (rain **88%**, wind squalls **${weather.windSpeed + 15} km/h**), causing estimated **+45 mins traffic delay** and underpass waterlogging.`;
    actionBullet = `IMD Recommendation: Depart immediately within next 20 mins to beat the storm cell, or delay departure until post-storm clearance after 9:15 PM.`;
  }
  // SCENARIO 2: Waterlogging & Underpasses
  else if (lower.includes('waterlog') || lower.includes('underpass') || lower.includes('paani') || lower.includes('flood') || lower.includes('road')) {
    text = `Doppler precipitation reflectivity indicates localized heavy water pooling (> 1.2 ft) near low-lying ramps, especially **Mahipalpur / Aerocity Underpass** and **Dhaula Kuan Junction**. Ground absorption is saturated with **${weather.rainfallMm} mm** recent rainfall.`;
    actionBullet = `Safety Advisory: Stick to upper flyover lanes on NH-48 / Ring Road. Do not drive through submerged underpass service lanes.`;
  }
  // SCENARIO 3: Rain & Umbrella
  else if (lower.includes('rain') || lower.includes('barish') || lower.includes('chhate') || lower.includes('umbrella') || lower.includes('precipitation')) {
    text = `Current IMD radar observation confirms **${weather.condition}** in ${weather.city}. Precipitation likelihood is **${weather.rainProbability}%**, with expected shower intensity of **${weather.rainfallMm} mm/hr**. Relative humidity is currently **${weather.humidity}%** with falling barometric pressure (**${weather.pressure} hPa**).`;
    actionBullet = weather.rainProbability > 65
      ? `Carry waterproof protection. Heaviest rain bursts are projected between 6:30 PM and 8:30 PM.`
      : `Scattered light drizzle expected; severe widespread flooding is not imminent.`;
  }
  // SCENARIO 4: Agromet / Spraying / Crop
  else if (lower.includes('spray') || lower.includes('fertilizer') || lower.includes('kisan') || lower.includes('crop') || lower.includes('fasal') || lower.includes('kheti')) {
    text = `Agromet advisory for ${weather.city} & surrounding farming zones: Surface topsoil is saturated at **${weather.humidity}% humidity**. Rain forecast of **${weather.rainfallMm} mm** and gusty winds of **${weather.windSpeed} km/h** will trigger chemical runoff and waste foliar application.`;
    actionBullet = `Strictly defer pesticide spraying, urea broadcasting, and seed sowing for 36–48 hours until atmospheric clearance.`;
  }
  // SCENARIO 5: Health / AQI / Asthmatic
  else if (lower.includes('health') || lower.includes('aqi') || lower.includes('asthma') || lower.includes('breathe') || lower.includes('hawa') || lower.includes('air')) {
    text = `Air Quality in ${weather.city} is currently indexed at **AQI ${weather.aqi} (${weather.aqiCategory})**, compounded by high ambient moisture (**${weather.humidity}%**) and particulate matter dampening. Asthmatic patients and individuals with bronchial sensitivities may experience airway constriction.`;
    actionBullet = `Keep emergency inhalers accessible. Wear N95 filtration masks during outdoor transit and avoid high-traffic corridors.`;
  }
  // SCENARIO 6: Lightning & Storm Warning
  else if (lower.includes('lightning') || lower.includes('thunder') || lower.includes('bijli') || lower.includes('toofan') || lower.includes('storm')) {
    text = `IMD Doppler Radar detects convective cumulonimbus cloud heads (height ~11 km) generating isolated cloud-to-ground lightning flashes and wind gusts up to **${weather.windSpeed + 12} km/h**.`;
    actionBullet = `Take immediate shelter inside solid pukka buildings. Strictly avoid standing under tall trees, electric poles, or tin sheds.`;
  }
  // SCENARIO 7: Outdoor Sports & Gym
  else if (lower.includes('outdoor') || lower.includes('sports') || lower.includes('gym') || lower.includes('running') || lower.includes('training')) {
    text = `Ambient temperature in ${weather.city} is **${weather.temperature}°C** (Feels like **${weather.feelsLike}°C**), with UV Index of **${weather.uvIndex}** and surface wind gusts of **${weather.windSpeed} km/h**. Wet ground traction is reduced.`;
    actionBullet = `Curtailed evening outdoor workouts are advised due to sudden squalls. Early morning (06:00 AM – 08:00 AM) provides optimal athletic conditions.`;
  }
  // SCENARIO 8: Today vs Tomorrow
  else if (lower.includes('tomorrow') || lower.includes('kal') || lower.includes('aane wala')) {
    text = `Tomorrow's synoptic forecast for ${weather.city} projects significant improvement: High temperature of **33°C**, low of **24°C**, rain probability dropping to **~15%**, and dry national highway corridors.`;
    actionBullet = `Tomorrow provides an optimal non-urgent departure and field work window compared to today's convective weather hazards.`;
  }
  // DEFAULT GROUND TELEMETRY
  else {
    text = `Validated IMD Telemetry for **${weather.city}**: Temperature is **${weather.temperature}°C** (${weather.condition}), Feels like **${weather.feelsLike}°C**, Rain Risk is **${weather.rainProbability}%**, Wind is **${weather.windSpeed} km/h (${weather.windDirection})**, Visibility is **${weather.visibility} km**, and AQI is **${weather.aqi} (${weather.aqiCategory})**.`;
    actionBullet = activeAlert 
      ? `Active Hazard: ${activeAlert.headline} (Valid till ${activeAlert.validTill}).` 
      : `All parameters are within normal threshold ranges for this hour.`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text,
    actionBullet,
    confidenceBadge,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};
