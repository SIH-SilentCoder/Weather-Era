import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  PersonaType, 
  LocationItem, 
  WeatherData, 
  WeatherAlert, 
  WeatherDNA, 
  HomepageExplanation 
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
  learningPaused: false,
};

interface AppContextType {
  persona: PersonaType;
  setPersona: (p: PersonaType) => void;
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
  currentTab: 'home' | 'forecast' | 'map' | 'ai' | 'profile';
  setCurrentTab: (tab: 'home' | 'forecast' | 'map' | 'ai' | 'profile') => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  isRefreshing: boolean;
  refreshWeather: () => Promise<void>;
  explanation: HomepageExplanation;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [persona, setPersona] = useState<PersonaType>('commuter');
  const [savedLocations, setSavedLocations] = useState<LocationItem[]>(DEFAULT_SAVED_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(DEFAULT_SAVED_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData>(MOCK_WEATHER_DATABASE['delhi']);
  const [alerts, setAlerts] = useState<WeatherAlert[]>(MOCK_ACTIVE_ALERTS);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark'); // Default to sleek modern dark mode
  const [language, setLanguage] = useState<Language>('en');
  const [weatherDNA, setWeatherDNA] = useState<WeatherDNA>(INITIAL_WEATHER_DNA);
  const [currentTab, setCurrentTab] = useState<'home' | 'forecast' | 'map' | 'ai' | 'profile'>('home');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sync weather data when selectedLocation changes
  useEffect(() => {
    let isMounted = true;
    fetchWeatherForLocation(selectedLocation).then((data) => {
      if (isMounted) setWeatherData(data);
    });
    return () => { isMounted = false; };
  }, [selectedLocation]);

  // Adjust DNA when persona changes to align transparent defaults
  useEffect(() => {
    if (weatherDNA.learningPaused) return;

    if (persona === 'farmer') {
      setWeatherDNA(prev => ({ ...prev, agricultureFocus: 5, rainSensitivity: 5, commuteFrequency: 1 }));
    } else if (persona === 'commuter') {
      setWeatherDNA(prev => ({ ...prev, commuteFrequency: 5, rainSensitivity: 4, agricultureFocus: 1 }));
    } else if (persona === 'health') {
      setWeatherDNA(prev => ({ ...prev, aqiSensitivity: 5, temperatureSensitivity: 4 }));
    } else if (persona === 'outdoor') {
      setWeatherDNA(prev => ({ ...prev, outdoorSports: 5, temperatureSensitivity: 4 }));
    }
  }, [persona]);

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
    return getHomepageChangeExplanation(persona, weatherData, alerts, weatherDNA);
  }, [persona, weatherData, alerts, weatherDNA]);

  return (
    <AppContext.Provider
      value={{
        persona,
        setPersona,
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
