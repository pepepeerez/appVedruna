import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../paginas/LoginScreen';
import RegisterScreen from '../paginas/RegisterScreen';

const Stack = createStackNavigator();

export default function StackNavigationPubli() {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }} // Oculta el encabezado
      />
      <Stack.Screen 
        name="RegisterScreen" 
        component={RegisterScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
