import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  PersonaType, 
  LocationItem, 
  WeatherData, 
  WeatherAlert, 
  WeatherDNA, 
  HomepageExplanation,
  TimeOfDay,
  UserInterest
} from '../types';
import { 
  DEFAULT_SAVED_LOCATIONS, 
  MOCK_WEATHER_DATABASE, 
  MOCK_ACTIVE_ALERTS, 
  fetchWeatherForLocation 
} from '../services/weatherService';
import { getHomepageChangeExplanation } from '../services/personalizationEngine';
import { lightPalette, darkPalette, ThemePalette } from '../theme';
import { Language, translations } from '../i18n';

export const INITIAL_WEATHER_DNA: WeatherDNA = {
  rainSensitivity: 4,
  temperatureSensitivity: 3,
  aqiSensitivity: 4,
  commuteFrequency: 5,
  agricultureFocus: 2,
  outdoorSports: 3,
  lightningStormSensitivity: 4,
  windSquallSensitivity: 3,
  learningPaused: false,
};

const getCalculatedTimeOfDay = (): TimeOfDay => {
  const hr = new Date().getHours();
  if (hr >= 5 && hr < 12) return 'morning';
  if (hr >= 12 && hr < 17) return 'afternoon';
  if (hr >= 17 && hr < 22) return 'evening';
  return 'night';
};

interface AppContextType {
  persona: PersonaType;
  setPersona: (p: PersonaType) => void;
  selectedInterests: UserInterest[];
  toggleInterest: (interest: UserInterest) => void;
  timeOfDay: TimeOfDay;
  timeOfDayOverride: TimeOfDay | null;
  setTimeOfDayOverride: (tod: TimeOfDay | null) => void;
  selectedLocation: LocationItem;
  setSelectedLocation: (l: LocationItem) => void;
  savedLocations: LocationItem[];
  addSavedLocation: (l: LocationItem) => void;
  weatherData: WeatherData;
  alerts: WeatherAlert[];
  dismissAlert: (id: string) => void;
  themeMode: 'light' | 'dark';
  theme: ThemePalette;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  weatherDNA: WeatherDNA;
  updateDNA: (key: keyof WeatherDNA, val: any) => void;
  resetDNA: () => void;
  currentTab: 'home' | 'forecast' | 'map' | 'alerts' | 'ai' | 'profile';
  setCurrentTab: (tab: 'home' | 'forecast' | 'map' | 'alerts' | 'ai' | 'profile') => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  isRefreshing: boolean;
  refreshWeather: () => Promise<void>;
  explanation: HomepageExplanation;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [persona, setPersona] = useState<PersonaType>('commuter');
  const [selectedInterests, setSelectedInterests] = useState<UserInterest[]>(['waterlogging', 'transit_delays']);
  const [timeOfDayOverride, setTimeOfDayOverride] = useState<TimeOfDay | null>(null);
  const [savedLocations, setSavedLocations] = useState<LocationItem[]>(DEFAULT_SAVED_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(DEFAULT_SAVED_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData>(MOCK_WEATHER_DATABASE['delhi']);
  const [alerts, setAlerts] = useState<WeatherAlert[]>(MOCK_ACTIVE_ALERTS);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [weatherDNA, setWeatherDNA] = useState<WeatherDNA>(INITIAL_WEATHER_DNA);
  const [currentTab, setCurrentTab] = useState<'home' | 'forecast' | 'map' | 'alerts' | 'ai' | 'profile'>('home');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const timeOfDay = useMemo(() => {
    return timeOfDayOverride || getCalculatedTimeOfDay();
  }, [timeOfDayOverride]);

  // Sync weather data when selectedLocation changes
  useEffect(() => {
    let isMounted = true;
    fetchWeatherForLocation(selectedLocation).then((data) => {
      if (isMounted) setWeatherData(data);
    });
    return () => { isMounted = false; };
  }, [selectedLocation]);

  // Adjust default interests when persona changes
  useEffect(() => {
    if (persona === 'farmer') {
      setSelectedInterests(['spraying', 'lightning']);
      if (!weatherDNA.learningPaused) {
        setWeatherDNA(prev => ({ ...prev, agricultureFocus: 5, rainSensitivity: 5, commuteFrequency: 1 }));
      }
    } else if (persona === 'commuter') {
      setSelectedInterests(['waterlogging', 'transit_delays']);
      if (!weatherDNA.learningPaused) {
        setWeatherDNA(prev => ({ ...prev, commuteFrequency: 5, rainSensitivity: 4, agricultureFocus: 1 }));
      }
    } else if (persona === 'health') {
      setSelectedInterests(['aqi_bronchial']);
      if (!weatherDNA.learningPaused) {
        setWeatherDNA(prev => ({ ...prev, aqiSensitivity: 5, temperatureSensitivity: 4 }));
      }
    } else if (persona === 'outdoor') {
      setSelectedInterests(['workout', 'lightning']);
      if (!weatherDNA.learningPaused) {
        setWeatherDNA(prev => ({ ...prev, outdoorSports: 5, temperatureSensitivity: 4 }));
      }
    } else if (persona === 'fisherman') {
      setSelectedInterests(['marine_swell']);
    } else if (persona === 'traveller') {
      setSelectedInterests(['transit_delays', 'waterlogging']);
    }
  }, [persona]);

  const toggleInterest = (interest: UserInterest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const theme = useMemo(() => (themeMode === 'light' ? lightPalette : darkPalette), [themeMode]);
  const t = useMemo(() => translations[language], [language]);

  const toggleTheme = () => setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));

  const updateDNA = (key: keyof WeatherDNA, val: any) => {
    setWeatherDNA(prev => ({ ...prev, [key]: val }));
  };

  const resetDNA = () => {
    setWeatherDNA(INITIAL_WEATHER_DNA);
  };

  const addSavedLocation = (loc: LocationItem) => {
    setSavedLocations(prev => [...prev, loc]);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const refreshWeather = async () => {
    setIsRefreshing(true);
    try {
      const updated = await fetchWeatherForLocation(selectedLocation);
      setWeatherData(updated);
    } finally {
      setIsRefreshing(false);
    }
  };

  const explanation = useMemo(() => {
    return getHomepageChangeExplanation(
      persona, 
      weatherData, 
      alerts, 
      weatherDNA, 
      timeOfDay, 
      selectedInterests
    );
  }, [persona, weatherData, alerts, weatherDNA, timeOfDay, selectedInterests]);

  return (
    <AppContext.Provider
      value={{
        persona,
        setPersona,
        selectedInterests,
        toggleInterest,
        timeOfDay,
        timeOfDayOverride,
        setTimeOfDayOverride,
        selectedLocation,
        setSelectedLocation,
        savedLocations,
        addSavedLocation,
        weatherData,
        alerts,
        dismissAlert,
        themeMode,
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        weatherDNA,
        updateDNA,
        resetDNA,
        currentTab,
        setCurrentTab,
        isOffline,
        setIsOffline,
        isRefreshing,
        refreshWeather,
        explanation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
