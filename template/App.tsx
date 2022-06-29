/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
 import {
   StyleSheet, View, NativeModules
 } from 'react-native';

 import BaseNavigation from './template/Navigation/BaseNavigation'
 import { Provider, useDispatch } from 'react-redux'
 import Store, {persistor} from './Store/ReduxStore'
import { PersistGate } from 'redux-persist/integration/react';
import { ACTIONS_TYPE } from './Store/reducers/UHFConfigReducer';
 
 const App = () => {

   return (
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
            <BaseNavigation useExample={true} useScheme={true}/>
          {
            // Populate Navigation.js with useExample={false}/>
          }
        </NavigationContainer>
       </PersistGate>
      </Provider>
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
