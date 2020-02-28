import * as React from 'react';
import { StyleSheet, Text, View, Picker, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import axios from 'axios'
import numeral from 'numeral'

import moment from 'moment'
import 'moment/locale/es'

import { DataTable, IconButton, Button, ProgressBar, TextInput } from 'react-native-paper';
import useStateWithCallback from 'use-state-with-callback';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ReportsScreen() {

  const [isLoading, setIsLoading] = React.useState(false);

  // Set moment locale
  moment.locale('es')

  // .___________. __  .______     ______       _______    ______     ______ 
  // |           ||  | |   _  \   /  __  \     |       \  /  __  \   /      |
  // `---|  |----`|  | |  |_)  | |  |  |  |    |  .--.  ||  |  |  | |  ,----'
  //     |  |     |  | |   ___/  |  |  |  |    |  |  |  ||  |  |  | |  |     
  //     |  |     |  | |  |      |  `--'  |    |  '--'  ||  `--'  | |  `----.
  //     |__|     |__| | _|       \______/     |_______/  \______/   \______|

  // Extrae datos de la API y construye options. Equivalente a ejecutar en mounted?

  const [tipoDoc, setTipoDoc] = React.useState(1);
  const [listOfTipoDoc, setListOfTipoDoc] = React.useState([]);

  React.useEffect(() => {
    // Fetch dat from API and build Picker
    const getTipoDocAsync = async () => {
      let tipoDoc = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/get-tipo-doc').catch((err) => { console.log(err) })
      setListOfTipoDoc(tipoDoc.data)
    };
    getTipoDocAsync();
  }, []);

  // .______    __    ______  __  ___  _______ .______           ______      ___      .___________. _______   _______   ______   .______       __       ___      
  // |   _  \  |  |  /      ||  |/  / |   ____||   _  \         /      |    /   \     |           ||   ____| /  _____| /  __  \  |   _  \     |  |     /   \     
  // |  |_)  | |  | |  ,----'|  '  /  |  |__   |  |_)  |       |  ,----'   /  ^  \    `---|  |----`|  |__   |  |  __  |  |  |  | |  |_)  |    |  |    /  ^  \    
  // |   ___/  |  | |  |     |    <   |   __|  |      /        |  |       /  /_\  \       |  |     |   __|  |  | |_ | |  |  |  | |      /     |  |   /  /_\  \   
  // |  |      |  | |  `----.|  .  \  |  |____ |  |\  \----.   |  `----. /  _____  \      |  |     |  |____ |  |__| | |  `--'  | |  |\  \----.|  |  /  _____  \  
  // | _|      |__|  \______||__|\__\ |_______|| _| `._____|    \______|/__/     \__\     |__|     |_______| \______|  \______/  | _| `._____||__| /__/     \__\ 

  // Extrae datos de la API y construye options. Equivalente a ejecutar en mounted?

  const [category, setCategory] = React.useState(-1);
  const [listOfCategories, setListOfCategories] = React.useState([]);

  React.useEffect(() => {
    // Fetch dat from API and build Picker
    const getCategoriasAsync = async () => {
      let categorias = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/get-categorias').catch((err) => { console.log(err) })
      setListOfCategories(categorias.data)
    };
    getCategoriasAsync();
  }, []);

  // .___________.     ___      .______    __       _______  _______       ___      .___________.     ___      
  // |           |    /   \     |   _  \  |  |     |   ____||       \     /   \     |           |    /   \     
  // `---|  |----`   /  ^  \    |  |_)  | |  |     |  |__   |  .--.  |   /  ^  \    `---|  |----`   /  ^  \    
  //     |  |       /  /_\  \   |   _  <  |  |     |   __|  |  |  |  |  /  /_\  \       |  |       /  /_\  \   
  //     |  |      /  _____  \  |  |_)  | |  `----.|  |____ |  '--'  | /  _____  \      |  |      /  _____  \  
  //     |__|     /__/     \__\ |______/  |_______||_______||_______/ /__/     \__\     |__|     /__/     \__\ 

  // const [tipoDoc, setTipoDoc] = React.useState(1);
  const [listOfData, setListOfData] = React.useState([]);

  // // Este hook siempre esta atento a la variable tipoDoc especificada como ultimo argumento
  // // cada vez que la variable cambia se ejecuta este hook especificamente.
  // // si no se especifica o es [] (vacio) el hook solo se ejecuta on loaded sin mirar variables
  // React.useEffect(() => {
  //   // Fetch dat from API to build Table
  //   const getDataAsync = async () => {
  //     setIsLoading(true)

  //     // Para los gastos solo muestra los gastos del mes. Para los demas Documentos muestra 
  //     // Todos los del Año
  //     let fechaInicio = ''
  //     let fechaTermino = ''
  //     if (tipoDoc == 1) {
  //       fechaInicio = moment().format('YYYY-MM') + '-01'
  //       fechaTermino = moment().format('YYYY-MM') + '-31'
  //     } else {
  //       fechaInicio = moment().format('YYYY') + '-01-01'
  //       fechaTermino = moment().format('YYYY') + '-12-01'
  //     }
  //     let docs = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/get-docs', {
  //       params: {
  //         fk_tipoDoc: tipoDoc,
  //         fechaInicio,
  //         fechaTermino
  //       }
  //     }).catch((err) => { console.log(err) })
  //     setIsLoading(false)
  //     setListOfData(docs.data)
  //   };
  //   getDataAsync();
  // }, []);

  const getData = () => {
    React.useEffect(async () => {
      setIsLoading(true)

      // Asume Fechas que el usuario ingreso o Todo el Año en Defecto 
      let fechaInicio = dateFechaInicio || moment().format('YYYY-01-01')
      let fechaTermino = dateFechaTermino || moment().format('YYYY-12-31')

      let categoryReq = ''
      // Verifica si la categoria es -1. Si lo es en realidad setea la variable envia como Undefined
      if(category == -1){
        // No hacemos nada. Se va por Defecto Vacia
      } else {
        // Tiene algun Valor. Enviamos a la Req
        categoryReq = category
      }

      let docs = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/get-docs', {
        params: {
          fk_tipoDoc: tipoDoc,
          fk_categoria: categoryReq,
          fechaInicio,
          fechaTermino
        }
      }).catch((err) => { console.log(err) })
      setIsLoading(false)
      setListOfData(docs.data)

    })
  }

  //  _______       ___      .___________. _______ .______    __    ______  __  ___  _______ .______      
  //  |       \     /   \     |           ||   ____||   _  \  |  |  /      ||  |/  / |   ____||   _  \     
  //  |  .--.  |   /  ^  \    `---|  |----`|  |__   |  |_)  | |  | |  ,----'|  '  /  |  |__   |  |_)  |    
  //  |  |  |  |  /  /_\  \       |  |     |   __|  |   ___/  |  | |  |     |    <   |   __|  |      /     
  //  |  '--'  | /  _____  \      |  |     |  |____ |  |      |  | |  `----.|  .  \  |  |____ |  |\  \----.
  //  |_______/ /__/     \__\     |__|     |_______|| _|      |__|  \______||__|\__\ |_______|| _| `._____|

  // Es necesario usar useStateWithCallBack para evitar que el DatePicker
  // Se muestre 2 veces al hacer clic en el Boton
  // Show es un flag de control para mostrar o no el DatePicker
  // https://github.com/react-native-community/react-native-datetimepicker/issues/54
  const [dateFechaInicio, setDateFechaInicio] = useStateWithCallback(
    '',
    () => setShowDatePickerFechaInicioFlag(Platform.OS === 'ios'),
  );

  const [showDatePickerFechaInicioFlag, setShowDatePickerFechaInicioFlag] = React.useState(false);

  const onChangeDateTimeFechaInicio = (event, selectedDate) => {
    const currentDate = selectedDate || dateFechaInicio;
    setDateFechaInicio(currentDate);
  };
  const showDatePickerFechaInicio = () => {
    setShowDatePickerFechaInicioFlag(true);
  };

  // Fecha Termino Picker
  const [dateFechaTermino, setDateFechaTermino] = useStateWithCallback(
    '',
    () => setShowDatePickerFechaTerminoFlag(Platform.OS === 'ios'),
  );

  const [showDatePickerFechaTerminoFlag, setShowDatePickerFechaTerminoFlag] = React.useState(false);

  const onChangeDateTimeFechaTermino = (event, selectedDate) => {
    const currentDate = selectedDate || dateFechaTermino;
    setDateFechaTermino(currentDate);
  };
  const showDatePickerFechaTermino = () => {
    setShowDatePickerFechaTerminoFlag(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: 'row', borderColor: '#BBB', borderBottomWidth: 0.5, marginBottom: 10 }}>
          <Text style={styles.label}>Tipo Doc </Text>
          <View style={{ width: 300, height: 40 }}>
            <Picker selectedValue={tipoDoc} style={styles.picker, styles.customInput}
              onValueChange={(itemValue, itemIndex) => setTipoDoc(itemValue)}>
              {listOfTipoDoc.map((item, key) => (
                <Picker.Item label={item.descripcion} value={item.id} key={item.id} />)
              )}
            </Picker>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderColor: '#BBB', borderBottomWidth: 0.5, marginBottom: 10 }}>
          <Text style={styles.label}>Categoria</Text>
          <View style={{ width: 300, height: 40 }}>
            <Picker selectedValue={category} style={styles.picker, styles.customInput}
              onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
              <Picker.Item label={'Todos'} value={-1} />
              {listOfCategories.map((item, key) => (
                <Picker.Item label={item.descripcion} value={item.id} key={item.id} />)
              )}
            </Picker>
          </View>
        </View>


        {/* DatePickers */}
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TextInput mode="outlined" dense='true' label='Fecha Inicio' value={dateFechaInicio && moment(dateFechaInicio).format('YYYY-MM-DD')}
            style={styles.customInput, styles.dateInputReadOnly} />
          <Button mode="contained" onPress={showDatePickerFechaInicio} style={styles.dateInputButton}> > </Button>
        </View>
        {showDatePickerFechaInicioFlag && (
          <DateTimePicker testID="dateTimePicker" value={dateFechaInicio || new Date()} mode="date"
            display="default" onChange={onChangeDateTimeFechaInicio}
          />
        )}
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TextInput mode="outlined" dense='true' label='Fecha Termino' value={dateFechaTermino && moment(dateFechaTermino).format('YYYY-MM-DD')}
            style={styles.customInput, styles.dateInputReadOnly} />
          <Button mode="contained" onPress={showDatePickerFechaTermino} style={styles.dateInputButton}> > </Button>
        </View>
        {showDatePickerFechaTerminoFlag && (
          <DateTimePicker testID="dateTimePicker" value={dateFechaTermino || new Date()} mode="date"
            display="default" onChange={onChangeDateTimeFechaTermino}
          />
        )}

        {/* Botones */}
        <View style={{ flexDirection: 'row-reverse' }}>
          <Button mode="contained" style={styles.customInput} onPress={getData}>Procesar</Button>
          <Button mode="outlined" style={{ marginBottom: 10, marginRight: 10 }}>Limpiar</Button>
        </View>


        {isLoading ? (
          <ProgressBar progress={1} indeterminate />
        ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 0.4 }}>Fecha</DataTable.Title>
                <DataTable.Title style={{ flex: 1.2 }}>Proposito</DataTable.Title>
                <DataTable.Title numeric style={{ flex: 0.5 }}>Monto</DataTable.Title>
                <DataTable.Title numeric style={{ flex: 0.4 }}>#</DataTable.Title>
              </DataTable.Header>

              {listOfData.map((item, key) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell style={{ flex: 0.5 }}>{moment(item.fecha).format('D MMM')}</DataTable.Cell>
                  <DataTable.Cell style={{ flex: 1.2 }}>{item.proposito}</DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 0.5 }}> {numeral(item.monto).format('0,0')}</DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 0.4 }} onPress={() => { console.log("Pressed") }}>

                    {/* <DeleteButton/> */}

                  </DataTable.Cell>
                </DataTable.Row>
              )
              )}

            </DataTable>
          )}

      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    padding: 10,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  label: {
    marginTop: 15
  },
  customInput: {
    marginBottom: 10
  },
  dateInputReadOnly: {
    width: '75%'
  },
  dateInputButton: {
    marginLeft: 5,
    marginTop: 5,
  },
});
