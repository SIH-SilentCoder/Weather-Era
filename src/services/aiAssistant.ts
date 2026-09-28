import { WeatherData, PersonaType, WeatherAlert } from '../types';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isWeatherFact?: boolean;
  actionBullet?: string;
}

export const SUGGESTED_QUESTIONS: Record<PersonaType, string[]> = {
  farmer: [
    'Is it safe to spray pesticides or fertilizers today?',
    'Will rain cause field waterlogging tonight?',
    'What is the best 3-day window for harvesting?',
  ],
  commuter: [
    'Will it rain during my evening commute?',
    'Should I leave for office now or wait an hour?',
    'Which route has less waterlogging risk?',
  ],
  traveller: [
    'Should I proceed with highway travel tonight?',
    'What weather changes are expected along my route?',
    'Is there any flight or rail delay warning?',
  ],
  student: [
    'Do I need an umbrella for evening classes?',
    'Is campus outdoor sports scheduled safely today?',
    'What will the AQI and temperature be tomorrow morning?',
  ],
  outdoor: [
    'What is the optimal hour for outdoor training?',
    'Are wind squalls dangerous for cycling today?',
    'What is the peak UV exposure window?',
  ],
  health: [
    'Is outdoor air safe for asthmatic patients today?',
    'Will high humidity worsen respiratory allergies?',
    'What precautions are suggested for children and elders?',
  ],
  fisherman: [
    'What are the offshore wave heights and wind speeds?',
    'Is it safe to venture beyond 5 nautical miles?',
    'When will the coastal squall warning expire?',
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

  const activeAlert = alerts[0];

  if (lower.includes('rain') || lower.includes('barish') || lower.includes('chhate') || lower.includes('umbrella')) {
    text = `Current radar scans indicate an **${weather.rainProbability}% probability of rain** in ${weather.city}, with an estimated accumulation of **${weather.rainfallMm} mm** over the next 3–4 hours. Convective cloud buildup is concentrated in eastern quadrants.`;
    actionBullet = weather.rainProbability > 60 
      ? `Carrying waterproof gear is strongly advised. Peak intensity is expected between 6:30 PM and 8:30 PM.` 
      : `Isolated drizzle is possible, but severe downpours are not imminent.`;
  } else if (lower.includes('travel') || lower.includes('commute') || lower.includes('leave') || lower.includes('niklu') || lower.includes('safar')) {
    text = `For travel in ${weather.city}, the primary bottleneck is **gusty wind (${weather.windSpeed} km/h)** and reduced road visibility (**${weather.visibility} km**). Arterial underpasses on NH-48 / Ring Road are prone to traffic slow-downs.`;
    actionBullet = `Optimal window: Leaving before 6:15 PM saves an estimated 25–35 minutes compared to peak storm arrival at 7:30 PM.`;
  } else if (lower.includes('spray') || lower.includes('fertilizer') || lower.includes('kisan') || lower.includes('crop') || lower.includes('fasal')) {
    text = `Agromet advisory for ${weather.city}: Soil moisture is currently saturated with high relative humidity (${weather.humidity}%). Incoming rain of ~${weather.rainfallMm} mm will wash off foliar treatments.`;
    actionBullet = `Strictly postpone pesticide and urea broadcast for at least 36–48 hours until field drainage stabilizes.`;
  } else if (lower.includes('impact') || lower.includes('score') || lower.includes('high') || lower.includes('kyu')) {
    text = `Your Weather Impact Score is elevated primarily due to the interplay of **${weather.rainProbability}% rain risk** and **${weather.windSpeed} km/h wind squalls**, prioritized for your **${persona.toUpperCase()}** profile.`;
    actionBullet = `Review the "What-If" simulator on the homepage to explore alternative departure windows with lower risk scores.`;
  } else if (lower.includes('outdoor') || lower.includes('sports') || lower.includes('gym') || lower.includes('running') || lower.includes('training')) {
    text = `Ambient temperature is ${weather.temperature}°C with a heat index ("feels like") of ${weather.feelsLike}°C and UV Index of ${weather.uvIndex}. Sudden wind gusts pose safety risks on open grounds.`;
    actionBullet = `Outdoor training should be curtailed during evening squalls. Morning hours (06:00 AM – 08:30 AM) offer the safest athletic window.`;
  } else if (lower.includes('tomorrow') || lower.includes('kal') || lower.includes('forecast')) {
    text = `Tomorrow's forecast for ${weather.city} projects a high of 33°C and low of 26°C, with a lower rain probability of ~40% (scattered passing showers) and satisfactory air quality.`;
    actionBullet = `Weather conditions are expected to improve notably compared to today's active storm cells.`;
  } else {
    text = `Based on validated IMD Doppler data for ${weather.city}: Current temperature is **${weather.temperature}°C** (${weather.condition}), humidity is **${weather.humidity}%**, wind is blowing at **${weather.windSpeed} km/h**, and AQI is **${weather.aqi} (${weather.aqiCategory})**.`;
    actionBullet = activeAlert ? `Note: ${activeAlert.headline} remains active till ${activeAlert.validTill}.` : `No critical warnings active for your coordinates.`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text,
    actionBullet,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};
