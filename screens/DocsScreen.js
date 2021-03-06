import * as React from 'react';
// Usamos Picker aunque este deprecated por compatibilidad
import { StyleSheet, Text, View, Animated } from 'react-native';
// Parece que aun hay problemas usando la version nueva de Picker Linking
// import {Picker} from '@react-native-community/picker';
import { Ionicons } from '@expo/vector-icons';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'
import TipoDocPicker from '../components/TipoDocPicker'

import axios from 'axios'
import numeral from 'numeral'

import moment from 'moment'
import 'moment/locale/es'
import _ from 'lodash'

import { DataTable, IconButton, Button, ProgressBar, Text as PaperText } from 'react-native-paper';

// https://software-mansion.github.io/react-native-gesture-handler/docs/component-swipeable.html
// https://github.com/software-mansion/react-native-gesture-handler/blob/master/Example/swipeable/AppleStyleSwipeableRow.js
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function DocsScreen({ navigation }) {

  // Simplemente ejecuta funcion Logout del Context (Asi modifica el estado de la App)
  // Se trae el prefix para acceder a la API
  const { logout, apiPrefix, getTheme } = React.useContext(AuthContext)

  //     _______..___________.     ___      .___________. _______ 
  //     /       ||           |    /   \     |           ||   ____|
  //    |   (----``---|  |----`   /  ^  \    `---|  |----`|  |__   
  //     \   \        |  |       /  /_\  \       |  |     |   __|  
  // .----)   |       |  |      /  _____  \      |  |     |  |____ 
  // |_______/        |__|     /__/     \__\     |__|     |_______|


  const [isLoading, setIsLoading] = React.useState(false);
  const [listOfData, setListOfData] = React.useState([]);
  const tipoDoc = React.useRef(1);
  const [tipoDocName, setTipoDocName] = React.useState('Gasto');

  // Variable que contiene la suma de todas las filas mostradas
  const sumaTotal = React.useRef(0);
  const [rowRefs, setRowRefs] = React.useState([]);

  // Set moment locale
  moment.locale('es')

  // .___________. __  .______     ______       _______    ______     ______ 
  // |           ||  | |   _  \   /  __  \     |       \  /  __  \   /      |
  // `---|  |----`|  | |  |_)  | |  |  |  |    |  .--.  ||  |  |  | |  ,----'
  //     |  |     |  | |   ___/  |  |  |  |    |  |  |  ||  |  |  | |  |     
  //     |  |     |  | |  |      |  `--'  |    |  '--'  ||  `--'  | |  `----.
  //     |__|     |__| | _|       \______/     |_______/  \______/   \______|

  const onUpdateTipoDoc = ({ id, descripcion }) => {
    tipoDoc.current = id
    setTipoDocName(descripcion)
    getDataAsync();
  }

  // .___________.     ___      .______    __       _______  _______       ___      .___________.     ___      
  // |           |    /   \     |   _  \  |  |     |   ____||       \     /   \     |           |    /   \     
  // `---|  |----`   /  ^  \    |  |_)  | |  |     |  |__   |  .--.  |   /  ^  \    `---|  |----`   /  ^  \    
  //     |  |       /  /_\  \   |   _  <  |  |     |   __|  |  |  |  |  /  /_\  \       |  |       /  /_\  \   
  //     |  |      /  _____  \  |  |_)  | |  `----.|  |____ |  '--'  | /  _____  \      |  |      /  _____  \  
  //     |__|     /__/     \__\ |______/  |_______||_______||_______/ /__/     \__\     |__|     /__/     \__\ 

  const getDataAsync = async () => {
    setIsLoading(true)
    // Reseteamos la variable que suma las filas mostradas en la tabla para volver a sumar
    sumaTotal.current = 0

    // Para los gastos solo muestra los gastos del mes. Para los demas Documentos muestra 
    // Todos los del Año
    let fechaInicio = ''
    let fechaTermino = ''
    if (tipoDoc.current == 1) {
      fechaInicio = moment().format('YYYY-MM') + '-01'
      fechaTermino = moment().format('YYYY-MM-') + moment().daysInMonth();
    } else {
      fechaInicio = moment().format('YYYY') + '-01-01'
      fechaTermino = moment().format('YYYY') + '-12-31'
    }
    // Obtiene la Session 
    var sessionHash = await AsyncStorage.getItem('session');
    let docs = await axios.get(apiPrefix + '/api/v1/api-endpoints/get-docs', {
      params: {
        fk_tipoDoc: tipoDoc.current,
        fechaInicio,
        fechaTermino,
        sessionHash
      }
    }).catch((err) => { console.log(err) })
    // Probablemente este Error es que el Token no es valido
    // Cerramos la Sesion
    if (docs.data.hasErrors) {
      logout(sessionHash)
    } else {
      // Recorremos el array para sumar el Total
      for (var doc of docs.data) {
        sumaTotal.current += doc.monto
      }
      setIsLoading(false)
      setListOfData(docs.data)
    }
  };

  //  _______  _______ .___________.  ______  __    __          ___      .______    __      __       __       _______..___________. _______ .__   __.  _______ .______       _______      _______.
  //  |   ____||   ____||           | /      ||  |  |  |        /   \     |   _  \  |  |    |  |     |  |     /       ||           ||   ____||  \ |  | |   ____||   _  \     |   ____|    /       |
  //  |  |__   |  |__   `---|  |----`|  ,----'|  |__|  |       /  ^  \    |  |_)  | |  |    |  |     |  |    |   (----``---|  |----`|  |__   |   \|  | |  |__   |  |_)  |    |  |__      |   (----`
  //  |   __|  |   __|      |  |     |  |     |   __   |      /  /_\  \   |   ___/  |  |    |  |     |  |     \   \        |  |     |   __|  |  . `  | |   __|  |      /     |   __|      \   \    
  //  |  |     |  |____     |  |     |  `----.|  |  |  |     /  _____  \  |  |      |  |    |  `----.|  | .----)   |       |  |     |  |____ |  |\   | |  |____ |  |\  \----.|  |____ .----)   |   
  //  |__|     |_______|    |__|      \______||__|  |__|    /__/     \__\ | _|      |__|    |_______||__| |_______/        |__|     |_______||__| \__| |_______|| _| `._____||_______||_______/    

  // Cada vez que le hacen Focus a esta pagina traemos los datos del Servidor
  // si se cambia de tab y vuelve sin modificar el estado del componente la lista queda con 
  // informacion absoleta (ejemplo, abrio aqui luego fue a añadir un registro y luego vuelve)
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataAsync();
    });
    return unsubscribe;
  }, [navigation]);


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


  // .______       _______ .__   __.  _______   _______ .______      
  // |   _  \     |   ____||  \ |  | |       \ |   ____||   _  \     
  // |  |_)  |    |  |__   |   \|  | |  .--.  ||  |__   |  |_)  |    
  // |      /     |   __|  |  . `  | |  |  |  ||   __|  |      /     
  // |  |\  \----.|  |____ |  |\   | |  '--'  ||  |____ |  |\  \----.
  // | _| `._____||_______||__| \__| |_______/ |_______|| _| `._____|                                                                

  // Notas en la renderizacion del Contenido
  // se uso la propiedad flex para controlar el ancho de las columnas y las celdas segun leido en Post
  // No parece ser la mejor forma pero es funcional

  // TODO. Ver si la paginacion es necesaria
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, alignItems: 'baseline', }}>
          <TipoDocPicker onUpdateTipoDoc={onUpdateTipoDoc} />
          <PaperText style={{ marginLeft: 10, fontSize: 16 }}>{tipoDocName}</PaperText>
        </View>
        {isLoading ? (
          <ProgressBar indeterminate />
        ) : (
          <View>
            <DataTable>
              <DataTable.Header style={styles.tableHeader, headerBg()}>
                <DataTable.Title style={{ flex: 0.4, paddingTop: 8 }}>
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
                    {/* moment.utc corrige el error que Moment parseara un dia menos */}
                    <DataTable.Cell style={{ flex: 0.5 }}>{moment.utc(item.fecha).format('D MMM')}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1.2 }}>{item.proposito}</DataTable.Cell>
                    <DataTable.Cell numeric style={{ flex: 0.5 }}> {numeral(item.monto).format('0,0')}</DataTable.Cell>
                  </DataTable.Row>
                </Swipeable>
              ))}
              {/* <DataTable.Pagination
            page={1}
            numberOfPages={3}
            onPageChange={(page) => { console.log(page); }}
            label="1-2 of 6"
          /> */}
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
  customInput: {
    marginBottom: 10
  },
  label: {
    marginTop: 15,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tableHeader: {
    height: 36
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
