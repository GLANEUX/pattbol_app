import React from 'react'

import style from '../style.js'
import { View, Text } from 'react-native'

export default class Home extends React.Component{
    render (){
        const {message} = this.props
        return(
            <View>
                <Text style={style.title}>Home</Text>
            </View>
        )
    }
}