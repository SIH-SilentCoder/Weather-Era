import os
from fpdf import FPDF
from fpdf.enums import XPos, YPos

class MausamPDF(FPDF):
    def __init__(self):
        super().__init__()
        # Register Arial fonts for full Unicode support
        self.add_font("Arial", "", r"C:\Windows\Fonts\arial.ttf")
        self.add_font("Arial", "B", r"C:\Windows\Fonts\arialbd.ttf")
        self.add_font("Arial", "I", r"C:\Windows\Fonts\ariali.ttf")
        self.add_font("Arial", "BI", r"C:\Windows\Fonts\arialbi.ttf")

    def header(self):
        # Top banner with government styling
        self.set_fill_color(11, 44, 93) # Deep IMD Navy
        self.rect(0, 0, 210, 13, 'F')
        
        # Tiranga accent strip
        self.set_fill_color(255, 153, 51) # Saffron
        self.rect(0, 13, 70, 2.5, 'F')
        self.set_fill_color(255, 255, 255) # White
        self.rect(70, 13, 70, 2.5, 'F')
        self.set_fill_color(19, 136, 8) # Green
        self.rect(140, 13, 70, 2.5, 'F')

        self.set_font('Arial', 'B', 8)
        self.set_text_color(255, 255, 255)
        self.set_xy(10, 3)
        self.cell(130, 7, "MINISTRY OF EARTH SCIENCES (MoES) | INDIA METEOROLOGICAL DEPARTMENT (IMD)", new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.cell(60, 7, "SMART INDIA HACKATHON", align='R', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(6)

    def footer(self):
        self.set_y(-14)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Mausam IQ - SIH Technical & Architectural Specification | Page {self.page_no()}/{{nb}}", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def chapter_title(self, num_str, title_str):
        self.set_font('Arial', 'B', 12)
        self.set_text_color(11, 44, 93)
        self.cell(0, 8, f"{num_str}. {title_str}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(11, 44, 93)
        self.set_line_width(0.4)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)

    def section_title(self, title_str):
        self.set_font('Arial', 'B', 9.5)
        self.set_text_color(2, 132, 199)
        self.cell(0, 5.5, title_str, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def body_p(self, text):
        self.set_font('Arial', '', 8.5)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 4.3, text)
        self.ln(2)

def generate_pdf():
    pdf = MausamPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.add_page()

    # Document Header Title Block
    pdf.ln(1)
    pdf.set_font('Arial', 'B', 16)
    pdf.set_text_color(11, 44, 93)
    pdf.cell(0, 7.5, "MAUSAM IQ - TECHNICAL & API SPECIFICATION", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font('Arial', 'B', 10.5)
    pdf.set_text_color(217, 119, 6)
    pdf.cell(0, 5.5, "Personalized Homepage for 'Mausam' Mobile & Web Application", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font('Arial', '', 8)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 4.5, "Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD) - SIH Architecture Blueprint", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(4)

    # 1. Executive Summary
    pdf.chapter_title("1", "EXECUTIVE SUMMARY & CORE PARADIGM SHIFT")
    pdf.body_p(
        "Traditional weather applications present static, scientific numbers (e.g. 'Precipitation 82%, Wind 28 km/h'). "
        "For ordinary citizens—farmers, urban commuters, delivery partners, and vulnerable citizens—raw numbers fail to answer: "
        "'What does this weather mean for my life, and what action should I take right now?'\n\n"
        "Mausam IQ transforms the IMD platform from an observational data feed into a Personalized Weather Intelligence Platform. "
        "It executes a deterministic 7-stage intelligence loop: "
        "RAW DATA -> WEATHER -> PERSONAL CONTEXT -> IMPACT -> SCENARIO -> ACTION -> TRANSPARENCY."
    )

    # 2. Technology Stack
    pdf.chapter_title("2", "COMPLETE TECHNOLOGY STACK")
    pdf.body_p("The system is engineered as an enterprise-grade Universal Cross-Platform application running on Android, iOS, and Web:")

    # Table of Tech Stack
    headers = ["Layer", "Technology", "Version", "Architectural Role & Capability"]
    col_widths = [32, 45, 23, 90]
    
    pdf.set_fill_color(238, 242, 246)
    pdf.set_text_color(11, 44, 93)
    pdf.set_font('Arial', 'B', 8)
    for i, h in enumerate(headers):
        pdf.cell(col_widths[i], 6, h, border=1, fill=True)
    pdf.ln()

    stack_rows = [
        ("Mobile & Web Core", "Universal React Native", "v0.86.3", "Native runtime bridge for mobile devices & adaptive web interface"),
        ("Cross-Platform SDK", "Expo SDK", "v57.0.25", "Universal device abstraction layer, permissions & asset pipeline"),
        ("UI Rendering", "React 19 & React-DOM", "v19.2.3", "Concurrent rendering engine & component state lifecycle"),
        ("Web Compilation", "react-native-web", "v0.21.2", "Translates React Native primitives into optimized responsive Web DOM"),
        ("Programming Language", "TypeScript", "~6.0.3", "Strict static compile-time type safety & domain interface contracts"),
        ("Styling & Tokens", "StyleSheet & Custom Theme", "Native", "Zero-runtime overhead; Dark & Light mode; IMD 4-tier alert tokens"),
        ("Visual Effects", "expo-linear-gradient", "~57.0.2", "Atmospheric backdrops, glassmorphism & radar visualization"),
        ("Iconography", "@expo/vector-icons", "v15.0.2", "MaterialCommunityIcons, Ionicons, and Feather symbols"),
        ("State Management", "React Context + Hooks", "Native", "Reactive state for Persona, Language, Location & Card Rankings"),
        ("Offline Storage", "AsyncStorage", "v2.2.0", "Local persistence of cache, user DNA & disaster warnings"),
        ("Internationalization", "Custom i18n Engine", "v1.0.0", "Instant dynamic switching between English & Hindi (Bilingual)"),
        ("Bundling & Tooling", "Metro Bundler", "~57.0.16", "High-speed hot module replacement & tree-shaking compiler")
    ]

    pdf.set_font('Arial', '', 7.5)
    pdf.set_text_color(30, 30, 30)
    for row in stack_rows:
        pdf.cell(col_widths[0], 5, row[0], border=1)
        pdf.cell(col_widths[1], 5, row[1], border=1)
        pdf.cell(col_widths[2], 5, row[2], border=1, align='C')
        pdf.cell(col_widths[3], 5, row[3], border=1)
        pdf.ln()

    pdf.ln(3)

    # 3. Complete APIs Specification
    pdf.chapter_title("3", "API ARCHITECTURE (11 ACTIVE APIS & SERVICES)")
    pdf.body_p(
        "Mausam IQ operates with a total of 11 active APIs and service engines: 6 External Meteorological Feeds and 5 Internal Algorithmic Micro-Services."
    )

    pdf.section_title("A. External Meteorological & GIS Data Ingestion APIs (6 Feeds):")
    ext_apis = [
        ("1. IMD Doppler Weather Radar (DWR) Telemetry API", "Provides real-time ground radar reflectivity (dBZ), convective storm velocity, and localized cloud top heights from Palam, Safdarjung, and coastal radar network."),
        ("2. MoES / IMD Numerical Weather Prediction (NWP) Ensemble API", "Delivers 24-hour hourly progression and 7-day high-resolution synoptic forecasts (Precipitation, Relative Humidity, Pressure, Wind Shear)."),
        ("3. IMD Agromet Advisory Service (AAS) / ICAR API", "Supplies hyperlocal agricultural advisories, crop vulnerability thresholds, evapotranspiration rates, and agrochemical spraying feasibility guidelines."),
        ("4. CPCB (Central Pollution Control Board) National AQI API", "Streams real-time Air Quality Index metrics (PM2.5, PM10, NO2) with 6-tier health hazard classifications."),
        ("5. OpenStreetMap / CartoDB / WMO Vector Tile API", "Renders interactive GIS radar maps, global meteorological wind streams (Jet Streams), and Inter-Tropical Convergence Zone (ITCZ) satellite overlays."),
        ("6. Open-Meteo & WMO Global Met Office Sync API", "Synchronizes international weather feeds for global metropolises (Tokyo, London, New York, Dubai, Sydney, Cairo) for the global radar scope.")
    ]
    for name, desc in ext_apis:
        pdf.set_font('Arial', 'B', 8)
        pdf.set_text_color(11, 44, 93)
        pdf.cell(0, 4.2, name, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font('Arial', '', 7.5)
        pdf.set_text_color(50, 50, 50)
        pdf.multi_cell(0, 3.8, f"   Function: {desc}")
        pdf.ln(0.8)

    pdf.ln(2)
    pdf.section_title("B. Internal Algorithmic Engine APIs (5 Core Micro-Services in src/services/):")
    int_apis = [
        ("1. weatherService (weatherService.ts)", "fetchCurrentWeather(), fetchHourlyForecast(), fetch7DayForecast(), fetchActiveAlerts(), getSavedLocations(). Provides ground-truth data with confidence scores and freshness timestamps."),
        ("2. impactEngine (impactEngine.ts)", "analyzeWeatherImpact(). Converts raw weather facts into personalized citizen impact, calculates the 0-100 Weather Impact Score, factors breakdown, and interactive Action Checklists."),
        ("3. routeEngine (routeEngine.ts)", "getWhatIfScenarios(), calculateRouteWeather(). Simulates realistic departure windows ('Abhi Niklu' vs '7 PM' vs '9:30 PM' vs 'Kal Subah') with road waterlogging severity, delay minutes, and AI verdicts."),
        ("4. personalizationEngine (personalizationEngine.ts)", "rankHomepageCards(), getCardExplanation(). Multi-factor mathematical ranking algorithm scoring cards by Persona (0.35), Interests (0.25), Location (0.15), Time of Day (0.15), and Severe Alert Urgency (0.10)."),
        ("5. aiAssistant (aiAssistant.ts)", "askMausamAI(). Grounded, zero-hallucination conversational meteorology copilot answering queries strictly based on IMD Doppler observations and official safety protocols.")
    ]
    for name, desc in int_apis:
        pdf.set_font('Arial', 'B', 8)
        pdf.set_text_color(2, 132, 199)
        pdf.cell(0, 4.2, name, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font('Arial', '', 7.5)
        pdf.set_text_color(50, 50, 50)
        pdf.multi_cell(0, 3.8, f"   Function: {desc}")
        pdf.ln(0.8)

    pdf.ln(2)

    # 4. Signature Modules
    pdf.chapter_title("4", "CORE SIGNATURE USER-FACING MODULES")
    
    # 4.1 Weather -> Impact -> Action
    pdf.section_title("1. Weather -> Impact -> Action (Beyond Static Weather Data)")
    pdf.body_p(
        "• Stage 1 (IMD Ground Reality): Displays official Doppler facts (e.g. Convective rain 32 mm/hr, squall 42 km/h).\n"
        "• Stage 2 (Real-Life Citizen Impact): Automatically tailored to the active citizen persona (Commuter, Farmer, Delivery, Senior Citizen).\n"
        "• Stage 3 (Action Playbook & Interactive Checklist): Provides concrete safety steps with a live tap-to-complete citizen action checklist (e.g. 'Clear field drainage channels', 'Switch to elevated metro lines')."
    )

    # 4.2 Weather Impact Score
    pdf.section_title("2. Context-Specific Weather Impact Score & Factor Decomposition")
    pdf.body_p(
        "• 0-100 Circular Dial Gauge: Dynamically color-coded (Low, Moderate, High, Severe) calibrated to user vulnerability.\n"
        "• Contributing Vulnerability Factors: Transparent breakdown with exact percentage weights (e.g. Rain Intensity 35%, Underpass Waterlogging 30%, Wind Squalls 20%, Lightning 15%).\n"
        "• Tap-to-Inspect Drawers: Tapping any factor reveals observed ground values and direct mitigation guidance.\n"
        "• 'Why is my score High?' Modal: Mathematical calibration explanation."
    )

    # 4.3 What-If Simulator
    pdf.section_title("3. What-If Simulator ('Abhi Niklu vs 7 PM vs Kal Subah' Comparison)")
    pdf.body_p(
        "• Realistic Departure Windows: Compares 'Abhi Niklu (6:15 PM)' [Recommended, +8m delay], 'Sham 7:00 PM' [Avoid, +45m delay, severe underpass flooding], 'Raat 9:30 PM' [Safe delayed window], and 'Kal Subah (07:30 AM)' [Optimal, 0m delay].\n"
        "• Dual Modes: Focus Deep-Dive View & Side-by-Side Matrix Table comparing Rain %, Delay, Waterlogging, and AI Verdicts."
    )

    # 4.4 Start -> Destination Weather Checkpoints
    pdf.section_title("4. Start -> Destination Corridor Weather Checkpoints (Corridor Mesonet)")
    pdf.body_p(
        "• Micro-Climate Checkpoint Timeline: Tracks live weather between Start and Destination nodes with color-coded safety indicators (Clear, Caution, Danger).\n"
        "• Road Surface & Ponding Telemetry: Detects waterlogging depth (e.g. Underpass Ponding > 1.2 ft), crosswind gusts on flyways, and low visibility (< 1.8 km).\n"
        "• Major Highway Corridors: Calibrated datasets for Delhi-Gurugram Expressway (31 km), Airport Express (38 km), GT Road Agri Corridor (128 km), and Pune IT Corridor (20 km).\n"
        "• Tap-to-Inspect Safety Protocol: Tapping any node displays official IMD highway guidance (e.g. 'Use upper flyover, avoid waterlogged underpass ramp')."
    )

    # 4.5 Radar Map
    pdf.section_title("5. Dual-Scope Radar Map (India National Radar + All Over The World Map)")
    pdf.body_p(
        "• India Radar: Doppler composite, lightning alerts, cloud animation, and IMD coastal mesonet.\n"
        "• World Map: Global metropolises (Tokyo, London, NYC, Dubai), Jet Streams, ITCZ rain belt, and timezones."
    )

    # 5. Evaluator & Hackathon Summary
    pdf.chapter_title("5", "SIH EVALUATION & SYSTEM VERIFICATION")
    pdf.body_p(
        "• Dev Server Endpoint: http://localhost:8081 (Universal Web / Responsive Desktop & Tablet).\n"
        "• Metro Bundler: 200 OK Clean compilation (360+ modules).\n"
        "• Zero Hallucination Guarantee: All AI responses are deterministically anchored to IMD ground telemetry.\n"
        "• Offline Resilience: Critical disaster alerts and user DNA persist without active network connectivity."
    )

    output_path = r"c:\Users\Ankur Yadav\OneDrive\Desktop\SIH2\mausam-AI\MAUSAM_IQ_TechStack_APIs_Specification.pdf"
    pdf.output(output_path)
    print(f"SUCCESS: PDF generated at {output_path} ({os.path.getsize(output_path)} bytes)")

if __name__ == '__main__':
    generate_pdf()
