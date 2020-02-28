import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Picker, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import { TextInput, Button, Banner } from 'react-native-paper';
import axios from 'axios'
// Imports para el DatePicker
import DateTimePicker from '@react-native-community/datetimepicker';
import useStateWithCallback from 'use-state-with-callback';

// import { TextInputMask } from 'react-native-masked-text'

import moment from 'moment'

export default function AddRecordScreen() {
    // _______   ______   .______      .___  ___.     _______       ___      .___________.     ___      
    // |   ____| /  __  \  |   _  \     |   \/   |    |       \     /   \     |           |    /   \     
    // |  |__   |  |  |  | |  |_)  |    |  \  /  |    |  .--.  |   /  ^  \    `---|  |----`   /  ^  \    
    // |   __|  |  |  |  | |      /     |  |\/|  |    |  |  |  |  /  /_\  \       |  |       /  /_\  \   
    // |  |     |  `--'  | |  |\  \----.|  |  |  |    |  '--'  | /  _____  \      |  |      /  _____  \  
    // |__|      \______/  | _| `._____||__|  |__|    |_______/ /__/     \__\     |__|     /__/     \__\                                                                                                     

    const [proposito, setProposito] = React.useState('')
    const [monto, setMonto] = React.useState('')


    //  __    __       _______. _______ .______          _______  _______  _______  _______  .______        ___        ______  __  ___ 
    //  |  |  |  |     /       ||   ____||   _  \        |   ____||   ____||   ____||       \ |   _  \      /   \      /      ||  |/  / 
    //  |  |  |  |    |   (----`|  |__   |  |_)  |       |  |__   |  |__   |  |__   |  .--.  ||  |_)  |    /  ^  \    |  ,----'|  '  /  
    //  |  |  |  |     \   \    |   __|  |      /        |   __|  |   __|  |   __|  |  |  |  ||   _  <    /  /_\  \   |  |     |    <   
    //  |  `--'  | .----)   |   |  |____ |  |\  \----.   |  |     |  |____ |  |____ |  '--'  ||  |_)  |  /  _____  \  |  `----.|  .  \  
    //   \______/  |_______/    |_______|| _| `._____|   |__|     |_______||_______||_______/ |______/  /__/     \__\  \______||__|\__\ 

    // Feedback para el usuario
    const [feedback, setFeedback] = React.useState(false)
    const [feedbackDescription, setFeedbackDescription] = React.useState('')


    //  __    __       ___      .__   __.  _______   __       _______ .______        ___      .______           _______. __  .__   __.   _______ 
    //  |  |  |  |     /   \     |  \ |  | |       \ |  |     |   ____||   _  \      /   \     |   _  \         /       ||  | |  \ |  |  /  _____|
    //  |  |__|  |    /  ^  \    |   \|  | |  .--.  ||  |     |  |__   |  |_)  |    /  ^  \    |  |_)  |       |   (----`|  | |   \|  | |  |  __  
    //  |   __   |   /  /_\  \   |  . `  | |  |  |  ||  |     |   __|  |   ___/    /  /_\  \   |      /         \   \    |  | |  . `  | |  | |_ | 
    //  |  |  |  |  /  _____  \  |  |\   | |  '--'  ||  `----.|  |____ |  |       /  _____  \  |  |\  \----..----)   |   |  | |  |\   | |  |__| | 
    //  |__|  |__| /__/     \__\ |__| \__| |_______/ |_______||_______|| _|      /__/     \__\ | _| `._____||_______/    |__| |__| \__|  \______| 

    const saveNewRecord = async () => {
        var argins = {
            fk_categoria: category,
            fk_tipoDoc: tipoDoc,
            proposito: proposito,
            monto: monto,
            fecha: moment(date).format('YYYY-MM-DD')
        }

        // Verificar que todos los campos estan Llenos
        if (argins.fk_categoria == '' || argins.fk_tipoDoc == '' || argins.proposito == '' || argins.monto == '' || argins.fecha == '') {
            setFeedback(true)
            setFeedbackDescription('Debes llenar todos los campos xD')
        }

        // TODO. Verificar que se grabo
        axios.post('https://scpp.herokuapp.com/api/v1/api-endpoints/post-save-doc', argins)
            .then(function (response) {
                if (response.data.hasErrors) {
                    setFeedback(true)
                    setFeedbackDescription(response.data.errorDescription)
                } else {
                    setFeedback(true)
                    setFeedbackDescription('Se ha grabado con Exito :D')
                    setTimeout(() => { setFeedback(false) }, 3000)
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    // ==============================================================
    // Funcion para limpiar el Formulario
    const clearForm = () => {
        // Limpiamos las variables del Formulario
        setMonto('')
        setProposito('')
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
    const [date, setDate] = useStateWithCallback(
        new Date(),
        () => setShow(Platform.OS === 'ios'),
    );
    const [show, setShow] = React.useState(false);

    const onChangeDateTime = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        // setShow(Platform.OS === 'ios' ? true : false);
    };
    const showDatepicker = () => {
        setShow(true);
    };


    // .______    __    ______  __  ___  _______ .______           ______      ___      .___________. _______   _______   ______   .______       __       ___      
    // |   _  \  |  |  /      ||  |/  / |   ____||   _  \         /      |    /   \     |           ||   ____| /  _____| /  __  \  |   _  \     |  |     /   \     
    // |  |_)  | |  | |  ,----'|  '  /  |  |__   |  |_)  |       |  ,----'   /  ^  \    `---|  |----`|  |__   |  |  __  |  |  |  | |  |_)  |    |  |    /  ^  \    
    // |   ___/  |  | |  |     |    <   |   __|  |      /        |  |       /  /_\  \       |  |     |   __|  |  | |_ | |  |  |  | |      /     |  |   /  /_\  \   
    // |  |      |  | |  `----.|  .  \  |  |____ |  |\  \----.   |  `----. /  _____  \      |  |     |  |____ |  |__| | |  `--'  | |  |\  \----.|  |  /  _____  \  
    // | _|      |__|  \______||__|\__\ |_______|| _| `._____|    \______|/__/     \__\     |__|     |_______| \______|  \______/  | _| `._____||__| /__/     \__\ 

    // Extrae datos de la API y construye options. Equivalente a ejecutar en mounted?

    const [category, setCategory] = React.useState(2);
    const [listOfCategories, setListOfCategories] = React.useState([]);

    React.useEffect(() => {
        // Fetch dat from API and build Picker
        const getCategoriasAsync = async () => {
            let categorias = await axios.get('https://scpp.herokuapp.com/api/v1/api-endpoints/get-categorias').catch((err) => { console.log(err) })
            setListOfCategories(categorias.data)
        };
        getCategoriasAsync();
    }, []);


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

    // Maneja el Evento cuando Cambian el Select si no es categoria Gasto deja como Null la categoria
    const onChangeTipoDoc = (itemValue) => {
        setTipoDoc(itemValue)
        if (itemValue != 1) {
            setCategory(null)
        } else {
            // Reset la Categoria a valor por Defecto
            setCategory(2)
        }
    }


    return (
        <View style={styles.container}>
            <Banner visible={feedback}
                actions={[{
                    label: 'Okay',
                    onPress: () => setFeedback(false),
                }, {
                    label: 'Limpiar',
                    onPress: () => {
                        clearForm()
                        setFeedback(false)
                    },
                },
                ]}>
                <Text>{feedbackDescription}</Text>
            </Banner>
            <View>
                <ScrollView style={styles.contentContainer}>

                    <TextInput mode="outlined" dense='true' label='Monto' value={monto} style={styles.customInput}
                        onChangeText={text => setMonto(text)} keyboardType={'numeric'} />
                    <TextInput mode="outlined" dense='true' label='Propósito' value={proposito} style={styles.customInput}
                        onChangeText={text => setProposito(text)} />

                    {show && (
                        <DateTimePicker testID="dateTimePicker" value={date} mode="date"
                            display="default" onChange={onChangeDateTime}
                        />
                    )}
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput mode="outlined" dense='true' label='Fecha' value={moment(date).format('YYYY-MM-DD')}
                            style={styles.customInput, styles.dateInputReadOnly} />
                        <Button mode="contained" onPress={showDatepicker} style={styles.dateInputButton}> > </Button>
                    </View>

                    <View style={{ flexDirection: 'row', borderColor: '#BBB', borderBottomWidth: 0.5, marginBottom: 10 }}>
                        <Text style={{marginTop: 30}}>Tipo Doc </Text>
                        <View style={{ width: 300, height: 40, marginTop: 15 }}>
                            <Picker selectedValue={tipoDoc} style={styles.picker, styles.customInput}
                                onValueChange={(itemValue, itemIndex) => onChangeTipoDoc(itemValue)}>
                                {listOfTipoDoc.map((item, key) => (
                                    <Picker.Item label={item.descripcion} value={item.id} key={item.id} />)
                                )}
                            </Picker>
                        </View>
                    </View>

                    {category && (
                        <View style={{ flexDirection: 'row', borderColor: '#BBB', borderBottomWidth: 0.5 }}>
                            <Text style={styles.label}>Categoria</Text>
                            <View style={{ width: 300, height: 40 }}>
                                <Picker selectedValue={category} style={styles.picker, styles.customInput}
                                    onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
                                    {listOfCategories.map((item, key) => (
                                        <Picker.Item label={item.descripcion} value={item.id} key={item.id} />)
                                    )}
                                </Picker>
                            </View>
                        </View>
                    )}

                    <Button mode="contained" onPress={saveNewRecord} style={styles.customInput, styles.saveButton} >Guardar</Button>
                    <Button mode="outlined" style={styles.customInput, styles.saveButton} onPress={clearForm}>Limpiar</Button>

                </ScrollView>
            </View>
        </View >

    );
}

// AddRecordScreen.navigationOptions = {
//   header: null,
// };

// NOTAS. Al picker no pude hacerlo outlined asi que simule algo parecido usando un View

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 10,
    },
    customInput: {
        marginBottom: 10
    },
    picker: {
        // height: 50,
        // width: '100%',
    },
    dateInputReadOnly: {
        width: '75%'
    },
    dateInputButton: {
        marginLeft: 5,
        marginTop: 5,
    },
    label: {
        marginTop: 15
    },
    saveButton: {
        marginTop: 30
    }
});
