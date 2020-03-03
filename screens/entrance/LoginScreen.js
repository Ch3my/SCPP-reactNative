import React, { useState } from 'react'
import axios from 'axios';
import { AsyncStorage, ScrollView, View, KeyboardAvoidingView, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

import AuthContext from '../../context/AuthContext'

const LoginScreen = props => {
    // Traemos las variables de Contexto. La variables fueron definidas en el Componente que tiene
    // Context.Provider 
    const { login } = React.useContext(AuthContext)

    const [username, setUsername] = useState({ value: '' })
    const [password, setPassword] = useState({ value: '' })


    // .______       _______ .__   __.  _______   _______ .______      
    // |   _  \     |   ____||  \ |  | |       \ |   ____||   _  \     
    // |  |_)  |    |  |__   |   \|  | |  .--.  ||  |__   |  |_)  |    
    // |      /     |   __|  |  . `  | |  |  |  ||   __|  |      /     
    // |  |\  \----.|  |____ |  |\   | |  '--'  ||  |____ |  |\  \----.
    // | _| `._____||_______||__| \__| |_______/ |_______|| _| `._____|

    // El componente Keyboard es para evitar que el Keyboard se ponga sobre los inputs
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.cardContainer}>
                <Card style={styles.card}>
                    {/* <Card.Title title="Card Title" subtitle="Card Subtitle" left={(props) => <Avatar.Icon {...props} icon="folder" />} /> */}
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                    <Card.Content>
                        {/* <Title>Card title</Title>
                        <Paragraph>Card content</Paragraph> */}
                        <TextInput mode="outlined" label='Nombre de Usuario' dense='true'
                            onChangeText={username => setUsername({ username })} autoCapitalize="none" value={username.value} />
                        <TextInput mode="outlined" label='Contraseña' dense='true'
                            onChangeText={password => setPassword({ password })} secureTextEntry={true} value={username.value} />

                    </Card.Content>
                    <Card.Actions>
                        <Button mode="contained" style={styles.loginButton} onPress={() => login({ username, password })}>Ingresar</Button>
                    </Card.Actions>
                </Card>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
    },
    card: {
        width: 350,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        flex: 1
    }
})

export default LoginScreen