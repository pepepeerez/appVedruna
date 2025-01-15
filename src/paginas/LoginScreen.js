import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebase-config';


export function LoginScreen({ navigation }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);
  
  const handleSingIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Sesión iniciada');
        navigation.navigate('TabNavegation');
      })
      .catch((error) => {
        console.log('Error al iniciar sesión:', error);
      });
  };


  return (
    <View style={styles.container}>
      {/* Imagen del logo */}
      <Image source={require('../../assets/ic_logo 2.png')} style={styles.logo} />

      <Text style={styles.title}>VEDRUNA EDUCACIÓN</Text>

      <TextInput
        style={styles.input}
        placeholder="Introduzca su correo o nick..."
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, styles.passwordInput]} // Aplica un estilo adicional al campo de contraseña
        placeholder="Introduzca su contraseña..."
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Enlace de "¿Olvidaste tu contraseña?" */}
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSingIn}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      {/* Footer con separador y enlace */}
      <View style={styles.footer}>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text>
            <Text style={styles.question}>¿No tienes cuenta? </Text>
            <Text style={styles.link}>Crear cuenta</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '85%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    color: '#fff',
  },
  passwordInput: {
    marginTop: 20, // Añadí un margen superior para separar del campo de email
  },
  button: {
    width: '85%',
    padding: 10,
    backgroundColor: '#9FC63B',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    width: '85%',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  forgotPassword: {
    color: '#9FC63B',
    fontSize: 14,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#333',
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  link: {
    color: '#9FC63B',
  },
  question: {
    color: '#dfdfdf',
  },
});
