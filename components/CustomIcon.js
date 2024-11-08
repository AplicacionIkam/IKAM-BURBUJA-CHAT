// CustomIcon.js
import React from 'react';
import { AntDesign, Entypo, EvilIcons, Feather, FontAwesome, FontAwesome6, FontAwesome5, Fontisto, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons, SimpleLineIcons, Zocial } from '@expo/vector-icons';

// Mapa de bibliotecas de íconos
const iconLibraries = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

const CustomIcon = ({ type, name, size, color }) => {
  // Si el tipo especificado existe en el mapa, utiliza esa biblioteca para el ícono
  const IconLibrary = iconLibraries[type];
  if (!IconLibrary) {
    console.warn(`La biblioteca de íconos "${type}" no existe.`);
    return null;
  }
  
  return <IconLibrary name={name} size={size} color={color} />;
};

export default CustomIcon;
