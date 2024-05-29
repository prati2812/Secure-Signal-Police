import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface NotificationFilterProps {
    icon:string,
    color:string,
    message:string,
    iconBackgroundColor:string,
    textColor:string
}

const NotificationFilter:React.FC<NotificationFilterProps> = ({icon, color, message, iconBackgroundColor, textColor}) => {
  return (
    <View style={styles.notificationBottomSheetView}>
      <View style={[styles.notificationBottomSheetIcon , 
           {backgroundColor:`${iconBackgroundColor}`}]}>
        <Icon name={icon} size={35} color={color} />
      </View>
      <Text style={[styles.notificationText , {color:`${textColor}`}]}>{message}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
    notificationBottomSheetView:{
        marginTop:10,
        flexDirection:'row',
        gap:10,
        alignItems:'center',
      },
      notificationBottomSheetIcon:{
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        borderRadius:25,
      },
      notificationText:{
        fontSize:17,
        fontWeight:'700'
      }
});

export default NotificationFilter;


