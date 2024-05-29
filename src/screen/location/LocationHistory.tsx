import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView, RefreshControl } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import ComplaintsCard from '../../components/ComplaintsCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import NotificationBottomSheet from '../../components/NotificationBottomSheet';
import axios from 'axios';
import { firebase } from '@react-native-firebase/auth';
import { fetchLiveLocationNotificationData } from '../../redux/notifications/action';
import instance from '../../axios/axiosInstance';
import { dispatchStore } from '../dashboard/HomeScreen';



interface LocationHistoryProps {
   navigation:any;
}

const LocationHistory:React.FC<LocationHistoryProps> = ({navigation}) => {
 const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);   
 const [read , setRead] = useState(false); 
 const notificationData = useSelector((state:any) => state.notification.notifications);
 const userId = firebase.auth().currentUser?.uid;   
 const token = useSelector((state:any) => state.userProfile.token);
 const notificationReadStatus = useSelector((state: any) => state.notification.notificationAllReadOrNot);
   
 const dispatch = useDispatch();
 

 useEffect(() => {
    dispatchStore(fetchLiveLocationNotificationData(userId));
 },[read]);

 const handleSetting = () => {  
    setBottomSheetVisible(true);
 }

 const handleNotificationRead = async(notification_id : String , senderId : String) => {
     let notificationId = notification_id;
     
     
     const response = await instance.post("/policeStation/LiveLocation/markAsRead" , {userId , notificationId});

     if(response.status === 200){
        setRead(!read);  
        navigation.navigate('LiveLocation' , {senderId});
     }

 }

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={'#af952e'} />
        <CustomHeader
          name={'Location'}
          icon={'cog-outline'}
          call={handleSetting}
          backIcon="keyboard-backspace"
          backCall={() => navigation.goBack()}
        />

        {notificationData.length > 0 ? (
          <ScrollView
            style={{marginTop: 20, marginBottom: 20}}
            showsVerticalScrollIndicator={false}>
            {notificationData.length > 0 &&
              notificationData.map( 
                (
                  item: {
                    notification_id: String;
                    isRead: boolean;
                    senderName: any;
                    timeStamp: string;
                    senderId: string;
                  },
                  key: React.Key | null | undefined,
                ) => {
                  return (
                    <ComplaintsCard
                      key={key}
                      icon={'location-pin'}
                      message={`Live Location Shared by a ${item.senderName}.`}
                      time={item.timeStamp}
                      color={'#af952e'}
                      isRead={
                        notificationReadStatus !== null &&
                        notificationReadStatus === true
                          ? true
                          : item.isRead
                      }
                      handleDetails={() =>
                        handleNotificationRead(
                          item.notification_id,
                          item.senderId,
                        )
                      }
                    />
                  );
                },
              )}
          </ScrollView>
        ) : (
          <View style={{flex: 1, top: '20%'}}>
            <Text
              style={{textAlign: 'center', fontSize: 25, fontWeight: '700'}}>
              No Notification
            </Text>
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
    }
});

export default LocationHistory;


