import React, { useEffect, useState } from 'react'
import { RefreshControl } from "react-native"
import { FlipInEasyX } from 'react-native-reanimated'

import { colors } from '../../styles/styles'
import {B, colors as templateColors} from '../Styles/Styles'



export default IziRefreshControl = (
    {

        style,
        children,
        refreshing,
        onRefresh,
        colors=[templateColors.iziflo_blue, templateColors.iziflo_back_blue]
    }) => {


    return (
    <RefreshControl
        children={children}
        style={style}
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={colors[0]}
        colors={colors}
        progressBackgroundColor={"white"}/>
    )
}
