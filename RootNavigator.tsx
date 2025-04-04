import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BluetoothContext } from './src/context/BluetoothContext';
import BluetoothSetupScreen from './src/screens/BluetoothSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import CommandScreen from './src/screens/CommandScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TuningScreen from './src/screens/TuningScreen';
// ... other screens if needed

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { connected } = useContext(BluetoothContext);
  const [initialRoute, setInitialRoute] = useState<string>('BluetoothSetup');

  useEffect(() => {
    if (connected) {
      setInitialRoute('Home');
    } else {
      setInitialRoute('BluetoothSetup');
    }
  }, [connected]);

  if (!initialRoute) {
    return null; // or a loading spinner
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      // Universal screenOptions for all screens:
      screenOptions={{
        headerShown: true,          // Show the default header with back arrow
        headerBackTitleVisible: false,
        headerTintColor: '#555',    // Color of the back arrow and text
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,            // Remove Android shadow
          shadowOpacity: 0,        // Remove iOS shadow
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      {/* 
        For HomeScreen, we might want NO header, 
        so we can override that below with `options={{ headerShown: false }}` 
      */}
      <Stack.Screen
        name="BluetoothSetup"
        component={BluetoothSetupScreen}
        options={{ title: 'Setup Bluetooth' }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, // We hide it here to preserve the custom UI
        }}
      />
      <Stack.Screen
        name="Tutorial"
        component={TutorialScreen}
        options={{
            headerShown: false, // We hide it here to preserve the custom UI
          }}
      />
      <Stack.Screen
        name="Command"
        component={CommandScreen}
        options={{ title: 'Freestyle' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Tuning"
        component={TuningScreen}
        options={{ title: 'Tuning' }}
      />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
