import * as React from 'react';
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert, NativeSyntheticEvent, TextInputKeyPressEventData, Pressable } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from '../../components/useError';
import { useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { requestUserPermission } from '../../utils/NotificationService';
import instance from '../../axios/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { height, regex, width } from '../../utils/constant';


interface OtpNumberScreenProps {
    navigation:any;
}

const OtpNumberScreen: React.FC<OtpNumberScreenProps> = ({navigation}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isError, setIsError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const phoneNumber = useSelector((state : any) => state.credentials.phoneNumber);
  const verificationId = useSelector((state:any) => state.credentials.verificationId);
  const accountType = useSelector((state: any) => state.userProfile.accountType); 
  

  useEffect(() => {
    requestUserPermission();
  },[]);
  
  useEffect(() => {
    if (timeLeft === 0) {
      setIsResendEnabled(true);
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft]);

  const getColor = (accountType: string | null) => {
    if (accountType === 'PoliceStation') {
      return '#af952e';
    } else if (accountType === 'Hospital') {
      return '#008ECC';
    } else {
      return '#af952e';
    }
  };

  
  const handleResendCode = async() => {
    if (!isResendEnabled) return;
     await auth().signInWithPhoneNumber(phoneNumber,true);
    setTimeLeft(30);
    setIsResendEnabled(false);
  };

  const handleOtpNumber = async() => {
    if(!isError){
      try
      {
         if(!otp){
          setIsError(true);
          setOtp(otp);
          return false;  
         }
    
         setIndicatorVisible(true); 
         let otpString = otp.join('');
         const credential = auth.PhoneAuthProvider.credential(verificationId , otpString);
         const dataa = await auth().signInWithCredential(credential);
         const userId = dataa.user.uid;
         const phoneNumber = dataa.user.phoneNumber;
  
         if(accountType === "PoliceStation"){
          const response = await instance.post('/policeStation/userAuthentication', {
            userId,
            phoneNumber,
          });
          if (response.status === 201) {
            const responseData = await response.data;
            const {token} = responseData;
            AsyncStorage.setItem('token', token);
          }   
         }
         else if(accountType === "Hospital"){
          const response = await instance.post("/hospital/userAuthentication" , {userId , phoneNumber});
          if(response.status === 201){
           const responseData = await response.data;
           const {token} = responseData;
           AsyncStorage.setItem('token' , token);
          } 
         } 
         
         
         setIndicatorVisible(false);
         navigation.navigate('UserProfile');
      }
      catch(error)
      {
         setIndicatorVisible(false);
         Alert.alert(
          'Invalid Otp',
          `Please enter the correct otp`,
          [
            {
              text: 'Ohk',
            },
          ],
          {
            cancelable: true,
          },
        );
         console.log(error);
         
      } 
    }
    
    
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
      
    }
  };

  const otpValidation = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;

    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (!text) {
      setIsError(true);
    } else if (regex.test(text)) {
      setIsError(true);
    } else if (newOtp.join('').length < 6) {
      setIsError(true);
    } else {
      setIsError(false);
    }

    setOtp(newOtp);
  };

  const otpContent = useMemo(
    () => (
      <View style={styles.otpContainerView}>
        {otp.map((value, i) => (
          <TextInput
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          value={value}
          onChangeText={(text) => otpValidation(text, i)}
          style={[
            styles.otpTextStyle,
            accountType && {borderColor:getColor(accountType)},
            otp[i] ? styles.otpFilledStyle : {},
          ]}
          maxLength={1}
          keyboardType="number-pad"
          onFocus={() => inputRefs.current[i].setNativeProps({ selection: { start: 0, end: 0 } })}
          onKeyPress={(e) => handleKeyPress(e,i)}
          onSubmitEditing={handleOtpNumber}
        />
        ))}
      </View>
    ),
    [otp],
  );


  
  
  const isDisabled = isError || isIndicatorVisible;
    
    
  return (
    <View style={[styles.container , accountType && {backgroundColor:getColor(accountType)}]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <Image
            style={{
              width: width / 1.7,
              height: height / 4,
              resizeMode: 'cover',
            }}
            source={require('../../assets/verification.png')}
          />
        </View>
        <View style={{width: '100%', height: '72%'}}>
          <View style={styles.bottomSheet}>
            <Pressable style={styles.iconArrowBackView} onPress={() => navigation.goBack()}>
              <Text style={styles.iconArrowBack}>
                <Icon name="keyboard-backspace" size={40} />
              </Text>
            </Pressable>
            <View style={styles.otpnNumberTextView}>
              <Text style={styles.otpNumberText}>
                Enter the code we just texted you
              </Text>
            </View>
            <View style={styles.otpNumberViewTextTextInput}>
              {otpContent}
            </View>
            {isError && otp.length >= 1 && otp.length <= 6 && regex.test(otp) ? (
                 <View style={{marginTop: 23, marginLeft: -2}}>
                        <HandleError title="please enter the valid code" />
                 </View>
      ) : isError ? (
        <View style={{marginTop: 23, marginLeft: -2}}>
          <HandleError title="please enter the code" />
        </View>
      ) : null}
           <View style={styles.otpNumberResendCodeStyle}>
              <TouchableOpacity
              onPress={handleResendCode}
              disabled={!isResendEnabled}>
              <View style={styles.otpNumberResendCodeText}>
                <Text style={[styles.otpNumberResendCode , isResendEnabled && {color:getColor(accountType)}]}>Resend Code</Text>
              </View>
              </TouchableOpacity>
              <View style={styles.otpNumberResendCodeTextTimer}>
                <Text style={[styles.otpNumberResendCodeTimer , !isResendEnabled && {color:getColor(accountType)}]}>{`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}</Text>
              </View>
            </View> 

            <View style={styles.verifyCodeBtnView}>
              <TouchableOpacity 
                   style={[styles.verifyBtnCode , accountType && {backgroundColor:getColor(accountType)} , isError && accountType  && styles.verifyCodeBtnDisable]} 
                   onPress={handleOtpNumber}
                   disabled={isDisabled}>
                <View style={styles.btnView}>
                  {
                    isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/> 
                       :  <Text style={styles.verifyCode}>Next</Text>   
                  }
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#af952e',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  iconArrowBackView: {
    marginTop: 20,
  },
  iconArrowBack: {
    justifyContent: 'center',
    marginLeft: 10,
    color: 'black',
  },
  otpnNumberTextView: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpNumberText: {
    fontSize: 25,
    color: 'black',
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  otpNumberViewTextTextInput: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  otpTextInput: {
    height: 60,
    width: '100%',
    marginBottom:-60,
    opacity:0,
  },
  otpContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  otpTextStyle: {
    height: 60,
    width: 50,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 28,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: 'black',
    backgroundColor: '#F3FAFF',
    borderColor: 'white',
    elevation: 3,
  },
  otpFilledStyle: {
    backgroundColor: '#F3FAFF',
    overflow: 'hidden',
    borderColor: 'gray',
  },
  otpNumberResendCodeStyle: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpNumberResendCodeText: {
    paddingLeft: 20,
  },
  otpNumberResendCode: {
    color: 'lightgray',
    fontSize: 14,
    fontWeight: '500',
  },
  otpNumberResendCodeTextTimer: {
    paddingRight: 20,
  },
  otpNumberResendCodeTimer: {
    fontSize: 14,
    fontWeight: '500',
  },
  verifyCodeBtnView: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 20,
    marginBottom: 10,
  },
  verifyBtnCode: {
    backgroundColor: '#af952e',
    padding: 13,
    borderRadius: 10,
    elevation: 3,
  },
  verifyCodeBtnDisable:{
    backgroundColor: '#e0ce86', 
  },
  btnView: {
    alignItems: 'center',
    margin: 1,
  },
  verifyCode: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  
});


export default OtpNumberScreen;

