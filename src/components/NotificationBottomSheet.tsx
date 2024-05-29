import * as React from 'react';
import {Text, View, StyleSheet, Pressable, Animated, StatusBar, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useEffect } from 'react';
import axios from 'axios';
import { firebase } from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationFilter from './NotificationFilter';
import instance from '../axios/axiosInstance';


interface NotificationBottomSheetProps {
  setBottomSheetVisible: any;
}

const NotificationBottomSheet: React.FC<NotificationBottomSheetProps> = ({  setBottomSheetVisible,}) =>{

    const slide = React.useRef(new Animated.Value(300)).current;
    const userId = firebase.auth().currentUser?.uid; 
    const token = useSelector((state : any) => state.userProfile.token);
    const dispatch = useDispatch();

    useEffect(() => {
      slideUp()
    })


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
  
    
    const closeModal = () => {
        slideDown();
        setTimeout(() => {
         setBottomSheetVisible(false);
        },800);
    }

    const handleAllMarkAsNotification = async() => {
      const response = await instance.post('/policeStation/LiveLocation/markAsAllRead',{userId});

      if (response.status === 200) {
        console.log('successfully Read All Notification');
        dispatch({
          type: 'ALL_NOTIFICATION_READ',
          payload: true,
        });
        closeModal();
      }
    }  

    const handleDeleteAllNotificaion = async() => {
      const response = await instance.post('/policeStation/LiveLocation/deleteAllNotification', {userId});
  
      if(response.status === 200){
         console.log("successfully Delete All Notification");
         dispatch({
          type:'LIVE_LOCATION_NOTIFICATION_DATA',
          payload:'',
         })
         closeModal();
         
      }
    }

    return (

    <Pressable style={styles.container} onPress={closeModal}>
      <Pressable style={{ width: '100%', height: '20%'}}>
        <Animated.View style={[styles.bottomSheet , {transform: [{ translateY: slide}]}]}>
        <View style={styles.notificationBottomSheet}>

         <TouchableOpacity onPress={() => handleAllMarkAsNotification()}> 
          <NotificationFilter
            icon={'done-all'}
            color={'black'}
            message={'Mark all as read'}
            iconBackgroundColor={'lightgray'}
            textColor={'black'}
          />

         </TouchableOpacity>
         
         <TouchableOpacity onPress={() => handleDeleteAllNotificaion()}>
          <NotificationFilter
            icon={'delete'}
            color={'red'}
            message={'Delete all notification'}
            iconBackgroundColor={'#FFD6D7'}
            textColor={'red'}
          />
         </TouchableOpacity> 
          
        </View>
        </Animated.View>
      </Pressable>  
    </Pressable>
  );
};



const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#00000080',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  notificationBottomSheet: {
    margin: 25,
  },
});


export default NotificationBottomSheet;