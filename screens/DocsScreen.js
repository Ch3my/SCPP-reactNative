import * as React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import axios from 'axios'
import numeral from 'numeral'

import moment from 'moment'
import 'moment/locale/es'


import { DataTable, IconButton, Button, ProgressBar } from 'react-native-paper';

export default function DocsScreen() {

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


  // .___________.     ___      .______    __       _______  _______       ___      .___________.     ___      
  // |           |    /   \     |   _  \  |  |     |   ____||       \     /   \     |           |    /   \     
  // `---|  |----`   /  ^  \    |  |_)  | |  |     |  |__   |  .--.  |   /  ^  \    `---|  |----`   /  ^  \    
  //     |  |       /  /_\  \   |   _  <  |  |     |   __|  |  |  |  |  /  /_\  \       |  |       /  /_\  \   
  //     |  |      /  _____  \  |  |_)  | |  `----.|  |____ |  '--'  | /  _____  \      |  |      /  _____  \  
  //     |__|     /__/     \__\ |______/  |_______||_______||_______/ /__/     \__\     |__|     /__/     \__\ 

  // const [tipoDoc, setTipoDoc] = React.useState(1);
  const [listOfData, setListOfData] = React.useState([]);

  // Este hook siempre esta atento a la variable tipoDoc especificada como ultimo argumento
  // cada vez que la variable cambia se ejecuta este hook especificamente.
  // si no se especifica o es [] (vacio) el hook solo se ejecuta on loaded sin mirar variables
  React.useEffect(() => {
    // Fetch dat from API to build Table
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
    getDataAsync();
  }, [tipoDoc]);


  // .______     ______   .___________.  ______   .__   __.  _______      _______.
  // |   _  \   /  __  \  |           | /  __  \  |  \ |  | |   ____|    /       |
  // |  |_)  | |  |  |  | `---|  |----`|  |  |  | |   \|  | |  |__      |   (----`
  // |   _  <  |  |  |  |     |  |     |  |  |  | |  . `  | |   __|      \   \    
  // |  |_)  | |  `--'  |     |  |     |  `--'  | |  |\   | |  |____ .----)   |   
  // |______/   \______/      |__|      \______/  |__| \__| |_______||_______/    


  const DeleteButton = () => {
    return (
      <IconButton
        icon="camera"
        size={20}
        onPress={() => console.log('Pressed')}
        animated
      />
    )

  }


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
          <ProgressBar progress={1} indeterminate/>
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
});
