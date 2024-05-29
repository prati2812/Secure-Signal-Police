import React from 'react';
import { View,Text, StyleSheet } from 'react-native';


interface HandleErrorProps {
     title:string,
}

const HandleError: React.FC<HandleErrorProps> = (props) => {
    return(
         <View style={styles.errorView}>
             <Text style={styles.errorText}>{props.title}</Text>
         </View>
    )
};

const styles = StyleSheet.create({
    errorView:{
        paddingLeft:25,
        marginTop:-33,
        padding:10, 
     }, 
     errorText:{
       color:'red',
       marginLeft:2,
     }, 
});


export default HandleError;
