import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';

import AuthContext from '../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen() {

    // Simplemente ejecuta funcion Logout del Context (Asi modifica el estado de la App)
    const { logout } = React.useContext(AuthContext)

    React.useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                var sessionHash = await AsyncStorage.getItem('session');
                logout(sessionHash)
            } catch (err) {
                console.log(err)
            }
        }
        bootstrapAsync()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text>LoginOut</Text>
            </View>
        </View>
    );
}

// HomeScreen.navigationOptions = {
//   header: null,
// };


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
