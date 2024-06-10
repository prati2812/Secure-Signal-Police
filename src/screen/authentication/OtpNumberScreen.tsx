import * as React from 'react';
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from '../../hook/useError';
import { useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { requestUserPermission } from '../../utils/NotificationService';
import instance from '../../axios/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;


interface OtpNumberScreenProps {
    navigation:any;
}

const OtpNumberScreen: React.FC<OtpNumberScreenProps> = ({navigation}) => {
  const regex = /[.,+\-' ']/;  
  const inputRef = useRef<TextInput>(null);
  const [otp, setOtp] = useState('');
  const [isError, setIsError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const phoneNumber = useSelector((state : any) => state.credentials.phoneNumber);
  const verificationId = useSelector((state:any) => state.credentials.verificationId);
  const accountType = useSelector((state: any) => state.userProfile.accountType); 
  const onPress = () => inputRef.current?.focus();

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

  const handleResendCode = async() => {
    if (!isResendEnabled) return;
     await auth().signInWithPhoneNumber(phoneNumber,true);
    setTimeLeft(30);
    setIsResendEnabled(false);
  };

  const handleOtpNumber = async() => {
    
    try
    {
       if(!otp){
        setIsError(true);
        setOtp(otp);
        return false;  
       }
  
       setIndicatorVisible(true); 
       const credential = auth.PhoneAuthProvider.credential(verificationId , otp);
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
    
  };


  const otpContent = useMemo(
    () => (
      <View style={styles.otpContainerView}>
        {Array.from({length: 6}).map((_, i) => (
          <Text
            key={i}
            onPress={onPress}
            style={[styles.otpTextStyle, otp[i] ? styles.otpFilledStyle : {}]}>
            {otp[i]}
          </Text>
        ))}
      </View>
    ),
    [otp],
  );


  const otpValidation = (text: string) => {
    if(!text) {
      setIsError(true);
      setOtp(text);
      return false;
    }
    else if(regex.test(text)){
      setIsError(true);
      setOtp(text);
      return false;
    } 
    else if ((text.length < 6)) {
      setIsError(true);
      setOtp(text);
      return false;
    }
    else{
      setIsError(false);
      setOtp(text);
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
            <View style={styles.iconArrowBackView}>
              <Text style={styles.iconArrowBack}>
                <Icon name="keyboard-backspace" size={40} />
              </Text>
            </View>
            <View style={styles.otpnNumberTextView}>
              <Text style={styles.otpNumberText}>
                Enter the code we just texted you
              </Text>
            </View>
            <View style={styles.otpNumberViewTextTextInput}>
              <TextInput
                maxLength={6}
                ref={inputRef}
                style={styles.otpTextInput}
                onChangeText={otpValidation}
                value={otp}
                keyboardType="number-pad"
              />
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
                   style={[styles.verifyBtnCode , isError && styles.verifyCodeBtnDisable , accountType && {backgroundColor:getColor(accountType)}]} 
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
    color: 'black',
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

