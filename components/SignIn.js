import React from 'react'

import style from '../style.js'
import { View, TextInput, Text, Button } from 'react-native'

export default class SignIn extends React.Component{

    constructor(props){
        super(props)//constructeur parent

        this.state = {
            email: "",
            password: ""
        }
    }

    submit(){
        // this.props.navigation.push('', {email: this.state.email})

        
    }

    

    render (){
        return(
            <View>
                <Text style={style.title}>Home</Text>
                <TextInput style={style.input} onChangeText={(t) => this.state.email = t}/>
                <TextInput style={style.input} onChangeText={(t) => this.state.password = t}/>
                <Button title="Connexion" onPress={() => this.submit()} />
            </View>
        )
    }
}