import React, { useEffect, useState } from 'react';
import { Image, StatusBar, Text, View , StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';


interface SplashScreenProps {
  navigation:any
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const token = useSelector((state:any) => state.userProfile.token);
  const accountType = useSelector((state: any) => state.userProfile.accountType);

 
  
  useEffect(() => {
    const navigateToScreen = () => {
      if (token) { 
        navigation.navigate('TabNavigator');
      } else { 
        navigation.navigate('AccountType');
      }
    };

    const timer = setTimeout(navigateToScreen, 5000);
    return () => clearTimeout(timer);
      
  },[navigation , token]);

  const getGradientColors = (accountType: string) => {
    if (accountType === 'PoliceStation') {
      return ['#af952e', '#f2dd87'];
    } else if (accountType === 'Hospital') {
      return ['#008ECC', '#f2dd87'];
    } else {
      return ['#af952e', '#008ECC'];
    }
  };

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
    <View style={style.splashMain}>
      <StatusBar backgroundColor={getColor(accountType)} />
      <LinearGradient
        colors={getGradientColors(accountType)}
        style={style.splashLinearGradient}>
        <View style={style.viewImage}>
         <Image
            style={style.splashImage}
            source={require('../assets/secure.png')}
          />   
          <Text style={style.splashText}>🄿🅁🄾🅃🄴🄲🅃🄾🅁</Text>
        </View>
      </LinearGradient>
      <StatusBar hidden={true} />
    </View>
  );
};

const style = StyleSheet.create({
  splashMain: {
    flex: 1,
  },
  splashLinearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap:5,
  },
  splashText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  splashImage:{
    width:80,
    height:80,
    tintColor:'white'
  }
});

export default SplashScreen;



