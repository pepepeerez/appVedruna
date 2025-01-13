import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [nick, setNick] = useState('');
  const [name, setName] = useState('');
  const [firstSurname, setFirstSurname] = useState('');
  const [secondSurname, setSecondSurname] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completar los siguientes campos:</Text>
      <TextInput
        style={styles.input}
        placeholder="Introduzca su nick"
        value={nick}
        onChangeText={setNick}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su primer apellido"
        value={firstSurname}
        onChangeText={setFirstSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su segundo apellido"
        value={secondSurname}
        onChangeText={setSecondSurname}
      />
      <TouchableOpacity style={styles.button} onPress={() => console.log('Register')}>
        <Text style={styles.buttonText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#84bd00',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});