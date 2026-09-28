export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    forecast: 'Forecast',
    map: 'Weather Map',
    ai: 'Mausam AI',
    profile: 'Profile',
    alerts: 'Alerts',
    
    // Header & Meta
    imdBrand: 'INDIA METEOROLOGICAL DEPARTMENT',
    moesBrand: 'Ministry of Earth Sciences, Govt. of India',
    liveRadar: 'Live Radar Active',
    updatedAgo: 'Updated',
    minsAgo: 'mins ago',
    confidence: 'Forecast Confidence',
    
    // Personas
    persona: 'Active Persona',
    farmer: 'Farmer (किसान)',
    commuter: 'Commuter (दैनिक यात्री)',
    traveller: 'Traveller (यात्री)',
    student: 'Student (विद्यार्थी)',
    outdoor: 'Outdoor / Sports',
    health: 'Health Sensitive',
    fisherman: 'Fisherman (मछुआरा)',
    
    // Signature 1: Weather -> Impact -> Action
    signatureTitle: 'Weather Intelligence Engine',
    weatherFactTitle: 'WEATHER OBSERVATION',
    impactTitle: 'PERSONAL IMPACT',
    actionTitle: 'RECOMMENDED ACTION',
    systemGeneratedTag: 'Contextual AI Advisory • IMD Validated',
    
    // Signature 2: Weather Impact Score
    impactScoreTitle: 'Contextual Weather Impact',
    whyScoreHigh: 'Why is my score high?',
    contributingFactors: 'Contributing Risk Factors',
    close: 'Close',
    
    // Signature 3: What If Simulator
    whatIfTitle: '“What If?” Departure Simulator',
    whatIfSubtitle: 'Compare weather & travel impact across departure windows',
    leaveNow: 'Leave Now',
    leaveIn1Hour: 'Leave in 1 Hr',
    leaveIn2Hours: 'Leave in 2 Hrs',
    leaveTomorrow: 'Tomorrow Morning',
    delayRisk: 'Delay Risk',
    
    // Signature 4: Route Weather
    routeTitle: 'Weather Along My Route',
    routeSubtitle: 'Real-time micro-climate checkpoints between travel nodes',
    fromLocation: 'Origin',
    toLocation: 'Destination',
    checkRoute: 'Analyze Route',
    
    // Signature 5: Weather DNA
    weatherDnaTitle: 'Personal Weather DNA',
    weatherDnaDesc: 'Transparent priority weights that shape your feed',
    rainSensitivity: 'Rain & Storm Sensitivity',
    tempSensitivity: 'Extreme Heat/Cold Alert',
    aqiSensitivity: 'Air Quality (AQI) Caution',
    commuteFactor: 'Commute & Traffic Sensitivity',
    agriFocus: 'Agricultural / Crop Health',
    pauseLearning: 'Pause Personalization Learning',
    resetDna: 'Reset Personal Preferences',
    
    // Signature 6: Why Homepage Changed
    whyHomepageChanged: 'Why did my homepage adapt?',
    
    // Hourly & Daily
    hourlyForecast: '24-Hour Timeline',
    sevenDayForecast: '7-Day Extended Forecast',
    airQuality: 'Air Quality Index',
    uvIndex: 'UV Index',
    humidity: 'Humidity',
    wind: 'Wind',
    pressure: 'Pressure',
    visibility: 'Visibility',
    
    // AI Assistant
    aiAssistantTitle: 'Mausam Conversational AI',
    aiPlaceholder: 'Ask about rain, commute, agricultural advisory...',
    askAi: 'Ask',
    suggestedQuestions: 'Frequently Asked Scenarios',
    
    // Saved Locations
    savedLocations: 'Saved Locations & Family',
    addLocation: 'Add Location',
  },
  hi: {
    // Navigation
    home: 'होम',
    forecast: 'पूर्वानुमान',
    map: 'मौसम मानचित्र',
    ai: 'मौसम AI',
    profile: 'प्रोफाइल',
    alerts: 'चेतावनी',
    
    // Header & Meta
    imdBrand: 'भारत मौसम विज्ञान विभाग',
    moesBrand: 'पृथ्वी विज्ञान मंत्रालय, भारत सरकार',
    liveRadar: 'लाइव रडार सक्रिय',
    updatedAgo: 'अपडेट किया गया',
    minsAgo: 'मिनट पहले',
    confidence: 'पूर्वानुमान सटीकता',
    
    // Personas
    persona: 'सक्रिय व्यक्तित्व',
    farmer: 'किसान (Farmer)',
    commuter: 'दैनिक यात्री (Commuter)',
    traveller: 'यात्री (Traveller)',
    student: 'विद्यार्थी (Student)',
    outdoor: 'खेल व आउटडोर',
    health: 'स्वास्थ्य संवेदनशील',
    fisherman: 'मछुआरा (Fisherman)',
    
    // Signature 1: Weather -> Impact -> Action
    signatureTitle: 'मौसम इंटेलिजेंस इंजन',
    weatherFactTitle: 'मौसम की वास्तविक स्थिति',
    impactTitle: 'व्यक्तिगत प्रभाव',
    actionTitle: 'सुझाया गया कदम',
    systemGeneratedTag: 'संदर्भित AI परामर्श • IMD सत्यापित',
    
    // Signature 2: Weather Impact Score
    impactScoreTitle: 'मौसम प्रभाव स्कोर',
    whyScoreHigh: 'मेरा स्कोर क्यों अधिक है?',
    contributingFactors: 'जोखिम कारक विश्लेषण',
    close: 'बंद करें',
    
    // Signature 3: What If Simulator
    whatIfTitle: '“क्या अगर?” प्रस्थान सिम्युलेटर',
    whatIfSubtitle: 'विभिन्न समय पर निकलने से मौसम और यात्रा पर असर की तुलना करें',
    leaveNow: 'अभी निकलें',
    leaveIn1Hour: '1 घंटे बाद निकलें',
    leaveIn2Hours: '2 घंटे बाद निकलें',
    leaveTomorrow: 'कल सुबह',
    delayRisk: 'देरी का जोखिम',
    
    // Signature 4: Route Weather
    routeTitle: 'मेरे मार्ग पर मौसम स्थिति',
    routeSubtitle: 'मार्ग के विभिन्न बिंदुओं पर वास्तविक सूक्ष्म-मौसम जांच',
    fromLocation: 'प्रस्थान स्थल',
    toLocation: 'गंतव्य स्थल',
    checkRoute: 'मार्ग जांचें',
    
    // Signature 5: Weather DNA
    weatherDnaTitle: 'व्यक्तिगत मौसम डीएनए (DNA)',
    weatherDnaDesc: 'पारदर्शी प्राथमिकताएं जो आपके होमपेज को अनुकूलित करती हैं',
    rainSensitivity: 'वर्षा व आंधी संवेदनशीलता',
    tempSensitivity: 'गर्मी व ठंड अलर्ट',
    aqiSensitivity: 'वायु गुणवत्ता (AQI) संवेदनशीलता',
    commuteFactor: 'सफर व ट्रैफिक प्राथमिकता',
    agriFocus: 'कृषि व फसल स्वास्थ्य',
    pauseLearning: 'सीखना रोकें (Pause)',
    resetDna: 'प्राथमिकताएं रीसेट करें',
    
    // Signature 6: Why Homepage Changed
    whyHomepageChanged: 'मेरा होमपेज क्यों बदला?',
    
    // Hourly & Daily
    hourlyForecast: '24-घंटे का रुझान',
    sevenDayForecast: '7-दिवसीय विस्तृत पूर्वानुमान',
    airQuality: 'वायु गुणवत्ता सूचकांक (AQI)',
    uvIndex: 'पराबैंगनी (UV) सूचकांक',
    humidity: 'आर्द्रता (Humidity)',
    wind: 'हवा की गति',
    pressure: 'वायुमंडलीय दबाव',
    visibility: 'दृश्यता',
    
    // AI Assistant
    aiAssistantTitle: 'मौसम संवादात्मक AI',
    aiPlaceholder: 'बारिश, यात्रा, कृषि सलाह के बारे में पूछें...',
    askAi: 'पूछें',
    suggestedQuestions: 'महत्वपूर्ण प्रश्न',
    
    // Saved Locations
    savedLocations: 'सहेजे गए स्थान व परिवार',
    addLocation: 'नया स्थान जोड़ें',
  }
};
