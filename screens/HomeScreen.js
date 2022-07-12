import * as React from 'react';
import {
  Image, Platform, StyleSheet, TouchableOpacity,
  View, Dimensions, ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Text } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'

import Svg, { G, Circle, Path, Line, Polyline } from "react-native-svg";

import LineChart from '../components/ChartSVG/LineChart'

import axios from 'axios'
import numeral from 'numeral'

export default function HomeScreen({ navigation }) {

  // const [sessionHash, setSessionHash] = React.useState(null);
  const [monthlyGraphData, setMonthlyGraphData] = React.useState(null);
  // const didMount = React.useRef(false)

  // Se trae el prefix para acceder a la API
  const { logout, apiPrefix } = React.useContext(AuthContext)

  // const ActivityIndicatorLoadingView = () => {
  //   //making a view to show to while loading the webpage
  //   return (
  //     <ActivityIndicator
  //       color="#007bff"
  //       size="large"
  //       style={{
  //         top: 0, bottom: 0,
  //         left: 0, right: 0,
  //         position: 'absolute'
  //       }}
  //     />
  //   );
  // }

  // Obtenemos Hash para enviar al servidor y hacer renderizado alla
  // Solo mostramos Webview que contiene una web especial
  // const getSessionHash = async () => {
  //   var sessionHash = await AsyncStorage.getItem('session');
  //   setSessionHash(sessionHash)
  //   // didMount.current = true
  // }

  const getDataAsync = async () => {
    var sessionHash = await AsyncStorage.getItem('session');
    console.log(apiPrefix + '/monthly-graph?nMonths=5&sessionHash=' + sessionHash);
    let monthlyGraphData = await axios.get(apiPrefix + '/monthly-graph', {
      params: {
        sessionHash: sessionHash,
        nMonths: 5
      }
    }).catch((err) => { console.log(err) })
    monthlyGraphData = monthlyGraphData.data
    if (monthlyGraphData.hasErrors) {
      logout(sessionHash)
    } else {
      setMonthlyGraphData(monthlyGraphData)
    }
  };


  const BuildMonthlyChart = () => {
    if (monthlyGraphData) {
      return (
        <LineChart datasets={[{ 
          data: monthlyGraphData.gastosDataset,
          color: 'rgba(255, 99, 132, 1)'
        }, {
          data: monthlyGraphData.ingresosDataset,
          color: 'rgba(4, 162, 235, 1)'
        }, {
          data: monthlyGraphData.ahorrosDataset,
          color: 'rgba(255, 205, 86, 1)'
        }]}
          totalWidth={Dimensions.get('window').width}
          totalHeight="250" 
          labels={monthlyGraphData.labels} />
      )
    } else {
      return (
        <ActivityIndicator
          color="#007bff"
          size="large"
        />
      );
    }
  }

  // Cada vez que le hacen Focus a esta pagina traemos los datos del Servidor
  // si se cambia de tab y vuelve sin modificar el estado del componente la lista queda con 
  // informacion absoleta (ejemplo, abrio aqui luego fue a añadir un registro y luego vuelve)
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataAsync();
    });
    return unsubscribe;
  }, [navigation]);

  // React.useEffect(() => {
  //   getSessionHash()
  // }, [])

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <BuildMonthlyChart></BuildMonthlyChart>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
