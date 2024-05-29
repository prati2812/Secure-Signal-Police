import axios from "axios";
import { Dispatch } from "redux";
import instance from "../../axios/axiosInstance";


export const LIVE_LOCATION_NOTIFICATION_DATA = 'LIVE_LOCATION_NOTIFICATION_DATA';
export const ALL_NOTIFICATION_READ = 'ALL_NOTIFICATION_READ';



export const fetchLiveLocationNotificationData = (userId:string | undefined) => {
    return async(dispatch:Dispatch) => {
        try{
            const response = await instance.post('/policeStation/LiveLocation/fetchNotification',
            {userId});

            if (response.status === 200) {
                const notificationData = await response.data;
                
                dispatch({
                    type:LIVE_LOCATION_NOTIFICATION_DATA,
                    payload:notificationData,
                })
                                
            }
        }
        catch(error){
            console.log(error);
            
        }
    }

}

export const allNotificationReadOrNot = (userId:string | undefined) => {
 
    return async (dispatch : Dispatch) => {
       
            let isAllRead = false;
            const response = await instance.post('/policeStation/LiveLocation/fetchNotification',{userId});
                   
            if(response.status === 200){
                 const data  = response.data;
                 if(data.length === 0){
                      dispatch({
                         type:ALL_NOTIFICATION_READ,
                         payload:true,
                      })
                 }
                 else{
                    
                    for (let i = 0; i < data.length; i++) {
                        const read = data[i].isRead;
                        if(read === false){
                          dispatch({
                            type: ALL_NOTIFICATION_READ,
                            payload: false,
                          });
                          isAllRead = read;
                          break;
                        }
                        else{
                          isAllRead = read;
                        }
                    }

                    if(isAllRead === true){
                        dispatch({
                            type: ALL_NOTIFICATION_READ,
                            payload: true,
                          });
                    }
                 }
            }

        
              
    }
}