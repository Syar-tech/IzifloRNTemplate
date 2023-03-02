
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { RefreshControl, View , Text} from "react-native"
import Animated from 'react-native-reanimated'

export const FlipView = ({
    children,
    displayedStyle
} ) => {
    const [show, setShow] = useState(false);
    const [internChildren, setInternChildren] = useState({children1:undefined, children2:undefined});
    useEffect(()=>{
        setShow(!show)
        setInternChildren({
            children1:!show? children : internChildren.children1,
            children2:show? children : internChildren.children2
        })
    }, [children])
    
    return (
      <View style={{width:"100%", height:'100%'}}>
        {show ? (
          <Animated.View style={{justifyContent:'center', alignItems:'center', width:'100%', height:'100%'}} entering={displayedStyle?.entering} exiting={displayedStyle?.exiting}>{internChildren.children1}</Animated.View>
        ) : null}
        {!show ? (
          <Animated.View style={{justifyContent:'center', alignItems:'center', width:'100%', height:'100%'}} entering={displayedStyle?.entering} exiting={displayedStyle?.exiting}>{internChildren.children2}</Animated.View>
        ) : null}
      </View>
    );
  };