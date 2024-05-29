import { firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSelector } from 'react-redux';
import  poyline from 'google-polyline';
import instance from '../../axios/axiosInstance';
import { RAPID_API_BASE_URL, X_RAPID_API_HOST, X_RAPID_API_KEY } from '@env';


interface LiveLocationProps {
    route: any;
}

const LiveLocation: React.FC<LiveLocationProps> = ({ route }) => {
    const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
    const [destination, setDestination] = useState({ latitude: 0, longitude: 0 });
    const [routeData, setRouteData] = useState<{ routes: any[] } | null>(null);
    const [coordinates, setCoordinates] = useState<[number, number][]>([]);
    const userId = firebase.auth().currentUser?.uid;
    const token = useSelector((state: any) => state.userProfile.token);
    const senderId = route.params?.senderId;
  

    useEffect(() => {
      const currentLocation = () => {
        Geolocation.getCurrentPosition(
          position => {
            setOrigin({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          error => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      };
      currentLocation();
    }, []);
  
    useEffect(() => {
      const interval = setInterval(() => {
        getUserLocation();
      }, 1000);
  
      return () => clearInterval(interval);
  
    }, []);

   
    useEffect(() => {
       fetchRouteData();
    },[destination])


    useEffect(() => {
        try{
            if (routeData && routeData.routes && routeData.routes.length > 0) {
                const routeGeometry = routeData.routes[0].geometry;
                const data = poyline.decode(routeGeometry);
                setCoordinates(data); 
                console.log("======" , data);
                
            }
        }
        catch(error){
            console.log(error);
            
        }
        
    }, [routeData]);
    

    const getUserLocation = async () => {
        const response = await instance.post("/policeStation/fetchLiveLocation",{ userId, senderId });
    
        if (response.status === 200) {
          const data = await response.data;
          
          if (data.latitude !== destination.latitude || data.longitude !== destination.longitude) 
          {
            setDestination({ latitude: data.latitude, longitude: data.longitude });
          }
        }
    };

    const fetchRouteData = async () => {
      
        const options = {
          method: 'GET',
          url: `${RAPID_API_BASE_URL}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`,
          params: {
            alternatives: 'true'
          },
          headers: {
            'X-RapidAPI-Key': X_RAPID_API_KEY,
            'X-RapidAPI-Host': X_RAPID_API_HOST
          }
        };
  
        try {
          const response = await axios.request(options);
          setRouteData(response.data);
        } catch (error) {
          console.error(error);
        }
    }

   

  
    return (
      <View style={styles.container}>
        {coordinates.length > 0 ? (
          <MapView
            style={styles.locationMap}
            region={{
              latitude: (origin.latitude + destination.latitude) / 2,
              longitude: (origin.longitude + destination.longitude) / 2,
              latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 1.5,
              longitudeDelta:Math.abs(origin.longitude - destination.longitude) * 1.5,
            }}>

            <Polyline
              coordinates={coordinates.map(coordinate => ({
                latitude: coordinate[0],
                longitude: coordinate[1],
              }))}
              strokeWidth={4}
              strokeColor="blue"
            />
            <Marker
              coordinate={{
                latitude: origin.latitude,
                longitude: origin.longitude,
              }}
              title="You"
            />

            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title="Destination"
            />
          </MapView>
        ) : (
            <View style={{flex:1, alignItems:'center' , justifyContent:'center'}}>
              <ActivityIndicator size={45} color={'green'} />
            </View>  
       
        )}
      </View>
    );
};
  
export default LiveLocation;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'white',
  },
  locationMap:{
    flex:1,  
  }
});
