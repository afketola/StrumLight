import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './src/screens/OnboardingScreen';
import BluetoothSetupScreen from './src/screens/BluetoothSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import CommandTestScreen from './src/screens/CommandTestScreen'; // New test page
import SettingsScreen from './src/screens/SettingsScreen'; // Placeholder for settings
import TutorialScreen from './src/screens/TutorialScreen';

const Stack = createStackNavigator();

const App = (): React.JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="BluetoothSetup" component={BluetoothSetupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
