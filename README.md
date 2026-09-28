# MAUSAM IQ — Personalized Weather Intelligence Platform
### Ministry of Earth Sciences / India Meteorological Department (IMD), Govt. of India

> **A Universal React Native & Web Application designed for Smart India Hackathon (SIH)**  
> **Core Architecture: WEATHER → PERSONAL CONTEXT → IMPACT → SCENARIO → ACTION → EXPLANATION**

---

## 🌟 Executive Summary

Traditional weather platforms report passive numbers: *"Rain probability: 78%"*.  
**Mausam IQ** transforms meteorological observations into actionable intelligence tailored to citizen personas:

- 🌦️ **WEATHER**: *"Rain probability is 82% with squalls (28 km/h) in Delhi NCR."*
- ⚡ **IMPACT**: *"Peak commute speeds reduced by ~35%; underpasses on NH-48 prone to waterlogging."*
- 🎯 **ACTION**: *"Depart before 6:15 PM or switch to elevated Metro Rail; pack waterproof gear."*

The application dynamically prioritizes feeds based on **7 Indian Citizen Personas**, **Live IMD Doppler Radar Streams**, and **Personal Weather DNA**.

---

## 🚀 Key Signature Features

### 1. Weather → Impact → Action Engine
- Clear demarcation between **IMD Ground Observations** (factual) and **System-Generated Contextual Advice** (modeled).
- Guarantees zero hallucinations and authentic governmental credibility.

### 2. Contextual Weather Impact Score (0–100)
- Unlike static weather numbers, this score reflects real-world vulnerability:
  - **Commuter**: Weighted on rain, road visibility, and wind.
  - **Farmer**: Weighted on soil moisture, spray windows, and humidity.
  - **Fisherman**: Weighted on sea swell, wave height, and squalls.
  - **Health-Sensitive**: Weighted on PM2.5 / PM10 AQI stress and respiratory dampness.
- Interactive modal: *"Why is my score high?"* explaining the contributing factor weights.

### 3. "What If?" Weather Departure Simulator
- Time-slider comparison comparing departures:
  - *Leave Now* vs *Wait +1 Hour* vs *Wait +2.5 Hours* vs *Tomorrow Morning*.
  - Compares rain risk curves, wind gusts, and travel delay risk.

### 4. Weather Along My Route
- Origin to Destination corridor checkpoints with micro-climate telemetry.
- Highlights localized hazard zones (e.g. Mahipalpur Underpass water accumulation, Dhaula Kuan crosswinds).
- Quick route presets (Delhi → Gurugram, Noida → Airport, Delhi → Karnal Agri Hub).

### 5. Personal Weather DNA
- Fully transparent user preference weights (Rain, Temperature, AQI, Commute, Agriculture).
- Pause learning switch, priority level bars, and instant reset.

### 6. "Why Did My Homepage Adapt?" Explanation Layer
- Transparent banner revealing the exact micro-climate triggers that caused card re-ranking (e.g. *"Orange Alert escalated to slot #1"*, *"Commuter profile active"*).

### 7. Forecast Trust & Verification System
- Data freshness indicator (*"Updated 4 mins ago • Live Doppler"*).
- Forecast Confidence metrics (*"High Confidence: 92% Consensus from 4 NWP Models"*).
- Official data attribution (*IMD Palam Doppler Radar & MoES WRF Ensemble*).

### 8. Alert Intelligence
- Orange/Red IMD disaster warnings immediately re-rank to position #1.
- Provides actionable safety advisories and affected district breakdowns.

### 9. Mausam Conversational AI Copilot
- Context-aware chatbot for natural language weather inquiries.
- Suggested prompt carousel based on active persona.
- Bilingual (English & Hindi) query resolution.

### 10. Multi-Layer Geospatial Weather Map
- Touch-friendly layer switcher:
  - 🌧️ Precipitation Doppler Radar
  - 💨 Wind Flow Vectors
  - 🌡️ Thermal Heatmap
  - 🌫️ Air Quality Index (AQI)
  - ⚠️ IMD Warning Zones
- Interactive city checkpoints across all major Indian states.

### 11. Family & Saved Locations Carousel
- Quick switching between Home (Delhi), Office (Gurugram), Village/Farm (Karnal), Family (Pune), and Coastal (Kochi).

### 12. Bilingual & Multi-Theme Design
- Full support for **English** and **हिन्दी (Hindi)**.
- **Midnight Sapphire (Dark Mode)** and **Clear Sky (Light Mode)**.
- Metric conventions: °C, km/h, mm, AQI.

---

## 📱 Cross-Platform Technology Stack

- **Framework**: React Native (Universal with Expo SDK 57)
- **Web Runtime**: `react-native-web` (seamless desktop & tablet responsive execution)
- **Design System**: Vanilla CSS tokens & StyleSheet (light & dark palettes, responsive breakpoints)
- **Iconography**: `@expo/vector-icons` (MaterialCommunityIcons & Ionicons)
- **State Management**: React Context (`AppContext`) with offline simulation & preferences cache
- **Languages**: TypeScript & Modern React

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Web / Desktop Browser
```bash
npm run web
```
Open **[http://localhost:8081](http://localhost:8081)** in your browser.

### 3. Run on Mobile (Android / iOS)
```bash
# Start Expo development server
npm start

# For Android
npm run android

# For iOS
npm run ios
```
Scan the QR code with **Expo Go** on your Android or iPhone device.

---

## 🏛️ Organization & Governance
- **Organization**: Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)
- **Initiative**: Smart India Hackathon (SIH) Prototype
- **License**: MIT