// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BluetoothProvider } from './src/context/BluetoothContext';
import RootNavigator from './RootNavigator';

const App = (): React.JSX.Element => {
  return (
    <BluetoothProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </BluetoothProvider>
  );
};

export default App;
