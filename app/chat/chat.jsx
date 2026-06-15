// app/chat/chat.jsx — adaptado para iPhone 14 Pro Max y Android Samsung A72
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomNav } from "../../hooks/useBottomNav";
import styles from "./csschat";

const IP_PC = "192.168.1.5"; // ← cambia por tu IP
const WS_URL = `ws://${IP_PC}:3000`;
const API_URL = `http://${IP_PC}:3000`;

const InitialAvatar = ({ nombre, sizeStyle, textStyle }) => (
  <View style={[styles.initialAvatarContainer, sizeStyle]}>
    <Text style={[styles.initialAvatarText, textStyle]}>
      {nombre ? nombre.charAt(0).toUpperCase() : "?"}
    </Text>
  </View>
);

export default function Chat({ isTab = false, onGoToTab }) {
  const router = useRouter();
  const { paddingBottom } = useBottomNav();
  const wsRef = useRef(null);
  const flatListRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("Yo");
  const [textoMensaje, setTextoMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [conectado, setConectado] = useState(false);

  const contactos = [
    { id: 1, nombre: "TzNakroth", estado: "En línea", tipo: "amigo" },
    { id: 2, nombre: "CodeMaster", estado: "En línea", tipo: "amigo" },
    { id: 3, nombre: "MichiUTP", estado: "En línea", tipo: "amigo" },
    { id: 4, nombre: "SofiDev", estado: "Ausente", tipo: "amigo" },
    { id: 5, nombre: "General UTP+", estado: "3", tipo: "grupo" },
    { id: 6, nombre: "Ing. Sistemas", estado: "12", tipo: "grupo" },
    { id: 7, nombre: "Gamers UTP", estado: "8", tipo: "grupo" },
    { id: 8, nombre: "Memes UTP", estado: "15", tipo: "grupo" },
  ];

  const [chatSeleccionado, setChatSeleccionado] = useState(contactos[0]);

  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      if (id) setUserId(id);
    });
    AsyncStorage.getItem("nombre_usuario").then((n) => {
      if (n) setNombreUsuario(n);
    });
  }, []);

  useEffect(() => {
    conectarWebSocket(chatSeleccionado.id);
    cargarHistorial(chatSeleccionado.id);
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [chatSeleccionado.id]);

  const conectarWebSocket = (chatId) => {
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      setConectado(true);
      ws.send(JSON.stringify({ tipo: "unirse", chatId: `chat_${chatId}` }));
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.tipo === "nuevo_mensaje") {
          setMensajes((prev) => [
            ...prev,
            {
              id: data.id_mensaje || Date.now(),
              texto: data.contenido,
              hora: new Date(data.fecha_envio).toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              mio: false,
              remitente: data.nombre_usuario,
            },
          ]);
          setTimeout(
            () => flatListRef.current?.scrollToEnd({ animated: true }),
            100,
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    ws.onerror = () => setConectado(false);
    ws.onclose = () => setConectado(false);
    wsRef.current = ws;
  };

  const cargarHistorial = async (chatId) => {
    try {
      const res = await fetch(`${API_URL}/api/mensajes/${chatId}`);
      const data = await res.json();
      if (data.success) {
        setMensajes(
          data.mensajes.map((m) => ({
            id: m.id_mensaje,
            texto: m.contenido,
            hora: new Date(m.fecha_envio).toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            mio: String(m.id_usuario) === String(userId),
            remitente: m.nombre_usuario,
          })),
        );
      }
    } catch {
      // Sin backend, mensajes de ejemplo
      setMensajes([
        {
          id: 1,
          texto: "Hola bro!",
          hora: "10:00 a. m.",
          mio: false,
          remitente: chatSeleccionado.nombre,
        },
        {
          id: 2,
          texto: "Qué onda, ¿todo bien?",
          hora: "10:01 a. m.",
          mio: true,
          remitente: "Yo",
        },
        {
          id: 3,
          texto: "Sí, aquí dándole al código",
          hora: "10:02 a. m.",
          mio: false,
          remitente: chatSeleccionado.nombre,
        },
      ]);
    }
  };

  const enviarMensaje = () => {
    const texto = textoMensaje.trim();
    if (!texto) return;
    const msgLocal = {
      id: Date.now(),
      texto,
      hora: new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mio: true,
      remitente: nombreUsuario,
    };
    setMensajes((prev) => [...prev, msgLocal]);
    setTextoMensaje("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          tipo: "mensaje",
          chatId: `chat_${chatSeleccionado.id}`,
          id_usuario: userId || "999",
          nombre_usuario: nombreUsuario,
          contenido: texto,
          tipo_chat: chatSeleccionado.tipo === "grupo" ? "grupo" : "privado",
        }),
      );
    }
  };

  const amigos = contactos.filter((c) => c.tipo === "amigo");
  const grupos = contactos.filter((c) => c.tipo === "grupo");

  // ─── paddingBottom dinámico según dispositivo ───────────────
  const navPaddingBottom = isTab ? 0 : paddingBottom;

  return (
    // edges={["top"]} para que solo proteja arriba
    // el bottom lo manejamos con insets manualmente
    <SafeAreaView style={[styles.container, { paddingBottom: navPaddingBottom }]} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (isTab && onGoToTab) {
            onGoToTab(0);
          } else {
            router.push("/inicio/inicio");
          }
        }}>
          <Text style={styles.logo}>
            UTP+ <Text style={styles.logoBlanco}>Movil</Text>
          </Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: conectado ? "#30D158" : "#555",
              marginRight: 4,
            }}
          />
          <Ionicons name="search-outline" size={26} color="white" />
          <Ionicons name="add-circle-outline" size={27} color="white" />
        </View>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        {/* SIDEBAR */}
        <View style={styles.sidebar}>
          <FlatList
            data={[
              { tipo: "titulo", label: "AMIGOS" },
              ...amigos.map((a) => ({ tipo: "amigo", ...a })),
              { tipo: "titulo", label: "GRUPOS" },
              ...grupos.map((g) => ({ tipo: "grupo_item", ...g })),
            ]}
            keyExtractor={(item, i) => item.id?.toString() || `t${i}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.tipo === "titulo") {
                return <Text style={styles.sectionTitle}>{item.label}</Text>;
              }
              return (
                <TouchableOpacity
                  style={[
                    styles.contactItem,
                    chatSeleccionado.id === item.id && styles.contactActive,
                  ]}
                  onPress={() => {
                    setChatSeleccionado(item);
                    setMensajes([]);
                  }}
                >
                  <View style={{ position: "relative" }}>
                    <InitialAvatar nombre={item.nombre} />
                    {item.tipo === "amigo" && (
                      <View
                        style={[
                          styles.statusDot,
                          item.estado === "Ausente" && styles.statusAway,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName} numberOfLines={1}>
                      {item.nombre}
                    </Text>
                    <Text style={styles.contactStatus}>
                      {item.tipo === "amigo"
                        ? `• ${item.estado}`
                        : "Servidor UTP+"}
                    </Text>
                  </View>
                  {item.tipo === "grupo_item" && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.estado}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* PANEL CHAT */}
        <View style={styles.chatPanel}>
          <View style={styles.chatHeader}>
            <InitialAvatar
              nombre={chatSeleccionado.nombre}
              sizeStyle={styles.initialAvatarHeader}
              textStyle={styles.initialAvatarHeaderText}
            />
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatName}>{chatSeleccionado.nombre}</Text>
              <Text style={styles.chatStatus}>
                {conectado
                  ? "🟢 En línea"
                  : chatSeleccionado.tipo === "grupo"
                    ? "Servidor UTP+"
                    : chatSeleccionado.estado}
              </Text>
            </View>
            <Ionicons
              name="information-circle-outline"
              size={26}
              color="white"
            />
          </View>

          <FlatList
            ref={flatListRef}
            data={mensajes}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messages}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            ListHeaderComponent={
              <View style={styles.dayBox}>
                <Text style={styles.dayText}>Hoy</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageRow,
                  item.mio ? styles.messageRight : styles.messageLeft,
                ]}
              >
                {!item.mio && (
                  <InitialAvatar
                    nombre={item.remitente || chatSeleccionado.nombre}
                    sizeStyle={styles.initialAvatarMessage}
                    textStyle={styles.initialAvatarMessageText}
                  />
                )}
                <View
                  style={[
                    styles.bubble,
                    item.mio ? styles.myBubble : styles.otherBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{item.texto}</Text>
                  <Text style={styles.messageTime}>
                    {item.hora} {item.mio ? "✓✓" : ""}
                  </Text>
                </View>
              </View>
            )}
          />

          <View style={styles.inputArea}>
            <TouchableOpacity style={styles.circleButton}>
              <Ionicons name="add-outline" size={24} color="#E60023" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#8A8A8A"
              value={textoMensaje}
              onChangeText={setTextoMensaje}
              onSubmitEditing={enviarMensaje}
              returnKeyType="send"
            />
            <Ionicons name="happy-outline" size={24} color="#B8B8B8" />
            <TouchableOpacity onPress={enviarMensaje} style={{ marginLeft: 8 }}>
              <Ionicons name="send" size={22} color="#E60023" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* BOTTOM NAV — padding dinámico por dispositivo */}
      {!isTab && (
        <View style={[styles.bottomNav, { paddingBottom: navPaddingBottom }]}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/inicio/inicio")}
          >
            <Ionicons name="home-outline" size={26} color="#888" />
            <Text style={styles.navText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="chatbubble" size={26} color="#E60023" />
            <Text style={[styles.navText, styles.navTextActive]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/notificacion/notificaciones")}
          >
            <View style={{ position: "relative" }}>
              <Ionicons name="notifications-outline" size={26} color="#888" />
              <View style={styles.smallBadge}>
                <Text style={styles.smallBadgeText}>3</Text>
              </View>
            </View>
            <Text style={styles.navText}>Notificaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/perfil/perfil")}
          >
            <Ionicons name="person-outline" size={26} color="#888" />
            <Text style={styles.navText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
