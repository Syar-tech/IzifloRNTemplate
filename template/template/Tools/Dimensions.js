
import { PixelRatio} from 'react-native'

export class IziDimensions {
    static dimensionsOrder = [450, 600, 720];
    static getDimension(window,dimensions, name = null){
        const sw = Math.min(window.width, window.height)
        const isLandscape = window.height < window.width
        let aggregatedDim = {...dimensions["qdef"]};
        this.dimensionsOrder.forEach(size => {
            if(sw >= size){
                aggregatedDim = {...aggregatedDim, ...dimensions["q"+size+"sw"]}
            }
        });
        if(isLandscape){
            aggregatedDim = {...aggregatedDim, ...dimensions["qdef_land"]};
            this.dimensionsOrder.forEach(size => {
                if(sw >= size){
                    aggregatedDim = {...aggregatedDim, ...dimensions["q"+size+"sw_land"]}
                }
            });
        }
        if(name)
            return aggregatedDim[name]
        else
            return aggregatedDim
    }
}