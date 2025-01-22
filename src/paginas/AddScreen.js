import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export function AddScreen() {
  const [photo, setPhoto] = useState(null); // URI de la foto
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

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
      Alert.alert("Error", "Por favor, toma una foto primero.");
      return;
    }

    if (!title.trim() || !comment.trim()) {
      Alert.alert("Error", "Por favor, ingresa un título y un comentario.");
      return;
    }

    // Aquí puedes añadir la lógica para guardar la foto, título y comentario en tu base de datos
    Alert.alert("Guardado", "Tu foto ha sido guardada con éxito.");
    setPhoto(null);
    setTitle("");
    setComment("");
  };

  return (
    <View style={styles.container}>
      {photo && <Image source={{ uri: photo }} style={styles.photo} />}
      <Button title="Abrir Cámara" onPress={openCamera} />
      {photo && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Comentario"
            value={comment}
            onChangeText={setComment}
          />
          <Button title="Guardar" onPress={handleSave} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  photo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default AddScreen;
