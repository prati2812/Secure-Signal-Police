import { COMPLAINT, COMPLAINTS_DATA} from "./action";


const inintialState ={
    complaints:[],
    complaint:Object,
}

const complaintReducer = (state = inintialState , action:{type:any , payload:any}) => {
    switch(action.type){
        case COMPLAINTS_DATA:
            return{
                ...state,
                complaints:action.payload,
            }
        
        case COMPLAINT:
            return{
                ...state,
                complaint:action.payload,
            }    
        default:
            return state;    
    }
}

export default complaintReducer;