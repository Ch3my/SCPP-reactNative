import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput, Button, Banner, Text as PaperText } from 'react-native-paper';
import axios from 'axios'
// Imports para el DatePicker
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'
import TipoDocPicker from '../components/TipoDocPicker'
import CategoriaPicker from '../components/CategoriaPicker'

import { TextInputMask } from 'react-native-masked-text'

import moment from 'moment'

export default function AddRecordScreen() {

    // Se trae el prefix para acceder a la API
    const { apiPrefix } = React.useContext(AuthContext)

    // _______   ______   .______      .___  ___.     _______       ___      .___________.     ___      
    // |   ____| /  __  \  |   _  \     |   \/   |    |       \     /   \     |           |    /   \     
    // |  |__   |  |  |  | |  |_)  |    |  \  /  |    |  .--.  |   /  ^  \    `---|  |----`   /  ^  \    
    // |   __|  |  |  |  | |      /     |  |\/|  |    |  |  |  |  /  /_\  \       |  |       /  /_\  \   
    // |  |     |  `--'  | |  |\  \----.|  |  |  |    |  '--'  | /  _____  \      |  |      /  _____  \  
    // |__|      \______/  | _| `._____||__|  |__|    |_______/ /__/     \__\     |__|     /__/     \__\                                                                                                     

    const [proposito, setProposito] = React.useState('')
    const [monto, setMonto] = React.useState('')
    const [isNegativeAmount, setIsNegativeAmount] = React.useState(false)
    const [dynamicButtomColor, setDynamicButtomColor] = React.useState('#007bff')



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
        // Parece que se puede usar un metodo getRaw su usamos un ref en el Masked input
        // por ahora solo lo manejamos asi
        var calculatedMonto = monto.replace(/\,/g, "").replace(/\$/g, "").trim()
        // Si esta marcado el Flag de Numero Negativo, lo ponemos negativo
        if (isNegativeAmount) {
            calculatedMonto = calculatedMonto * -1
        }

        var argins = {
            fk_categoria: category,
            fk_tipoDoc: tipoDoc,
            proposito: proposito,
            monto: calculatedMonto,
            fecha: moment(date).format('YYYY-MM-DD')
        }

        // Verificar que todos los campos estan Llenos
        if (argins.fk_categoria == '' || argins.fk_tipoDoc == '' || argins.proposito == '' || argins.monto == '' || argins.fecha == '') {
            setFeedback(true)
            setFeedbackDescription('Debes llenar todos los campos xD')
        }

        // Obtiene la Session 
        var sessionHash = await AsyncStorage.getItem('session');
        argins.sessionHash = sessionHash
        // TODO. Verificar que se grabo
        axios.post(apiPrefix + '/documentos', argins)
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
    const [date, setDate] = React.useState(new Date());
    const [show, setShow] = React.useState(false);

    const onChangeDateTime = (event, selectedDate) => {
        setShow(false);
        const currentDate = selectedDate || date;
        setDate(currentDate);
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

    const [category, setCategory] = React.useState(2);
    const [categoriaName, setCategoriaName] = React.useState('Gasolina');

    const onUpdateCategoria = ({ id, descripcion }) => {
        setCategory(id)
        setCategoriaName(descripcion)
    }

    // .___________. __  .______     ______       _______    ______     ______ 
    // |           ||  | |   _  \   /  __  \     |       \  /  __  \   /      |
    // `---|  |----`|  | |  |_)  | |  |  |  |    |  .--.  ||  |  |  | |  ,----'
    //     |  |     |  | |   ___/  |  |  |  |    |  |  |  ||  |  |  | |  |     
    //     |  |     |  | |  |      |  `--'  |    |  '--'  ||  `--'  | |  `----.
    //     |__|     |__| | _|       \______/     |_______/  \______/   \______|

    const [tipoDoc, setTipoDoc] = React.useState(1);
    const [tipoDocName, setTipoDocName] = React.useState('Gasto');

    const onUpdateTipoDoc = ({ id, descripcion }) => {
        setTipoDoc(id)
        setTipoDocName(descripcion)
        // Si no es gasto no existe categoria
        if (id != 1) {
            setCategory(null)
        } else {
            // Si es gasto setea la categoria
            // a valores por defecto
            setCategory(2)
            setCategoriaName('Gasolina')
        }
    }

    // Funcion que marca el flag de numero negativo. Ya que no podemos enmascarar un numero negativo al parecer
    // lo que provoca que no podamos grabar un numero negativo
    const setNegativeAmount = () => {
        setIsNegativeAmount(!isNegativeAmount)
        if (!isNegativeAmount) {
            // Amarillo
            setDynamicButtomColor('#f1c40f')
        } else {
            // Reset to InitalState. Azul
            setDynamicButtomColor('#007bff')
        }
    }

    return (
        <View style={styles.container} behavior="padding">
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
                {/* keyboardShouldPersistTaps='handled' para poder hacer click aun cuando este el teclado activo */}
                <ScrollView style={styles.contentContainer} keyboardShouldPersistTaps='handled'>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <TextInput mode="outlined" dense='true' label='Monto' value={monto} style={styles.dateInputReadOnly}
                            onChangeText={text => setMonto(text)} keyboardType={'decimal-pad'}
                            render={props =>
                                <TextInputMask
                                    {...props}
                                    type={'money'} value={monto}
                                    options={{
                                        precision: 0,
                                        separator: '.',
                                        delimiter: ',',
                                        unit: '$ ',
                                        suffixUnit: ''
                                    }} />
                            } />
                        <Button mode="contained" onPress={setNegativeAmount} style={styles.dateInputButton} color={dynamicButtomColor}> ! </Button>
                    </View>

                    <TextInput mode="outlined" dense='true' label='Propósito' value={proposito} style={styles.customInput}
                        onChangeText={text => setProposito(text)} />

                    {show && (
                        <DateTimePicker testID="dateTimePicker" value={date} mode="date"
                            display="default" onChange={onChangeDateTime}
                        />
                    )}
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <TextInput mode="outlined" dense='true' label='Fecha' value={moment(date).format('YYYY-MM-DD')}
                            style={styles.dateInputReadOnly} />
                        <Button mode="contained" onPress={showDatepicker} style={styles.dateInputButton}> &gt; </Button>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, alignItems: 'baseline', }}>
                        <TipoDocPicker onUpdateTipoDoc={onUpdateTipoDoc} hideKeyboardOnShow={true} />
                        <PaperText style={{ marginLeft: 10, fontSize: 16 }}>{tipoDocName}</PaperText>
                    </View>
                    {/* Si no es gasto no muestra la categoria */}
                    {category && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, alignItems: 'baseline', }}>
                            <CategoriaPicker onUpdateCategoria={onUpdateCategoria} hideKeyboardOnShow={true} />
                            <PaperText style={{ marginLeft: 10, fontSize: 16 }}>{categoriaName}</PaperText>
                        </View>
                    )}

                    <Button mode="contained" onPress={saveNewRecord} style={[styles.customInput, styles.saveButton]} >Guardar</Button>
                    <Button mode="outlined" style={{ marginTop: 10 }} onPress={clearForm}>Limpiar</Button>

                </ScrollView>
            </View>
        </ View>

    );
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
