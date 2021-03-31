import React from 'react'
import {ActivityIndicator} from 'react-native'
import {colors} from '../Styles/Styles'

export default function IziLoader(){
    return (<ActivityIndicator color={colors.iziflo_blue} size='large'/> )
}