import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export function AddScreen() {
  const [photo, setPhoto] = useState(null); // URI de la foto
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const openImagePicker = async () => {
    // Solicitar permisos para la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se necesita permiso para acceder a la galería. Por favor, habilítalo en la configuración."
      );
      return;
    }

    // Abrir la galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // Guardar la URI de la foto
    }
  };

  const openCamera = async () => {
    // Solicitar permisos para la cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se necesita permiso para acceder a la cámara. Por favor, habilítalo en la configuración."
      );
      return;
    }

    // Abrir la cámara
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // Guardar la URI de la foto
    }
  };

  const handleSave = () => {
    if (!photo) {
      Alert.alert("Error", "Por favor, toma una foto o selecciona una de la galería primero.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Por favor, ingresa un título y una descripción.");
      return;
    }

    // Aquí puedes añadir la lógica para guardar la foto, título y descripción en tu base de datos
    Alert.alert("Guardado", "Tu foto ha sido guardada con éxito.");
    setPhoto(null);
    setTitle("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publicación</Text>
      <TouchableOpacity style={[styles.photoContainer, { borderColor: '#84bd00', borderWidth: 3 }]} onPress={() => {
        Alert.alert(
          "Seleccionar opción",
          "¿Quieres tomar una foto o seleccionar una de la galería?",
          [
            { text: "Tomar foto", onPress: openCamera },
            { text: "Seleccionar de la galería", onPress: openImagePicker },
            { text: "Cancelar", style: "cancel" }
          ]
        );
      }}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <Image source={require('../../assets/Contacts.png')} style={styles.logo} />
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <Text style={styles.tituloInput}>Título:</Text>
        <TextInput
          style={styles.input}
          placeholder="Máx. 40 caracteres"
          maxLength={40}
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.tituloInput}>Descripción:</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Máx. 250 caracteres"
          maxLength={250}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>PUBLICAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 39,
    fontWeight: "bold",
    color: "#9FC63B",
    marginBottom: 15,
    marginTop: 30,
  },
  photoContainer: {
    width: 200,
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  inputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  tituloInput: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#9FC63B",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: "#868686",
    fontSize: 15,
  },
  descriptionInput: {
    width: "100%",
    height: 180,
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: "#868686",
    textAlignVertical: "top",
    fontSize: 15,
  },
  button: {
    width: '50%',
    padding: 10,
    backgroundColor: '#121212',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
    borderWidth: 3,
    borderColor: '#84bd00',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default AddScreen;
