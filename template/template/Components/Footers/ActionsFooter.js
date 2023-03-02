

// Components/Footer.js
import React, { useEffect, useState } from 'react'
import {View} from 'react-native'
import { useLanguage } from '../../Locales/locales'
import icon_home from '../../res/img/icon_home'
import icon_more from '../../res/img/icon_more'
import { IziDimensions } from '../../Tools/Dimensions'
import FooterControl from './FooterControl'
import FooterMenuItem from './FooterMenuItem'
import ModalMenu from './ModalMenu'


const ActionsFooter = ({items,footerStyle, rotate, onPress,buttonWidth,textStyle, frontColor, backColor }) => {
  const {locale} = useLanguage()
  let [displayedItems, setDisplayedItems] = useState([]);
  let [modalVisible, setModalVisible] = useState(false);
  const maxDisplayed = 4
  const hasMore  = items?.length > displayedItems?.length

  useEffect(()=>{
    if(items && items.length >4){
      let itms = items.slice(0,maxDisplayed-1)
      setDisplayedItems(itms)
    }else{
      setDisplayedItems(items)
    }
  }, [items])

  const _toggleModal = ()=>{
    setModalVisible(!modalVisible)
  }

  return (
        <View style={{...IziDimensions.getDimension(window,styles.footerContainer), backgroundColor:backColor,...footerStyle}}>
          {displayedItems.map((item, index)=>{
           return  (
              <FooterControl 
                  style={{flex:0, width:buttonWidth}} 
                  key={item.key} 
                  onPress={() => { 
                    
                    if(onPress) {
                    onPress(item.key)
                  }}}
                  image = {{height:item.iconHeight ? item.iconHeight : 25,width:item.iconWidth ? item.iconWidth : 25, xml:item.icon}}
                  text={{text:item.title, style:{marginTop:5, ...textStyle}}}
                  disabled={item.disabled}
                  rotate={rotate}
                  frontColor={frontColor}
                  badge={item.badge} />)
          })}
          {hasMore &&
            <FooterControl 
                  style={{flex:0, width:buttonWidth}} 
                  key={99} 
                  onPress={_toggleModal}
                  image={{height:25, xml:icon_more}}
                  text={{text:locale._template.more, style:{marginTop:5, ...textStyle}}}
                  frontColor={frontColor}
                  rotate={rotate}  />}
          {hasMore && 
            <ModalMenu
                  visible={modalVisible}
                  onPress={_toggleModal}
                  bottomMargin={IziDimensions.getDimension(window,styles.footerContainer, 'height')}
                  >
                  {items.slice(maxDisplayed-1).reverse().map((item, index)=>{
                    return (
                      <FooterMenuItem
                        key={item.key}
                        title={item.title}
                        icon={item.icon}
                        disabled={item.disabled}
                        onPress={() => {
                          if(modalVisible){
                            setModalVisible(false)
                          }                          
                          if(onPress) onPress(item.key)}} />
                    )
                  })}
            </ModalMenu>
                }
        </View>
  )
}

ActionsFooter.defaultProps = {
  items:[],
  footerStyle:{},
  buttonWidth:50,
  textStyle:{},
  rotate:false,
  frontColor:"#272727",
  backColor:"white",
  onPress:()=>{}
}

const styles = {
  footerContainer:{
      qdef:{
        height:60,
        width:'100%',
        backgroundColor:"white",
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        paddingLeft:5,
        paddingRight:5,
        paddingBottom:5,
        paddingTop:5,
        overflow:"hidden",
        borderTopColor:'#aaaaaa',
        borderTopWidth:1
      },
      q600sw:{
        height:70
      }
  },
}

export default ActionsFooter
