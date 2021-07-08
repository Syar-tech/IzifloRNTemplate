import { DrawerItem } from '@react-navigation/drawer'
import React from 'react'
import { Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import locale from '../Locales/locales'
import { colors } from '../Styles/Styles'

function ColorSchemeItem(props){

    const onThemeChange = value => {
        const scheme = value ? 'dark' : 'light'
        props.dispatch({
            type:scheme
        })
        props.navigation.toggleDrawer()
    };

    return (<DrawerItem style={{width:'100%'}}
        label={() => <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{color:colors[props.colorScheme].textDefaultColor}}>
                {locale._template.darkMode}
              </Text>
              <Switch
                  trackColor={{ false: '#DEDEDE', true: colors.iziflo_green }}
                  thumbColor={props.colorScheme === 'light' ? colors.lightGray : "#F4F3F4"}
                  ios_backgroundColor={colors.lightGray}
                  onValueChange={onThemeChange}
                  value={props.colorScheme === 'dark'}
              />
            </View>
        } onPress={() => {
            onThemeChange(!(props.colorScheme === 'dark'))
        }}/>
    )
}

const mapStateToProps = state => {

    return {
      colorScheme: state.colorScheme
    }
  }
  
  export default connect(mapStateToProps)(ColorSchemeItem)
  