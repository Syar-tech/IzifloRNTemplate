import React, { useEffect, useState } from 'react'
import { RefreshControl } from "react-native"
import { FlipInEasyX } from 'react-native-reanimated'

import { colors } from '../../style/style'
import {B, colors as templateColors} from '../Styles/Styles'



export default IziRefreshControl = (
    {

        style,
        children,
        refreshing,
        onRefresh,
    }) => {



    return (
    <RefreshControl
        children={children}
        style={style}
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={colors.blue}
        colors={[colors.blue, templateColors.iziflo_blue]}
        progressBackgroundColor={"white"}/>
    )
}