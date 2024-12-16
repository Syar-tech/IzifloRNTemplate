
import React from 'react'
import {
    Platform,
    StyleSheet,
    Text,
} from 'react-native'

export const colors={
    iziflo_blue:"#5483AC",
    iziflo_back_blue:"#E8EDF5",
    iziflo_dark_gray:"#606060",
    iziflo_green:"#A9D14E",
    iziflo_orange:"#E58B3E",
    lightGray:'#f1f1f1',
    lightBlack:'#272727',
    orange:'#FAA542',
    yellowOrange:'#F9B42E',
    white:'#FFF',
    dark:{
        backgroundColor:'#272727',
        textDefaultColor:'#EFEFEF',
        textGray:'#ADADAD',
        placeholderDefaultColor:'#AAAAAA',
        svgColor:'#EFEFEF',
        listOverlay:"black",
        headerTextColor:'black'
    },
    light:{
        backgroundColor:'#EFEFEF',
        textDefaultColor:'#272727',
        textGray:'#919191',
        placeholderDefaultColor:null,
        svgColor:'#272727',
        listOverlay:"white",
        headerTextColor:'black'
    }
}

const border_width=1

const textinput_height = 40
const button_height = 40
const dropdown_height = 40
const secureimage_height = textinput_height-10


const dimensions = {
    qdef:{

    },
    q420sw:{

    },
    q600sw:{},
    q720sw:{},
    qdef_land:{

    },
    q420sw_land:{

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


export const B = props => <Text style={{fontWeight:'bold'}}>{props.children}</Text>

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
        textinput_disabled:{
            color:colors.light.textGray,
            borderColor:colors.light.textGray,
            backgroundColor:colors.lightGray,
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
            backgroundColor:colors.iziflo_green
        },
        orange:{
            backgroundColor:colors.iziflo_orange
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
        marginBottom:20,
        height:dropdown_height + 20,
        

        horizontal:{
            flexDirection:"row",
            height:dropdown_height,
            alignItems:'center',
            marginBottom:0,
            justifyContent:"center",
        },
        title:{
            fontSize:13,
            marginStart: 15,
            marginBottom: 3,
            color:colors.iziflo_blue,
        },

        title_disabled:{
            marginStart: 15,
            marginBottom: 3,
            color:'gray',
        },
        title_horizontal:{
            marginRight:6,
            marginStart:0,
            marginBottom:0,
        },

        button:{
            borderTopRightRadius:dropdown_height/2,
            borderTopLeftRadius:dropdown_height/2,
            borderBottomRightRadius:dropdown_height/2,
            borderBottomLeftRadius:dropdown_height/2,
            borderWidth:border_width,
            height:dropdown_height,
            backgroundColor:"white",
            flex:1,
            enabled:{
                borderColor:colors.iziflo_blue,
            },
            disabled:{
                borderColor:'lightgray',
            },
            label:{
                color:colors.iziflo_dark_gray,
                fontSize:16,
                disabled:{
                    color:'lightgray',
                },
            },
    
        },
        
        dropdown:{
            borderTopRightRadius:dropdown_height/2,
            borderTopLeftRadius:dropdown_height/2,
            borderBottomRightRadius:dropdown_height/2,
            borderBottomLeftRadius:dropdown_height/2,
            borderWidth:border_width,
            minHeight:0,
            enabled:{
                borderColor:colors.iziflo_blue,
            },
            disabled:{
                borderColor:'lightgray',
            },
            label:{
                fontSize:16,
                alignSelf:"center",
                height:"auto",
                flex:0,
                enabled:{
                    color:colors.iziflo_dark_gray,
                },
        
                disabled:{
                    color:'lightgray',
                },
            },
            sublabel:{
                fontSize:16,
                alignSelf:"center",
                height:"auto",
                flex:0,
                enabled:{
                    color:colors.iziflo_dark_gray,
                },
        
                disabled:{
                    color:'lightgray',
                },
            }
            
        },
        dropdown_horizontal:{
            width:100,
        },
        placeholder:{}
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


export const footerStyle = {

    footerContainer:{
        qdef:{
            height:60,
            width:'100%',
            backgroundColor:colors.lightGray,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            paddingLeft:5,
            paddingRight:5,
            paddingBottom:5,
            paddingTop:5
        },
        q600sw:{
            height:70
        }
    },
    iconHeight: 25,
    iconMarginTop: 5
}
export const  filterObject = (obj, predicate)=>Object.fromEntries(Object.entries(obj).filter(predicate));


export default {}
