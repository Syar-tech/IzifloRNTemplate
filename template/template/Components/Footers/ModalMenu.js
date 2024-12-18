
import React, { useEffect, useState } from 'react'
import {Modal,TouchableWithoutFeedback, TouchableOpacity, View, Platform} from 'react-native'
import { useWindowDimensions } from "react-native"
import { hasNotch } from 'react-native-device-info'
import { colors } from '../../Styles/Styles'

function MenuModal({ visible, onPress, children,bottomMargin }) {
    
        const { width, height } = useWindowDimensions()
        return (
            <Modal
                style={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                }}
                transparent={true}
                visible={visible}
            >
                <TouchableOpacity
                    style={{
                        width,
                        height : (height),
                        justifContent:'flex-end',
                        alignItem:'end',
                    }} 
                    onPress={onPress}
                >
                    <View
                    style={{flex:1,marginBottom:bottomMargin+(hasNotch() ? 35:35),backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'flex-end', alignItems:'flex-end' }}>
                        {children}
                    </View>
                    
                </TouchableOpacity>
            </Modal>
        )
}
MenuModal.defaulProps={
    bottomMargin:0,
    visible:false,
    onPress:()=>{}
}

export default MenuModal