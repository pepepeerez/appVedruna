import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../../firebase-config';

const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date); 

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else {
    return `Hace ${seconds} segundo${seconds > 1 ? 's' : ''}`;
  }
};

export function HomeScreen() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userLikes, setUserLikes] = useState(new Set());
  const [userComments, setUserComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserName(currentUser.displayName || currentUser.email || 'Usuario');
    }

    fetchPublicaciones();
  }, []);

  const fetchPublicaciones = async () => {
    try {
      const url = 'http://192.168.1.147:8080/proyecto01/publicaciones';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener publicaciones');
      }

      const data = await response.json();
      setPublicaciones(data || []);
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const pubIndex = publicaciones.findIndex((pub) => pub.id === id);
      const updatedPublicaciones = [...publicaciones];
      const pub = updatedPublicaciones[pubIndex];

      if (userLikes.has(id)) {
        pub.likes -= 1;
        setUserLikes((prev) => {
          const newLikes = new Set(prev);
          newLikes.delete(id);
          return newLikes;
        });
      } else {
        pub.likes = (pub.likes || 0) + 1;
        setUserLikes((prev) => new Set(prev).add(id));
      }

      setPublicaciones(updatedPublicaciones);

      const url = `http://192.168.1.147:8080/proyecto01/publicaciones/put/${id}/${userId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likes: pub.likes,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el like');
      }
    } catch (error) {
      console.error('Error al actualizar el like:', error);
    }
  };

  const handleComment = async (id) => {
    try {
      const url = `http://192.168.1.147:8080/proyecto01/comentarios/put`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el comentario');
      }

      const data = await response.json();
      setUserComments((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), data.comment],
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-left" size={20} color="#9FC63B" />
        <View style={styles.userInfo}>
          <View style={styles.userDetails}>
            <Image
              source={require('../../assets/perfil.jpg')}
              style={styles.userPhoto}
            />
            <View>
              <Text style={styles.userName}>{userName}</Text>
            </View>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.imageContainer}>
          {publicaciones.length > 0 ? (
            publicaciones.map((publicacion) => {
              return (
                <View key={publicacion.id} style={styles.publicacion}>
                  <Image
                    source={{ uri: publicacion.image_url }}
                    style={styles.image}
                    onError={(e) =>
                      console.log('Error al cargar la imagen:', e.nativeEvent.error)
                    }
                  />
                  <View style={styles.likeContainer}>
                    <TouchableOpacity onPress={() => handleLike(publicacion.id)}>
                      <Icon
                        name={userLikes.has(publicacion.id) ? 'heart' : 'heart-o'}
                        size={24}
                        color={userLikes.has(publicacion.id) ? '#ff0000' : '#ffffff'}
                      />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{publicacion.likes || 0} Me gusta</Text>
                  </View>
                  <Text style={styles.title}>{publicacion.titulo}</Text>
                  <Text style={styles.description}>{publicacion.comentario}</Text>
                  <Text style={styles.date}>{timeAgo(publicacion.createdAt)}</Text>
                  <View style={styles.commentContainer}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Escribe un comentario..."
                      value={newComment}
                      onChangeText={setNewComment}
                    />
                    <TouchableOpacity onPress={() => handleComment(publicacion.id)}>
                      <Icon name="send" size={20} color="#9FC63B" />
                    </TouchableOpacity>
                  </View>
                  {userComments[publicacion.id] && (
                    <View style={styles.commentsList}>
                      {userComments[publicacion.id].map((comment, index) => (
                        <Text key={index} style={styles.comment}>
                          {comment}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={styles.noPublicaciones}>No hay publicaciones disponibles.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2F33', // Cambiado a un color más oscuro
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23272A',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingTop: 50,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#ffffff',
    fontSize: 20, // Aumentado el tamaño de la fuente
    fontWeight: 'bold',
    flexShrink: 1,
  },
  userPhoto: {
    width: 50, // Aumentado el tamaño de la imagen
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#9FC63B',  
  },
  imageContainer: {
    padding: 15, // Aumentado el padding
  },
  publicacion: {
    marginBottom: 25, // Aumentado el margen
    backgroundColor: '#23272A',
    padding: 15, // Aumentado el padding
    borderRadius: 10, // Añadido borde redondeado
    shadowColor: '#000', // Añadido sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Para Android
  },
  image: {
    width: '100%',
    height: 220, // Aumentado el tamaño de la imagen
    marginBottom: 15,
    borderRadius: 10, // Añadido borde redondeado
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  likeCount: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16, // Aumentado el tamaño de la fuente
  },
  title: {
    color: '#9FC63B',
    fontSize: 20, // Aumentado el tamaño de la fuente
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#cccccc',
    fontSize: 16, // Aumentado el tamaño de la fuente
    marginBottom: 5,
  },
  date: {
    color: '#888888',
    fontSize: 14,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2F33',
  },
  noPublicaciones: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18, // Aumentado el tamaño de la fuente
    marginTop: 20,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  commentsList: {
    marginTop: 10,
  },
  comment: {
    color: '#cccccc',
    fontSize: 15, // Aumentado el tamaño de la fuente
    marginBottom: 5,
  },
});

