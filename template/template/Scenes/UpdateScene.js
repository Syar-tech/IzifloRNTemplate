import React, { useEffect, useState } from 'react'
import {ScrollView, StyleSheet, Text, useWindowDimensions, View,NativeModules, RefreshControl,Image, Linking, Platform} from 'react-native'
import { colors as templateColors} from '../Styles/Styles'
import { useLanguage } from '../Locales/locales'
import Button ,{IziButtonStyle} from "../Components/IziButton"
import {  openUpdateUrl } from '../API/LoginApi'


export default function UpdateScene({navigation,route}){

    const {locale} = useLanguage()


    /**
     * VIEW
     */



    return (
        <View style={{...styles.container, justifyContent:'center',alignItems:'center',}}>
            <View style={{justifyContent:'center',alignItems:'center',flex:1, width:"100%",paddingTop:20, paddingBottom:20}}>
                <Image 
                    source={route.params.allowUpdate ? require('../res/update.gif') : require('../res/downgrade.gif')}
                    style={{flex:1,maxHeight:400,width:'100%', resizeMode:'contain'}}
                />
            </View>
            <View style={{paddingLeft:50,paddingRight:50}}>
                <Text style={styles.title}>
                    {route.params.allowUpdate ? locale._template.UpdateScene.mandatoryUpdateTitle : locale._template.UpdateScene.mandatoryTooBigVersionTitle}
                </Text>

                <Text style={styles.description}>
                    {route.params.allowUpdate ? locale._template.UpdateScene.mandatoryUpdateDescription : locale._template.UpdateScene.mandatoryTooBigVersionDescription}
                </Text>
                {route.params.allowUpdate && <View style={{ paddingBottom:20, justifyContent:'center',alignItems:'center',}}>
                    <Button style={styles.button} title={locale._template.UpdateScene.update} iziStyle={{
                        backgroundColor:templateColors.yellowOrange,
                    }} onPress={() => {
                        openUpdateUrl()
                    }} />

                </View>}
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    button:{
        height:35,
        marginTop:10,
        paddingStart:4, 
        paddingEnd:4,
        borderWidth:2,
        borderColor:templateColors.orange
    },
    container:{
        flex:10
    },
    description:{
        color:templateColors.iziflo_dark_gray,
        textAlign:'center',
        paddingBottom:40
    },
    footer:{
        width:'100%',
        shadowColor: "#000",
        shadowOpacity: 0,
        elevation:0,
        borderBottomColor:'#aaaaaa',
        borderTopWidth:1,
        padding:25,
        justifyContent:'center',
        alignItems:'center',
        elevation:5
    },
    menuItemsContainer:{

    },

    title:{
        fontWeight:'bold',
        fontSize:20,
        textAlign:'center',
        paddingLeft:50,
        paddingRight:50,
        paddingBottom:30
    }
})