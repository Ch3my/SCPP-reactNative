import * as React from 'react';
import { StyleSheet, Text, View, Picker, Platform, AsyncStorage, Animated } from 'react-native';
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

import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function ReportsScreen({ navigation }) {

  const [isLoading, setIsLoading] = React.useState(false);
  const [rowRefs, setRowRefs] = React.useState([]);
  const [searchPhrase, setSearchPhrase] = React.useState('')  

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
      // Obtiene la Session 
      var sessionHash = await AsyncStorage.getItem('session');
      let tipoDoc = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/get-tipo-doc',
        {
          params: {
            sessionHash
          }
        }).catch((err) => { console.log(err) })
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

  const getDataAsync = async () => {
    setIsLoading(true)

    // Asume Fechas que el usuario ingreso o Todo el Año en Defecto 
    let fechaInicio = dateFechaInicio || moment().format('YYYY-01-01')
    let fechaTermino = dateFechaTermino || moment().format('YYYY-12-31')

    let categoryReq = ''
    // Verifica si la categoria es -1. Si lo es en realidad setea la variable envia como Undefined
    if (category == -1) {
      // No hacemos nada. Se va por Defecto Vacia
    } else {
      // Tiene algun Valor. Enviamos a la Req
      categoryReq = category
    }

    // Obtiene la Session 
    var sessionHash = await AsyncStorage.getItem('session');
    let docs = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/get-docs', {
      params: {
        fk_tipoDoc: tipoDoc,
        fk_categoria: categoryReq,
        fechaInicio,
        fechaTermino,
        sessionHash,
        searchPhrase
      }
    }).catch((err) => { console.log(err) })
    setIsLoading(false)
    setListOfData(docs.data)

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

  // .______     ______   .___________.  ______   .__   __.  _______      _______.
  // |   _  \   /  __  \  |           | /  __  \  |  \ |  | |   ____|    /       |
  // |  |_)  | |  |  |  | `---|  |----`|  |  |  | |   \|  | |  |__      |   (----`
  // |   _  <  |  |  |  |     |  |     |  |  |  | |  . `  | |   __|      \   \    
  // |  |_)  | |  `--'  |     |  |     |  `--'  | |  |\   | |  |____ .----)   |   
  // |______/   \______/      |__|      \______/  |__| \__| |_______||_______/    

  // Funcion que renderiza Los botones al Swiped
  const renderRightAction = (text, color, x, progress, icon, id) => {
    // Calcula transformacion de los botones en funcion del movimiento
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = async id => {
      // alert(id)
      if (text == 'modify') {
        // Abrir Activity de Modificar
        // Navigate to the Edit route with params 
        navigation.navigate('EditRecord', { id });      
      } else if (text == 'delete') {
        try {
          // Obtiene la Session 
          var sessionHash = await AsyncStorage.getItem('session');
          // Enviar al Servidor la eliminacion de este Registro y recargar la tabla
          await axios.delete('https://scpp.herokuapp.com/api/v1/api-endpoints/delete-doc', { data: { id, sessionHash } });
          getDataAsync();
        } catch (e) {
          console.log("Error al eliminar Documento")
          console.log(e)
        }
      }
    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={() => pressHandler(id)}>
          {/* <Text style={styles.actionText}>{text}</Text> */}
          <Ionicons name={icon} size={20} style={{ marginBottom: -3 }} color={"white"} />
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (progress, id) => (
    // La variable progress es algo que Swipeable Component entrega
    <View style={{ width: 100, flexDirection: 'row' }}>
      {renderRightAction('modify', '#f8a501', 100, progress, 'md-create', id)}
      {renderRightAction('delete', '#a21d38', 50, progress, 'md-trash', id)}
    </View>
  );
  const collectRowRefs = (ref) => {
    // Obtenemos y guardamos todos los refs de los swipeables para poder ejecutar sus funciones internas
    // (como cerrarlos) a voluntad
    // Por alguna razon a veces se creaban refs nulls. Asi que añadimos una verificacion
    // TODO. averiguar porque se crean refs Nulls. Es intermitente?
    if (ref != null) {
      rowRefs.push(ref)
    }
  }
  const closeOtherSwipeables = identifier => {
    // Cuando abren un Row cerramos todos los demas
    // console.time("closeOtherSwipeables")
    rowRefs.forEach((ref) => {
      if (identifier != ref.props.identifier) {
        ref.close();
      }
    });
    // console.timeEnd("closeOtherSwipeables")
  }


  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
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
        {/* Texto de Busqueda */}
        <TextInput mode="outlined" dense='true' label='Buscar' value={searchPhrase}
            style={styles.customInput } onChangeText={text => setSearchPhrase(text)}/>

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
          <Button mode="contained" style={styles.customInput} onPress={getDataAsync}>Procesar</Button>
          <Button mode="outlined" style={{ marginBottom: 10, marginRight: 10 }}>Limpiar</Button>
        </View>


        {isLoading ? (
          <ProgressBar progress={1} indeterminate />
        ) : (
            <DataTable>
              <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title style={{ flex: 0.5, paddingTop: 8 }}>
                  <Text style={styles.tableHeaderText}>Fecha</Text>
                </DataTable.Title>
                <DataTable.Title style={{ flex: 1.2, paddingTop: 8 }}>
                  <Text style={styles.tableHeaderText}>Proposito</Text>
                </DataTable.Title>
                <DataTable.Title numeric style={{ flex: 0.5, paddingTop: 8 }}>
                  <Text style={styles.tableHeaderText}>Monto</Text>
                </DataTable.Title>
              </DataTable.Header>

              {listOfData.map((item, key) => (
                <Swipeable renderRightActions={progress => renderRightActions(progress, item.id)} key={item.id} identifier={item.id} friction={1} ref={collectRowRefs}
                  overshootFriction={4} onSwipeableRightOpen={() => closeOtherSwipeables(item.id)}>
                  <DataTable.Row style={key % 2 == 0 && styles.oddRows}>
                    <DataTable.Cell style={{ flex: 0.5 }}>{moment(item.fecha).format('D MMM YY')}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1.2 }}>{item.proposito}</DataTable.Cell>
                    <DataTable.Cell numeric style={{ flex: 0.5 }}> {numeral(item.monto).format('0,0')}</DataTable.Cell>
                  </DataTable.Row>
                </Swipeable>
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
    marginBottom: 10,
  },
  dateInputReadOnly: {
    width: '75%'
  },
  dateInputButton: {
    marginLeft: 5,
    marginTop: 5,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  oddRows: {
    backgroundColor: '#def5ff'
  },
  tableHeader: {
    backgroundColor: '#4aaacf',
    height: 36
  },
  tableHeaderText: {
    fontSize: 13
  }
});
