import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { auth, ikam } from "@/firebase/config-ikam";
import ListaPymes from "@/components/pymes";

interface Pyme {
  id: string;
  [key: string]: any;
}

export default function App() {
  const [pymeSeleccionada, setPymeSeleccionada] = useState<null | Pyme>(null);
  const [vistaDetalles, setVistaDetalles] = useState<boolean>(false);
  const [pymesLikes, setPymesLikes] = useState<string[]>([]);
  const [pymesQ, setPymesQ] = useState<Pyme[]>([]);
  const [pymes, setPymes] = useState<Pyme[]>([]);

  useEffect(() => {
    fetchPymes();
    const unsubscribeLikes = fetchPymesLikes();

    return () => {
      if (unsubscribeLikes) {
        unsubscribeLikes();
      }
    };
  }, []);

  useEffect(() => {
    if (pymes.length > 0 && pymesLikes.length > 0) {
      const likedPymes = pymes.filter((pyme) => pymesLikes.includes(pyme.id));
      setPymesQ(likedPymes);
    } else {
      setPymesQ([]);
    }
  }, [pymes, pymesLikes]);

  const fetchPymes = async () => {
    try {
      const querySnapshot = await getDocs(collection(ikam, "pyme"));
      const pymesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pyme[];
      setPymes(pymesArray);
    } catch (error) {
      console.error("Error fetching pymes:", error);
    }
  };

  const fetchPymesLikes = () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const likesCollection = collection(ikam, "likes");
      const unsubscribe = onSnapshot(likesCollection, (querySnapshot) => {
        const pymesLikesArray = querySnapshot.docs
          .filter((doc) => doc.data().userId === user.uid)
          .map((doc) => doc.data().pymeId);

        setPymesLikes(pymesLikesArray);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <Text style={styles.favoritesTitle}>Favoritos</Text>
      {pymesQ.length > 0 ? (
        <FlatList
          data={pymesQ}
          renderItem={({ item }) => <ListaPymes pyme={item} />}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.noFavoritesContainer}>
          <Text style={styles.noFavoritesText}>¡No tienes favoritos!</Text>
          <Text style={styles.noFavoritesText}>Añade algunos</Text>
          <Image
            source={require("@/assets/img/abuNotFound.png")}
            style={styles.noFavoritesImage}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  favoritesTitle: {
    marginVertical: 15,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
  },
  noFavoritesContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  noFavoritesImage: {
    width: 300,
    height: 300,
    marginTop: 15,
  },
  noFavoritesText: {
    color: "#888",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 15,
  },
});
