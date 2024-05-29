import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RAPID_API_BASE_URL, X_RAPID_API_HOST, X_RAPID_API_KEY } from '@env';
import axios from 'axios';
import  poyline from 'google-polyline';

interface LocationRouteScreenProps {}

const LocationRouteScreen = (props: LocationRouteScreenProps) => {
    const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
    const [routeData, setRouteData] = useState<{ routes: any[] } | null>(null);
    const [coordinates, setCoordinates] = useState<[number, number][]>([]);
    const complaintData = useSelector((state:any) => state.complaint.complaint);
    
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
        fetchRouteData();
    },[origin])  
    
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

    const fetchRouteData = async () => {
      
        const options = {
          method: 'GET',
          url: `${RAPID_API_BASE_URL}/${origin.longitude},${origin.latitude};${complaintData.complaints.complaintLocation.longtitude},${complaintData.complaints.complaintLocation.latitude}`,
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
              latitude: (origin.latitude + complaintData.complaints.complaintLocation.latitude) / 2,
              longitude: (origin.longitude + complaintData.complaints.complaintLocation.longtitude) / 2,
              latitudeDelta: Math.abs(origin.latitude - complaintData.complaints.complaintLocation.latitude) * 1.5,
              longitudeDelta:Math.abs(origin.longitude - complaintData.complaints.complaintLocation.longtitude) * 1.5,
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
                latitude: complaintData.complaints.complaintLocation.latitude,
                longitude: complaintData.complaints.complaintLocation.longtitude,
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

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white',
      },
      locationMap:{
        flex:1,  
      }
});
  

export default LocationRouteScreen;

