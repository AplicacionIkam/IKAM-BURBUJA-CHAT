import React, { useState, useEffect, type ComponentProps } from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import {
  obtenerChatsEnTiempoReal,
  verificarSiEsPyme,
} from "@/services/services";
import { auth } from "@/firebase/config-ikam";
import colorsIkam from "@/assets/estilos";

type IoniconsName = ComponentProps<typeof TabBarIcon>["name"];

const createTabBarIcon =
  (
    focusedName: IoniconsName,
    unfocusedName: IoniconsName,
    unreadCount?: number
  ) =>
  ({ color, focused }: { color: string; focused: boolean }) =>
    (
      <View style={{ position: "relative" }}>
        <TabBarIcon
          name={focused ? focusedName : unfocusedName}
          color={color}
          size={25}
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

  useEffect(() => {
    const obtenerMensajesNoLeidos = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No hay usuario autenticado");
        return;
      }

      const userId = user.uid;

      const unsubscribe = await obtenerChatsEnTiempoReal(
        userId,
        (unreadMessages) => {
          setUnreadMessages(unreadMessages);
        }
      );

      return unsubscribe;
    };

    const unsubscribePromise = obtenerMensajesNoLeidos();

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (unsubscribe && typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#222C57",
          height: 57,
        },
        tabBarLabelStyle: {
          marginTop: 3,
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
          tabBarIcon: createTabBarIcon(
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
    fontSize: 9,
    fontWeight: "bold",
  },
});
