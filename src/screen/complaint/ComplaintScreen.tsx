import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import base64 from 'base64-js';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ComplaintScreenProps {

}

const ComplaintScreen = (props: ComplaintScreenProps) => {
 const complaintData = useSelector((state:any) => state.complaint.complaint);
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
 
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={getColor(accountType)} />  
      <CustomHeader name={'Complaint Preview'} icon={''} />
      
      <ScrollView
         style={{marginTop: 20, marginBottom: 20}}
         showsVerticalScrollIndicator={false}>
          
          <View style={styles.complaintMessageView}>
                    <View style={styles.complaintMessage}>
                          <Text style={styles.complaintTitle}>{`Complainer : `}</Text>
                          <Text style={styles.message}>{complaintData.complaints.complaintBy}</Text>
                    </View>
            </View>

            <View style={styles.complaintMessageView}>
                    <View style={styles.complaintMessage}>
                          <Text style={styles.complaintTitle}>{`Complaint : `}</Text>
                          <Text style={styles.message}>{complaintData.complaints.complaint}</Text>
                    </View>
            </View>

            <View style={styles.complaintMessageView}>
                    <View style={styles.complaintMessage}>
                          <Text style={styles.complaintTitle}>{`IsInjured : `}</Text>
                          <Text style={styles.message}>{complaintData.complaints.isInjured}</Text>
                    </View>
            </View>

            <View style={styles.complaintMessageView}>
                        <Text style={styles.complaintTitle}>{`Incident Photos : `}</Text>
                        <View style={styles.complaintImageView}>
                        {
                            complaintData.complaintsImageBuffer !== undefined && 
                               complaintData.complaintsImageBuffer.map((item : any,  index:number) => {
                                      
                                  const base64Image = base64.fromByteArray(item.imageBuffer.data);
                                  const imageUrl = `data:image/jpeg;base64,${base64Image}`;
                                      
                                      return (
                                        <View style={styles.complaintImage} key={index}>
                                          <Image
                                            key={index}
                                            source={{
                                              uri: imageUrl
                                                ? imageUrl
                                                : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                                            }}
                                            style={{flex: 1}}
                                            resizeMode="cover"
                                          />
                                        </View>
                                      );                                                                   
                               })
                        }
                        </View>
                  
            </View>


            <View style={styles.complaintMessageView}>
                   <Text style={styles.complaintTitle}>{`Incident Location : `}</Text>
                    <View style={{marginTop:10, }}>
                          <View style={{width:'100%' , height:300 , borderRadius:10, overflow:'hidden'}}>
                       
                                      <MapView
                                       style={{flex:1}} 
                                       provider={PROVIDER_GOOGLE}
                                       scrollEnabled={false}
                                       zoomEnabled={true}
                                       region={{
                                         latitude:complaintData.complaints.complaintLocation.latitude,
                                         longitude:complaintData.complaints.complaintLocation.longtitude,
                                         latitudeDelta: 0.015,
                                         longitudeDelta: 0.0121,
                                       }}>
                                               <Marker coordinate={{
                                        latitude: complaintData.complaints.complaintLocation.latitude , 
                                        longitude: complaintData.complaints.complaintLocation.longtitude} } >
                                       <Icon name='location-pin' size={40} color={'#5F4C24'}/>
                                      </Marker>

                                       </MapView>
                                                       
                          </View>
                    </View>
            </View>

         


       
        
      </ScrollView>

    </View>
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
    }
});
  
export default ComplaintScreen;

