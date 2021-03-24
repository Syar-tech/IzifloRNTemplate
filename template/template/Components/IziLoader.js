import React from 'react'
import {ActivityIndicator} from 'react-native'
import {iziflo_blue} from '../Styles/Styles'

export default function IziLoader(){
    return (<ActivityIndicator color={iziflo_blue} size='large'/> )
}