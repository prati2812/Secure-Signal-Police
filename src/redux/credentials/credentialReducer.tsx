import { ADD_PHONE_NUMBER, ADD_VERIFICATION_ID } from "./action";

const inintialState = {
    phoneNumber:'',
    verificationId:'',
}

const credientialReducer = (state = inintialState , action: { type: any; payload: any; }) => {
    switch(action.type){
        case ADD_PHONE_NUMBER:
            return{
                ...state,
                phoneNumber:action.payload,
            }
        case ADD_VERIFICATION_ID:
            return{
                ...state,
                verificationId:action.payload,
            }

        default:
            return state;  
    }

};


export default credientialReducer;
