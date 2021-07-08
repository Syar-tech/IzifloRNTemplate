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
import React from 'react';
 import {
   StyleSheet, useColorScheme
 } from 'react-native';

 import BaseNavigation from './template/Navigation/BaseNavigation'
 import { Provider } from 'react-redux'
 import Store from './template/store/SchemeStore'

 const App = () => {
   return (

      <Provider store={Store}>
        <NavigationContainer>
            <BaseNavigation useExample={true}useScheme={true}/>
          {
            // Populate Navigation.js with useExample={false}/>
          }
        </NavigationContainer>
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
