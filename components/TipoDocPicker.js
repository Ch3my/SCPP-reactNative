/* Picker dejo de ser compatible asi que simulamos un equivalente
con diferentes componentes
NOTA. PaperText es un componente de texto que sigue las normas del tema aplicado
*/
import * as React from 'react';
import { Button, Dialog, Portal, RadioButton, Text as PaperText } from 'react-native-paper';

import { View } from 'react-native';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'

const TipoDocPicker = props => {
    // Logic Stuff
    const { logout, apiPrefix, getTheme } = React.useContext(AuthContext)
    const [listOfTipoDoc, setListOfTipoDoc] = React.useState([]);
    // Por defecto tiene marcado Gasto
    const [checked, setChecked] = React.useState(1);
    // Emite evento al padre para actalizar
    const emitEventUpdateTipoDoc = () => {
        props.onUpdateTipoDoc(checked);
        setVisible(false);        
    }

    // Dialog Stuff
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    React.useEffect(() => {
        // Fetch dat from API and build Picker
        const getTipoDocAsync = async () => {
            // Obtiene la Session 
            var sessionHash = await AsyncStorage.getItem('session');
            let tipoDoc = await axios.get(apiPrefix + '/api/v1/api-endpoints/get-tipo-doc', {
                params: {
                    sessionHash
                }
            }).catch((err) => { console.log(err) })
            // Probablemente este Error es que el Token no es valido
            // Cerramos la Sesion
            if (tipoDoc.data.hasErrors) {
                logout(sessionHash)
            } else {
                setListOfTipoDoc(tipoDoc.data)
            }
        };
        getTipoDocAsync();
    }, []);


    return (
        <View>
            <Button mode="outlined" onPress={showDialog}>Tipo Doc</Button>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Tipo Documento</Dialog.Title>
                    <Dialog.Content>
                        {listOfTipoDoc.map((item, key) => (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline' }} key={item.id}>
                                <PaperText>{item.descripcion}</PaperText>
                                <RadioButton
                                    value={item.id}
                                    key={item.id}
                                    status={checked === item.id ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked(item.id)}
                                />
                            </View>
                        ))}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={emitEventUpdateTipoDoc}>Listo!</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

export default TipoDocPicker;
