import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const GetPushNotificationToken = async () => {
  let token;

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Token de notificación:", token);

  // Opciones adicionales para Android
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

export default GetPushNotificationToken;
