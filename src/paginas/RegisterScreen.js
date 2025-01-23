import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebase-config';
import axios from 'axios'; // Asegúrate de tener instalado y configurado axios

export function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nick, setNick] = useState('');
  const [name, setName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const auth = getAuth(app);

  const handleCreateAccount = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Cuenta creada');
        saveUserDataToMicroservice();
        navigation.navigate('LoginScreen');
      })
      .catch((error) => {
        console.log('Error al crear cuenta:', error);
        Alert.alert('Error', 'No se pudo crear la cuenta. Verifica los datos.');
      });
  };

  const saveUserDataToMicroservice = async () => {
    try {
      await axios.post('http://localhost:8080/proyecto01/users', {
        nick,
        name,
        lastName1,
        lastName2,
      });
      console.log('Datos guardados en el microservicio');
    } catch (error) {
      console.error('Error al guardar los datos en el microservicio:', error);
      Alert.alert('Error', 'No se pudieron guardar los datos en el microservicio.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../../assets/formulario 1.png')} style={styles.image} />
        <Text style={styles.title}>Completar los siguientes campos:</Text>
        <View style={styles.formContainer}>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            placeholder="Introduzca su correo"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            placeholder="Introduzca su contraseña"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
          />
          <TextInput
            onChangeText={(text) => setConfirmPassword(text)}
            style={styles.input}
            placeholder="Repita su contraseña"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
          />
          <TextInput
            onChangeText={(text) => setNick(text)}
            style={styles.input}
            placeholder="Introduzca su nick"
            placeholderTextColor="#ccc"
          />
          <TextInput
            onChangeText={(text) => setName(text)}
            style={styles.input}
            placeholder="Introduzca su nombre"
            placeholderTextColor="#ccc"
          />
          <TextInput
            onChangeText={(text) => setLastName1(text)}
            style={styles.input}
            placeholder="Introduzca su primer apellido"
            placeholderTextColor="#ccc"
          />
          <TextInput
            onChangeText={(text) => setLastName2(text)}
            style={styles.input}
            placeholder="Introduzca su segundo apellido"
            placeholderTextColor="#ccc"
          />

          <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
            <Text style={styles.buttonText}>FINALIZAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
  },
  image: {
    height: 280,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#84bd00',
    textAlign: 'left',
    width: '90%',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
  },
  input: {
    width: '90%',
    padding: 3,
    marginBottom: 15,
    color: '#868686',
    borderBottomWidth: 1,
    borderBottomColor: '#868686',
    fontSize: 14,
  },
  button: {
    width: '50%',
    padding: 15,
    backgroundColor: '#121212',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 3,
    borderColor: '#84bd00',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
