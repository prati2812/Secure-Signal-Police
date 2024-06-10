import * as React from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, Image, Pressable, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, Alert, StatusBar, ScrollView } from 'react-native';
import HandleError from '../../hook/useError';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPhoneNumber, addVerificationId } from '../../redux/credentials/action';
import auth, { firebase } from '@react-native-firebase/auth';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;


interface PhoneNumberScreenProps {
  navigation:any;
}

const PhoneNumberScreen:React.FC<PhoneNumberScreenProps> = ({navigation}) => {
  const regex = /[.,+\-' ']/; 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isError, setIsError] = useState(false);
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const dispatch = useDispatch();
  const accountType = useSelector((state: any) => state.userProfile.accountType); 
   
   


const handlePhoneNumber = async() => {
  try {
     if(!phoneNumber){
      setIsError(true);
      setPhoneNumber(phoneNumber);
      return false;    
     }
  
     let phoneNo = '+91'+phoneNumber;
     dispatch(addPhoneNumber(phoneNo));
      
     setIndicatorVisible(true);
     try{
      console.log("===" , phoneNo);
      const confirmation = await auth().signInWithPhoneNumber(phoneNo);
      console.log("====",confirmation);
      
      dispatch(addVerificationId(confirmation.verificationId));  
      setIndicatorVisible(false);
       
      navigation.navigate('OtpScreen');
     }
     catch(error){
       setIndicatorVisible(false); 
       console.log(error);
       
       Alert.alert(
        'Error',
        'Please try again later',
        [
          {
            text: 'Ohk',
          },
        ],
        {
          cancelable: false,
        },
      );
       
       
     }
     
  } catch (error) {
    console.log(error);
  }

}

 
 const phoneNumberValidation = (text:string) => {
  if (!text) {
    setIsError(true);
    setPhoneNumber(text);
    return false;
  } 
  else if (text.length < 10) {
    setIsError(true);
    setPhoneNumber(text);
    return false;
  } 
  else if(regex.test(text)) {
     setIsError(true);
     setPhoneNumber(text);
     return false;
  }
  else{
    setPhoneNumber(text);
    setIsError(false);
  }
  
  

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


const isDisabled = isError || isIndicatorVisible;

  return (
    
    <View style={[styles.container, accountType && {backgroundColor:getColor(accountType)}]}>  
     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>   
      <View style={{alignItems: 'center' , flex:1 , justifyContent:'center'}}>
        <Image
          style={{width: width / 1.2, height: height / 3 , resizeMode:'cover'}}
          source={require('../../assets/authentication.png')}
        />
      </View>
      <Pressable style={{width: '100%', height: '60%'}}>
        <View style={styles.bottomSheet}>
          <View style={styles.phoneNumberView}>
            <Text style={styles.phoneNumberText}>Enter your phone number</Text>
          </View>
          <View style={styles.phoneNumebrTextInputView}>
            <View style={styles.phoneNumberTextInput}>
              <TextInput
                style={styles.phoneNumber}
                placeholder="Phone number"
                keyboardType="numeric"
                maxLength={10}
                value={phoneNumber}
                onChangeText={phoneNumberValidation}
              />
            </View>
          </View>
          {isError && phoneNumber.length <= 10 && phoneNumber.length >= 1  && regex.test(phoneNumber)?
          <HandleError title="please enter valid phone number" />
            : isError ? <HandleError title="please enter phone number" /> : null
          }  

      <View style={styles.informationView}>
        <Text style={styles.informationText}>
          We'll send you a verification code. Message and
          data rates may apply.
        </Text>
      </View>
      
      <View style={styles.sendCodeBtnView}>
         <TouchableOpacity style={[styles.sendBtnCode, isError && styles.sendBtnCodeDisable , accountType && {backgroundColor:getColor(accountType)}]}
                disabled={isDisabled}
                onPress={ () => handlePhoneNumber()}>
         <View style={styles.btnView}>
            {
               isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/> 
               :   <Text style={styles.sendCode}>
                      Send Code
                  </Text>
            }
          </View>
         </TouchableOpacity>
      </View>

        </View>
      </Pressable>
      </KeyboardAvoidingView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    flex:1,
    backgroundColor:'#af952e',
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
    borderTopRightRadius:45,
    borderTopLeftRadius:45,
},
phoneNumberView:{
    marginTop:10,
    alignItems:'center',
    justifyContent:'center',
},
phoneNumberText:{
   fontSize:25,
   color:'black',
   fontWeight:'500',
   padding:10,
   textAlign:'center'
},
phoneNumebrTextInputView:{
    backgroundColor:'white',
    padding:20
 },
 phoneNumberTextInput:{
    backgroundColor:'#F3FAFF',
    margin:2,
    padding:10,
    borderRadius:15,
    elevation:3,
 },
 phoneNumber:{
    fontSize:20,
    color:'black'  
 },
 informationView:{
    margin:-10,
    justifyContent:'center', 
 },
 informationText:{
    color:'black',
    fontSize:16,
    paddingLeft:35,
    paddingRight:35,
    fontWeight:'400'
 },
 sendCodeBtnView:{
     flex:1,
     justifyContent:'flex-end',
     margin:20,
     marginBottom:10,
 },
 sendBtnCode:{
     backgroundColor:'#af952e',
     padding:13,
     borderRadius:10,
     elevation:3,
 },
 sendBtnCodeDisable:{
     backgroundColor: '#e0ce86', 
 },
 btnView:{
    color:'white',
    alignItems:'center',
    margin:1
 },
 sendCode:{
    color:'white',
    fontSize:18,
    fontWeight:'700'
 },
});
  

export default PhoneNumberScreen;

