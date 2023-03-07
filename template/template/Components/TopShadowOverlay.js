import React from 'react'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

export default function TopShadowOverlay({
    style = {},
    height = 6, 
    mode='light'
}){

    const colors = {
        light :[
            {color:'#FFFFFF', opacity :"0"},
            {color:'#BBBBBB', opacity :"0.2"},
            {color:'#999999', opacity :"0.4"},
            {color:'#666666', opacity :"0.4"}
        ],
        dark :[
            {color:'#000000', opacity :"0"},
            {color:'#000000', opacity :"0.2"},
            {color:'#000000', opacity :"0.2"},
            {color:'#000000', opacity :"0.4"}
        ]
    }
    return (
        <Svg height={height} width="100%" style={[{position:'absolute', top:-6, width:'100%'},style]}>
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={colors[mode][0].color || "#FFFFFF"} stopOpacity={colors[mode][0].opacity }/>
                    <Stop offset="0.5" stopColor={colors[mode][1].color || "#BBBBBB"} stopOpacity={colors[mode][1].opacity}/>
                    <Stop offset="0.8" stopColor={colors[mode][2].color || "#999999"} stopOpacity={colors[mode][2].opacity}/>
                    <Stop offset="1" stopColor={colors[mode][3].color || "#666666"} stopOpacity={colors[mode][3].opacity} />
                </LinearGradient>
            </Defs>

            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
)


}
