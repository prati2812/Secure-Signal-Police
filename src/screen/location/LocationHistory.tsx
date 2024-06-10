import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView, FlatList, RefreshControl } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import ComplaintsCard from '../../components/ComplaintsCard';
import {  useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import NotificationBottomSheet from '../../components/NotificationBottomSheet';

import { firebase } from '@react-native-firebase/auth';
import { allNotificationReadOrNot, fetchLiveLocationNotificationData } from '../../redux/notifications/action';
import instance from '../../axios/axiosInstance';
import { dispatchStore } from '../dashboard/HomeScreen';



interface LocationHistoryProps {
   navigation:any;
}

const LocationHistory:React.FC<LocationHistoryProps> = ({navigation}) => {
 const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);   
 const [read , setRead] = useState(false); 
 const [refreshing, setRefreshing] = useState(false);
 const notificationData = useSelector((state:any) => state.notification.notifications);
 const userId = firebase.auth().currentUser?.uid;   
 const notificationReadStatus = useSelector((state: any) => state.notification.notificationAllReadOrNot);
   

 

 useEffect(() => {
    dispatchStore(fetchLiveLocationNotificationData(userId));
 },[read]);



 const handleNotificationRead = async(notification_id : String , senderId : String) => {
     let notificationId = notification_id;
     
     
     const response = await instance.post("/policeStation/LiveLocation/markAsRead" , {userId , notificationId});

     if(response.status === 200){
        setRead(!read);
        dispatchStore(allNotificationReadOrNot(userId));  
        navigation.navigate('LiveLocation' , {senderId});
     }

 }

   
 const renderItem = ({ item }: { item: any }) => (
  <ComplaintsCard
    icon={'location-pin'}
    message={`Live Location Shared by ${item.senderName}.`}
    time={item.timeStamp}
    color={'#af952e'}
    isRead={notificationReadStatus !== null && notificationReadStatus === true ? true : item.isRead}
    handleDetails={() => handleNotificationRead(item.notification_id, item.senderId)}
  />
);

const onRefresh = () => {
  setRefreshing(true);
  dispatchStore(fetchLiveLocationNotificationData(userId));
  setRefreshing(false);
};

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={'#af952e'} />
        <CustomHeader
          name={'Location'}
          icon={'dots-vertical'}
          call={() => setBottomSheetVisible(true)}
          backIcon="keyboard-backspace"
          backCall={() => navigation.goBack()}
        />
        {notificationData.length > 0 ? (
          <FlatList
            data={notificationData}
            renderItem={renderItem}
            keyExtractor={item => item.notification_id}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noNotificationContainer}>
            <Text style={styles.noNotificationText}>No Notification</Text>
          </View>
        )}
      </View>
      {isBottomSheetVisible && (
        <NotificationBottomSheet
          setBottomSheetVisible={setBottomSheetVisible}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
    listContent: {
      paddingVertical: 20,
    },
    noNotificationContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noNotificationText: {
      textAlign: 'center',
      fontSize: 25,
      fontWeight: '700',
    },
    
});

export default LocationHistory;


