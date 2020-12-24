import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { List } from 'react-native-paper'

export default function ConfigScreen({ navigation }) {

    return (
        <ScrollView style={styles.container}>
            <List.Item title="Cerrar Sesión" left={props => <List.Icon {...props} icon="logout" />}
                onPress={() => navigation.navigate('Logout')} />
        </ScrollView>
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
