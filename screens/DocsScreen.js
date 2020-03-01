import * as React from 'react';
import { StyleSheet, Text, View, Picker, ListView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import axios from 'axios'
import numeral from 'numeral'

import moment from 'moment'
import 'moment/locale/es'

import { DataTable, IconButton, Button, ProgressBar } from 'react-native-paper';

// https://software-mansion.github.io/react-native-gesture-handler/docs/component-swipeable.html
// https://github.com/software-mansion/react-native-gesture-handler/blob/master/Example/swipeable/AppleStyleSwipeableRow.js
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function DocsScreen({ navigation }) {

  //     _______..___________.     ___      .___________. _______ 
  //     /       ||           |    /   \     |           ||   ____|
  //    |   (----``---|  |----`   /  ^  \    `---|  |----`|  |__   
  //     \   \        |  |       /  /_\  \       |  |     |   __|  
  // .----)   |       |  |      /  _____  \      |  |     |  |____ 
  // |_______/        |__|     /__/     \__\     |__|     |_______|


  const [isLoading, setIsLoading] = React.useState(false);
  const [listOfData, setListOfData] = React.useState([]);
  const [tipoDoc, setTipoDoc] = React.useState(1);
  const [listOfTipoDoc, setListOfTipoDoc] = React.useState([]);
  const [selectedDoc, setSelectedDoc] = React.useState(-1);
  const [rowRefs, setRowRefs] = React.useState([]);


  // Set moment locale
  moment.locale('es')

  // .___________. __  .______     ______       _______    ______     ______ 
  // |           ||  | |   _  \   /  __  \     |       \  /  __  \   /      |
  // `---|  |----`|  | |  |_)  | |  |  |  |    |  .--.  ||  |  |  | |  ,----'
  //     |  |     |  | |   ___/  |  |  |  |    |  |  |  ||  |  |  | |  |     
  //     |  |     |  | |  |      |  `--'  |    |  '--'  ||  `--'  | |  `----.
  //     |__|     |__| | _|       \______/     |_______/  \______/   \______|

  // Extrae datos de la API y construye options. Equivalente a ejecutar en mounted?

  React.useEffect(() => {
    // Fetch dat from API and build Picker
    const getTipoDocAsync = async () => {
      let tipoDoc = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/get-tipo-doc').catch((err) => { console.log(err) })
      setListOfTipoDoc(tipoDoc.data)
    };
    getTipoDocAsync();
  }, []);

  // .___________.     ___      .______    __       _______  _______       ___      .___________.     ___      
  // |           |    /   \     |   _  \  |  |     |   ____||       \     /   \     |           |    /   \     
  // `---|  |----`   /  ^  \    |  |_)  | |  |     |  |__   |  .--.  |   /  ^  \    `---|  |----`   /  ^  \    
  //     |  |       /  /_\  \   |   _  <  |  |     |   __|  |  |  |  |  /  /_\  \       |  |       /  /_\  \   
  //     |  |      /  _____  \  |  |_)  | |  `----.|  |____ |  '--'  | /  _____  \      |  |      /  _____  \  
  //     |__|     /__/     \__\ |______/  |_______||_______||_______/ /__/     \__\     |__|     /__/     \__\ 

  const getDataAsync = async () => {
    setIsLoading(true)

    // Para los gastos solo muestra los gastos del mes. Para los demas Documentos muestra 
    // Todos los del Año
    let fechaInicio = ''
    let fechaTermino = ''
    if (tipoDoc == 1) {
      fechaInicio = moment().format('YYYY-MM') + '-01'
      fechaTermino = moment().format('YYYY-MM') + '-31'
    } else {
      fechaInicio = moment().format('YYYY') + '-01-01'
      fechaTermino = moment().format('YYYY') + '-12-01'
    }
    let docs = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/get-docs', {
      params: {
        fk_tipoDoc: tipoDoc,
        fechaInicio,
        fechaTermino
      }
    }).catch((err) => { console.log(err) })
    setIsLoading(false)
    setListOfData(docs.data)
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


  // Este hook siempre esta atento a la variable tipoDoc especificada como ultimo argumento
  // cada vez que la variable cambia se ejecuta este hook especificamente.
  // si no se especifica o es [] (vacio) el hook solo se ejecuta on loaded sin mirar variables
  React.useEffect(() => {
    // Fetch dat from API to build Table
    getDataAsync();
  }, [tipoDoc]);



  // .______     ______   .___________.  ______   .__   __.  _______      _______.
  // |   _  \   /  __  \  |           | /  __  \  |  \ |  | |   ____|    /       |
  // |  |_)  | |  |  |  | `---|  |----`|  |  |  | |   \|  | |  |__      |   (----`
  // |   _  <  |  |  |  |     |  |     |  |  |  | |  . `  | |   __|      \   \    
  // |  |_)  | |  `--'  |     |  |     |  `--'  | |  |\   | |  |____ .----)   |   
  // |______/   \______/      |__|      \______/  |__| \__| |_______||_______/    

  // Funcion que renderiza Los botones al Swiped
  const renderRightAction = (text, color, x, progress, icon) => {
    // Calcula transformacion de los botones en funcion del movimiento
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      if (text == 'modify') {
        // Abrir Activity de Modificar
      } else if (text == 'delete') {
        // Enviar al Servidor la eliminacion de este Registro y recargar la tabla
      }
    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}>
          {/* <Text style={styles.actionText}>{text}</Text> */}
          <Ionicons name={icon} size={20} style={{ marginBottom: -3 }} color={"white"} />
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = progress => (
    <View style={{ width: 100, flexDirection: 'row' }}>
      {renderRightAction('modify', '#f8a501', 100, progress, 'md-create')}
      {renderRightAction('delete', '#a21d38', 50, progress, 'md-trash')}
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
    // Guardamos el Identifier para poder Referenciarlo cuando enviemos al Servidor
    setSelectedDoc(identifier)

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
        <View style={{ flexDirection: 'row', borderColor: '#BBB', borderBottomWidth: 0.5, marginBottom: 10 }}>
          <Text style={styles.label}>Tipo Doc</Text>
          <View style={{ width: 300, height: 40 }}>
            <Picker selectedValue={tipoDoc} style={styles.picker, styles.customInput}
              onValueChange={(itemValue, itemIndex) => setTipoDoc(itemValue)}>
              {listOfTipoDoc.map((item, key) => (
                <Picker.Item label={item.descripcion} value={item.id} key={item.id} />)
              )}
            </Picker>
          </View>
        </View>
        {isLoading ? (
          <ProgressBar indeterminate />
        ) : (
            <DataTable>
              <DataTable.Header style={styles.tableHeader}>
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
                <Swipeable renderRightActions={renderRightActions} key={item.id} identifier={item.id} friction={1} ref={collectRowRefs}
                  overshootFriction={4} onSwipeableRightOpen={() => closeOtherSwipeables(item.id)}>
                  <DataTable.Row style={key % 2 == 0 && styles.oddRows}>
                    <DataTable.Cell style={{ flex: 0.5 }}>{moment(item.fecha).format('D MMM')}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1.2 }}>{item.proposito}</DataTable.Cell>
                    <DataTable.Cell numeric style={{ flex: 0.5 }}> {numeral(item.monto).format('0,0')}</DataTable.Cell>
                  </DataTable.Row>
                </Swipeable>
              )
              )}

              {/* <DataTable.Pagination
            page={1}
            numberOfPages={3}
            onPageChange={(page) => { console.log(page); }}
            label="1-2 of 6"
          /> */}
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
  },
  customInput: {
    marginBottom: 10
  },
  label: {
    marginTop: 15
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
