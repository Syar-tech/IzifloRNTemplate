import React from 'react'
import {TouchableOpacity, StyleSheet,Text, View, useWindowDimensions} from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

export default function TopShadowOverlay({
}){


    return (
        <Svg height="6" width="100%" style={{position:'absolute', top:-6, width:'100%'}}>
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
                <Stop offset="0.5" stopColor="#BBBBBB" stopOpacity="0.2" />
                <Stop offset="0.8" stopColor="#999999" stopOpacity="0.4" />
                <Stop offset="1" stopColor="#666666" stopOpacity="0,8" />
                </LinearGradient>
            </Defs>

            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
)


}
