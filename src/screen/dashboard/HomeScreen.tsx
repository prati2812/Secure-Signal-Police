import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView, Platform, PermissionsAndroid } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { addToken, addUserName } from '../../redux/userProfile/action';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import ComplaintsCard from '../../components/ComplaintsCard';
import { COMPLAINT, fetchComplaints } from '../../redux/complaints/action';
import { allNotificationReadOrNot, fetchLiveLocationNotificationData } from '../../redux/notifications/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeCustomHeader from '../../components/HomeCustomHeader';
import store from '../../redux/store';



interface HomeScreenProps {
  navigation:any;
}

const HomeScreen:React.FC<HomeScreenProps> = ({navigation}) => {
   const dispatch = useDispatch(); 
   const userId = firebase.auth().currentUser?.uid;
   const [token , setToken] = useState<string | null>(null); 
   const complaints = useSelector((state:any) => state.complaint.complaints);
   const notificationReadStatus = useSelector((state: any) => state.notification.notificationAllReadOrNot);
   const accountType = useSelector((state: any) => state.userProfile.accountType);
   console.log(accountType);
            

   
   useEffect(() => {
      getToken(); 
      dispatchStore(fetchLiveLocationNotificationData(userId));
   },[token]);


   useEffect(() => {
     
     const checkValuesNotNull = () => {
       if (notificationReadStatus !== null) {
         return true;
       }
       return false;
     };

     // If both values are null, dispatch actions
     if (!checkValuesNotNull()) {       
       dispatchStore(allNotificationReadOrNot(userId));
     }
   }, [notificationReadStatus]);


   useEffect(() => {
    if(accountType){
      dispatchStore(addUserName(userId , accountType));
      dispatchStore(fetchComplaints(userId , accountType));
    } 
  },[accountType]);


  

  const getToken = async() => {
    const value = await AsyncStorage.getItem('token');
    if(value !== null){
      setToken(value);
      dispatch(addToken(value));
    }
    
  }
   

  const requestNotificationPermission = async() => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
           
      } else {
           requestNotificationPermission();      
      }
    }
  }


   const handleDetails = (item:Object) => {
      console.log(item);
      dispatch({
         type:COMPLAINT,
         payload:item,
      })
      navigation.navigate('Complaint');
   }

   const handleLocationHistory = () => {
    navigation.navigate('LocationHistory');
   }

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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={getColor(accountType)} />
      <HomeCustomHeader name={'Home'} icon={accountType === 'PoliceStation'  ? 'map'  : ''} call={handleLocationHistory} isRead={notificationReadStatus}/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingTop:20, paddingBottom:10}}>

        {complaints.length > 0 ?
          complaints.map((item: any, index: number) => {
            return (
              <ComplaintsCard
                key={index}
                icon={'person'}
                message={item.complaints.complaint}
                time={new Date(item.complaints.createdAt).toLocaleDateString()+" "+new Date(item.complaints.createdAt).toLocaleTimeString()}
                color={getColor(accountType)}
                isRead={true}
                handleDetails={() => handleDetails(item)}
              />
            );
          }) : <View style={{alignItems:'center'}}>
                      <Text style={{fontSize:25 , color:'black' , fontWeight:'700'}}>No Complaint</Text>
              </View>
          }
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    }
});

export default HomeScreen;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>

