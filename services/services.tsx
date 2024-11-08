import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
  updateDoc,
  increment,
} from "firebase/firestore";
import { ikam } from "@/firebase/config-ikam";
import { Pyme } from "@/models/Pyme";
import { Categoria } from "@/models/Categoria";
import { SubCategoria } from "@/models/SubCategoria";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/models/User";

interface Chat {
  id: string;
  unreadCount: number; // Asegúrate de que esta propiedad esté incluida
  // Agrega otras propiedades que puedan existir en tu objeto chat
}

export const suscribirseAPymes = (callback: (pymes: Pyme[]) => void) => {
  try {
    const unsubscribe = onSnapshot(
      collection(ikam, "pyme"),
      (querySnapshot) => {
        const pymesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pyme[];
        callback(pymesArray);
      }
    );

    return unsubscribe; // Devuelve la función de limpieza
  } catch (error) {
    console.error("Error suscribiéndose a las pymes:", error);
  }
};

export const suscribirseACategorias = (
  callback: (categorias: Categoria[]) => void
) => {
  try {
    // Se suscribe a la colección "categoria" y actualiza el estado cuando hay cambios
    const unsubscribe = onSnapshot(
      collection(ikam, "categoria"),
      (querySnapshot) => {
        const categoriasArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Categoria[];
        callback(categoriasArray);
      }
    );

    // Retorna la función de limpieza para cancelar la suscripción
    return unsubscribe;
  } catch (error) {
    console.error("Error suscribiéndose a las categorías:", error);
  }
};

export const suscribirseASubCategorias = (
  callback: (subcategorias: SubCategoria[]) => void
) => {
  try {
    const unsubscribe = onSnapshot(
      collection(ikam, "subCategoria"),
      (querySnapshot) => {
        const subcategoriasArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SubCategoria[];
        callback(subcategoriasArray);
      }
    );

    return unsubscribe; // Devuelve la función de limpieza para cancelar la suscripción
  } catch (error) {
    console.error("Error suscribiéndose a las subcategorías:", error);
  }
};

export const suscribirseAColonias = (callback: (colonias: any[]) => void) => {
  try {
    const unsubscribe = onSnapshot(
      collection(ikam, "colonia"),
      (querySnapshot) => {
        const coloniasArray = querySnapshot.docs.map((doc) => ({
          // id: `${doc.id}-${doc.data().nombreCol}`,
          label: doc.data().nombreCol,
          value: doc.data().nombreCol,
        }));
        callback(coloniasArray);
      }
    );

    return unsubscribe; // Devuelve la función de limpieza para cancelar la suscripción
  } catch (error) {
    console.error("Error suscribiéndose a las colonias:", error);
  }
};

export const obtenerDetallesPyme = async (pymeId: string) => {
  try {
    const docRef = doc(ikam, "pyme", pymeId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Pyme) : null;
  } catch (error) {
    console.error("Error obteniendo detalles de la pyme:", error);
    return null;
  }
};

export const getQuestions = async () => {
  try {
    const querySnapshot = await getDocs(collection(ikam, "preguntas"));
    const questions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export const subscribeToQuestions = (callback: any) => {
  try {
    const unsubscribe = onSnapshot(
      collection(ikam, "preguntas"),
      (querySnapshot) => {
        const questions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(questions);
      }
    );

    return unsubscribe; // Devuelve la función de desuscripción
  } catch (error) {
    console.error("Error subscribing to questions:", error);
    return () => {}; // Retorna una función vacía en caso de error
  }
};

export const preguntaDb = async (pregunta: any, correo: any) => {
  try {
    await addDoc(collection(ikam, "preguntas"), {
      correo: correo,
      pregunta: pregunta,
      created_time: Timestamp.now(),
    });
    //console.log("Documento agregado con éxito");
  } catch (error) {
    //console.error("Error al agregar el documento:", error);
  }
};

export const soporte = async (asunto: any, mensaje: any, correo: any) => {
  try {
    await addDoc(collection(ikam, "soporte"), {
      correo: correo,
      asunto: asunto,
      mensaje: mensaje,
      created_time: Timestamp.now(),
    });
    //console.log("Documento agregado con éxito");
  } catch (error) {
    //console.error("Error al agregar el documento:", error);
  }
};

export const listenToUserChanges = (userUID: any, setUserData: any) => {
  const userDocRef = doc(ikam, "users", userUID);

  // Escuchar los cambios en el documento del usuario
  const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      //console.log("Datos del usuario actualizados:", userData);

      // Combinar el `uid` con los datos obtenidos del documento
      const combinedUserData = {
        ...userData, // Datos de Firestore
        uid: userUID, // Añadir el UID del usuario
      };

      // Guardar los datos actualizados en AsyncStorage
      try {
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(combinedUserData)
        );
        //console.log("Datos del usuario guardados en AsyncStorage.");
      } catch (error) {
        console.error("Error al guardar los datos en AsyncStorage:", error);
      }

      // Actualizar el estado local con los datos actualizados
      setUserData(combinedUserData);
    } else {
      //console.log("El documento del usuario no existe.");
    }
  });

  // Retorna la función para cancelar la suscripción (desconectar la escucha)
  return unsubscribe;
};

export const verificarYCrearChat = async (
  chatId: string,
  userid: string,
  pymeid: string
) => {
  const chatDocRef = doc(ikam, "chat", chatId);
  const chatDoc = await getDoc(chatDocRef);
  if (!chatDoc.exists()) {
    await setDoc(chatDocRef, {
      creadoEn: new Date(),
      idPyme: pymeid,
      idUser: userid,
    });
  }
};

export const suscribirseAlChat = (
  chatId: string,
  callback: (mensajes: any[]) => void
) => {
  try {
    // Escuchar los mensajes de la subcolección `mensaje` en tiempo real
    const mensajesQuery = query(
      collection(ikam, "chat", chatId, "mensaje"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(mensajesQuery, (querySnapshot) => {
      const mensajesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(mensajesArray);
    });

    return unsubscribe; // Devuelve la función de limpieza
  } catch (error) {
    console.error("Error suscribiéndose al chat:", error);
  }
};

// Función para suscribirse a los chats del usuario
export const suscribirseAChats = (
  userId: string,
  callback: (chats: any[]) => void
) => {
  try {
    const q = query(collection(ikam, "chat"), where("idUser", "==", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(chatsArray);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error suscribiéndose a los chats:", error);
  }
};

// Función para suscribirse a los chats del usuario pyme
export const suscribirseAChatsPyme = (
  userId: string,
  callback: (chats: any[]) => void
) => {
  try {
    const q = query(collection(ikam, "chat"), where("idPyme", "==", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(chatsArray);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error suscribiéndose a los chats de pyme:", error);
  }
};

export const enviarMensaje = async (
  chatId: string,
  mensaje: string,
  uid: string
) => {
  if (mensaje.trim() === "") return; // No enviar si el mensaje está vacío

  try {
    // Enviar el mensaje a la subcolección `mensaje`
    await addDoc(collection(ikam, "chat", chatId, "mensaje"), {
      mensaje: mensaje, // El texto del mensaje
      timestamp: new Date(), // Marca de tiempo
      user: uid, // ID del usuario que envía el mensaje
    });

    //console.log("Mensaje enviado:", mensaje);
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
};

export const suscribirseAMensajes = (chatId: any, callback: any) => {
  const mensajesRef = collection(ikam, "chat", chatId, "mensaje");

  const q = query(mensajesRef, orderBy("timestamp")); // Asegúrate de que el campo que usas aquí es el correcto

  return onSnapshot(q, (querySnapshot) => {
    const mensajes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(mensajes);
  });
};

export const suscribirseAMensajesPyme = (chatId: any, callback: any) => {
  const mensajesRef = collection(ikam, "chat", chatId, "mensaje");
  const q = query(mensajesRef, orderBy("timestamp"));
  return onSnapshot(q, (querySnapshot) => {
    const mensajes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(mensajes);
  });
};

export const suscribirseAUser = (callback: (user: User[]) => void) => {
  try {
    const unsubscribe = onSnapshot(
      collection(ikam, "users"),
      (querySnapshot) => {
        const usersArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        callback(usersArray);
      }
    );

    return unsubscribe; // Devuelve la función de limpieza
  } catch (error) {
    console.error("Error suscribiéndose a los usuarios:", error);
  }
};

// Ejemplo de función que recupera todos los chats
export const obtenerChatsEnTiempoReal = (
  userId: string,
  tipo: "idUser" | "idPyme",
  callback: (chats: Chat[]) => void
) => {
  try {
    // Crear la consulta dinámica
    const chatsQuery = query(
      collection(ikam, "chat"),
      where(tipo, "==", userId)
    );

    // Escuchar los cambios en tiempo real
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const chats: Chat[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        unreadCount: doc.data().unreadCount || 0,
        idUser: doc.data().idUser,
        idPyme: doc.data().idPyme,
      }));

      // Llamar al callback con los chats recuperados
      if (typeof callback === "function") {
        callback(chats);
      }
    });

    return unsubscribe; // Retornar la función de unsubscribe
  } catch (error) {
    console.error("Error al obtener los chats:", error);
    return () => {}; // Retorna una función vacía en caso de error
  }
};

// export const obtenerTodosLosChats = async (userId: string): Promise<Chat[]> => {
//   try {
//     const chatsQuery = query(
//       collection(ikam, "chat"),
//       where("idUser", "==", userId)
//     );
//     //console.log(getDocs(chatsQuery));
//     const querySnapshot = await getDocs(chatsQuery);

//     const chats: Chat[] = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       unreadCount: doc.data().unreadCount || 0, // Asegúrate de mapear el unreadCount
//       // Agrega otras propiedades del chat que necesites
//     }));

//     //console.log("chats" + chats);
//     return chats; // Devuelve un array de chats con el tipo correcto
//   } catch (error) {
//     console.error("Error al obtener los chats:", error);
//     return []; // Devuelve un array vacío en caso de error
//   }
// };

// Servicio para obtener el token del usuario receptor
export const getReceptorToken = async (uid: string) => {
  try {
    // Consulta a la colección completa una vez
    const querySnapshot = await getDocs(collection(ikam, "users"));

    // Busca coincidencia con `pyme` o con el ID del documento
    const matchingDoc = querySnapshot.docs.find(
      (doc) => doc.data().pyme === uid || doc.id === uid
    );

    // Si se encuentra coincidencia, devuelve el token
    if (matchingDoc) {
      const userData = matchingDoc.data();
      return userData.tokens;
    }

    // Si no hay coincidencia, lanza un error
    throw new Error("Usuario no encontrado");
  } catch (error) {
    console.error("Error al obtener el token del receptor:", error);
    return null; // Retorna `null` si ocurre un error
  }
};

// export const getReceptorToken = async (uid: string) => {
//   //console.log(uid)
//   const userQuery = query(collection(ikam, "users"), where("pyme", "==", uid));
//   const querySnapshot = await getDocs(userQuery);

//   if (!querySnapshot.empty) {
//     const userData = querySnapshot.docs[0].data();
//     //console.log(userData)

//     return userData.tokens;
//   } else {
//     throw new Error("Usuario no encontrado");
//   }
// };

export const actualizarUnreadCount = async (
  chatId: string,
  newCount: number
) => {
  try {
    const chatRef = doc(ikam, "chat", chatId);
    if (newCount === 0) {
      // Si newCount es 0, reseteamos el contador
      await updateDoc(chatRef, {
        unreadCount: 0,
      });
    } else {
      // Incrementamos en 1 si no se especifica un nuevo conteo
      await updateDoc(chatRef, {
        unreadCount: increment(1),
      });
    }
  } catch (error) {
    console.error("Error al actualizar unreadCount:", error);
  }
};

export const verificarSiEsPyme = async (userUID: string) => {
  try {
    // Consulta a la colección de usuarios una vez
    const querySnapshot = await getDocs(collection(ikam, "users"));

    // Busca coincidencia con el ID del documento
    const matchingDoc = querySnapshot.docs.find((doc) => doc.id === userUID);

    if (matchingDoc) {
      // Verifica si hay un documento coincidente
      const userData = matchingDoc.data(); // Obtiene los datos del documento

      if (userData.pyme) {
        // Si es una pyme, devuelve el ID de la pyme asignada
        return userData.pyme; // Asegúrate de que este campo existe en tu modelo de usuario
      } else {
        return false; // No es una pyme
      }
    } else {
      console.log("No se encontró un documento del usuario.");
      return false;
    }
  } catch (error) {
    console.error("Error al verificar si es pyme:", error);
    return false; // Retorna `false` si hay un error
  }
};
