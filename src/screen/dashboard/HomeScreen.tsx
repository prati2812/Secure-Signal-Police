import * as React from 'react';
import { Text, View, StyleSheet, StatusBar,  Platform, PermissionsAndroid, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import {  addUserName } from '../../redux/userProfile/action';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import ComplaintsCard from '../../components/ComplaintsCard';
import { COMPLAINT, fetchComplaints } from '../../redux/complaints/action';
import { allNotificationReadOrNot, fetchLiveLocationNotificationData } from '../../redux/notifications/action';
import HomeCustomHeader from '../../components/HomeCustomHeader';
import store from '../../redux/store';
import { FAB } from 'react-native-paper';
import ComplaintFilterBottomSheet from '../../components/ComplaintFilterBottomSheet';



interface HomeScreenProps {
  navigation:any;
}

const HomeScreen:React.FC<HomeScreenProps> = ({navigation}) => {
   const dispatch = useDispatch(); 
   const userId = firebase.auth().currentUser?.uid;
   const [token , setToken] = useState<string | null>(null); 
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const [isComplaintBottomSheetVisible , setComplaintBottomSheetVisible] = useState(false);
   const complaints = useSelector((state:any) => state.complaint.complaints);
   const complaintStatus = useSelector((state:any) => state.complaint.complaintStatus);
   const notificationReadStatus = useSelector((state: any) => state.notification.notificationAllReadOrNot);
   const accountType = useSelector((state: any) => state.userProfile.accountType);
  
            

   
   useEffect(() => {
      requestNotificationPermission(); 
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
      dispatchStore(fetchComplaints(userId, accountType))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } 
  },[accountType]);


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
      dispatch({
         type:COMPLAINT,
         payload:item,
      })
      navigation.navigate('Complaint');
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


  const onRefresh = () => {
    setRefreshing(true);
    dispatchStore(fetchComplaints(userId, accountType))
    setRefreshing(false);
  };


  const getStatusIcon = (item: { complaints: { isInjured: any; complaintStatus: any; policeStationStatus: any; hospitalStatus: any; }; }) => {
    const { isInjured, complaintStatus, policeStationStatus, hospitalStatus } = item.complaints;
    

    if (complaintStatus === 'Completed') {
      return 'thumbs-up';
    }
  
    if (complaintStatus === 'NotCompleted') {
      return 'thumbs-down';
    }
  
    if(complaintStatus === "pending" && isInjured === "No"){
        if(!policeStationStatus){
           return 'clock';
        }
        else if(policeStationStatus && (policeStationStatus === "Not Completed")){
          return 'window-close';  
        }
        return 'thumbs-down';
    }
    if(complaintStatus === "pending" && isInjured === "Yes"){
       if(!policeStationStatus && !hospitalStatus){
          return 'clock';
       }
       else if((policeStationStatus || hospitalStatus) && ((policeStationStatus === "Completed") || (hospitalStatus === "Completed"))){
                 return 'thumbs-down';
       }
       else if((policeStationStatus || hospitalStatus)  &&  (policeStationStatus === "Not Completed" || hospitalStatus === "Not Completed")){
           return 'window-close';
       }

    }
  
    return 'clock'; 
  };

  const getStatusColor = (item: { complaints: { isInjured: any; complaintStatus: any; policeStationStatus: any; hospitalStatus: any; }; }) => {
    const { isInjured, complaintStatus, policeStationStatus, hospitalStatus } = item.complaints;
    

    if (complaintStatus === 'Completed') {
      return 'green';
    }
  
    if (complaintStatus === 'NotCompleted') {
      return 'red';
    }
  
    if(complaintStatus === "pending" && isInjured === "No"){
        if(!policeStationStatus){
           return '#e1ad01';
        }
        else if(policeStationStatus && (policeStationStatus === "Not Completed")){
           return 'red'; 
        }
        return 'red';
    }
    if(complaintStatus === "pending" && isInjured === "Yes"){
       if(!policeStationStatus && !hospitalStatus){
          return '#e1ad01';
       }
       else if((policeStationStatus || hospitalStatus) && 
            ((policeStationStatus === "Completed" || policeStationStatus === "Not Completed") || 
              (hospitalStatus === "Completed" || hospitalStatus === "Not Completed"))){
                 return 'red';
       }

    }
  
    return '#e1ad01'; 
  };




  const renderComplaint = ({ item }: { item: any }) => (
    <ComplaintsCard
      icon={'person'}
      message={item.complaints.complaint.trim()}
      time={new Date(item.complaints.createdAt).toLocaleDateString('en-GB') +
        ' ' +
        new Date(item.complaints.createdAt).toLocaleTimeString()}
      color={getColor(accountType)}
      isRead={true}
      handleDetails={() => handleDetails(item)}
      statusIcon={getStatusIcon(item)} 
      statusIconColor={getStatusColor(item)}
    />
  );


  const filteredComplaints = complaints.filter((item: { complaints: {
    hospitalStatus: any;
    policeStationStatus: any; complaintStatus:any; 
}; }) => {
    if (complaintStatus === 'All') return true;
    else if(complaintStatus === "Accepted"){
      return item.complaints.complaintStatus === "Completed" && complaintStatus === "Accepted";
    }
    else if(complaintStatus === "Rejected"){
      return (item.complaints.complaintStatus === "Not Completed" || item.complaints.complaintStatus === "pending") && (item.complaints.policeStationStatus || item.complaints.hospitalStatus) && complaintStatus === "Rejected";
    }
    else if(complaintStatus === "Pending"){
      return item.complaints.complaintStatus === "pending" && (!item.complaints.policeStationStatus && !item.complaints.hospitalStatus) && complaintStatus === "Pending";
    } 
    
  
  });


  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={getColor(accountType)} />
        <HomeCustomHeader
          name={'Home'}
          icon={accountType === 'PoliceStation' ? 'map' : ''}
          call={() => navigation.navigate('LocationHistory')}
          isRead={notificationReadStatus}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={getColor(accountType)} />
          </View>
        ) : (
          <>
            <FlatList
              data={filteredComplaints.sort(
                (
                  a: {complaints: {createdAt: string}},
                  b: {complaints: {createdAt: string}},
                ) =>
                  new Date(b.complaints.createdAt).getTime() -
                  new Date(a.complaints.createdAt).getTime(),
              )}
              renderItem={renderComplaint}
              keyExtractor={item => item.complaints.complaintId.toString()}
              contentContainerStyle={{paddingTop: 20, paddingBottom: 10}}
              ListEmptyComponent={
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{fontSize: 25, color: 'black', fontWeight: '700'}}>
                    No Complaint
                  </Text>
                </View>
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
            />

            {complaints.length > 0 && (
              <FAB
                style={[
                  styles.fab,
                  accountType && {backgroundColor: getColor(accountType)},
                ]}
                icon="filter-outline"
                color="white"
                onPress={() => setComplaintBottomSheetVisible(true)}
              />
            )}
          </>
        )}
      </View>
      {isComplaintBottomSheetVisible && (
        <ComplaintFilterBottomSheet
          setComplaintBottomSheetVisible={setComplaintBottomSheetVisible}
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      borderRadius:30,
    },
});

export default HomeScreen;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>

