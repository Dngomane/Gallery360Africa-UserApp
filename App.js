import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import auth from '@react-native-firebase/auth';
// icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

// Import screens
import Market from './src/screens/Market';
import Exhibition from './src/screens/Exhibition';
import Splash from './src/screens/Splash';
import Onboarding from './src/screens/Onboarding';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Home from './src/screens/Home';
import ArtPreview from './src/screens/ArtPreview';
import ArtistProfile from './src/screens/ArtistProfile';
import Cart from './src/screens/Cart';
import PaymentSuccesful from './src/screens/PaymentSuccesful';
import PaymentFailure from './src/screens/PaymentFailure';
import PaymentForm from './src/screens/PaymentForm';
import DeliveryAddress from './src/screens/DeliveryAddress';
import ShippingAddress from './src/screens/ShippingAddress';
import Preview from './src/screens/Preview';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        showPageIndicator: false,
        tabBarPressColor: '#000',
        swipeEnabled: false,
        tabBarStyle: {
          height: 50,
          minHeight: 0,
          borderRadius: 20,
          marginHorizontal: 12,
          width: 'auto',
          backgroundColor: '#ceb89e',
          headerShadowVisible: false,
          margin: 5
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#fff',
        tabBarPressColor: '#000',
      }}
    >
      <Tab.Screen name='Market' component={Market} />
      <Tab.Screen name='Exhibition' component={Exhibition} />
    </Tab.Navigator>
  )
}

const App = () => {

  const toastConfig = {
   
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 17,
          fontWeight: '400',
        }}
      />
    ),

    error: (props) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17
        }}
        text2Style={{
          fontSize: 15,
          color: 'red'
        }}
      />
    ),

    tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    )
  };

  const [user, setuser] = useState('')
    useEffect(() => {
      const unregister = auth().onAuthStateChanged(userExist=>{
            if(userExist) setuser(userExist)
            else setuser("")
      })

      return () => {
        unregister()
      }

  }, [])
  
  // const [photo, setPhoto] = useState(null);

  // const getPhoto = () => {
  //   return db.collection('artists').onSnapshot((snapShot) => {
  //     const allPhotos = snapShot.docs.map(docSnap => docSnap.data());
  //     setPhoto(allPhotos);
  //   })
  // }
  // useEffect(() => {
  //   getPhoto();
  // }, [])

  return (
    <>
      <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Splash'
      >

<Stack.Screen options={{headerShown: false}} name='Splash' component={Splash} />
            <Stack.Screen options={{headerShown: false}} name='Onboarding' component={Onboarding} />
    
        <Stack.Screen 
          name='Home' 
          component={TabNavigator}
          options={({navigation}) => ({
            headerLeft: () => {return null;},
            title: 'Hi Sibusiso',
            headerRight: () => (
              <View style={{flexDirection: 'row', width: 74, justifyContent: 'space-between', }}>
                {/* <TouchableOpacity style={{borderWidth: 1, borderRadius: 20, borderColor: '#fff', width: 50, height: 50, alignItems: 'center', paddingTop: 12, }}>
                  <MaterialIcons name='shopping-cart' size={24} color={'white'}/>
                </TouchableOpacity> */}

                <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                  <MaterialIcons name='shopping-cart' size={29} color={'#000'}/>
                </TouchableOpacity>
                <TouchableOpacity>
                  <EvilIcons name='user' size={39} color={'#000'} />
                </TouchableOpacity>
              </View>
            )       
          })}
          
        />

        {user?
           <>
            <Stack.Screen options={{headerShown: false}} name='ArtistProfile' component={ArtistProfile}/>   
            <Stack.Screen options={{headerShown: false}} name="ArtPreview" component={ArtPreview} />
            <Stack.Screen options={{headerShown: false}} name='Cart' component={Cart} />
            <Stack.Screen options={{headerShown: false}} name='PaymentSuccesful' component={PaymentSuccesful} />
            <Stack.Screen options={{headerShown: false}} name='PaymentFailure' component={PaymentFailure} /> 
            <Stack.Screen options={{headerShown: false}} name='PaymentForm' component={PaymentForm} />
            <Stack.Screen options={{headerShown: false}} name='DeliveryAddress' component={DeliveryAddress} />
            <Stack.Screen options={{headerShown: false}} name='ShippingAddress' component={ShippingAddress} />
            <Stack.Screen options={{headerShown: false}} name='Preview' component={Preview} />
          </>
          :
          <>
            
            <Stack.Screen options={{headerShown: false}} name='SignIn' component={SignIn} />
            <Stack.Screen options={{headerShown: false}} name='SignUp' component={SignUp} />
          </>
        }

      </Stack.Navigator>
    </NavigationContainer>
    <Toast config={toastConfig} />
    </>
  )
}

export default App;