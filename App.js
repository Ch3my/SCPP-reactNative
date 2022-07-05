import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Image } from 'react-native';
import * as  SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthContext from './context/AuthContext'
import axios from 'axios'

import BottomTabNavigator from './navigation/BottomTabNavigator';
import LoginScreen from './screens/entrance/LoginScreen'

// Tema oscuro
// Saber si el SO tiene activado light/dark theme
// Para que funcione tenemos que setear el tema de native-paper
// y react navigation
import { Appearance } from 'react-native';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, } from '@react-navigation/native'
import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper'
const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
  },
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
};

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [theme, setTheme] = React.useState(CombinedDefaultTheme);
  const containerRef = React.useRef();
  // TODO Delete
  // const { getInitialState } = useLinking(containerRef);

  // Escondemos el SplashScreen por defecto para mostrar la Propia
  SplashScreen.hideAsync();

  // ApiPrefix que se usa dentro del AuthContext. ya que parace que context
  // no puede referenciarse a si mismo
  const contextApiPrefix = 'https://scpp.lezora.cl:4343'
  // Development
  // const contextApiPrefix = 'http://192.168.2.20:1337'

  // Saber que tema esta usando el SO
  const colorScheme = Appearance.getColorScheme();
  // console.log(colorScheme)
  if (colorScheme === 'dark') {
    // Use dark color scheme
    // En mi telefono Samsung aunque tenga activado el Dark 
    // react native piensa que es light. Asi que tendremos Boton de Toggle
  }

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {

        // TODO Delete
        // Load our initial navigation state
        // setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        // ...
      }
    }

    // Obtenemos Datos de LocalStorage. Esta dentro de esta funcion para poder ejecutarlo de manera sincrona
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let session;
      let themeScoped;

      try {
        session = await AsyncStorage.getItem('session');
        themeScoped = await AsyncStorage.getItem('theme');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: session });

      // Guardamos en el contexto que tema estamos usando
      // de acuerdo a lo que tenemos en el AsyncStorage
      if (themeScoped == null) {
        // deja el tema por defecto
        // No cambia el objeto theme porque ya esta por defecto
        // Ademas si es nulo lo crea
        AsyncStorage.setItem('theme', 'default')
        dispatch({ type: 'UPDATE_THEME', theme: 'default' });
        setTheme(CombinedDefaultTheme)
      } else {
        if (themeScoped == 'default') {
          // theme = CombinedDefaultTheme
          setTheme(CombinedDefaultTheme)
          dispatch({ type: 'UPDATE_THEME', theme: 'default' });
        } else if (themeScoped == 'dark') {
          // theme = CombinedDarkTheme
          setTheme(CombinedDarkTheme)
          dispatch({ type: 'UPDATE_THEME', theme: 'dark' });
        }
      }
      // Ahora que terminamos el Mambo seteamos como finalizado y escondemos el SplashScreen
      // Lo dejamos un poco para la animacion
      // setTimeout(async () => {
      //   setLoadingComplete(true);
      // }, 2000);
      setLoadingComplete(true);

    };

    loadResourcesAndDataAsync();
    bootstrapAsync();
  }, []);


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
        case 'UPDATE_THEME':
          return {
            ...prevState,
            themeName: action.theme,
          }
      }
    },
    {
      isSignout: false,
      userToken: null,
      stackHeader: true,
      themeName: 'default'
    }
  );

  // Actualiza el tema onDemand
  React.useEffect(() => {
    if (state.themeName == 'default') {
      // theme = CombinedDefaultTheme
      setTheme(CombinedDefaultTheme)
    } else if (state.themeName == 'dark') {
      // theme = CombinedDarkTheme
      setTheme(CombinedDarkTheme)
    }
  }, [state.themeName]);

  const authContextState = {
    isLoggedIn: false,
    apiPrefix: 'https://scpp.lezora.cl:4343',
    // Development
    // apiPrefix: 'http://192.168.2.20:1337',
    login: data => {
      var argins = {
        username: data.username.username,
        password: data.password.password,
      }
      axios.post(contextApiPrefix + '/api/v1/api-endpoints/entrance/login', argins
      ).then(response => {
        if (response.status != 200) {
          console.log("El usuario no esta autorizado")
        } else {
          // console.log("Usuario Autorizado")
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
      axios.get(contextApiPrefix + '/api/v1/api-endpoints/entrance/logout', {
        params: {
          sessionHash: sessionHash
        }
      }).then(response => {
        console.log(response)
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
    },
    updateTheme: theme => {
      if (theme) {
        // Seteamos directamente lo que nos dijeron
        // en caso de que tengamos mas de 2 temas
        AsyncStorage.setItem('theme', theme)
        dispatch({ type: 'UPDATE_THEME', theme: theme });
        return
      }
      if (state.themeName == 'default') {
        AsyncStorage.setItem('theme', 'dark')
        dispatch({ type: 'UPDATE_THEME', theme: 'dark' });
      } else if (state.themeName == 'dark') {
        AsyncStorage.setItem('theme', 'default')
        dispatch({ type: 'UPDATE_THEME', theme: 'default' });
      }
    },
    getTheme: () => state.themeName
  }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    // Podemos retornar null si estamos usando
    // el splashScreen por defecto
    // var gif = Math.round(Math.random())
    // Como carga rapido con EAS no mostramos Gif Animado
    
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
          <Image
            style={{ width: 400 }}
            resizeMode='center'
            source={require('./assets/images/splash.png')}
          />
          
          {/* {gif == 0 ? (
            <Image
              style={{ width: 500, position: 'absolute', bottom: 0 }}
              resizeMode='center'
              source={require('./assets/images/pika-1.gif')}
            />
          ) : (
              <Image
                style={{ width: 200, position: 'absolute', bottom: 0 }}
                resizeMode='center'
                source={require('./assets/images/pika-2.gif')}
              />
            )} */}
      </View>
    )
  } else {
    // Verificar si tiene session Iniciada o no. Redireccionar a Login en caso de No
    // Navegacion sin Stack sobre el TabNavigator (En caso de que todas las tab sean stack y tengan su propio header)
    return (
      <AuthContext.Provider value={authContextState}>
        <PaperProvider theme={theme}>
          <View style={styles.container}>
            <StatusBar color="black"/>
            <NavigationContainer ref={containerRef} initialState={initialNavigationState} theme={theme}>
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
