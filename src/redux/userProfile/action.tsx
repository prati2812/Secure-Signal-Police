import axios from "axios";
import { Dispatch } from "redux";
import base64 from 'base64-js';
import instance from "../../axios/axiosInstance";



export const ADD_USER_NAME = 'ADD_USER_NAME';
export const USER_IMAGE_RESPONSE = 'USER_IMAGE_RESPONSE';
export const ADD_IMAGE_URI = 'ADD_IMAGE_URI';
export const ADD_TOKEN = 'ADD_TOKEN';
export const ADD_ACCOUNT_TYPE= 'ADD_ACCOUNT_TYPE';
export const IS_PROFILE_COMPLETED = 'IS_PROFILE_COMPLETED';
export const ADD_USER_ADDRESS = 'ADD_USER_ADDRESS';




export const addUserName = (userId : string | undefined , accountType: string | undefined) => {

    return async (dispatch:Dispatch)  => {
                 
        
        
        try {
           console.log(accountType);
           
           if(accountType === 'PoliceStation'){
             const response = await instance.post('/fetchDetails', {userId});
             if (response.status === 200) {
                const { userData, imageBuffer } = await response.data;
                const { userName , address } = userData;
                
                
                dispatch({
                    type: ADD_USER_NAME,
                    payload: userName,
                });

                if(imageBuffer){
                    const base64Image = base64.fromByteArray(imageBuffer.data);
                    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    
                    dispatch({
                        type: ADD_IMAGE_URI,
                        payload: imageUrl,
                    });
                }

                dispatch({
                    type: ADD_USER_ADDRESS,
                    payload: address,
                });
                
            }
           } 
           else if(accountType === 'Hospital'){
            const response = await instance.post('/hospital/fetchUserDetails', {userId});
            if (response.status === 200) {
              const {userData, imageBuffer} = await response.data;
              const {userName , address} = userData;

              dispatch({
                type: ADD_USER_NAME,
                payload: userName,
              });

            
              
              if(imageBuffer){
                const base64Image = base64.fromByteArray(imageBuffer.data);
                const imageUrl = `data:image/jpeg;base64,${base64Image}`;
                dispatch({
                    type: ADD_IMAGE_URI,
                    payload: imageUrl,
                  });
    
              }
              
              dispatch({
                type: ADD_USER_ADDRESS,
                payload: address,
            });
             } 
           }
              
           
        } catch (error) {
            console.log('Error fetching user details:', error);
            
        }   
    }
};

export const addUserImageResponse = (imageResponse: Object) => ({
    type: USER_IMAGE_RESPONSE,
    payload:imageResponse,
});

export const addImageUri = (imageUri : string) => ({
    type:ADD_IMAGE_URI,
    payload:imageUri,
});

export const addToken = (token: string | null) => ({
    type:ADD_TOKEN,
    payload:token,
})

export const addAccountType = (accountType : string | null) => ({
    type: ADD_ACCOUNT_TYPE,
    payload: accountType,
});


export const setProfileCompleted = (isProfile: boolean | null) => ({
    type:IS_PROFILE_COMPLETED,
    payload:isProfile,
})