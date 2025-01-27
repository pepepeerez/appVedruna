import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Alert } from "react-native";

// Componente para mostrar una publicación con su contenido y opciones de interacción
export function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtener las publicaciones y sus detalles
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://192.168.1.147:8080/proyecto01/publicaciones");
        const result = await response.json();

        // Aquí se asume que cada publicación tiene un user_id asociado que debemos buscar
        const enrichedPosts = await Promise.all(result.map(async (post) => {
          const userResponse = await fetch(`http://192.168.1.147:8080/proyecto01/usuarios/${post.id}`);
          const user = await userResponse.json();
          return {
            ...post,
            userNick: user.nick, // Agregar el nick del usuario a la publicación
          };
        }));

        setPosts(enrichedPosts);
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
  const handleLike = async (postId, id) => {
    try {
      // Hacer un PUT a tu API para dar like
      const response = await fetch(`http://192.168.1.147:8080/proyecto01/put/${postId}/${id}`, {
        method: "PUT",
      });
  
      if (response.ok) {
        Alert.alert("Éxito", "Has dado like a la publicación.");
        // Aquí, si quieres, puedes refrescar el estado de las publicaciones
        // para reflejar la actualización del like.
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, like: updatedPost.like } : post
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
      const response = await fetch(`http://192.168.1.147:8080/proyecto01/publicaciones/${postId}/comentario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comentario: newComment }),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Comentario agregado.");
        setNewComment(""); // Limpiar el campo de comentario
        // Recargar las publicaciones (si es necesario)
      } else {
        Alert.alert("Error", "No se pudo agregar el comentario.");
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      Alert.alert("Error", "Ocurrió un error al agregar el comentario.");
    }
  };

  // Función para renderizar cada publicación
  const renderPost = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName} {item.userSurname} ({item.userNick})</Text>
        </View>
        <Image source={{ uri: item.image_url }} style={styles.postImage} />
        <Text style={styles.postTitle}>{item.titulo}</Text>
        <Text style={styles.postDescription}>{item.comentario}</Text>

        <View style={styles.likesContainer}>
          <Text style={styles.likesText}>Likes: {item.like.length}</Text>
          <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(item.id)}>
            <Text style={styles.likeButtonText}>Dar like</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentContainer}>
          <TextInput
            style={styles.commentInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Escribe un comentario..."
          />
          <TouchableOpacity style={styles.commentButton} onPress={() => handleComment(item.id)}>
            <Text style={styles.commentButtonText}>Comentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Text>Cargando publicaciones...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publicaciones</Text>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
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
  title: {
    fontSize: 24,
    color: "#9FC63B",
    fontWeight: "bold",
    marginBottom: 20,
  },
  postContainer: {
    backgroundColor: "#1E1E1E",
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    color: "#9FC63B",
    fontSize: 18,
    fontWeight: "bold",
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
});

export default HomeScreen;
