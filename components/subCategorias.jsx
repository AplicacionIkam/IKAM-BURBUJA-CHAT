import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomIcon from "@/components/CustomIcon";

const ListaCategorias = ({
  subCategorias,
  subCategoriaSeleccionada,
  setSubCategoriaSeleccionada,
  setSubCategoriaBuscarPyme,
}) => {
  const renderizarItemCategoria = ({ item }) => {
    if (item.nombre != null) {
      const isSelected = subCategoriaSeleccionada === item.id;

      return (
        <TouchableOpacity
          style={[
            styles.categoryButton,
            isSelected && styles.activeCategoryButton,
          ]}
          onPress={() => {
            setSubCategoriaSeleccionada(item.id);
            setSubCategoriaBuscarPyme(item.nombre);
          }}
        >
          <CustomIcon
            type={item.libreria}
            name={item.icono}
            size={24}
            color={isSelected ? "#C61919" : "#888"}
          />
          <Text
            style={[
              styles.categoryLabel,
              isSelected && styles.activeCategoryLabel,
            ]}
          >
            {item.nombre}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={styles.categoryContainer}>
      <FontAwesome5
        name="angle-left"
        size={25}
        color="#C61919"
        style={styles.navigationIcon}
        onPress={() => {}}
      />
      <FlatList
        data={subCategorias}
        renderItem={renderizarItemCategoria}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <FontAwesome5
        name="angle-right"
        size={25}
        color="#C61919"
        style={styles.navigationIcon}
        onPress={() => {}}
      />
    </View>
  );
};

export default ListaCategorias;

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 5,
  },
  navigationIcon: {
    marginHorizontal: 10,
    marginVertical: 33,
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 15,
    width: 73,
    height: 73,
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  activeCategoryButton: {
    backgroundColor: "#EEE",
  },
  categoryLabel: {
    marginTop: 8,
    color: "#888",
    fontSize: 8,
  },
  activeCategoryLabel: {
    color: "#C61919",
  },
});
