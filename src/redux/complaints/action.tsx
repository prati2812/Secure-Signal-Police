import axios from "axios";
import { Dispatch } from "redux";
import instance from "../../axios/axiosInstance";


export const COMPLAINTS_DATA = 'COMPLAINTS_DATA';
export const COMPLAINT = 'COMPLAINT';
export const COMPLAINT_STATUS_TYPES = 'COMPLAINT_STATUS_TYPES';


export const fetchComplaints = (userId:string | undefined , accountType: string | undefined) => {
    return async(dispatch:Dispatch) => {
        try{
            if(accountType === 'PoliceStation'){
                const response = await instance.post("/fetchUserComplaint", {userId});
                  
                if (response.status === 200) {
                    const complaintsData = await response.data;
                    console.log("=======" , complaintsData);
                    
                    dispatch({
                        type:COMPLAINTS_DATA,
                        payload:complaintsData,
                    })
                                    
                }
                                    
            }
            else if(accountType === 'Hospital'){
                const response = await instance.post('/hospital/fetchUserComplaints',{userId});

                if (response.status === 200) {
                    const complaintsData = await response.data;
                   
                    dispatch({
                        type:COMPLAINTS_DATA,
                        payload:complaintsData,
                    })
                                    
                }
            }
            
        }
        catch(error){
            console.log(error);
            
        }
    }

}

export const addComplaintStatus = (complaintStatus:string|undefined) => ({
    type:COMPLAINT_STATUS_TYPES,
    payload:complaintStatus,
})