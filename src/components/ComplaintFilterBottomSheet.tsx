import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, Animated, Pressable, TouchableOpacity } from 'react-native';
import NotificationFilter from './NotificationFilter';
import { useDispatch } from 'react-redux';
import { addComplaintStatus } from '../redux/complaints/action';


interface ComplaintFilterBottomSheetProps {
    setComplaintBottomSheetVisible:any;
}

const ComplaintFilterBottomSheet:React.FC<ComplaintFilterBottomSheetProps> = ({setComplaintBottomSheetVisible}) => {
 const slide = React.useRef(new Animated.Value(300)).current;  
 const dispatch = useDispatch();

  useEffect(() => {
    slideUp()
  } , [])

  const slideUp = () => {
      Animated.timing(slide, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
  };
  
  const slideDown = () => {
     
      Animated.timing(slide, {
        toValue: 300,
        duration: 800,
        useNativeDriver: true,
      }).start();
  };

  
  const closeModal = () => {
      slideDown();
      setTimeout(() => {
       setComplaintBottomSheetVisible(false);
      },800);
  }

  const handleComplaintStatus = (complaintStatus : string) => {
     dispatch(addComplaintStatus(complaintStatus));
     closeModal();
  }


  return (
    <Pressable style={styles.container} onPress={closeModal}>
        <Pressable style={{width: '100%', height: '25%'}}>
          <Animated.View
            style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>

                   <View style={styles.filterOptionContainer}>

                            <TouchableOpacity onPress={() => handleComplaintStatus("All")}>
                                  <Text style={[styles.filterOption , {color:'blue'}]}>All</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleComplaintStatus("Accepted")}>
                                  <Text style={[styles.filterOption , {color:'green'}]}>Accepted</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleComplaintStatus("Rejected")}>
                                  <Text style={[styles.filterOption, {color:'red'}]}>Rejected</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleComplaintStatus("Pending")}>
                                  <Text style={styles.filterOption}>Pending</Text>
                            </TouchableOpacity>

                   </View> 

          </Animated.View>
        </Pressable>
      </Pressable>
  );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        backgroundColor: '#00000080',
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
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
      },
      notificationBottomSheet: {
        margin: 25,
      },
      filterOptionContainer:{
         marginTop:30,
         alignItems:'center',
         justifyContent:'center',
         gap:10, 
      },
     
      filterOption:{
        fontSize:20,
        fontWeight:'500',
      }
});
  

export default ComplaintFilterBottomSheet;

