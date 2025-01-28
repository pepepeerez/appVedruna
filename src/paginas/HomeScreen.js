import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Alert } from "react-native";

// Componente principal de la pantalla de publicaciones
export function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [nick, setNick] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtener el nick y la foto de perfil del usuario desde el microservicio
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://172.26.1.252:8080/proyecto01/usuarios/1"); // Cambia "1" por el ID del usuario deseado
        const user = await response.json();
        setNick(user.nick); // Almacena el nick del usuario
        setProfilePicture(user.profile_picture); // Almacena la foto de perfil del usuario
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        Alert.alert("Error", "No se pudo cargar el nombre del usuario.");
      }
    };

    fetchUserData();
  }, []);

  // Obtener las publicaciones
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://172.26.1.252:8080/proyecto01/publicaciones");
        const result = await response.json();
        setPosts(result);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
        Alert.alert("Error", "No se pudo obtener las publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Función para agregar un like
  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://172.26.1.252:8080/proyecto01/put/${postId}`, {
        method: "PUT",
      });

      if (response.ok) {
        Alert.alert("Éxito", "Has dado like a la publicación.");
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, like: updatedPost.like } : post
          )
        );
      } else {
        Alert.alert("Error", "No se pudo dar like.");
      }
    } catch (error) {
      console.error("Error al dar like:", error);
      Alert.alert("Error", "Ocurrió un error al dar like.");
    }
  };

  // Función para agregar un comentario
  const handleComment = async (postId) => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Por favor, ingresa un comentario.");
      return;
    }

    try {
      const response = await fetch(`http://172.26.1.252:8080/proyecto01/comentarios/put`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_publicacion: postId, comentario: newComment }),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Comentario agregado.");
        setNewComment(""); // Limpiar el campo de comentario
      } else {
        Alert.alert("Error", "No se pudo agregar el comentario.");
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      Alert.alert("Error", "Ocurrió un error al agregar el comentario.");
    }
  };

  // Renderizar cada publicación
  const renderPost = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <Image source={{ uri: item.image_url }} style={styles.postImage} />
        <Text style={styles.postTitle}>{item.titulo || "Sin título"}</Text>
        <Text style={styles.postDescription}>{item.comentario || "Sin descripción"}</Text>

        <View style={styles.likesContainer}>
          <Text style={styles.likesText}>Likes: {item.like?.length || 0}</Text>
          <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(item._id)}>
            <Text style={styles.likeButtonText}>Dar like</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentContainer}>
          <TextInput
            style={styles.commentInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Escribe un comentario..."
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.commentButton} onPress={() => handleComment(item._id)}>
            <Text style={styles.commentButtonText}>Comentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Text style={styles.loadingText}>Cargando publicaciones...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Cabecera con nick y foto de perfil */}
      <View style={styles.header}>
        <Image
          source={{ uri: profilePicture }}
          style={styles.profilePicture}
        />
        <Text style={styles.nickText}>Nick: {nick || "Cargando..."}</Text>
      </View>

      {/* Lista de publicaciones */}
      <FlatList
        data={posts || []}
        renderItem={renderPost}
        keyExtractor={(item) => item._id || Math.random().toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  nickText: {
    color: "#9FC63B",
    fontSize: 20,
    fontWeight: "bold",
  },
  postContainer: {
    backgroundColor: "#1E1E1E",
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  postDescription: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 10,
  },
  likesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likesText: {
    color: "#fff",
    fontSize: 16,
  },
  likeButton: {
    backgroundColor: "#84bd00",
    padding: 10,
    borderRadius: 5,
  },
  likeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  commentContainer: {
    marginTop: 10,
  },
  commentInput: {
    backgroundColor: "#868686",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: "#121212",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#84bd00",
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});

export default HomeScreen;
