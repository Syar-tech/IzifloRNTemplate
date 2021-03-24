export const iziflo_blue="#0000FF"

const border_width=3

const textiput_height = 40
const button_height = 40
const secureimage_height = textiput_height-10

export const loginStyles = {
    textinput:{
        title:{
            fontSize:13,
            marginStart: 15,
            marginBottom: 3,
            color:iziflo_blue,
        },
        textinput:{
            borderColor:iziflo_blue,
            paddingHorizontal:15,
            borderWidth:border_width,
            height:textiput_height,
            borderTopRightRadius:textiput_height/2,
            borderTopLeftRadius:textiput_height/2,
            borderBottomRightRadius:textiput_height/2,
            borderBottomLeftRadius:textiput_height/2,
        },
        secureImageContainer:{
            position:'absolute',
            height:secureimage_height,
            width:secureimage_height,
            right:5,
            top:5,
            bottom:5,
            borderTopRightRadius:secureimage_height,
            borderTopLeftRadius:secureimage_height,
            borderBottomRightRadius:secureimage_height,
            borderBottomLeftRadius:secureimage_height,
            backgroundColor:iziflo_blue,
        },
        secureImage:{
            height:20,
            width:20,
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
            color:'black',
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
            backgroundColor : iziflo_blue
        },
        connection:{
            backgroundColor : 'white',
            borderColor : iziflo_blue,
            borderWidth : border_width,
            image :{
                height:20,
            }
        }
    },
    
}

export default {}