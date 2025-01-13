import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavegacionPubli from './src/navegacion/StackNavegacionPubli'; // Importa tu stack

export default function App() {
  return (
    <NavigationContainer>
      <StackNavegacionPubli />
    </NavigationContainer>
  );
}

