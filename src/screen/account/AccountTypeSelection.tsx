import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, Pressable, TouchableOpacity, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { addAccountType } from '../../redux/userProfile/action';


interface AccountTypeSelectionProps {
    navigation:any
}

const AccountTypeSelection:React.FC<AccountTypeSelectionProps> = ({navigation}) => {

    const [selectedType, setSelectedType] = useState<string | null>('Hospital');
    const dispatch = useDispatch();

    const handleSelection = (type: string | null) => {
      setSelectedType(type);
    };

    const selectionSubmit = async() => {
        await AsyncStorage.clear();
        if(selectedType){
           await AsyncStorage.setItem("AccountType" , selectedType);
           dispatch(addAccountType(selectedType));
           navigation.navigate('PhoneNumber');
        }
    }
    

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'white'}/>
      <View style={styles.selectionTypeView}>
        <Text style={styles.selectionTypeText}>
          Select Your Registration Type
        </Text>
      </View>

      

        <View style={styles.queryBtn}>
        <TouchableOpacity 
          style={[
            styles.HospitalTypeView,
            selectedType === 'Hospital' && styles.selectedType
          ]}
          onPress={() => handleSelection('Hospital')}
        >
            <Text style={styles.HospitalTypeText}>Hospital</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          style={[
            styles.PoliceStationTypeView,
            selectedType === 'PoliceStation' && styles.selectedType
          ]}
          onPress={() => handleSelection('PoliceStation')}
        >
            <Text style={styles.PoliceStationTypeText}>Police Station</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.NextBtnView}>
              <TouchableOpacity
                  style={styles.NextBtn} 
                  onPress={() => selectionSubmit()}>
                  <View>
                       <Text style={styles.btnText}>Next</Text>
                  </View>
              </TouchableOpacity> 
        </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white',
    },
    selectionTypeView:{
        alignItems:'center',
        marginTop:40, 
    },
    selectionTypeText:{
        paddingTop:10,
        fontSize:25,
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
        borderColor:'white',
        borderWidth:2,
        borderRadius:10,
        elevation:10,
    },
    HospitalTypeText:{
        fontSize:25,
        fontWeight:'600',
        color:'black',
    },
    PoliceStationTypeView:{
        marginTop:20,
        padding:30,
        backgroundColor:'white',
        borderColor:'white',
        borderWidth:2,
        borderRadius:10,
        elevation:10,
    },
    PoliceStationTypeText:{
        fontSize:25,
        fontWeight:'600',
        color:'black',
    },
    NextBtnView:{
        margin:30,
        padding:20,
        
    },
    NextBtn:{
        padding:20,
        backgroundColor:'#bf1234',
        borderRadius:20,
        elevation:7,
        alignItems:'center',
    },
    btnText:{
        fontSize:20,
        fontWeight:'500',
        color:'white',
    },
    selectedType: {
        borderColor: '#bf1234',
        borderWidth: 2,
    },
         
});

export default AccountTypeSelection;


