import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import colorsIkam from "@/assets/estilos";
import { actualizarUnreadCount } from "@/services/services";

const Chatlist = ({ users, user }) => {
  const openChat = (item: any) => {
    router.push({ pathname: "/chat/chat", params: item });

    if (item.user !== user) {
      actualizarUnreadCount(item.id, 0); // Solo reseteará el contador si el receptor abre el chat
    }
  };

  const ChatItem = (item: any) => {
    return (
      <View>
        <TouchableOpacity
          style={estilos.touchable}
          onPress={() => openChat(item)}
        >
          {item.img ? (
            <View>
              <Image source={{ uri: item.img }} style={estilos.tarjetaImg} />
            </View>
          ) : (
            <View style={estilos.circle}>
              <Text style={estilos.text}>{item.nombre[0]}</Text>
            </View>
          )}

          <View style={estilos.textContainer}>
            <View style={estilos.headerContainer}>
              <Text style={estilos.nameText}>{item.nombre}</Text>
            </View>
            {item.user == user ? (
              <View>
                <Text style={estilos.messageText}>
                  Tu: {item.ultimoMensaje}
                </Text>
              </View>
            ) : (
              <Text style={estilos.messageTextOtros}>{item.ultimoMensaje}</Text>
            )}
            <Text style={estilos.timeText}>
              {item.hora
                ? new Date(item.hora.seconds * 1000).toLocaleDateString([], {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }) +
                  " " +
                  new Date(item.hora.seconds * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Text>
          </View>
          {item.user !== user && item.unreadCount > 0 && (
            <View style={estilos.badge}>
              <Text style={estilos.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const chatsFiltrados = users.filter((user: any) => user.ultimoMensaje);

  const chatsOrdenados = chatsFiltrados.sort(
    (a: any, b: any) =>
      new Date(b.hora.seconds * 1000).getTime() -
      new Date(a.hora.seconds * 1000).getTime()
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chatsOrdenados} // Usa el array filtrado aquí
        contentContainerStyle={{ paddingVertical: 6 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => ChatItem(item)} // Asegúrate de pasar el item
        keyExtractor={(item) => item.id.toString()} // Usa un id único
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  touchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },
  tarjetaImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colorsIkam.azul.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameText: {
    fontWeight: "bold",
  },
  timeText: {
    color: "#888",
    textAlign: "right",
  },
  messageText: {
    color: "#555",
  },
  messageTextOtros: {
    color: colorsIkam.azulTex.color,
  },
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

export default Chatlist;
