import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

interface ComplaintsCardProps {
   icon:string;
   message:string;
   time:string;
   color:string;
   isRead:boolean;
   handleDetails : Function
}

const ComplaintsCard:React.FC<ComplaintsCardProps> = ({icon,message , time , color, isRead , handleDetails}) => {

  const accountType = useSelector((state: any) => state.userProfile.accountType);
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

  const activeThemeColor = getColor(accountType);
  
  return (
    <TouchableOpacity onPress={() => handleDetails()}>
    <View style={[styles.notificationView , accountType && {borderColor:activeThemeColor}]}>
                 <View style={styles.notificationIcon}>
                        <Icon name={icon} size={45} color={color} />
                 </View>
                 <View style={styles.notificationData}>
                       <Text style={styles.notificationMessage}>
                              {message}
                       </Text>
                       <Text style={styles.notificationTime}>
                              {time}
                       </Text>
                 </View>

                 {
                    isRead === false && <View style={{borderWidth:7, borderColor:'green' , borderRadius:10,}}></View>
                 }
                
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    gap: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderColor: '#af952e',
    borderWidth: 1,
  },
  notificationIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 5,
    borderRadius: 10,
  },
  notificationData: {
    padding: 5,
    flexShrink:1,
    gap:5,
    flex:1,
  },
  notificationMessage: {
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
  },
  notificationTime: {
    fontWeight: '600',
  },
});


export default ComplaintsCard;


