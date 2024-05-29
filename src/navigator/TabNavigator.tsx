import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from "../screen/dashboard/HomeScreen";
import AccountProfile from "../screen/account/AccountProfile";
import { useSelector } from "react-redux";


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const accountType = useSelector((state: any) => state.userProfile.accountType);

    const getColor = (accountType: string | null) => {
        if (accountType === 'PoliceStation') {
          return '#af952e';
        } else if(accountType === 'Hospital'){
          return '#008ECC'; 
        }
        else{
          return '#af952e';
        }
    }; 

    const tabBarActiveColor = getColor(accountType);

    return(
        <Tab.Navigator
           initialRouteName="Home">
            <Tab.Group
              screenOptions={{
                headerShown:false , 
                tabBarShowLabel:false , 
                tabBarHideOnKeyboard:true,
                tabBarStyle:styles.container}}>

                <Tab.Screen name="Home" component={HomeScreen} options={{
                     tabBarIcon:({focused, color , size}) => (
                        <Icon name="home" 
                              size={35}
                              color={focused ? tabBarActiveColor : 'lightgray'}/>
                     ),
                }}></Tab.Screen>
                <Tab.Screen name="Profile" component={AccountProfile} options={{
                    tabBarIcon:({focused , color , size}) => (
                        <Icon name="account-circle" 
                              size={35}
                              color={focused ? tabBarActiveColor : 'lightgray'}/>
                    )
                }}></Tab.Screen>

            </Tab.Group>

        </Tab.Navigator>
    )
}


const styles = StyleSheet.create({
    container: {
        height:60,
    }
});

export default TabNavigator;



