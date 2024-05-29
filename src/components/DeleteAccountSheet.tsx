import AsyncStorage from '@react-native-async-storage/async-storage';
import {  firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Animated, TouchableOpacity, StatusBar, BackHandler, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TOKEN, addToken } from '../redux/userProfile/action';
import instance from '../axios/axiosInstance';




interface DeleteAccountSheetProps {
    setDeleteAccountSheetVisible:any;
    call?:any;
}

const DeleteAccountSheet:React.FC<DeleteAccountSheetProps> = ({setDeleteAccountSheetVisible , call}) => {
  const slide = React.useRef(new Animated.Value(300)).current;
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const dispatch = useDispatch();
  const accountType = useSelector((state: any) => state.userProfile.accountType);  

  const slideUp = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(slide, {
      toValue: 300,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    slideUp();
  }, []);

  const closeModal = () => {
    slideDown();
    setTimeout(() => {
        setDeleteAccountSheetVisible(false);
    }, 800);
  };

  
  const handleDeleteAccount = async() => {
    setIndicatorVisible(true);
    const userId = firebase.auth().currentUser?.uid;
    if(accountType === 'PoliceStation'){
      const response = await instance.post('/deletePoliceAccount', {userId});

      if(response.status === 200){
        await AsyncStorage.clear();
        dispatch(addToken(null));
        setIndicatorVisible(false);
        slideDown();
        setTimeout(() => {
          setDeleteAccountSheetVisible(false);
        }, 800);
      }
    }
    else if(accountType === 'Hospital'){
      const response = await instance.post('/hospital/deleteUserAccount', {userId});

      if(response.status === 200){
        firebase.auth().signOut();
        await AsyncStorage.clear();
        dispatch(addToken(''));
        setIndicatorVisible(false);
        slideDown();
        setTimeout(() => {
          setDeleteAccountSheetVisible(false);
        }, 800);
      }
    }
    

    
  }

  return (
    <Pressable style={styles.container} onPress={closeModal}>
      <Pressable style={{width: '100%', height: '25%'}}>
        <Animated.View
          style={[
            styles.bottomSheet,
            {transform: [{translateY: slide}]},
          ]}>

             <View style={styles.deleteAccountTextView}>
                   <Text style={styles.deleteAccountText}>Delete Account ?</Text>
             </View>

             <View style={styles.deleteWarningView}>
                  <Text style={styles.deleteWarningText}>Your account data will be deleted in 14 days. Log in to keep your data. We'll be glad to see you if you return!</Text>  
             </View> 

             <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => closeModal()}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDeleteAccount}>
                    {
                    isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/> 
                       :  <Text style={styles.btnText}>Delete</Text>   
                    } 
                   
              </TouchableOpacity>
            </View>

          </Animated.View>
      </Pressable>
    </Pressable>
  );
};


const styles = StyleSheet.create({
    container: {
        position:'absolute',
        flex:1,
        backgroundColor:'#00000080',
        width:'100%',
        height:'100%',
        top: 0,
        left: 0,
        justifyContent:'flex-end',
    },
    bottomSheet:{
        width:'100%',
        height:'100%',
        backgroundColor:'white',   
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
    },
    deleteAccountTextView:{
        marginTop:25,
        marginLeft:25,
    },
    deleteAccountText:{
        fontSize:27,
        color:'red',
        fontWeight:'600', 
    },
    deleteWarningView:{
        marginTop:10,
        marginLeft:25,
    },
    deleteWarningText:{
        fontSize:15,
        color:'black',
        fontWeight:'500',
    },
    buttonView:{
        flexDirection:'row' , 
        marginTop:20, 
        justifyContent:'flex-end',
        marginRight:15,
        gap:15,
    },
    cancelButton:{
        padding:10,
        backgroundColor:'green',
        width:'25%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        elevation:5,
    },
    deleteButton:{
        padding:10,
        backgroundColor:'red',
        width:'25%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        elevation:5,
    },
    btnText:{
        fontSize:17,
        color:'white',
        fontWeight:'600',
    }
});
  

export default DeleteAccountSheet;

