import * as React from 'react';
import {
  Image, Platform, StyleSheet, Text, TouchableOpacity,
  View, Dimensions, ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'react-native-chart-kit'

import axios from 'axios'
import numeral from 'numeral'

export default function HomeScreen({ navigation }) {

  const [sessionHash, setSessionHash] = React.useState(null);
  const [monthlyGraphData, setMonthlyGraphData] = React.useState(null);
  // const didMount = React.useRef(false)

  // Se trae el prefix para acceder a la API
  const { apiPrefix } = React.useContext(AuthContext)

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
  const getSessionHash = async () => {
    var sessionHash = await AsyncStorage.getItem('session');
    setSessionHash(sessionHash)
    // didMount.current = true
  }

  const getDataAsync = async () => {
    var sessionHash = await AsyncStorage.getItem('session');
    let monthlyGraphData = await axios.get(apiPrefix + '/monthly-graph', {
      params: {
        sessionHash,
        nMonths: 5
      }
    }).catch((err) => { console.log(err) })
    monthlyGraphData = monthlyGraphData.data
    setMonthlyGraphData(monthlyGraphData)
  };


  const BuildMonthlyChart = () => {
    const formatYLabel = (label) => {
      var formatted = '$' + numeral(label).format('0,0')
      return formatted
    }
    const dataPointClick = ({ value, dataset, getColor }) => {
      console.log('dataPointClick');
      return (
        <Text>{value}</Text>
      )
    }

    if (monthlyGraphData) {
      return (
        <LineChart
          data={{
            labels: monthlyGraphData.labels,
            datasets: [{
              data: monthlyGraphData.gastosDataset,
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // optional
            }, {
              data: monthlyGraphData.ingresosDataset,
              color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // optional
            }, {
              data: monthlyGraphData.ahorrosDataset,
              color: (opacity = 1) => `rgba(255, 205, 86, ${opacity})`, // optional
            }],
            legend: ["Gastos", "Ingresos", "Ahorros"] // optional
          }}

          formatYLabel={formatYLabel}
          horizontalLabelRotation={320}
          onDataPointClick={dataPointClick} // ejecuta una funcion pero no renderiza
          fromZero={true}
          width={Dimensions.get('window').width - 10} // from react-native
          height={220}
          withShadow={false}
          segments={4} // cantidad de medidas en Y
          chartConfig={{
            // backgroundColor: '#e26a00',
            // backgroundGradientFrom: '#fb8c00',
            // backgroundGradientTo: '#ffa726',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            strokeWidth: 3, // optional, default 3
            style: {
              // borderRadius: 5
            },
            propsForDots: {
              // r: "6",
              // strokeWidth: "2",
              // stroke: "#ffa726"
            }
          }}
          style={{
            marginVertical: 8,
            borderRadius: 5,
            alignItems: 'center'
          }}
        />
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

  React.useEffect(() => {
    getSessionHash()
  }, [])

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
