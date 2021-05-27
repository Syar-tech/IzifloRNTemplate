
import { PixelRatio} from 'react-native'

export class IziDimensions {
    static dimensionsOrder = [450, 600, 720];
    static  getDimension(name, dimensions, window){
        const sw = Math.min(window.width, window.height) / PixelRatio.get()
        const isLandscape = window.height < window.width
        let aggregatedDim = {...dimensions["qdef"]};
        dimensionsOrder.forEach(size => { 
            if(sw >= size){
                aggregatedDim = {...aggregatedDim, ...dimensions["q"+size+"sw"]}
            }
        });
        if(isLandscape){
            aggregatedDim = {...aggregatedDim, ...dimensions["qdef_land"]};
            dimensionsOrder.forEach(size => { 
                if(sw >= size){
                    aggregatedDim = {...aggregatedDim, ...dimensions["q"+size+"sw_land"]}
                }
            });
        }
        return aggregatedDim[name]
    }
}