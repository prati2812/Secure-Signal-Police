import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CustomProfileOptionProps {
    optionName: string,
    data?: string | null,
    icon: string,
}

const CustomProfileOption: React.FC<CustomProfileOptionProps> = ({optionName , data , icon}) => {
  return (
    <View
      style={styles.container}>
      <View style={styles.optionIcon}>
        <Icon name={icon} size={25} color={'black'}/>
        <Text style={styles.optionText}>{optionName}</Text>
      </View>
      <View style={styles.optionData}>
        <Text style={styles.optionName}>{data}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
    },
    optionIcon:{
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4
    },
    optionData:{   
        flexDirection: 'row', 
        alignItems: 'center'
    },
    optionText:{
        color:'black',
        fontSize:16,
    },
    optionName:{
        color:'black',
        fontSize:16,
    }

  });
  

export default CustomProfileOption;

