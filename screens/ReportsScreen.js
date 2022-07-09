import * as React from 'react';
import { StyleSheet, Text, View, Platform, Animated, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'
import TipoDocPicker from '../components/TipoDocPicker'
import CategoriaPicker from '../components/CategoriaPicker'

import axios from 'axios'
import numeral from 'numeral'

import moment from 'moment'
import 'moment/locale/es'

import { DataTable, IconButton, Button, ProgressBar, TextInput, Text as PaperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function ReportsScreen({ navigation }) {

  const [isLoading, setIsLoading] = React.useState(false);
  const [rowRefs, setRowRefs] = React.useState([]);
  const [searchPhrase, setSearchPhrase] = React.useState('')
  // Variable que contiene la suma de todas las filas mostradas
  const sumaTotal = React.useRef(0);
  // Se trae el prefix para acceder a la API
  const { apiPrefix, getTheme } = React.useContext(AuthContext)

  // Set moment locale
  moment.locale('es')

  // .___________. __  .______     ______       _______    ______     ______ 
  // |           ||  | |   _  \   /  __  \     |       \  /  __  \   /      |
  // `---|  |----`|  | |  |_)  | |  |  |  |    |  .--.  ||  |  |  | |  ,----'
  //     |  |     |  | |   ___/  |  |  |  |    |  |  |  ||  |  |  | |  |     
  //     |  |     |  | |  |      |  `--'  |    |  '--'  ||  `--'  | |  `----.
  //     |__|     |__| | _|       \______/     |_______/  \______/   \______|

  const [tipoDoc, setTipoDoc] = React.useState(null);
  const [tipoDocName, setTipoDocName] = React.useState('');

  const onUpdateTipoDoc = ({ id, descripcion }) => {
    setTipoDoc(id)
    setTipoDocName(descripcion)
  }

  // .______    __    ______  __  ___  _______ .______           ______      ___      .___________. _______   _______   ______   .______       __       ___      
  // |   _  \  |  |  /      ||  |/  / |   ____||   _  \         /      |    /   \     |           ||   ____| /  _____| /  __  \  |   _  \     |  |     /   \     
  // |  |_)  | |  | |  ,----'|  '  /  |  |__   |  |_)  |       |  ,----'   /  ^  \    `---|  |----`|  |__   |  |  __  |  |  |  | |  |_)  |    |  |    /  ^  \    
  // |   ___/  |  | |  |     |    <   |   __|  |      /        |  |       /  /_\  \       |  |     |   __|  |  | |_ | |  |  |  | |      /     |  |   /  /_\  \   
  // |  |      |  | |  `----.|  .  \  |  |____ |  |\  \----.   |  `----. /  _____  \      |  |     |  |____ |  |__| | |  `--'  | |  |\  \----.|  |  /  _____  \  
  // | _|      |__|  \______||__|\__\ |_______|| _| `._____|    \______|/__/     \__\     |__|     |_______| \______|  \______/  | _| `._____||__| /__/     \__\ 

  const [category, setCategory] = React.useState(null);
  const [categoriaName, setCategoriaName] = React.useState('');

  const onUpdateCategoria = ({ id, descripcion }) => {
    setCategory(id)
    setCategoriaName(descripcion)
  }

  // .___________.     ___      .______    __       _______  _______       ___      .___________.     ___      
  // |           |    /   \     |   _  \  |  |     |   ____||       \     /   \     |           |    /   \     
  // `---|  |----`   /  ^  \    |  |_)  | |  |     |  |__   |  .--.  |   /  ^  \    `---|  |----`   /  ^  \    
  //     |  |       /  /_\  \   |   _  <  |  |     |   __|  |  |  |  |  /  /_\  \       |  |       /  /_\  \   
  //     |  |      /  _____  \  |  |_)  | |  `----.|  |____ |  '--'  | /  _____  \      |  |      /  _____  \  
  //     |__|     /__/     \__\ |______/  |_______||_______||_______/ /__/     \__\     |__|     /__/     \__\ 

  // const [tipoDoc, setTipoDoc] = React.useState(1);
  const [listOfData, setListOfData] = React.useState([]);

  const getDataAsync = async () => {
    // Esconde el Teclado
    Keyboard.dismiss()

    // Pone la tabla en estado de carga
    setIsLoading(true)

    // Reseteamos la variable que suma las filas mostradas en la tabla para volver a sumar
    sumaTotal.current = 0

    let fechaInicio = dateFechaInicio || null
    let fechaTermino = dateFechaTermino || null

    // Obtiene la Session 
    var sessionHash = await AsyncStorage.getItem('session');
    // Nos aseguramos de pasar la fecha con formato correcto o null si corresponde. Por si acaso
    // sino se va con la hora tambien
    let docs = await axios.get(apiPrefix + '/documentos', {
      params: {
        fk_tipoDoc: tipoDoc,
        fk_categoria: category,
        fechaInicio: fechaInicio == null ? null : moment(fechaInicio).format('YYYY-MM-DD'),
        fechaTermino: fechaTermino == null ? null : moment(fechaTermino).format('YYYY-MM-DD'),
        sessionHash: sessionHash,
        searchPhrase: searchPhrase
      }
    }).catch((err) => { console.log(err) })
    // Recorremos el array para sumar el Total
    for (var doc of docs.data) {
      sumaTotal.current += doc.monto
    }
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
  const [dateFechaInicio, setDateFechaInicio] = React.useState();
  const [showDatePickerFechaInicioFlag, setShowDatePickerFechaInicioFlag] = React.useState(false);

  const onChangeDateTimeFechaInicio = (event, selectedDate) => {
    setShowDatePickerFechaInicioFlag(false)
    const currentDate = selectedDate || dateFechaInicio;
    setDateFechaInicio(currentDate);
  };
  const showDatePickerFechaInicio = () => {
    setShowDatePickerFechaInicioFlag(true);
  };

  // Fecha Termino Picker
  const [dateFechaTermino, setDateFechaTermino] = React.useState()
  const [showDatePickerFechaTerminoFlag, setShowDatePickerFechaTerminoFlag] = React.useState(false);

  const onChangeDateTimeFechaTermino = (event, selectedDate) => {
    setShowDatePickerFechaTerminoFlag(false)
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
          await axios.delete(apiPrefix + '/api/v1/api-endpoints/delete-doc', { data: { id, sessionHash } });
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

  function clearForm() {
    // Seteamos todos los estados a null para no enviar a la API
    // y obtener los resultados esperados
    onUpdateTipoDoc({id: null, descripcion: null})
    setDateFechaTermino(null)
    setDateFechaInicio(null)
    setSearchPhrase('')
    onUpdateCategoria({id: null, descripcion: null})
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, alignItems: 'baseline', }}>
          <TipoDocPicker onUpdateTipoDoc={onUpdateTipoDoc} hideKeyboardOnShow={true} />
          <PaperText style={{ marginLeft: 10, fontSize: 16 }}>{tipoDocName}</PaperText>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, alignItems: 'baseline', }}>
          <CategoriaPicker onUpdateCategoria={onUpdateCategoria} hideKeyboardOnShow={true} />
          <PaperText style={{ marginLeft: 10, fontSize: 16 }}>{categoriaName}</PaperText>
        </View>
        {/* Texto de Busqueda */}
        <TextInput mode="outlined" dense='true' label='Buscar' value={searchPhrase}
          style={styles.customInput} onChangeText={text => setSearchPhrase(text)} />

        {/* DatePickers */}
        <View style={{ flexDirection: 'row' }}>
          <TextInput mode="outlined" dense='true' label='Fecha Inicio' value={dateFechaInicio && moment(dateFechaInicio).format('YYYY-MM-DD')}
            style={[styles.customInput, styles.dateInputReadOnly]} />
          <Button mode="contained" onPress={showDatePickerFechaInicio} style={styles.dateInputButton}> &gt; </Button>
        </View>
        {showDatePickerFechaInicioFlag && (
          <DateTimePicker testID="dateTimePicker" value={dateFechaInicio || new Date()} mode="date"
            display="default" onChange={onChangeDateTimeFechaInicio}
          />
        )}
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TextInput mode="outlined" dense='true' label='Fecha Termino' value={dateFechaTermino && moment(dateFechaTermino).format('YYYY-MM-DD')}
            style={[styles.customInput, styles.dateInputReadOnly]} />
          <Button mode="contained" onPress={showDatePickerFechaTermino} style={styles.dateInputButton}> &gt; </Button>
        </View>
        {showDatePickerFechaTerminoFlag && (
          <DateTimePicker testID="dateTimePicker" value={dateFechaTermino || new Date()} mode="date"
            display="default" onChange={onChangeDateTimeFechaTermino}
          />
        )}

        {/* Botones */}
        <View style={{ flexDirection: 'row-reverse' }}>
          <Button mode="contained" style={styles.customInput} onPress={getDataAsync}>Procesar</Button>
          <Button mode="outlined" style={[styles.customInput, {marginRight: 10}]} onPress={clearForm}>Limpiar</Button>
        </View>


        {isLoading ? (
          <ProgressBar progress={1} indeterminate />
        ) : (
          <View>
            <DataTable>
              <DataTable.Header style={[styles.tableHeader, headerBg()]}>
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
                  <DataTable.Row style={key % 2 == 0 && oddRowsProcessewdStyle(getTheme())}>
                    <DataTable.Cell style={{ flex: 0.5 }}>{moment.utc(item.fecha).format('D MMM YY')}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1.2 }}>{item.proposito}</DataTable.Cell>
                    <DataTable.Cell numeric style={{ flex: 0.5 }}> {numeral(item.monto).format('0,0')}</DataTable.Cell>
                  </DataTable.Row>
                </Swipeable>
              ))}
            </DataTable>
            <View style={styles.totalDiv}>
              <PaperText>Total $ {numeral(sumaTotal.current).format('0,0')}</PaperText>
            </View>
          </View>
        )}

      </View>
    </ScrollView>
  );
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  label: {
    marginTop: 15
  },
  customInput: {
    marginBottom: 5,
  },
  dateInputReadOnly: {
    width: '75%'
  },
  dateInputButton: {
    marginLeft: 5,
    marginTop: 5,
    height: 43
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
    height: 42
  },
  tableHeaderText: {
    fontSize: 13
  },
  totalDiv: {
    alignItems: 'flex-end',
    padding: 15,
    marginTop: 20
  }
});
