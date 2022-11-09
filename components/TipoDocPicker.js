/* Picker dejo de ser compatible asi que simulamos un equivalente
con diferentes componentes
NOTA. PaperText es un componente de texto que sigue las normas del tema aplicado
*/
import * as React from 'react';
import { Button, Dialog, Portal, List } from 'react-native-paper';

import { View, FlatList, Keyboard } from 'react-native';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'

const TipoDocPicker = props => {
    // Logic Stuff
    const { logout, apiPrefix, getTheme } = React.useContext(AuthContext)
    const [listOfTipoDoc, setListOfTipoDoc] = React.useState([]);
    // Emite evento al padre para actalizar
    const emitEventUpdateTipoDoc = ({ id, descripcion }) => {
        props.onUpdateTipoDoc({ id, descripcion });
        setVisible(false);
    }

    // Dialog Stuff
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => {
        if (props.hideKeyboardOnShow) {
            // Si el parametro viene true. Ocultamos el Keyboard
            Keyboard.dismiss()
        }
        setVisible(true)
    }
    const hideDialog = () => setVisible(false);

    React.useEffect(() => {
        // Fetch dat from API and build Picker
        const getTipoDocAsync = async () => {
            // Obtiene la Session 
            var sessionHash = await AsyncStorage.getItem('session');
            let tipoDoc = await axios.get(apiPrefix + '/tipo-docs', {
                params: {
                    sessionHash
                }
            }).catch((err) => { console.log(err) })
            // console.log(tipoDoc);
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
                    <Dialog.ScrollArea>
                        <FlatList
                            data={listOfTipoDoc}
                            renderItem={({ item }) => {
                                return (
                                    <List.Item
                                        title={item.descripcion}
                                        key={item.id}
                                        onPress={() => emitEventUpdateTipoDoc({
                                            id: item.id,
                                            descripcion: item.descripcion
                                        })} />
                                )
                            }}
                            keyExtractor={item => item.id} />
                    </Dialog.ScrollArea>
                </Dialog>
            </Portal>
        </View>
    )
}

export default React.memo(TipoDocPicker);
