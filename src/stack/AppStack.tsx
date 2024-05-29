import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from "./AuthStack";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAccountType, addToken } from "../redux/userProfile/action";
import NavigationStack from "./NavigationStack";


const AppStack : React.FC = () => {
  const token = useSelector((state: any) => state.userProfile.token);
  const dispatch = useDispatch(); 

  const getToken = async() => {
    const token = await AsyncStorage.getItem('token');
    const AccountType = await AsyncStorage.getItem('AccountType');
    console.log(AccountType);
    
    if(token){
      dispatch(addToken(token));
    }
    if(AccountType){
      dispatch(addAccountType(AccountType));
    }
    
  }
  
  useEffect(() => {
    getToken();
  },[]);


    return(
      <NavigationContainer>
        {
          token ? <NavigationStack/> : <AuthStack/>
        }
      </NavigationContainer>
    )
}

export default AppStack;