
import {
    Platform,
    StyleSheet,
} from 'react-native'

export const colors={
    iziflo_blue:"#5483AC",
    iziflo_back_blue:"#E8EDF5",
    iziflo_dark_gray:"#606060"
}

const border_width=2

const textinput_height = 40
const button_height = 40
const dropdown_height = 40
const secureimage_height = textinput_height-10


const dimensions = {
    qdef:{

    },
    q450sw:{

    },
    q600sw:{},
    q720sw:{},
    qdef_land:{

    },
    q450sw_land:{

    },
    q600sw_land:{},
    q720sw_land:{},

   
}


export const sizes = {
    modal:{
        close_icon_size:30
    },
    password:{
        image:{
            height:secureimage_height-8
        }
    }
}


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
            height:textinput_height,
            fontFamily: Platform.OS === 'android' ? 'OpenSans-Regular' : undefined ,
            fontWeight:'normal',
            borderTopRightRadius:textinput_height/2,
            borderTopLeftRadius:textinput_height/2,
            borderBottomRightRadius:textinput_height/2,
            borderBottomLeftRadius:textinput_height/2,
        },
        secureImageContainer:{
            position:'absolute',
            height:secureimage_height,
            width:secureimage_height,
            right:(textinput_height -secureimage_height)/2,
            top:(textinput_height -secureimage_height)/2,
            bottom:(textinput_height -secureimage_height)/2,
            borderTopRightRadius:secureimage_height,
            borderTopLeftRadius:secureimage_height,
            borderBottomRightRadius:secureimage_height,
            borderBottomLeftRadius:secureimage_height,
            backgroundColor:colors.iziflo_blue,
            alignItems:'center',
            justifyContent:'center',
        },
        secureImage:{
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
            marginTop:2,
            height:25,
            width:200,
            resizeMode:'contain',
            alignSelf:'center',
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
                borderColor:'lightgray',
            },
            label:{
                color:'black',
            },
    
            label_disabled:{
                color:'lightgray',
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