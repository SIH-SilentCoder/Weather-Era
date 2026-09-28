import React from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { NavHeader } from './src/components/NavHeader';
import { BottomNav } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { ForecastScreen } from './src/screens/ForecastScreen';
import { MapScreen } from './src/screens/MapScreen';
import { AIScreen } from './src/screens/AIScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

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
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
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
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  screenWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
});
