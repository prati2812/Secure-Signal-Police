import { ADD_ACCOUNT_TYPE, ADD_IMAGE_URI, ADD_TOKEN, ADD_USER_NAME, USER_IMAGE_RESPONSE, addAccountType } from "./action";


const inintialState ={
    userName:'',
    imageResponse:Object,
    imageUri:'',
    token:'',
    accountType:'',
}

const userProfileReducer = (state = inintialState , action: { type: any; payload: any; }) => {
    switch(action.type){
        case ADD_USER_NAME:
            return{
                ...state,
                userName:action.payload,
            }
        case USER_IMAGE_RESPONSE:
            return{
                ...state,
                imageResponse:action.payload,
            }
        case ADD_IMAGE_URI:
            return{
                ...state,
                imageUri:action.payload,
            }
        case ADD_TOKEN:
            return{
                ...state,
                token:action.payload,
            }
        
        case ADD_ACCOUNT_TYPE:{
            console.log(action.payload);
            
            return{
                ...state,
                accountType: action.payload, 
            }
        }    
        default:
            return state;    
    }
}

export default userProfileReducer;