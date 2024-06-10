import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { Text, View, StyleSheet,  TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { addAccountType } from '../../redux/userProfile/action';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import { height } from '../../utils/constant';

interface AccountTypeSelectionProps {
    navigation:any
}



const AccountTypeSelection:React.FC<AccountTypeSelectionProps> = ({navigation}) => {

    const dispatch = useDispatch();

    const handleSelection = async(type: string | null) => {
      await AsyncStorage.clear();
      if(type){
         await AsyncStorage.setItem("AccountType" , type);
         dispatch(addAccountType(type));
         navigation.navigate('PhoneNumber');
      }
    };

   


  
    

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'white'} translucent={true}/>
      <LinearGradient
        colors={['#008ECC', '#f2dd87']}
        style={{flex:1}}>

         
      <View style={styles.selectionTypeView}>
        <Text style={styles.selectionTypeText}>
          Select Your Registration Type
        </Text>
      </View>

      

        <View style={styles.queryBtn}>
        <TouchableOpacity 
          style={[
            styles.HospitalTypeView
          ]}
          onPress={() => handleSelection('Hospital')}>
            <Text style={styles.HospitalTypeText}>Hospital</Text>
            <Icon name='hospital' size={22} color={'#008ECC'}/>
          </TouchableOpacity>

          <TouchableOpacity 
          style={[
            styles.PoliceStationTypeView
          ]}
          onPress={() => handleSelection('PoliceStation')}>
            <Text style={styles.PoliceStationTypeText}>Police Station</Text>
            <Icon1 name='police-station' size={22} color={'#af952e'}/>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    selectionTypeView:{
        alignItems:'center',
        marginTop:height/6, 
    },
    selectionTypeText:{
        paddingTop:10,
        fontSize:22,
        fontWeight:'700',
        color:'black'
    },
    queryBtn:{
        margin:30,
    },
    HospitalTypeView:{
        marginTop:10,
        padding:30,
        backgroundColor:'white',
        borderColor:'#008ECC',
        borderWidth:2,
        borderRadius:10,
        elevation:10,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    HospitalTypeText:{
        fontSize:18,
        fontWeight:'600',
        color:'black',
    },
    PoliceStationTypeView:{
        marginTop:20,
        padding:30,
        backgroundColor:'white',
        borderColor:'#f2dd87',
        borderWidth:2,
        borderRadius:10,
        elevation:10,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    PoliceStationTypeText:{
        fontSize:18,
        fontWeight:'600',
        color:'black',
    },
  
         
});

export default AccountTypeSelection;


