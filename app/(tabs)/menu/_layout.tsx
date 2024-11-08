import React, { type ComponentProps, useState, useEffect } from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import colorsIkam from "@/assets/estilos";
import {
  obtenerChatsEnTiempoReal,
  verificarSiEsPyme,
} from "@/services/services"; // Nueva función de servicio
import { auth } from "@/firebase/config-ikam";

// Extraemos el tipo para el nombre de los íconos válidos
type IoniconsName = ComponentProps<typeof TabBarIcon>["name"];

const createTabBarIcon =
  (focusedName: IoniconsName, unfocusedName: IoniconsName) =>
  ({ color, focused }: { color: string; focused: boolean }) =>
    <TabBarIcon name={focused ? focusedName : unfocusedName} color={color} />;

const createTabBarIconWithBadge =
  (
    focusedName: IoniconsName,
    unfocusedName: IoniconsName,
    unreadCount: number
  ) =>
  ({ color, focused }: { color: string; focused: boolean }) =>
    (
      <View style={{ position: "relative" }}>
        <TabBarIcon
          name={focused ? focusedName : unfocusedName}
          color={color}
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    );

export default function TabLayout() {
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Función para obtener y sumar los mensajes no leídos de todos los chats
  useEffect(() => {
    const obtenerMensajesNoLeidos = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No hay usuario autenticado");
        return;
      }
  
      let userId = user.uid;
      const isPyme = await verificarSiEsPyme(userId);
      const tipo = isPyme ? "idPyme" : "idUser"; // Determinamos el tipo de usuario
  
      // Si es una pyme, usamos el idPyme, de lo contrario usamos el idUser
      const currentUserId = isPyme ? isPyme : userId; // Si es pyme o cliente, usar el idUser adecuado
  
      // Usamos obtenerTodosLosChats con el callback correcto
      const unsubscribe = obtenerChatsEnTiempoReal(
        currentUserId,
        tipo,
        (chats) => {
          let totalMensajesNoLeidos = 0;
  
          // Calculamos los mensajes no leídos dependiendo del tipo de usuario
          chats.forEach((chat) => {
            if (isPyme) {
              // Si es una pyme, contamos los mensajes no leídos de los clientes
              if (chat.idUser !== userId) {
                totalMensajesNoLeidos += chat.unreadCount || 0;
              }
            } else {
              // Si es un cliente, contamos los mensajes no leídos de las pymes
              if (chat.idPyme === userId) {
                totalMensajesNoLeidos += chat.unreadCount || 0;
              }
            }
          });
  
          // Establecemos el número total de mensajes no leídos
          setUnreadMessages(totalMensajesNoLeidos);
        }
      );
  
      return unsubscribe; // Asegúrate de que se devuelve la función de limpieza
    };
  
    // Ejecutamos la función
    const unsubscribe = obtenerMensajesNoLeidos();
  
    // Limpiar la suscripción al desmontar el componente
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe(); // Cancelamos la suscripción si es una función
      }
    };
  }, []); // Aquí puedes agregar dependencias, como el ID del usuario  

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#222C57",
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#FFFFFF",
        headerShown: true,
        headerStyle: { backgroundColor: colorsIkam.rojo.backgroundColor },
        headerTitleAlign: "center",
        headerTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: createTabBarIcon("home", "home-outline"),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          tabBarIcon: createTabBarIcon("heart", "heart-outline"),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: createTabBarIconWithBadge(
            "chatbubble-ellipses",
            "chatbubble-outline",
            unreadMessages
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: createTabBarIcon("person", "person-outline"),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
