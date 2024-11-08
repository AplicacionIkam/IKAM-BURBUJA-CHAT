import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { Stack } from 'expo-router';
import colorsIkam from "@/assets/estilos";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, ikam } from '@/firebase/config-ikam';
// import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/FontAwesome5";

// Cambiar el valor por defecto a una cadena vacía para que no se muestre una imagen predeterminada
const defaultProfileImage = '';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState(defaultProfileImage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageUri, setImageUri] = useState('');

  const [initialData, setInitialData] = useState({
    name: '',
    lastName: '',
    age: '',
    email: '',
    photoUrl: defaultProfileImage
  });

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(ikam, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          // console.log('User data:', data);
          const fetchedData = {
            name: data.display_name || '',
            lastName: data.last_name || '',
            age: data.age || '',
            email: data.email || '',
            photoUrl: data.photo_url || defaultProfileImage
          };
          setName(fetchedData.name);
          setLastName(fetchedData.lastName);
          setAge(fetchedData.age);
          setEmail(fetchedData.email);
          setPhotoUrl(fetchedData.photoUrl);
          setImageUri(fetchedData.photoUrl); // Mostrar la foto del usuario si existe
          setInitialData(fetchedData); 
        } else {
          // console.log('No such document!');
          setError('No se encontró el documento del usuario.');
        }
      } else {
        // console.log('No user is signed in.');
        setError('No hay un usuario autenticado.');
      }
    } catch (err) {
      // console.error('Error fetching user data:', err);
      setError('Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  // // Función para manejar la selección de imagen
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImageUri(result.uri); // Actualiza el URI de la imagen seleccionada
  //     setPhotoUrl(result.uri); // Actualiza el URL de la imagen para el almacenamiento local
  //   }
  // };


  const handleUpdate = async () => {
    Alert.alert(
      "Confirmar cambios",
      "¿Estás seguro de que deseas guardar los cambios?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                const userRef = doc(ikam, 'users', user.uid);
                const updates = {};

                if (name !== initialData.name) updates.display_name = name || '';
                if (lastName !== initialData.lastName) updates.last_name = lastName || '';
                if (age !== initialData.age) updates.age = age || '';
                if (photoUrl !== initialData.photoUrl) updates.photo_url = photoUrl || defaultProfileImage;

                if (Object.keys(updates).length > 0) {
                  await updateDoc(userRef, updates);
                  Alert.alert('Información actualizada', 'La información del usuario ha sido actualizada correctamente.');
                } else {
                  Alert.alert('Sin cambios', 'No se detectaron cambios en los datos.');
                }
              }
            } catch (err) {
              console.error('Error updating user data:', err);
              Alert.alert('Error', 'Hubo un problema al actualizar la información del usuario.');
            }
          }
        }
      ]
    );
  };

  const hasChanges = () => {
    return (
      name !== initialData.name ||
      lastName !== initialData.lastName ||
      age !== initialData.age ||
      photoUrl !== initialData.photoUrl
    );
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: colorsIkam.rojo.backgroundColor },
          headerTitle: "Datos de la cuenta",
          headerTitleAlign: 'center',
          headerTintColor: "white",
          headerShown: true,
        }}
      />
      <View style={styles.profileContainer}>
        {/* <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        </TouchableOpacity> */}
        <Text style={styles.header}>Perfil del Usuario</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Apellido:</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        {/* <View style={styles.formGroup}>
          <Text style={styles.label}>Edad:</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View> */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo Electrónico:</Text>
          <View style={styles.emailContainer}>
            <Text style={styles.emailText}>{email}</Text>
            <Icon name="lock" size={20} color="gray" style={styles.lockIcon} />
          </View>
        </View>
        {hasChanges() && (
          <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
            <Text style={styles.btnText}>Actualizar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
    backgroundColor: '#f9f9f9',
  },
  emailText: {
    flex: 1,
    color: '#888',
  },
  lockIcon: {
    marginLeft: 10,
  },
  btn: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: "#222C57",
    borderColor: "#222C57",
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default UserProfile;