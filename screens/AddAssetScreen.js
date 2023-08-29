import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'

import { List } from 'react-native-paper'

export default function ConfigScreen({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            <Text>ADD ASSET</Text>
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
