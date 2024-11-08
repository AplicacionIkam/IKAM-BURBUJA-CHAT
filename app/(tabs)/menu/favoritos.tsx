import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { auth, ikam } from "@/firebase/config-ikam";
import ListaPymes from "@/components/pymes";

interface Pyme {
  id: string;
  [key: string]: any; // Permite propiedades adicionales
}

export default function App() {
  const [pymeSeleccionada, setPymeSeleccionada] = useState<null | Pyme>(null);
  const [vistaDetalles, setVistaDetalles] = useState<boolean>(false);
  const [pymesLikes, setPymesLikes] = useState<string[]>([]); // Arreglo de IDs de pymes que les gustan
  const [pymesQ, setPymesQ] = useState<Pyme[]>([]); // Arreglo de pymes filtradas
  const [pymes, setPymes] = useState<Pyme[]>([]); // Arreglo de pymes obtenidas de Firestore

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
      setPymesQ([]); // Resetear si no hay pymes o likes
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
      if (!user) return; // Asegurarse de que el usuario esté autenticado

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
      <Text style={styles.favoritesText}>Favoritos</Text>
      <ScrollView>
        {pymesQ.length > 0 ? (
          <View style={styles.pymesContainer}>
            <ListaPymes
              setPymeSeleccionada={setPymeSeleccionada}
              pymesQ={pymesQ}
              setVistaDetalles={setVistaDetalles}
            />
          </View>
        ) : (
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>¡No tienes favoritos!</Text>
            <Text style={styles.notFoundText}>Añade algunos</Text>
            <Image
              source={require("@/assets/img/abuNotFound.png")}
              style={styles.notfoundImg}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  favoritesText: {
    marginVertical: 15,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
  },
  pymesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  notFoundContainer: {
    flex: 1,
    paddingTop: 25,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  notfoundImg: {
    width: 300,
    height: 300,
    marginTop: 15,
  },
  notFoundText: {
    color: "#888",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 15,
  },
});
