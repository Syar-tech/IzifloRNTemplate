import React ,{useState} from 'react'
import PropTypes from "prop-types";
import {
    View, StyleSheet,TouchableOpacity
} from 'react-native'
import Button ,{IziButtonStyle}from '../Components/IziButton'
import {__SInfoConfig} from '../Tools/Prefs';

import {InstanceType,CompanyType} from "../Types/LoginTypes"
import locale from '../../Locales/locales'
//types
import IziDropdown from './IziDropDown'

export interface Props{
    instances:InstanceType[],
    selectedInstance?:InstanceType,
    displayCompany? : boolean
    onLogout():void
    onInstanceChoosen(instance:InstanceType, company?:CompanyType):void
}

 const InstanceChoice : React.FC<Props> = ({instances, selectedInstance, displayCompany, onLogout,onInstanceChoosen}) => {

    const [instance, setInstance] = useState<InstanceType | undefined>(selectedInstance)
    const [company, setCompany] = useState<CompanyType | undefined>(undefined)


    console.log(JSON.stringify(instances))

    const _onConnect = ()=>{
        console.log("connect")
        if(instance && (!displayCompany || company))
            onInstanceChoosen(instance, company)

    }
    const _getConnectButtonStyle = () => {
        return (instance && (!displayCompany || company))
            ?  IziButtonStyle.green 
            : IziButtonStyle.disabled
    }


    const _displayCompanyChoice= ()=>{
        if( displayCompany){
            <IziDropdown
            items={instances}
            title="Comp"/>
        }else return undefined
    }

    return (
        <View>
            <IziDropdown
            items={instances}
            title={locale._template.dropdown_instance.title}
            placeholder={instances && instances.length > 0 ? locale._template.dropdown_instance.placeholder :  locale._template.dropdown_instance.empty_placeholder}
            disabled={instances== undefined || instances.length == 0 || selectedInstance}
            defaulValue={selectedInstance ? selectedInstance : undefined}
            onChangeItem={(item:InstanceType) => {setInstance(item)}}/>
            {_displayCompanyChoice()}
                <Button style={loginStyles.button} title={locale._template.connect} iziStyle={_getConnectButtonStyle()} onPress={_onConnect }/>
            <Button title={locale._template.disconnect} iziStyle={IziButtonStyle.orange} onPress={onLogout}/>
        </View>
    )
}

const loginStyles = StyleSheet.create({
    button:{
        marginBottom:20,
        marginTop:30,
    },
})

export default InstanceChoice