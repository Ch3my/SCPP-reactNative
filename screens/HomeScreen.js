import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'

import { WebView } from 'react-native-webview';

export default function HomeScreen({ navigation }) {

  const [sessionHash, setSessionHash] = React.useState(null);
  const webviewRef = React.useRef();
  const didMount = React.useRef(false)

  // Se trae el prefix para acceder a la API
  const { apiPrefix } = React.useContext(AuthContext)

  const ActivityIndicatorLoadingView = () => {
    //making a view to show to while loading the webpage
    return (
      <ActivityIndicator
        color="#007bff"
        size="large"
        style={{
          top: 0, bottom: 0,
          left: 0, right: 0,
          position: 'absolute'
        }}
      />
    );
  }

  const webViewReload = () => {
    webviewRef.current.reload()
  }
  // Cada vez que le hacen Focus a esta pagina traemos los datos del Servidor
  // si se cambia de tab y vuelve sin modificar el estado del componente la lista queda con 
  // informacion absoleta (ejemplo, abrio aqui luego fue a añadir un registro y luego vuelve)
  React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        if (didMount.current == true) {
          webViewReload();
        }
      });
      return unsubscribe;
  }, [navigation]);

    // Obtenemos Hash para enviar al servidor y hacer renderizado alla
  // Solo mostramos Webview que contiene una web especial
  React.useEffect(() => {
    const getSessionHash = async () => {
      var sessionHash = await AsyncStorage.getItem('session');
      setSessionHash(sessionHash)
      didMount.current = true
    }
    getSessionHash()   
  }, [])

  return (
    <ScrollView style={styles.container}>
      {sessionHash != null && (
        <WebView source={{ uri: apiPrefix + '/api/v1/api-endpoints/onserver-graph-render?sessionHash=' + sessionHash }}
          height={700} style={{ flex: 1 }} renderLoading={ActivityIndicatorLoadingView} startInLoadingState={true} ref={webviewRef} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
