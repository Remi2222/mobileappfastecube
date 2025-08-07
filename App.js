import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BiometricAuthScreen from './src/screens/Auth/BiometricAuthScreen';
import CameraAuthScreen from './src/screens/Auth/CameraAuthScreen';
import BlogScreen from './src/screens/BlogScreen';
import BlogPostScreen from './src/screens/BlogPostScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ContactScreen from './src/screens/ContactScreen';
import TicketsScreen from './src/screens/TicketsScreen';
import NewTicketScreen from './src/screens/NewTicketScreen';
import TicketDetailScreen from './src/screens/TicketDetailScreen';
import TicketScannerScreen from './src/screens/Tickets/TicketScannerScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AboutScreen from './src/screens/AboutScreen';
import SearchScreen from './src/screens/SearchScreen';
import AppelOffreScreen from './src/screens/AppelOffreScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import BlogListScreen from './src/screens/Blog/BlogListScreen';
import ChatbotScreen from './src/screens/Chatbot/ChatbotScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';

// Import contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Services') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Blog') {
          iconName = focused ? 'newspaper' : 'newspaper-outline';
        } else if (route.name === 'Tickets') {
          iconName = focused ? 'ticket' : 'ticket-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Services" component={ServicesScreen} />
    <Tab.Screen name="Blog" component={BlogScreen} />
    <Tab.Screen name="Tickets" component={TicketsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Drawer.Screen name="MainTabs" component={TabNavigator} />
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="BiometricAuth" component={BiometricAuthScreen} />
          <Stack.Screen name="CameraAuth" component={CameraAuthScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="MainApp" component={DrawerNavigator} />
          <Stack.Screen name="BlogPost" component={BlogPostScreen} />
          <Stack.Screen name="NewTicket" component={NewTicketScreen} />
          <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
          <Stack.Screen name="TicketScanner" component={TicketScannerScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="AppelOffre" component={AppelOffreScreen} />
          <Stack.Screen name="BlogList" component={BlogListScreen} />
          <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

// App Content
const AppContent = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

// Main App Component
export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <AuthProvider>
      <StatusBar style="auto" />
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
