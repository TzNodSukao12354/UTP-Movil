import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

// --- DATOS FALSOS / MOCKS ---
const GROUPS = [
  { id: '1', name: '🎮 Gamers' },
  { id: '2', name: '📚 Fijas del examen XD' },
  { id: '3', name: '💻 Programadores' },
  { id: '4', name: '😂 Memes UTP' },
];

const POSTS = [
  {
    id: '1',
    user: 'Juan Pérez',
    avatar: 'https://i.pravatar.cc/150?img=11',
    time: 'Hace 2 h',
    content: '¿Alguien tiene el syllabus de Base de Datos Avanzada? Me toca con el profesor Rodríguez y no lo encuentro en Canvas.',
    image: null,
    likes: 15,
    comments: 4,
  },
  {
    id: '2',
    user: 'María Gómez',
    avatar: 'https://i.pravatar.cc/150?img=5',
    time: 'Hace 5 h',
    content: 'Hoy hubo un torneo relámpago de Valorant en el primer piso. ¡Estuvo genial! 🏆',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    likes: 42,
    comments: 12,
  },
  {
    id: '3',
    user: 'Carlos Ruiz',
    avatar: 'https://i.pravatar.cc/150?img=33',
    time: 'Ayer',
    content: 'Recuerden que mañana vence el plazo para subir la T2 de Algoritmos. No lo dejen para última hora 🏃‍♂️💨',
    image: null,
    likes: 89,
    comments: 20,
  },
];

export default function InicioScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* HEADER SUPERIOR */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>UTP Connect</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            <View style={styles.badge} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=68' }} 
              style={styles.profilePic} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        
        {/* SECCIÓN LATERAL DE GRUPOS (Scroll Horizontal) */}
        <View style={styles.groupsSection}>
          <Text style={styles.sectionTitle}>Tus Grupos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupsScroll}>
            {GROUPS.map((group) => (
              <TouchableOpacity key={group.id} style={styles.groupCard}>
                <Text style={styles.groupText}>{group.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FEED DE PUBLICACIONES */}
        <View style={styles.feedSection}>
          {POSTS.map((post) => (
            <View key={post.id} style={styles.postContainer}>
              
              {/* Header de la Publicación (Foto, Nombre, Tiempo) */}
              <View style={styles.postHeader}>
                <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
                <View style={styles.postHeaderText}>
                  <Text style={styles.postUser}>{post.user}</Text>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#8892B0" />
                </TouchableOpacity>
              </View>

              {/* Contenido del Post */}
              <Text style={styles.postContent}>{post.content}</Text>
              
              {/* Imagen opcional del post */}
              {post.image && (
                <Image source={{ uri: post.image }} style={styles.postImage} />
              )}

              {/* Botones de acción (Likes, Comentarios, Guardar) */}
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart-outline" size={22} color="#8892B0" />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={20} color="#8892B0" />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} /> {/* Espaciador flexible para empujar el botón de guardar a la derecha */}
                <TouchableOpacity style={styles.actionButtonRight}>
                  <Ionicons name="bookmark-outline" size={20} color="#8892B0" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {/* Espacio extra al final para que la barra inferior no tape el último post */}
          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      {/* BARRA INFERIOR DE NAVEGACIÓN */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#00B4D8" />
          <Text style={[styles.navText, { color: '#00B4D8' }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubbles-outline" size={24} color="#8892B0" />
          <Text style={styles.navText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#8892B0" />
          <Text style={styles.navText}>Notifs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#8892B0" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F', // Azul oscuro (fondo principal)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#112240', // Azul un poco más claro
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A68',
  },
  headerLogo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00B4D8', // Celeste UTP
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30', // Rojo de notificación
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#00B4D8',
  },
  mainScroll: {
    flex: 1,
  },
  groupsSection: {
    paddingVertical: 15,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  groupsScroll: {
    paddingHorizontal: 15,
  },
  groupCard: {
    backgroundColor: '#112240',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#1E3A68',
  },
  groupText: {
    color: '#00B4D8',
    fontWeight: '600',
    fontSize: 14,
  },
  feedSection: {
    paddingHorizontal: 15,
  },
  postContainer: {
    backgroundColor: '#112240',
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#00B4D8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  postHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  postUser: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postTime: {
    color: '#8892B0', // Gris azulado
    fontSize: 12,
    marginTop: 2,
  },
  postContent: {
    color: '#CCD6F6', // Blanco hueso/celeste claro
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E3A68',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  actionButtonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#8892B0',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#112240',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E3A68',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#8892B0',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
