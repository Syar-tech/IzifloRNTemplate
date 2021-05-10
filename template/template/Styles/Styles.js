
import {
    StyleSheet,
} from 'react-native'

export const colors={
    iziflo_blue:"#5483AC",
    iziflo_back_blue:"#E8EDF5",
    iziflo_dark_gray:"#606060"
}

export const sizes = {
    modal:{
        close_icon_size:30
    }
}

const border_width=2

const textiput_height = 40
const button_height = 40
const dropdown_height = 40
const secureimage_height = textiput_height-14

export const loginStyles = {
    textinput:{
        title:{
            fontSize:13,
            marginStart: 15,
            marginBottom: 3,
            color:colors.iziflo_blue,
        },
        textinput:{
            color:"black",
            borderColor:colors.iziflo_blue,
            paddingHorizontal:15,
            borderWidth:border_width,
            height:textiput_height,
            fontFamily: 'OpenSans-Regular',
            fontWeight:'normal',
            borderTopRightRadius:textiput_height/2,
            borderTopLeftRadius:textiput_height/2,
            borderBottomRightRadius:textiput_height/2,
            borderBottomLeftRadius:textiput_height/2,
        },
        secureImageContainer:{
            position:'absolute',
            height:secureimage_height,
            width:secureimage_height,
            right:(textiput_height -secureimage_height)/2,
            top:(textiput_height -secureimage_height)/2,
            bottom:(textiput_height -secureimage_height)/2,
            borderTopRightRadius:secureimage_height,
            borderTopLeftRadius:secureimage_height,
            borderBottomRightRadius:secureimage_height,
            borderBottomLeftRadius:secureimage_height,
            backgroundColor:colors.iziflo_blue,
        },
        secureImage:{
            height:secureimage_height,
            width:secureimage_height,
        }

    },
    text:{
        color : 'black'
    },

    button:{
        height : button_height,
        justifyContent:'center',
        alignItems:'center',
        borderTopRightRadius:button_height/2,
        borderTopLeftRadius:button_height/2,
        borderBottomRightRadius:button_height/2,
        borderBottomLeftRadius:button_height/2,
        textContainer:{
            flex:1,
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
        },
        image:{
            height:20,
            width:20,
        },
        text:{
            color:'white',
            fontSize:16,
            fontWeight:'bold',
        },
        disabled:{
            backgroundColor:'gray',
            text:{
                color:'white',
                fontSize:16,
            }
        },
        green:{
            backgroundColor:'green'
        },
        orange:{
            backgroundColor:'orange'
        },
        action:{
            backgroundColor : colors.iziflo_blue
        },
        connection:{
            backgroundColor : 'white',
            borderColor : colors.iziflo_blue,
            borderWidth : border_width,
            text:{
                color:colors.iziflo_dark_gray,
                fontSize:16,
                fontWeight:'bold',
            },
            image :{
                height:20,
            }
        }
    },
    dropdown:{
        title:{
            fontSize:13,
            marginStart: 15,
            marginBottom: 3,
            color:colors.iziflo_blue,
        },

        title_disabled:{
            fontSize:13,
            marginStart: 15,
            marginBottom: 3,
            color:'gray',
        },
        dropdown:{
            height:dropdown_height,
            borderTopRightRadius:dropdown_height/2,
            borderTopLeftRadius:dropdown_height/2,
            borderBottomRightRadius:dropdown_height/2,
            borderBottomLeftRadius:dropdown_height/2,
            borderWidth:border_width,
            marginBottom:20,
            enabled:{
                borderColor:colors.iziflo_blue,
            },
            disabled:{
                opacity:.3
            },
        }
    },
    
}

export const ModalStyle = StyleSheet.create({
    close_button_pressable:{
        position:'absolute',
        top:0,
        end:0,
        backgroundColor:colors.iziflo_blue,
        padding:6
    } ,
    close_button_image:{
    } ,
    title:{
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold',
        color:colors.iziflo_blue,
        marginStart:sizes.modal.close_icon_size + 6,
        marginEnd:sizes.modal.close_icon_size + 6,
        marginBottom:20
    } 
})

export default {}