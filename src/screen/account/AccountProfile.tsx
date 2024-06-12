import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomProfileOption from '../../components/CustomProfileOption';
import DeleteAccountSheet from '../../components/DeleteAccountSheet';
import { useState } from 'react';
import BottomSheet from '../../components/BottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addToken } from '../../redux/userProfile/action';



interface AccountProfileProps {
  navigation:any;
}

const AccountProfile:React.FC<AccountProfileProps> = ({navigation}) => {

  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isDeleteAccountSheetVisible, setDeleteAccountSheetVisible] = useState(false);
  const userName = useSelector((state : any) => state.userProfile.userName);
  const address = useSelector((state:any) => state.userProfile.address);
  const imageUri = useSelector((state:any) => state.userProfile.imageUri);
  const phoneNumber = firebase.auth().currentUser?.phoneNumber;
  const accountType = useSelector((state: any) => state.userProfile.accountType);
  const dispatch = useDispatch();

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
  

  const handleLogout = async() => {
    await AsyncStorage.clear();
    dispatch(addToken(''));
    navigation.navigate('PhoneNumber');
  } 
 


  return (

    <View style={styles.container}>
      <CustomHeader name={'Profile'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: imageUri? imageUri  : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
              style={styles.profileImage}
              resizeMode='cover'
            />
          </View>

          <TouchableOpacity style={[styles.editProfileButton  , accountType && {borderColor:getColor(accountType)}]} onPress={() => setBottomSheetVisible(true)}>
            <View style={styles.editProfileButtonContent}>
              <Icon name='border-color' size={15} color={'black'} />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsSection}>
          {/* Render custom profile options */}
          <CustomProfileOption optionName='Name' data={userName} icon='person' />
          <CustomProfileOption optionName='PhoneNumber' data={phoneNumber} icon='call' />
          <CustomProfileOption optionName='Address' data={address} icon='apartment'/>

        </View>

        
        <TouchableOpacity style={[styles.deleteAccountButton , {backgroundColor:'white' , borderColor:'red' , borderWidth:1 , marginBottom:-10}]} onPress={() => handleLogout()}>
          <View style={styles.deleteAccountButtonContent}>
            <Icon name='logout' size={25} color={'red'} />
            <Text style={[styles.deleteAccountButtonText , {color:'red'}]}>Log out</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteAccountButton} onPress={()=>  setDeleteAccountSheetVisible(true)}>
          <View style={styles.deleteAccountButtonContent}>
            <Icon name='delete-forever' size={25} color={'white'} />
            <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {isBottomSheetVisible && <BottomSheet setBottomSheetVisible={setBottomSheetVisible} />}

      {
         isDeleteAccountSheetVisible && <DeleteAccountSheet setDeleteAccountSheetVisible={setDeleteAccountSheetVisible}/>
      }    
         

    </View>

     
     
  );
};

export default AccountProfile;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
      },
      profileSection: {
        marginTop: 20,
        alignItems: 'center',
      },
      profileImageContainer: {
        backgroundColor: 'lightblue',
        height: 150,
        width: 150,
        borderRadius: 100,
        elevation: 5,
        overflow: 'hidden',
      },
      profileImage: {
        flex: 1,
      },
      profileName: {
        marginTop: 10,
        fontSize: 20,
        color: 'black',
        fontWeight: '700',
      },
      phoneNumber: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '600',
      },
      editProfileButton: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 20,
        borderColor: '#af952e',
        borderWidth: 3,
        elevation: 5,
      },
      editProfileButtonContent: {
        flexDirection: 'row',
        gap: 7,
        alignItems: 'center',
        justifyContent: 'center',
      },
      editProfileButtonText: {
        color: 'black',
        fontSize: 15,
        fontWeight: '500',
      },
      optionsSection: {
        marginTop: 15,
        marginHorizontal: 15,
        marginBottom: 15,
      },
      deleteAccountButton: {
        marginTop: 30,
        backgroundColor: '#D01110',
        padding: 10,
        borderRadius: 15,
        elevation: 5,
        marginHorizontal: 15,
        marginBottom: 15,
      },
      deleteAccountButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
      },
      deleteAccountButtonText: {
        color: 'white',
        fontSize: 20,
      }, 
});
