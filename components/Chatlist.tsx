import React, { useEffect, useState, memo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import colorsIkam from "@/assets/estilos";
import { verificarSiEsPyme, actualizarUnreadCount } from "@/services/services";

const Chatlist = ({ users, user }: any) => {
  const [isPyme, setIsPyme] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await verificarSiEsPyme(user);
      setIsPyme(result);
    };
    fetchData();
  }, [user]);

  const openChat = (item: any) => {
    router.push({ pathname: "/chat/chat", params: item });

    var tipo = isPyme ? "unreadCountPyme" : "unreadCountUser";
    if (user === item.idUser) {
      tipo = "unreadCountUser";
      actualizarUnreadCount(item.id, tipo, 0);
    }

    if (item.user !== user) {
      actualizarUnreadCount(item.id, tipo, 0);
    }
  };

  const formatDate = (timestamp: any) => {
    return timestamp
      ? new Date(timestamp.seconds * 1000).toLocaleDateString([], {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
          " " +
          new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
      : "";
  };

  const chatsOrdenados = users
    .filter(
      (user: any) => user.ultimoMensaje && user.hora?.seconds !== undefined
    )
    .sort((a: any, b: any) => {
      const timeA = a.hora.seconds * 1000;
      const timeB = b.hora.seconds * 1000;
      return timeB - timeA;
    });

  return (
    <FlatList
      data={chatsOrdenados}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <ChatItem
          item={item}
          user={user}
          isPyme={isPyme}
          openChat={openChat}
          formatDate={formatDate}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const ChatItem = memo(({ item, user, isPyme, openChat, formatDate }: any) => {
  return (
    <TouchableOpacity
      style={styles.chatItemTouchable}
      onPress={() => openChat(item)}
    >
      {item.img ? (
        <Image source={{ uri: item.img }} style={styles.profileImage} />
      ) : (
        <View style={styles.initialCircle}>
          <Text style={styles.initialText}>{item.nombre[0]}</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.nameText}>{item.nombre}</Text>
        </View>
        <Text
          style={
            item.user === user ? styles.messageText : styles.messageTextOthers
          }
        >
          {item.user === user
            ? `Tú: ${item.ultimoMensaje}`
            : item.ultimoMensaje}
        </Text>
        <Text style={styles.timeText}>{formatDate(item.hora)}</Text>
      </View>
      {user === item.idUser && item.unreadCountUser > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unreadCountUser}</Text>
        </View>
      )}

      {user !== item.idUser &&
        (isPyme ? item.unreadCountPyme : item.unreadCountUser) > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {isPyme ? item.unreadCountPyme : item.unreadCountUser}
            </Text>
          </View>
        )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 7,
  },
  chatItemTouchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  initialCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colorsIkam.azul.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
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
  messageTextOthers: {
    color: colorsIkam.azulTex.color,
  },
  unreadBadge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
});

export default Chatlist;
