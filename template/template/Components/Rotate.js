

  // Components/Rotate.js
  import React ,{useState, useEffect} from 'react'
import { View} from 'react-native'
import Orientation, { useDeviceOrientationChange} from 'react-native-orientation-locker';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const Rotate = (props) =>{

    const [deviceOrientation, setDeviceOrientation] = useState()

    const [viewDim, setViewDim] = useState(undefined); 
    const angle = useSharedValue(0);
    const width = useSharedValue(undefined);
    const height = useSharedValue(undefined);
    const transY = useSharedValue(0);
/*
    const animatedStyles = useAnimatedStyle(() => {
        if(props.rotate)
            return {
                width: width.value ? width.value : "100%", 
                height: height.value ? height.value : "100%",
                transform: [{ rotate:(angle.value + "deg")} , {translateY:transY.value}],
            }
            return {}
    }); */

    useEffect(()=>{
        if(viewDim)Orientation.getDeviceOrientation(animate)
    }, [viewDim])
  
    useDeviceOrientationChange((o) => {
        if(props.rotate && viewDim && deviceOrientation != o){
            setDeviceOrientation(o)
            animate(o) 
        }

    });

    const animate = ( newOrientation) =>{
        let a = 0
        switch (newOrientation) {
            case "LANDSCAPE-LEFT":
                a = 90
                angle.value = withTiming(a, {}, ()=>{/*transY.value=-viewDim.x*/})
                height.value = withTiming(viewDim.width);
                width.value = withTiming(viewDim.height);
                break;
            case "PORTRAIT-UPSIDEDOWN":
                a = 180
                //transY.value=viewDim.x
                angle.value =  withTiming(a)
                height.value = withTiming(viewDim.height);
                width.value = withTiming(viewDim.width);
                break;
            case "LANDSCAPE-RIGHT":
                a = -90
                //transY.value=viewDim.x
                angle.value = withTiming(a)
                height.value = withTiming(viewDim.width);
                width.value = withTiming(viewDim.height);
                break;
            default:
                //transY.value=viewDim.x
                angle.value = withTiming(0)
                height.value = withTiming(viewDim.height);
                width.value = withTiming(viewDim.width);
                break;
        }
        if(typeof props.onRotate === 'function')
            props.onRotate(newOrientation,a)
    }

    return ( <View style={{...props.style, alignItems:'center', justifyContent:"center"}} onLayout={(e)=>{setViewDim(e.nativeEvent.layout)}}>
                <Animated.View style={/*animatedStyles*/{}}>
                    {props.children}
                </Animated.View>
                
            </View>
    )

}
Rotate.defaultProps = {rotate:true}


export default Rotate
