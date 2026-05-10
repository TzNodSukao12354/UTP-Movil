import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';

export default function LoginScreen() {
  const router = useRouter();
  const [showWebView, setShowWebView] = useState(false);
  
  const loginUrl = "https://sso.utp.edu.pe/auth/realms/Xpedition/protocol/openid-connect/auth?client_id=pao-web&redirect_uri=https%3A%2F%2Fclass.utp.edu.pe%2F&state=9d029327-5685-48ce-8d26-8de0929efb81&response_mode=fragment&response_type=code&scope=openid&nonce=a2b937af-d616-464b-8ad2-928087a7a077";

  const handleLogin = () => {
    // Abrimos el WebView interno
    setShowWebView(true);
  };

  const handleNavigationStateChange = (navState) => {
    // Detectamos si la URL contiene "class.utp.edu.pe/student" lo cual indica que 
    // el login fue exitoso y el usuario está entrando al portal de estudiantes.
    if (navState.url.includes('class.utp.edu.pe/student')) {
      setShowWebView(false); // Cerramos el WebView
      router.replace('/inicio'); // Redirigimos automáticamente al Feed (/inicio)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* MODAL CON WEBVIEW PARA EL SSO */}
      <Modal visible={showWebView} animationType="slide" onRequestClose={() => setShowWebView(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0A192F' }}>
          <View style={styles.webviewHeader}>
            <TouchableOpacity onPress={() => setShowWebView(false)}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.webviewTitle}>Autenticación UTP</Text>
          </View>
          
          <WebView 
            source={{ uri: loginUrl }} 
            onNavigationStateChange={handleNavigationStateChange}
            style={{ flex: 1 }}
            startInLoadingState={true}
          />
        </SafeAreaView>
      </Modal>

      <View style={styles.content}>
        
        {/* Contenedor de la Imagen/Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Logo_UTP.png/600px-Logo_UTP.png' }} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Textos Principales */}
        <Text style={styles.title}>UTP+Movil</Text>
        <Text style={styles.subtitle}>Inicia sesión mediante</Text>

        {/* Botón Principal */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Ingresar mediante UTP+Class</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F', // Azul oscuro moderno
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF', // Fondo blanco para que el logo de la UTP resalte
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#00B4D8', // Sombra celeste
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#00B4D8', // Borde celeste
    overflow: 'hidden', // Asegura que la imagen no se salga de los bordes redondeados
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF', // Blanco
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 16,
    color: '#8892B0', // Azul grisáceo claro
    marginBottom: 60,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#00B4D8', // Celeste
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#00B4D8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  webviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#0A192F',
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A68',
  },
  closeButtonText: {
    color: '#00B4D8',
    fontSize: 16,
    fontWeight: '600',
  },
  webviewTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
  }
});
