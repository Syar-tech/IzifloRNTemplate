/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-reanimated'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
 import {
   StyleSheet, View, NativeModules, SafeAreaView, StatusBar
 } from 'react-native';

 import BaseNavigation from './template/Navigation/BaseNavigation'
 import { Provider, useDispatch, useSelector } from 'react-redux'
 import Store, {persistor} from './Store/ReduxStore'
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from './styles/styles';
 
const CustomStatusBar = (
  {
    children //add more props StatusBar
  }
) => { 
   
    const colorScheme = useSelector((state) =>state._template.colorScheme);
   const insets = useSafeAreaInsets();
   return (
    <>
      <View style={{ height: insets.top, backgroundColor:colors[colorScheme].backgroundColor }}>
        <StatusBar
          animated={true}
          backgroundColor={colors[colorScheme].backgroundColor}
          barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'} />
      </View>
      <SafeAreaView style={{flex:1, overflow:'hidden', backgroundColor:colors[colorScheme].backgroundColor}}>
        {children}
      </SafeAreaView>
    </>
   );
}


 const App = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
        background: colors.lightGray
    },
  };
  //StatusBar.setBarStyle('dark-content')
   return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex:1}}>
        <Provider store={Store}>
          <PersistGate loading={null} persistor={persistor}>
            <CustomStatusBar>
                          <NavigationContainer theme={MyTheme}>
                              <BaseNavigation useScheme={true}/>
                            {
                              // Populate Navigation.js with useExample={false}/>
                            }
                          </NavigationContainer>
            </CustomStatusBar>

          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
   );
 };

 const styles = StyleSheet.create({
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
 });

 export default App;
