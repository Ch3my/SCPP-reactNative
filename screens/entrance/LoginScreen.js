import React, { useState } from 'react'
import axios from 'axios';
import { AsyncStorage, ScrollView, View, KeyboardAvoidingView, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';


const LoginScreen = props => {

    const [username, setUsername] = useState({ value: '' })
    const [password, setPassword] = useState({ value: '' })

    const handleParsingLoginForm = () => {
        var data = {
            username: username.username,
            password: password.password
        }
        axios.post('https://scpp.herokuapp.com/api/v1/api-endpoints/entrance/login', data
        ).then(response => {
            console.log(response)
            if(response.data.status != 200){
                console.log("El usuario no esta autorizado")
            } else {
                console.log("Usuario Autorizado")
                // Guardamos usuario y la navegacion se actualiza automaticamente
                AsyncStorage.setItem('session', JSON.stringify(response.data.session))
                AsyncStorage.setItem('user', JSON.stringify(response.data.user))
                // props.navigation.navigate('Home')
            }
        }).catch(err => {
            console.error(err)
        })
    }

    // .______       _______ .__   __.  _______   _______ .______      
    // |   _  \     |   ____||  \ |  | |       \ |   ____||   _  \     
    // |  |_)  |    |  |__   |   \|  | |  .--.  ||  |__   |  |_)  |    
    // |      /     |   __|  |  . `  | |  |  |  ||   __|  |      /     
    // |  |\  \----.|  |____ |  |\   | |  '--'  ||  |____ |  |\  \----.
    // | _| `._____||_______||__| \__| |_______/ |_______|| _| `._____|
    return (
        <View style={styles.container}>
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
                        {/* <Button>Cancel</Button> */}
                        <Button mode="contained" style={styles.loginButton} onPress={handleParsingLoginForm}>Ingresar</Button>
                    </Card.Actions>
                </Card>
            </View>
        </View>
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