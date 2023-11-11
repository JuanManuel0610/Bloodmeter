import 'react-native-gesture-handler';
import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Ionicons, FontAwesome, Fontisto } from '@expo/vector-icons'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 

import { onAuthStateChanged, signOut  } from 'firebase/auth';
import { auth } from './src/database/Firebase';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MenuScreen from './src/screens/MenuScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import DataScreen from './src/screens/DataScreen';
import CameraScreen from './src/screens/CameraScreen';
import MeasuresScreen from './src/screens/MeasuresScreen';
import UserScreen from './src/screens/UserScreen';
import PruebaScreen from './src/screens/PruebaScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const  [user, setUser] = useState(null);
  return(
    <AuthenticatedUserContext.Provider value={{user, setUser}}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}

function AuthStack() {
  return(
    <Stack.Navigator>
      <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
      <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

function TabNavigator() {
  return(
    <Tab.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
      <Tab.Screen 
        name='Menu' 
        component={MenuScreen} 
        options={{
          tabBarLabel: 'Datos',
          tabBarIcon: ({color}) => (
            <FontAwesome name='pencil-square' color={color} size={35}/>
          ),
          headerShown: true,
          headerStyle: {backgroundColor: '#2B9ACA'},
          headerTitleStyle: {color: '#fff', fontSize: 25, fontWeight: '500'},
          title: 'Administrar datos'
        }}
      />
      <Tab.Screen 
        name='Home' 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Fontisto name='home' color={color} size={32}/>
          ),
          headerShown: true,
          headerStyle: {backgroundColor: '#2B9ACA'},
          headerTitleStyle: {color: '#fff', fontSize: 25, fontWeight: '500'}
        }}
      />
      <Tab.Screen 
        name='Informes' 
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Informes',
          tabBarIcon: ({color}) => (
            <Ionicons name='bar-chart-sharp' color={color} size={33}/>
          ),
          headerShown: true,
          headerStyle: {backgroundColor: '#2B9ACA'},
          headerTitleStyle: {color: '#fff', fontSize: 25, fontWeight: '500'}
        }}
      />
    </Tab.Navigator>
  )
}

function PrincipalStack() {
  return(
    <Stack.Navigator screenOptions={{}} initialRouteName='Home'>
      <Stack.Screen name='Tab' component={TabNavigator} options={{headerShown: false, headerStyle: {backgroundColor: '#2B9ACA'}, headerTitleStyle: {color: '#fff', fontSize: 25, fontWeight: '500'}}}/>
      <Stack.Screen name='Datos' component={DataScreen} options={{headerTransparent: true, title: 'Ingresar Datos'}}/>
      <Stack.Screen name='Camera' component={CameraScreen} options={{headerTransparent: true, headerTintColor: 'white'}}/>  
      <Stack.Screen name='Medidas' component={MeasuresScreen} options={{headerTransparent: true, title: 'Administrar Datos'}}/>    
      <Stack.Screen name='User' component={UserScreen} options={{title: 'Usuario', headerTitleStyle: {color: '#fff', fontSize: 25, fontWeight: '500'}, headerStyle: {backgroundColor: '#2B9ACA'}, headerTintColor: 'white'}}/>
    </Stack.Navigator>
  )
}

function CustomDrawerContent({ navigation }) {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>

      <Image source={require('./src/assets/logo2.png')} style={{width: '100%', height: 26}}/>

      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <TouchableOpacity style={[styles.firstButton, {backgroundColor: '#E0EFFF'}]} onPress={() => navigation.navigate('User')}>
          <FontAwesome name='user-circle' size={35} color={'#007AFF'}/>
          <Text style={[styles.textButton, {color: '#007AFF'}]}>Usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.firstButton, {backgroundColor: '#FFE0E0', marginBottom: '5%'}]} onPress={onSignOut}>
          <Ionicons name='exit-outline' size={35} color={'#E84855'}/>
          <Text style={[styles.textButton, {color: '#E84855'}]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

function DrawerFunction() {
  return(
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{drawerPosition: 'right', drawerType: 'front'}}>
      <Drawer.Screen name='Principal' component={PrincipalStack} options={{headerShown: false}} />
      <Drawer.Screen name='Ajustes' component={PruebaScreen} options={{headerShown: true}}/>
    </Drawer.Navigator>
  )
}

const onSignOut = () => {
  signOut(auth).catch(error => console.log(error));
}  

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  if(loading) {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'}/>
      </View>
    )
  }

  return( 
    <NavigationContainer>
      { user ? <DrawerFunction/> : <AuthStack/>}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator/>
    </AuthenticatedUserProvider>
  );
}

const styles = StyleSheet.create({
  firstButton: {
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginTop: '5%',
    width: '70%'
  },

  textButton: {
    fontWeight: '400',
    fontSize: 15,
    marginLeft: 20
  },
})