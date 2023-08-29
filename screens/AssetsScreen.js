import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext'

import { List } from 'react-native-paper'

export default function ConfigScreen({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Button icon="plus" mode="contained" onPress={() => navigation.navigate("AddAssetScreen")}>
                        Add
                    </Button>
                </View>
                <View style={styles.column}>
                    {/* Content for Column 2 */}
                </View><View style={styles.column}>
                    {/* Content for Column 2 */}
                </View><View style={styles.column}>
                    {/* Content for Column 2 */}
                </View>
            </View>

            <Text>ASSETS</Text>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 10
    },
    column: {
        paddingHorizontal: 8,
    },
});
