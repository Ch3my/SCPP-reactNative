import * as React from 'react';
import { AsyncStorage, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import AuthContext from './context/AuthContext'
import axios from 'axios'

import BottomTabNavigator from './navigation/BottomTabNavigator';
import LoginScreen from './screens/entrance/LoginScreen'
import useLinking from './navigation/useLinking';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);


  // Tema de React Paper
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#007bff',
      accent: '#f1c40f',
    },
  };

  // __        ______     _______  __  .__   __.      ______   .______         .______       _______  _______   __  .______       _______   ______ .___________.
  // |  |      /  __  \   /  _____||  | |  \ |  |     /  __  \  |   _  \        |   _  \     |   ____||       \ |  | |   _  \     |   ____| /      ||           |
  // |  |     |  |  |  | |  |  __  |  | |   \|  |    |  |  |  | |  |_)  |       |  |_)  |    |  |__   |  .--.  ||  | |  |_)  |    |  |__   |  ,----'`---|  |----`
  // |  |     |  |  |  | |  | |_ | |  | |  . `  |    |  |  |  | |      /        |      /     |   __|  |  |  |  ||  | |      /     |   __|  |  |         |  |     
  // |  `----.|  `--'  | |  |__| | |  | |  |\   |    |  `--'  | |  |\  \----.   |  |\  \----.|  |____ |  '--'  ||  | |  |\  \----.|  |____ |  `----.    |  |     
  // |_______| \______/   \______| |__| |__| \__|     \______/  | _| `._____|   | _| `._____||_______||_______/ |__| | _| `._____||_______| \______|    |__|     

  // Definicion del Estado General del AuthContext
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        case 'STACK_HEADER_CONTROL':
          return {
            ...prevState,
            stackHeader: action.control,
          };
      }
    },
    {
      isSignout: false,
      userToken: null,
      stackHeader: true,
    }
  );
  // Obtenemos Datos de LocalStorage. Esta dentro de esta funcion para poder ejecutarlo de manera sincrona
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let session;

      try {
        session = await AsyncStorage.getItem('session');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: session });
    };

    bootstrapAsync();
  }, []);


  const authContextState = {
    isLoggedIn: false,
    login: data => {
      var argins = {
        username: data.username.username,
        password: data.password.password,
      }
      axios.post('https://scpp.herokuapp.com/api/v1/api-endpoints/entrance/login', argins
      ).then(response => {
        if (response.status != 200) {
          console.log("El usuario no esta autorizado")
        } else {
          console.log("Usuario Autorizado")
          // Guardamos usuario y la navegacion se actualiza automaticamente al ejecutar dispatch. Que actualiza el Estado
          AsyncStorage.setItem('session', response.data.sessionHash)
          AsyncStorage.setItem('user', JSON.stringify(response.data.user))
          dispatch({ type: 'SIGN_IN', token: response.data.sessionHash });
        }
      }).catch(err => {
        console.error(err)
      })
    },
    logout: sessionHash => {
      axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/entrance/logout', {
        params: {
          sessionHash: sessionHash
        }
      }).then(response => {
        // TODO. Crear en el servidor y cliente metodo para que verifique que el logout fue exitoso
        // Limpia las variables del AsyncStorage y modifica el Estado de la App
        AsyncStorage.removeItem('session')
        AsyncStorage.removeItem('user', JSON.stringify(response.data.user))
        dispatch({ type: 'SIGN_OUT', token: response.data.sessionHash });
      }).catch(err => {
        console.error(err)
      })
    },
    stackHeaderControl: flag => {
      console.log("stackHeaderControl")
      dispatch({ type: 'STACK_HEADER_CONTROL', control: flag });
    },
    getStackHeaderControl: () => {
      return state.stackHeader      
    }
  }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    // Verificar si tiene session Iniciada o no. Redireccionar a Login en caso de No
    // return (
    //   <AuthContext.Provider value={authContextState}>
    //     <PaperProvider>
    //       <View style={styles.container}>
    //         {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
    //         <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
    //           <Stack.Navigator>
    //             {state.userToken ? (
    //               <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: state.stackHeader }} />
    //             ) : (
    //                 <Stack.Screen name="Login" component={LoginScreen} />
    //               )}
    //           </Stack.Navigator>
    //         </NavigationContainer>
    //       </View>
    //     </PaperProvider>
    //   </AuthContext.Provider>
    // );
    // Navegacion sin Stack sobre el TabNavigator (En caso de que todas las tab sean stack y tengan su propio header)
    return (
      <AuthContext.Provider value={authContextState}>
        <PaperProvider theme={theme}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
              {state.userToken ? (
                <BottomTabNavigator />
              ) : (
                  <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} />
                  </Stack.Navigator>
                )}
            </NavigationContainer>
          </View>
        </PaperProvider>
      </AuthContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
