import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from "./AuthStack";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAccountType, addToken, setProfileCompleted } from "../redux/userProfile/action";
import NavigationStack from "./NavigationStack";


const AppStack : React.FC = () => {
  const token = useSelector((state: any) => state.userProfile.token);
  const isProfile = useSelector((state:any) => state.userProfile.isProfileCompleted);
   
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

    const profileExist = await AsyncStorage.getItem("profileExist");
    if(profileExist){
       dispatch(setProfileCompleted(true));
    }
    else{
      dispatch(setProfileCompleted(false));
    }
    
  }
  
  useEffect(() => {
    getToken();
  },[]);


    return(
      <NavigationContainer>
        {
          token && isProfile ? <NavigationStack/> : <AuthStack/>
        }
      </NavigationContainer>
    )
}

export default AppStack;