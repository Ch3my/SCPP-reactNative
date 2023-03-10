import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'

import { List } from 'react-native-paper'

export default function ConfigScreen({ navigation }) {

    const { updateTheme, getTheme } = React.useContext(AuthContext)

    return (
        <ScrollView style={styles.container}>
            <List.Item title="Cerrar Sesión" left={props => <List.Icon {...props} icon="logout" />}
                onPress={() => navigation.navigate('Logout')} />
            <List.Item title={'Tema Activo: ' + getTheme()}   onPress={()=> updateTheme()} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
