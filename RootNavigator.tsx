import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BluetoothContext } from './src/context/BluetoothContext';
import BluetoothSetupScreen from './src/screens/BluetoothSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import CommandScreen from './src/screens/CommandScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TuningScreen from './src/screens/TuningScreen';
import DemoSongScreen from './src/screens/DemoSongScreen';
import LearnSongsScreen from './src/screens/LearnSongsScreen';
import SongPlayScreen from './src/screens/SongPlayScreen';


const Stack = createStackNavigator();

const RootNavigator = () => {
  const bluetoothContext = useContext(BluetoothContext);
  const isConnected = bluetoothContext?.connected || false;
  const [initialRoute, setInitialRoute] = useState<string>('BluetoothSetup');

  useEffect(() => {
    if (isConnected) {
      setInitialRoute('Home');
    } else {
      setInitialRoute('BluetoothSetup');
    }
  }, [isConnected]);

  if (!initialRoute) {
    return null; // or a loading spinner
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      // Universal screenOptions for all screens:
      screenOptions={{
        headerShown: true,          // Show the default header with back arrow
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
        For screens with custom headers, we hide the default header
        to avoid having two headers
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
        options={{ 
          headerShown: false, // Hide default header to avoid double headers
          title: 'Settings' 
        }}
      />
      <Stack.Screen
        name="Tuning"
        component={TuningScreen}
        options={{ 
          headerShown: false, // Hide default header to avoid double headers
          title: 'Tuning' 
        }}
      />
      <Stack.Screen
        name="LearnSongs"
        component={LearnSongsScreen}
        options={{ 
          headerShown: false, // Hide default header to avoid double headers
          title: 'Learn Songs' 
        }}
      />
      <Stack.Screen
        name="DemoSong"
        component={DemoSongScreen}
        options={{ title: 'Demo Song' }}
      />
      <Stack.Screen
        name="SongPlay"
        component={SongPlayScreen}
        options={{ 
          headerShown: false, // Hide default header to avoid double headers
          title: 'Play Song' 
        }}
      />
      
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
