import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Text, 
  TouchableOpacity, 
  Platform, 
  StatusBar as RNStatusBar 
} from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { NavHeader } from './src/components/NavHeader';
import { BottomNav } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { ForecastScreen } from './src/screens/ForecastScreen';
import { MapScreen } from './src/screens/MapScreen';
import { AIScreen } from './src/screens/AIScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AlertsScreen } from './src/screens/AlertsScreen';

const ANDROID_STATUS_BAR_HEIGHT = Platform.OS === 'android' 
  ? (RNStatusBar.currentHeight && RNStatusBar.currentHeight > 0 ? RNStatusBar.currentHeight : 24) 
  : 0;

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Mausam App Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorTitle}>🌤️ Mausam AI</Text>
          <Text style={styles.errorMessage}>
            Something went wrong while loading the screen.
          </Text>
          {this.state.error?.message ? (
            <Text style={styles.errorDetail}>{this.state.error.message}</Text>
          ) : null}
          <TouchableOpacity style={styles.reloadButton} onPress={this.resetError} activeOpacity={0.8}>
            <Text style={styles.reloadButtonText}>Restart Application</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const MainAppContent: React.FC = () => {
  const { theme, themeMode, currentTab } = useApp();

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'forecast':
        return <ForecastScreen />;
      case 'map':
        return <MapScreen />;
      case 'alerts':
        return <AlertsScreen />;
      case 'ai':
        return <AIScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
        <RNStatusBar 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor={theme.surface}
          translucent={true}
        />
        {/* Unified Responsive Navigation Header */}
        <NavHeader />

        {/* Dynamic Screen Viewport */}
        <View style={styles.screenWrapper}>
          {renderActiveScreen()}
        </View>

        {/* Mobile Touch-Friendly Bottom Navigation */}
        <BottomNav />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: ANDROID_STATUS_BAR_HEIGHT,
  },
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  screenWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: ANDROID_STATUS_BAR_HEIGHT + 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  reloadButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

