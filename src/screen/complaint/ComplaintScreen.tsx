import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import base64 from 'base64-js';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal } from 'react-native-paper';
import { firebase} from '@react-native-firebase/storage';
import instance from '../../axios/axiosInstance';


interface ComplaintScreenProps {
    navigation:any;  
}

const ComplaintScreen:React.FC<ComplaintScreenProps> = ({navigation}) => {
 const complaintData = useSelector((state:any) => state.complaint.complaint);
 const accountType = useSelector((state: any) => state.userProfile.accountType);
 const [visible, setVisible] = React.useState(false);
 const [imageUris, setImageUris] = React.useState<string[]>([]);
 const [imageUri , setImageUri] = React.useState<string | undefined>();
 const [loading , setLoading] = React.useState(true);
 const [isCompleted , setCompletedButton] = useState(false);
 const [isNotCompleted , setNotCompletedButton] = useState(false);
 const [isStatus , setStatus] = useState('');
 const userId = complaintData.complaints.complainerId;
 const policeStationId = complaintData.complaints.nearestPoliceStationId;
 const hospitalId = complaintData.complaints.nearestHospitalId;
 const complaintId = complaintData.complaints.complaintId;
 const isInjured = complaintData.complaints.isInjured;
   


 useEffect(() => {
     imageDownload();
          
 },[]);

 const imageDownload = async() => {
  try {
    const imagePaths = complaintData.complaints.complaintImage.map((image: string) =>
      image.replace('https://storage.googleapis.com/signal-55ec5.appspot.com/',''),
    );

    const imageUriPromises = imagePaths.map(async (filePath: string | undefined) => {
      const url = await firebase.storage().ref(filePath).getDownloadURL();
      return url;
    });

    const imageUris = await Promise.all(imageUriPromises);
    setImageUris(imageUris);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  } 
   

 }
 

const showModal = (imageUrl : string|undefined) => {
  setVisible(true)
  setImageUri(imageUrl);
};

const hideModal = () => setVisible(false);
 
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

const handleCompleted = () => {
  setCompletedButton(true);
  setNotCompletedButton(false);
  setStatus("Completed");
}

const handleNotCompleted = () => {
 setNotCompletedButton(true);
 setCompletedButton(false);
 setStatus("Not Completed");
}

const handleSave = async() => {
  const newStatus = isStatus;

  
  if(accountType === "Hospital"){
    const response = await instance.put("/hospital/updateComplaintStatus" , 
    {userId, policeStationId,hospitalId,complaintId,isInjured , newStatus});
 
   
   if(response.status === 200){
      const title = "Complaint Status Update";
      const body = "Your complaint has been updated by the hospital. Check the app for more details."
      const response = await instance.post("/hospital/sendNotificationComplainer" , {userId , title , body});
      if(response.status === 200){
         console.log("notification send successfully");
      }
      navigation.goBack();
   }
   else{
     console.log("problem occured");
     
   }   
  }
  else if(accountType === "PoliceStation"){
     const response = await instance.put("/policeStation/updateComplaintStatus",
     {userId, policeStationId,hospitalId,complaintId,isInjured , newStatus});

     if(response.status === 200){
      const title = "Complaint Status Update";
      const body = "Your complaint has been updated by the Police Station. Check the app for more details."
      const response = await instance.post("/policeStation/Notification/sendNotificationComplainer" , {userId , title , body});
      if(response.status === 200){
         console.log("notification send successfully");
      }
      navigation.goBack();
     }
     else{
       console.log("problem occured");
       
     } 


  }


   
}


 
  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={getColor(accountType)} />
        <CustomHeader
          name={'Complaint Preview'}
          backIcon="keyboard-backspace"
          backCall={() => navigation.goBack()}
          icon={isStatus.length === 0 ? '' : 'check'}
          call={handleSave}
        />

       {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={getColor(accountType)} />
        </View>
      ) : ( 
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingTop: 20, paddingBottom: 20}}>
          <View style={styles.complaintMessageView}>
            <View style={styles.complaintMessage}>
              <Text style={styles.complaintTitle}>{`Complainer : `}</Text>
              <Text style={styles.message}>
                {complaintData.complaints.complaintBy}
              </Text>
            </View>
          </View>

          <View style={styles.complaintMessageView}>
            <View style={styles.complaintMessage}>
              <Text style={styles.complaintTitle}>{`Complaint : `}</Text>
              <Text style={styles.message}>
                {complaintData.complaints.complaint.trim()}
              </Text>
            </View>
          </View>

          <View style={styles.complaintMessageView}>
            <View style={styles.complaintMessage}>
              <Text style={styles.complaintTitle}>{`IsInjured : `}</Text>
              <Text style={styles.message}>
                {complaintData.complaints.isInjured}
              </Text>
            </View>
          </View>

          {complaintData.complaints.complaintImage && (
            <View style={styles.complaintMessageView}>
              <Text style={styles.complaintTitle}>{`Incident Photos : `}</Text>
              <View style={styles.complaintImageView}>
                {imageUris.map((uri, index) => (
                  <Pressable key={index} onPress={() => showModal(uri)}>
                    <View style={styles.complaintImage}>
                      <Image
                        source={{uri}}
                        style={{flex: 1}}
                        resizeMode="cover"
                      />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.complaintMessageView}>
            <Text style={styles.complaintTitle}>{`Incident Location : `}</Text>
            <View style={{marginTop: 10}}>
              <Pressable onPress={() => navigation.navigate('LocationRoute')}>
                <View
                  style={{
                    width: '100%',
                    height: 300,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  <MapView
                    style={{flex: 1}}
                    provider={PROVIDER_GOOGLE}
                    scrollEnabled={false}
                    zoomEnabled={true}
                    region={{
                      latitude:
                        complaintData.complaints.complaintLocation.latitude,
                      longitude:
                        complaintData.complaints.complaintLocation.longtitude,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}>
                    <Marker
                      coordinate={{
                        latitude:
                          complaintData.complaints.complaintLocation.latitude,
                        longitude:
                          complaintData.complaints.complaintLocation.longtitude,
                      }}>
                      <Icon name="location-pin" size={40} color={'#5F4C24'} />
                    </Marker>
                  </MapView>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.questionOptionSelectionView}>
             
             <Pressable onPress={() => handleCompleted()} style={{flex:1}}>
              <View style={[styles.questionOptionView , isCompleted && {backgroundColor:getColor(accountType)}]}>
                   <Text style={[styles.option , isCompleted && styles.activateOption]}>
                         Completed
                   </Text>
              </View>
              </Pressable>

              <Pressable onPress={()=> handleNotCompleted()} style={{flex:1}}>
              <View style={[styles.questionOptionView , isNotCompleted && {backgroundColor:getColor(accountType)}]}>
                   <Text style={[styles.option , isNotCompleted && styles.activateOption]}>
                         Not Completed 
                   </Text>
              </View>
              </Pressable>

          </View>


        </ScrollView>
      )}
      </View>
      {
        <>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.containerStyle}>
            <Image
              source={{uri: imageUri}}
              style={{flex: 1}}
              resizeMode="cover"
            />
          </Modal>
        </>
      }
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
    complaintMessageView:{
        marginTop:5,
        marginLeft:15,
        marginRight:15,
        marginBottom:15,
        backgroundColor:'white',
        padding:10,
        borderRadius:10,
        elevation:7,
    },
    complaintMessage:{
        flexDirection:'row',
        alignItems:'center',
        flexWrap:'wrap',
    },
    complaintTitle:{
        fontWeight:'700',
        fontSize:20,
        color:'black',
    },
    message:{
        color:'black',
        alignItems:'center',
        justifyContent:'center',
        fontSize:16,
    },
    complaintImageView:{
        flexDirection:'row' ,  
        gap:10 , 
        alignItems:'center' ,  
        flexWrap:'wrap', 
        marginLeft:10, 
        marginTop:10,
    },
    complaintImage:{
        height:150, 
        width:150 , 
        marginTop:10, 
        backgroundColor:'lightblue' , 
        borderRadius:10,
        overflow:'hidden',
    },
    containerStyle:{
        backgroundColor:'white',
        marginLeft:30,
        marginRight:30,
        height:'60%',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    questionOptionSelectionView:{
      flexDirection:'row',
      marginTop:20,
      marginLeft:15,
      marginRight:15,
      gap:10,
    },
    questionOptionView:{
      flex:1,
      height:60,
      backgroundColor:'lightgray',
      borderRadius:25,
      alignItems:'center',
      justifyContent:'center',
      elevation:5,
    },
    option:{
        color:'black',
        fontSize:20,
        fontWeight:'500',
    },
    activateOptionView:{
      backgroundColor:'#3ebb6e'
    },
    activateOption:{
      color:'white'
    },
});
  
export default ComplaintScreen;

