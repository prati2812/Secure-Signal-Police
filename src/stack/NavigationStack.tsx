import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from '../navigator/TabNavigator';
import ComplaintScreen from '../screen/complaint/ComplaintScreen';
import LocationHistory from '../screen/location/LocationHistory';
import LiveLocation from '../screen/location/LiveLocation';
import SplashScreen from '../screen/SplashScreen';
import LocationRouteScreen from '../screen/location/LocationRouteScreen';


const Stack = createNativeStackNavigator(); 

const NavigationStack: React.FC = () => {
    return(
        <Stack.Navigator>
               <Stack.Screen name='TabNavigator' component={TabNavigator} options={{headerShown:false}} />
               <Stack.Screen name='Complaint' component={ComplaintScreen} options={{headerShown:false}} />
               <Stack.Screen name='LocationHistory' component={LocationHistory} options={{headerShown:false}} />
               <Stack.Screen name='LiveLocation' component={LiveLocation} options={{headerShown:false}} />
               <Stack.Screen name='LocationRoute' component={LocationRouteScreen} options={{headerShown:false}} />
        </Stack.Navigator>
    ); 
}


export default NavigationStack;
