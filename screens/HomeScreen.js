import * as React from 'react';
import {
  Image, Platform, StyleSheet, TouchableOpacity,
  View, Dimensions, ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'

import LineChart from '../components/ChartSVG/LineChart'
import BarChart from '../components/ChartSVG/BarChart';

import axios from 'axios'
import numeral from 'numeral'

import { Text, DataTable, IconButton, Button, ProgressBar, Modal } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  const [monthlyGraphData, setMonthlyGraphData] = React.useState(null);
  const [barChartData, setBarChartData] = React.useState(null);


  // Se trae el prefix para acceder a la API
  const { logout, apiPrefix, getTheme } = React.useContext(AuthContext)

  const getDataAsync = async () => {
    var sessionHash = await AsyncStorage.getItem('session');
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

  const getBarChartAsync = async () => {
    var sessionHash = await AsyncStorage.getItem('session');
    let barChartData = await axios.get(apiPrefix + '/expenses-by-category', {
      params: {
        sessionHash: sessionHash,
        nMonths: 5
      }
    }).catch((err) => { console.log(err) })
    barChartData = barChartData.data
    // console.log(barChartData)
    if (barChartData.hasErrors) {
      logout(sessionHash)
    } else {
      setBarChartData(barChartData)
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
          labels={monthlyGraphData.labels}
          yAxisPrefix='$ ' />
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

  const BuildExpensesByCategoryChart = () => {
    if (barChartData) {
      return (
        <BarChart dataset={barChartData.amounts}
          totalWidth={Dimensions.get('window').width}
          labels={barChartData.labels} 
          yAxisPrefix='$ '/>
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

  const BuildMonthlyTable = () => {
    // Lo mismo que las filas Odd pero para el color del header
    const headerBg = theme => {
      var backgroundColor = ''
      if (theme == 'default') {
        backgroundColor = '#def5ff'
      } else {
        backgroundColor = '#2f2f2f'
      }
      return {
        backgroundColor
      }
    }
    // No se porque no funciona getTheme dentro de la funcion asi que lo pasamos como argumento
    const oddRowsProcessewdStyle = theme => {
      var backgroundColor = ''
      // Controla el color dependiendo del tema en el que estamos
      if (theme == 'default') {
        backgroundColor = '#def5ff'
      } else {
        backgroundColor = '#222'
      }
      return {
        backgroundColor
      }
    }

    if (monthlyGraphData) {
      let rows = []
      for (let i = monthlyGraphData.labels.length - 1; i > -1; i--) {
        rows.push(
          <DataTable.Row key={i} style={i % 2 == 0 && oddRowsProcessewdStyle(getTheme())}>
            <DataTable.Cell>{monthlyGraphData.labels[i]}</DataTable.Cell>
            <DataTable.Cell numeric>{numeral(monthlyGraphData.ingresosDataset[i]).format('0,0')}</DataTable.Cell>
            <DataTable.Cell numeric>{numeral(monthlyGraphData.gastosDataset[i]).format('0,0')}</DataTable.Cell>
            <DataTable.Cell numeric > {numeral(monthlyGraphData.ahorrosDataset[i]).format('0,0')}</DataTable.Cell>
          </DataTable.Row>
        )
      }

      return (
        <DataTable style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}>
          <DataTable.Header style={[styles.tableHeader, headerBg()]}>
            <DataTable.Title style={{ paddingTop: 8 }}>
              <Text style={styles.tableHeaderText}>Fecha</Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ paddingTop: 8 }}>
              <Text style={styles.tableHeaderText}>Ingresos</Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ paddingTop: 8 }}>
              <Text style={styles.tableHeaderText}>Gastos</Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ paddingTop: 8 }}>
              <Text style={styles.tableHeaderText}>Ahorros</Text>
            </DataTable.Title>
          </DataTable.Header>
          {rows}
        </DataTable>
      )
    } else {
      return null
    }
  }

  // Cada vez que le hacen Focus a esta pagina traemos los datos del Servidor
  // si se cambia de tab y vuelve sin modificar el estado del componente la lista queda con 
  // informacion absoleta (ejemplo, abrio aqui luego fue a añadir un registro y luego vuelve)
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataAsync()
      getBarChartAsync()
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <BuildMonthlyChart></BuildMonthlyChart>
      <BuildMonthlyTable></BuildMonthlyTable>
      <BuildExpensesByCategoryChart></BuildExpensesByCategoryChart>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tableHeader: {
    height: 42
  },
  tableHeaderText: {
    fontSize: 13
  },
});
