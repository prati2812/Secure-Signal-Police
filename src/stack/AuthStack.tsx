import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '../screen/SplashScreen';
import PhoneNumberScreen from '../screen/authentication/PhoneNumberScreen';
import OtpNumberScreen from '../screen/authentication/OtpNumberScreen';
import UserProfileScreen from '../screen/account/UserProfileScreen';
import HomeScreen from '../screen/dashboard/HomeScreen';
import TabNavigator from '../navigator/TabNavigator';
import AccountTypeSelection from '../screen/account/AccountTypeSelection';
import NavigationStack from './NavigationStack';


const Stack = createNativeStackNavigator(); 

const AuthStack: React.FC = () => {
    return(
        <Stack.Navigator>
               <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }}/>
               <Stack.Screen name='AccountType' component={AccountTypeSelection} options={{headerShown:false}} />
               <Stack.Screen name='PhoneNumber' component={PhoneNumberScreen} options={{headerShown:false}} />
               <Stack.Screen name='OtpScreen' component={OtpNumberScreen} options={{headerShown:false}} />
               <Stack.Screen name='UserProfile' component={UserProfileScreen} options={{headerShown:false}} />
               <Stack.Screen name='HomeScreen' component={NavigationStack} options={{headerShown:false}} />
               
        </Stack.Navigator>
    ); 
}


export default AuthStack;

