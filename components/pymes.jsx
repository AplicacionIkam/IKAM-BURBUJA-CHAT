import { Link } from "expo-router";
import React, { useState } from "react";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const { width: viewportWidth } = Dimensions.get("window");

const ListaPymes = ({ pyme }) => {
  {
    /* Esto es para asegurar que se recibe un solo pyme */
  }
  const [loadingImage, setLoadingImage] = useState({});

  return (
    <Link
      asChild
      href={{
        pathname: "/pyme/[pymeId]",
        params: { pymeId: pyme.id },
      }}
    >
      <TouchableOpacity style={styles.card}>
        <View style={styles.imageContainer}>
          {loadingImage[pyme.id] && (
            <ActivityIndicator
              size="large"
              color="#CC0000"
              style={styles.loadingIndicator}
            />
          )}
          <Image
            source={{ uri: pyme.imagen1 }}
            style={styles.cardImage}
            onLoadStart={() =>
              setLoadingImage((prevState) => ({
                ...prevState,
                [pyme.id]: true,
              }))
            }
            onLoadEnd={() =>
              setLoadingImage((prevState) => ({
                ...prevState,
                [pyme.id]: false,
              }))
            }
          />
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>{pyme.nombre_pyme}</Text>
          <Text style={styles.cardSubtitle}>{pyme.direccion}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 33,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: viewportWidth * 0.9,
    marginVertical: 10,
    alignSelf: "center",
  },
  imageContainer: {
    width: viewportWidth * 0.9,
    height: 250,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 10,
    resizeMode: "stretch",
  },
  cardDetails: {
    flex: 1,
    padding: 15,
  },
  cardTitle: {
    textAlign: "center",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardSubtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  loadingIndicator: {
    position: "absolute",
  },
});

export default ListaPymes;
