import { DrawerItem } from '@react-navigation/drawer'
import React from 'react'
import { Switch, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '../Locales/locales'
import { colors } from '../Styles/Styles'

function ColorSchemeItem(props){

    const {locale} = useLanguage(false)
    const colorScheme = useSelector((state) =>state._template.colorScheme);
    const dispatch = useDispatch()

    const onThemeChange = value => {
        const scheme = value ? 'dark' : 'light'
        dispatch({
            type:scheme
        })
        props.navigation.toggleDrawer()
    };

    return (<DrawerItem style={{width:'100%'}}
        label={() => <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{color:colors[colorScheme].textDefaultColor}}>
                {locale._template.darkMode}
              </Text>
              <Switch
                  trackColor={{ false: '#DEDEDE', true: colors.iziflo_green }}
                  thumbColor={colorScheme === 'light' ? colors.lightGray : "#F4F3F4"}
                  ios_backgroundColor={colors.lightGray}
                  onValueChange={onThemeChange}
                  value={colorScheme === 'dark'}
              />
            </View>
        } onPress={() => {
            onThemeChange(!(colorScheme === 'dark'))
        }}/>
    )
}
  
  export default ColorSchemeItem
  
