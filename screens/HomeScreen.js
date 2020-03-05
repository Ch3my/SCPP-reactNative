import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, AsyncStorage, Dimensions, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import { ProgressBar } from 'react-native-paper'
// https://github.com/jerairrest/react-chartjs-2
// Solo funciona en el Browser
// import { Doughnut, HorizontalBar, Line, Pie } from 'react-chartjs-2';

import { WebView } from 'react-native-webview';

import axios from 'axios'
import numeral from 'numeral'

export default function HomeScreen({ navigation }) {

  // Comentado porque Chartjs no Funciona en React native
  const [barData, setBarData] = React.useState({});
  const [lineData, setLineData] = React.useState({});
  const [pieData, setPieData] = React.useState({});
  const [sessionHash, setSessionHash] = React.useState(null);
  const webviewRef = React.useRef();
  const didMount = React.useRef(false)


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

  // Comentado porque chartjs no funciona en ReactNative
  // React.useEffect(() => {
  //   const getBarData = async () => {
  //     var sessionHash = await AsyncStorage.getItem('session');
  //     setSessionHash(sessionHash)
  //     var barDataReq = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/graph/category-bar', {
  //       params: {
  //         sessionHash
  //       }
  //     })
  //     const barGraphData = {
  //       labels: barDataReq.data.catNames,
  //       datasets: [
  //         {
  //           label: 'Categoria',
  //           backgroundColor: 'rgba(75, 192, 192, 0.8)',
  //           borderColor: 'rgb(75, 192, 192)',
  //           borderWidth: 1,
  //           hoverBackgroundColor: 'rgba(255,99,132,0.4)',
  //           hoverBorderColor: 'rgba(255,99,132,1)',
  //           data: barDataReq.data.catValues
  //         }
  //       ]
  //     };
  //     setBarData(barGraphData)
  //   }
  //   const getLineData = async () => {
  //     // var sessionHash = await AsyncStorage.getItem('session');
  //     var lineDataReq = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/graph/historic-bar', {
  //       params: {
  //         sessionHash
  //       }
  //     })
  //     // Aunque la API entrega los ultimos 12 Meses nosotros cortamos en los 5 ultimos
  //     // porque la pantalla del Telefono es mas pequeña y no caen mas de manera efectiva
  //     const lineGraphData = {
  //       labels: lineDataReq.data.labels.slice(Math.max(lineDataReq.data.labels.length - 5, 0)),
  //       datasets: [{
  //         label: 'Gastos',
  //         backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //         borderColor: 'rgba(255, 99, 132)',
  //         borderWidth: 1,
  //         hoverBackgroundColor: 'rgba(255,99,132,0.4)',
  //         hoverBorderColor: 'rgba(255,99,132,1)',
  //         data: lineDataReq.data.gastosData.slice(Math.max(lineDataReq.data.gastosData.length - 5, 0)),
  //         lineTension: 0.1,
  //       }, {
  //         label: 'Ahorros',
  //         backgroundColor: 'rgb(255, 205, 86, 0.2)',
  //         borderColor: 'rgb(255, 205, 86)',
  //         borderWidth: 1,
  //         hoverBackgroundColor: 'rgba(255,99,132,0.4)',
  //         hoverBorderColor: 'rgba(255,99,132,1)',
  //         data: lineDataReq.data.ahorrosData.slice(Math.max(lineDataReq.data.ahorrosData.length - 5, 0)),
  //         lineTension: 0.1,
  //       }, {
  //         label: 'Ingresos',
  //         backgroundColor: 'rgb(54, 162, 235, 0.2)',
  //         borderColor: 'rgb(54, 162, 235)',
  //         borderWidth: 1,
  //         hoverBackgroundColor: 'rgba(255,99,132,0.4)',
  //         hoverBorderColor: 'rgba(255,99,132,1)',
  //         data: lineDataReq.data.ingresosData.slice(Math.max(lineDataReq.data.ingresosData.length - 5, 0)),
  //         lineTension: 0.1,
  //       }]
  //     };
  //     setLineData(lineGraphData)
  //   }
  //   const getPieData = async () => {
  //     // var sessionHash = await AsyncStorage.getItem('session');
  //     var pieDataReq = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/graph/tipo-doc-pie', {
  //       params: {
  //         sessionHash
  //       }
  //     })
  //     const lineGraphData = {
  //       labels: pieDataReq.data.tipoDocName,
  //       datasets: [{
  //         data: pieDataReq.data.tipoDocVal,
  //         backgroundColor: [
  //           'rgb(255, 99, 132)',
  //           'rgb(54, 162, 235)',
  //           'rgb(153, 102, 255)',
  //           'rgb(75, 192, 192)',
  //           'rgb(54, 162, 235)',
  //         ],
  //       }],
  //     }
  //     setPieData(lineGraphData)
  //   }

  //   getBarData()
  //   getLineData()
  //   getPieData()
  // }, [])

  return (
    <ScrollView style={styles.container}>
      {sessionHash != null && (
        <WebView source={{ uri: 'https://scpp.herokuapp.com/api/v1/api-endpoints/onserver-graph-render?sessionHash=' + sessionHash }}
          height={700} style={{ flex: 1 }} renderLoading={ActivityIndicatorLoadingView} startInLoadingState={true} ref={webviewRef} />
      )}

      {/* Esto es de Charjs pero solo funciona en el Browser :'( */}
      {/* <Line data={lineData} options={{
        tooltips: {
          custom: tooltipItem => {
            console.log(tooltipItem)
            if (tooltipItem.body) {
              tooltipItem.body[0].lines = [numeral(tooltipItem.dataPoints[0].yLabel).format('0,0')]
              return tooltipItem
            } else {
              return
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              // Cantidad de separacion que tendra el eje. De 100 en 100, 200 en 200, etc
              stepSize: 500000,
              // Return an empty string to draw the tick line but hide the tick label
              // Return `null` or `undefined` to hide the tick line entirely
              callback: function (value, index, values) {
                // Convert the number to a string and splite the string every 3 charaters from the end
                value = value.toString();
                value = value.split(/(?=(?:...)*$)/);

                // Convert the array to a string and format the output
                value = value.join('.');
                return '$' + value;
              },
            },
          }]
        }
      }} />

      <HorizontalBar data={barData} height={350} legend={{
        display: false
      }} options={{
        tooltips: {
          custom: tooltipItem => {
            if (tooltipItem.body) {
              tooltipItem.body[0].lines = [tooltipItem.title[0] + " " + numeral(tooltipItem.dataPoints[0].xLabel).format('0,0')]
              return tooltipItem
            } else {
              return
            }
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              // Cantidad de separacion que tendra el eje. De 100 en 100, 200 en 200, etc
              stepSize: 200000,
              // Return an empty string to draw the tick line but hide the tick label
              // Return `null` or `undefined` to hide the tick line entirely
              callback: function (value, index, values) {
                // Convert the number to a string and splite the string every 3 charaters from the end
                value = value.toString();
                value = value.split(/(?=(?:...)*$)/);

                // Convert the array to a string and format the output
                value = value.join('.');
                return '$' + value;
              },
            },
          }]
        }
      }} />

      <Pie data={pieData} /> */}
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
