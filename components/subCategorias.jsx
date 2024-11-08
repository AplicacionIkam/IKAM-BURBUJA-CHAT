import { FontAwesome5 } from "@expo/vector-icons";
import CustomIcon from "@/components/CustomIcon";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import {} from "react";

export default ListaCategorias = ({
  subCategorias,
  subCategoriaSeleccionada,
  setSubCategoriaSeleccionada,
  setSubCategoriaBuscarPyme
}) => {


  const renderizarItemCategoria = ({ item }) => {
    if (item.nombre != null) {
      return (
        <TouchableOpacity
          style={[
            estilos.categoria,
            subCategoriaSeleccionada === item.id && estilos.categoriaSeleccionada,
          ]}
          onPress={() => {            
            setSubCategoriaSeleccionada(item.id);               
            setSubCategoriaBuscarPyme(item.nombre)
          }}
        >
          <CustomIcon
            type={item.libreria}
            name={item.icono}
            size={24}
            color={subCategoriaSeleccionada === item.id ? "#C61919" : "#888"}
          />
          <Text
            style={[
              estilos.textoCategoria,
              subCategoriaSeleccionada === item.id &&
                estilos.textoCategoriaSeleccionada,
            ]}
          >
            {item.nombre}
          </Text>
        </TouchableOpacity>
      );
    }
  };
  return (
    <View style={estilos.listaCategorias}>
      <FontAwesome5
        name="angle-left"
        size={25}
        color="#C61919"
        style={estilos.iconoCategoria}
        onPress={() => {}}
      />
      <FlatList
        data={subCategorias}
        renderItem={renderizarItemCategoria}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={}
      />
      <FontAwesome5
        name="angle-right"
        size={25}
        color="#C61919"
        style={estilos.iconoCategoria}
        onPress={() => {
          console.log("HOla perro");
        }}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  iconoCategoria: {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  contenedorCategorias: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listaCategorias: {
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  categoria: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 15,
    width: 70,
    height: 70,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  textoCategoria: {
    marginTop: 8,
    color: "#888",
    fontSize: 8,
  },
  categoriaSeleccionada: {
    backgroundColor: "#EEE",
  },
  textoCategoriaSeleccionada: {
    color: "#C61919",
  },
});
