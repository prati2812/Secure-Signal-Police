import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView,  ScrollView, TouchableOpacity, Pressable, Image, TextInput, Platform, AppState, Alert, BackHandler, PermissionsAndroid, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from '../../components/useError';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import { useDispatch, useSelector } from 'react-redux';
import { addAccountType, addUserName, setProfileCompleted } from '../../redux/userProfile/action';
import { firebase } from '@react-native-firebase/auth';  
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import instance from '../../axios/axiosInstance';
import { dispatchStore } from '../dashboard/HomeScreen';

interface UserProfileScreenProps {
  navigation:any;
}

const UserProfileScreen:React.FC<UserProfileScreenProps> = ({navigation}) => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [accountType , setAccountType] = useState<string | null>('');
  const name = useSelector((state:any) => state.userProfile.userName);
  const [userName , setUserName] = useState('');
  const [isError , setIsError] = useState(false);
  const [isImageSelectionSheetVisible , setImageSelectionSheetVisible] = useState(false);
  const [notificationToken , setNotificationToken] = useState<string | null>('');
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const imageResponse = useSelector((state : any) => state.userProfile.imageResponse);
  const imageUri = useSelector((state:any) => state.userProfile.imageUri);
  const currentUser = firebase.auth().currentUser;
  const dispatch = useDispatch();
  const accountTypeTheme = useSelector((state: any) => state.userProfile.accountType);

  

  useEffect(() => {
     if(accountType){
      dispatchStore(addUserName(currentUser?.uid , accountType)).
       then(() => setLoading(false))
      .catch(() => setLoading(false));
     }
  },[accountType])

  useEffect(() => {
     getToken();
     requestLocationPermission();
  },[]);

  useEffect(() => {
    setUserName(name);
  },[name]);


  

  const getToken = async() => {
   const notificationToken = await AsyncStorage.getItem('fcm_token');
   setNotificationToken(notificationToken);
   const type = await AsyncStorage.getItem('AccountType');
   setAccountType(type);
   dispatch(addAccountType(type));
  }


  // Request location Permission 
  const requestLocationPermission = async() => {
    if(Platform.OS === 'android'){
       const granted = await PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION');
       if(granted === PermissionsAndroid.RESULTS.GRANTED )
       {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position.coords.latitude , position.coords.longitude);
            setLocation({latitude:position.coords.latitude , longitude:position.coords.longitude});
          },
          error => {
            console.log(error.code, error.message);
            console.log("error");
            
          },
        );
       }
       else{
           requestLocationPermission();
       }
    }
 }


  const closeApp = () => {
    dispatch({
      type: 'ADD_USER_NAME',
      payload: null,
    });

    dispatch({
      type: 'ADD_IMAGE_URI',
      payload: null,
    });
    navigation.navigate('AccountType')
  }
 

  // Terminate the process
  const handleCloseApp = async() => {
    Alert.alert(
      'Exit App',
      'If you proceed, You will need to register your phone number again when you use the app next time.',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () =>  closeApp()},
      ],
      {
        cancelable: false,
      },
    );
  }

  // Open ImageSheet for image selection
  const handleUserImage = async () =>{
      setImageSelectionSheetVisible(true);
  }


  const saveProfile = async() => {
    dispatch({
      type:'ADD_USER_NAME',
      payload:userName,
    });

    const formData = new FormData();
    if (imageResponse && imageResponse.assets && imageResponse.assets.length > 0){
      formData.append('image' , {
        uri: imageResponse.assets[0].uri,
        type: imageResponse.assets[0].type,
        name: imageResponse.assets[0].fileName,
      }); 
    }

    formData.append('phoneNumber' , currentUser?.phoneNumber);
    formData.append('userName' , userName);
    formData.append('userId', currentUser?.uid);
    formData.append('location', JSON.stringify({"latitude": location.latitude , "longtitude": location.longitude}));
    formData.append('notificationToken', notificationToken);
    console.log(notificationToken);
    
    console.log("========",location);
    
  

    setIndicatorVisible(true);

    if(accountType === 'PoliceStation'){
      const response = await instance.post('/userProfile', formData);

      if(response.status === 200){
        AsyncStorage.setItem("profileExist", "true");
        dispatch(setProfileCompleted(true));         
        setIndicatorVisible(false);
        navigation.navigate('HomeScreen') 
      }
      else{
         setIndicatorVisible(false);
          
      }
    }
    else if(accountType === 'Hospital'){
      console.log("======",accountType);
      
      const response = await instance.post('/hospital/userProfile', formData);

      if(response.status === 200){
        AsyncStorage.setItem("profileExist", "true");
        dispatch(setProfileCompleted(true));         
        setIndicatorVisible(false);
    
        navigation.navigate('HomeScreen') 
      }
      else{
         setIndicatorVisible(false);
          
      }
    }
    else{
      const response = await instance.post('/userProfile', formData);

      if(response.status === 200){
        AsyncStorage.setItem("profileExist", "true");
        dispatch(setProfileCompleted(true));         
        setIndicatorVisible(false);
              
        setIndicatorVisible(false);
    
        navigation.navigate('HomeScreen'); 
      }
      else{
         setIndicatorVisible(false);
          
      }
    }
    
  }



  // Save User Profile Data to Database
  const handleSaveProfile = async() => {
    if(userName.length <= 2){
      setIsError(true);
      setUserName(userName);
      return false;
    }

    Alert.alert(
      'Warning',
      `Your current location is being recognized as a ${accountType} on the map. Please confirm that you are actually at a ${accountType} before proceeding with user profile creation.`,
      [
        {
          text: 'OK',
          onPress: () => saveProfile(),
        },
        {
          text: 'Cancel',
        },
      ],
      { cancelable: false }
    );
       
  }


  // UserName Validation
  const userNamevalidation = (text : string) => {
    if(text.length !<= 2){
      setIsError(true);
      setUserName(text);
      return false;
    } 
    setUserName(text);
    setIsError(false);
  }
  
  const getColor = (accountType: string | null) => {
    if (accountType === 'PoliceStation') {
      return '#af952e';
    } else if (accountType === 'Hospital') {
      return '#008ECC';
    } else {
      return '#af952e';
    }
  };
  
  const isDisabled = isError || isIndicatorVisible || !userName;

  return (
    <>
    <SafeAreaView style={style.editProfileMain}>
    {loading ? (
        <View style={style.loadingContainer}>
          <ActivityIndicator size="large" color={getColor(accountType)} />
        </View>
       ) : (
        

      <>

      <ScrollView
        showsVerticalScrollIndicator={false}>      

        <View
                style={style.editProfileIconView}>
                <TouchableOpacity
                  style={style.closeIcon}
                  onPress={() => handleCloseApp()}>
                  <Icon name="close" size={30} color={'black'} />
                </TouchableOpacity>
              </View><View
                style={style.editProfileTextView}>
                  <Text style={style.editText}>
                    Edit Profile
                  </Text>
                </View><Pressable
                  style={{ elevation: 15, alignItems: 'center' }}
                  onPress={() => handleUserImage()}>
                  <View
                    style={style.editProfileImagePickerView}>
                    <Image
                      style={style.editProfileImagePicker}
                      source={{ uri: imageUri ? imageUri : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}>
                    </Image>
                  </View>
                </Pressable><View style={style.editTextInputView}>
                  <View style={style.editTextInput}>
                    <TextInput
                      style={style.editUsername}
                      placeholder="Enter Police Station Name"
                      value={userName}
                      onChangeText={userNamevalidation} />
                  </View>
                </View>
                
               {
                  isError ?  <HandleError title='please enter police station name'/> : null 
               }
              
      
      
      

      <View style={style.saveProfileBtnView}>
        <TouchableOpacity
          style={[style.SaveProfileBtn , isError && style.SaveProfileBtnDisable , accountTypeTheme && {backgroundColor:getColor(accountTypeTheme)}]}
          disabled={isDisabled}
          onPress={() => handleSaveProfile()}>
          <View style={style.btnView}>
          {
               isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/>  
               :    <Text style={style.saveProfile}>
                        Save Profile
                    </Text>
          }
          
          </View>
        </TouchableOpacity>
      </View>
      
     
      </ScrollView>
      </>
    )
    }  
    </SafeAreaView>
    {isImageSelectionSheetVisible && (
      <ImagePickerSheet
        setImageSelectionSheetVisible={setImageSelectionSheetVisible}
      />
    )}  
    </>
  );
};


const style = StyleSheet.create({
  editProfileMain: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  editProfileIconView: {
    marginTop: 20,
  },
  closeIcon: {
    paddingLeft: 20,
  },
  editProfileTextView: {
    marginTop: 10,
  },
  editText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
  },
  editProfileImagePickerView: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    width: 200,
    borderRadius: 120,
    elevation: 3,
    marginBottom: 2,
    overflow: 'hidden',
  },
  editProfileImagePicker: {
    width: 200,
    height: 200,
  },
  editTextInputView: {
    backgroundColor: 'white',
    padding: 20,
  },
  editTextInput: {
    backgroundColor: '#F3FAFF',
    margin: 2,
    padding: 10,
    borderRadius: 15,
    elevation: 3,
  },
  editUsername: {
    fontSize: 20,
    color: 'black',
  },
  saveProfileBtnView: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 20,
    marginBottom: 30,
  },
  SaveProfileBtn: {
    backgroundColor: '#af952e',
    padding: 13,
    borderRadius: 10,
    elevation: 3,
  },
  SaveProfileBtnDisable: {
    backgroundColor: '#e0ce86',
  },
  btnView: {
    alignItems: 'center',
    margin: 1,
  },
  saveProfile: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default UserProfileScreen;

