import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { launchCamera } from "react-native-image-picker";

export function AddScreen({ navigation }) {
  const [photo, setPhoto] = useState(null);

  // Abrir la cámara automáticamente al cargar la pantalla
  useEffect(() => {
    openCamera();
  }, []);

  const openCamera = () => {
    const options = {
      mediaType: "photo",
      cameraType: "back",
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("El usuario canceló la cámara");
        navigation.goBack(); // Volver atrás si el usuario cancela
      } else if (response.errorCode) {
        console.error("Error al abrir la cámara:", response.errorMessage);
        Alert.alert("Error", "No se pudo acceder a la cámara.");
        navigation.goBack();
      } else {
        console.log("Foto capturada:", response.assets);
        if (response.assets && response.assets.length > 0) {
          setPhoto(response.assets[0]); // Guardamos la foto tomada
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  image: {
    width: 300,
    height: 400,
    marginTop: 20,
  },
});
