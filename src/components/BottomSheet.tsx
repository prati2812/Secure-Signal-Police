import React, {useEffect, useRef , useState} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity , TextInput, Animated, Pressable, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePickerSheet from './ImagePickerSheet';
import { useDispatch, useSelector } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import { addUserName } from '../redux/userProfile/action';
import instance from '../axios/axiosInstance';



interface BottomSheetProps {
  setBottomSheetVisible:any;
}

const BottomSheet:React.FC<BottomSheetProps> = ({setBottomSheetVisible}) => {

  const [isImageSelectionSheetVisible , setImageSelectionSheetVisible] = useState(false);
  const [edittedUsername , setedittedUserName] = useState('');
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const userName = useSelector((state : any) => state.userProfile.userName);
  const imageResponse = useSelector((state : any) => state.userProfile.imageResponse);
  const imageUri = useSelector((state:any) => state.userProfile.imageUri);
  const accountType = useSelector((state: any) => state.userProfile.accountType);
  const userId = firebase.auth().currentUser?.uid;
  const dispatch = useDispatch(); 

  const slide = React.useRef(new Animated.Value(300)).current;
  // BottomSheet Slide Up Animatiom
  const slideUp = () => {
      Animated.timing(slide, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    };
  

    // BottomSheet Slide Down Animation
    const slideDown = () => {
     
      Animated.timing(slide, {
        toValue: 300,
        duration: 800,
        useNativeDriver: true,
      }).start();
    };

    useEffect(() => { 
      if(userName){
         setedittedUserName(userName);
      }     
      slideUp()
    })




   // Close BottomSheet
    const closeModal = () => {
      
       slideDown();
       setTimeout(() => {
        setBottomSheetVisible(false);
       },800);
    }



    // Update the data
    const handleUpdateData = async() => {
      
      const formData = new FormData();
      if (imageResponse && imageResponse.assets && imageResponse.assets.length > 0) {
        // Append image data
        formData.append('image', {
          uri: imageResponse.assets[0].uri,
          type: imageResponse.assets[0].type,
          name: imageResponse.assets[0].fileName,
        });
      }
      
      // Append edittedUsername and userId in both cases
      formData.append('edittedUsername', edittedUsername);
      formData.append('userId', userId);
      setIndicatorVisible(true); 
      
      
      try{
   
        if(accountType === 'PoliceStation'){
          const response = await instance.put('/updateProfile', formData);

          if (response.data) {
           setIndicatorVisible(false);
           dispatch({
             type:'ADD_USER_NAME',
             payload:edittedUsername,
           }) 
           closeModal();
          } else {
           setIndicatorVisible(false);
           console.log("Some Problem Occurred");
          }
 
        }
        else if(accountType === 'Hospital'){
          const response = await instance.put('/hospital/updateProfile', formData);

          if (response.data) {
           setIndicatorVisible(false);
           dispatch({
             type:'ADD_USER_NAME',
             payload:edittedUsername,
           }) 
           closeModal();
          } else {
           setIndicatorVisible(false);
           console.log("Some Problem Occurred");
          }
        }
      }
      catch(err){
        setIndicatorVisible(false);
        console.log(err);
        
      }   
     
  
 
       
    }

  return (
    <>
      <Pressable style={styles.container} onPress={closeModal}>
        <Pressable style={{width: '100%', height: '45%'}}>
          <Animated.View
            style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
            <View style={styles.editProfileView}>
              <Text style={styles.editProfileTxt}>Edit Profile</Text>
            </View>
            {/* Edit User Image */}
            <View style={styles.editUserImageView}>
              <View style={styles.editProfileImage}>  
                <Image
                  source={{
                    uri: imageUri ? imageUri : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                  }}
                  style={{flex: 1}}
                  resizeMode="cover"
                 />
              </View>
              <TouchableOpacity
                  style={styles.editProfileIcon}
                  onPress={() => setImageSelectionSheetVisible(true)}>
                  <Icon name="edit" size={20} color={'black'} />
              </TouchableOpacity>
            </View>

            {/* Edit Username */}
            <View style={styles.editTextInput}>
              <TextInput
                style={styles.editUsername}
                placeholder="Enter your name"
                onChangeText={(text) => setedittedUserName(text)}
                value={edittedUsername}
              />
            </View>



            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => closeModal()}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateData()}>
                {
                   isIndicatorVisible ? <ActivityIndicator size={25} color={'green'}/>  
                      : <Text style={styles.btnText}>Update</Text>
                }                                                          
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>

      {isImageSelectionSheetVisible && (
        <ImagePickerSheet
          setImageSelectionSheetVisible={setImageSelectionSheetVisible}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        flex:1,
        backgroundColor:'#00000080',
        width:'100%',
        height:'100%',
        top: 0,
        left: 0,
        justifyContent:'flex-end',
    },
    bottomSheet:{
        width:'100%',
        height:'100%',
        backgroundColor:'white',   
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
    },
    editProfileView:{
        alignItems:'center',
    },
    editProfileTxt:{
        marginTop:15,
        fontSize:22,
        color:'black',
        fontWeight:'700',
    },
    editUserImageView:{
        alignItems:'center',  
    },
    editProfileImage:{
        marginTop:10,
        height:120, 
        width:120, 
        borderRadius:100 , 
        elevation:5,
        backgroundColor:'lightblue',
        flexDirection:'row',
        overflow:'hidden',
        
    },
    editProfileIcon:{
        bottom:5, 
        backgroundColor:'white', 
        borderRadius:20,
        right:'35%',
        padding:5,
        borderColor:'black',
        borderWidth:2,
        position:'absolute',
       
    },
    editTextInput:{
        backgroundColor:'white',
        marginTop:15,
        borderRadius:10,
        elevation:5,
        marginLeft:15,
        marginRight:15,
        padding:5,
        borderColor:'green',
        borderWidth:1.5,
    },
    editUsername:{
        fontSize:20,
        color:'black' 
    },
    buttonView:{
        flexDirection:'row' , 
        marginTop:20, 
        justifyContent:'flex-end',
        marginRight:15,
        gap:15,
    },
    cancelButton:{
        padding:10,
        backgroundColor:'white',
        width:'25%',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'red',
        borderWidth:2,
        borderRadius:10,
        elevation:5,


    },
    updateButton:{
        padding:10,
        backgroundColor:'white',
        width:'25%',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'green',
        borderWidth:2,
        borderRadius:10,
        elevation:5,
    },
    btnText:{
        fontSize:17,
        color:'black',
        fontWeight:'600',
    }
});


  
export default BottomSheet;

