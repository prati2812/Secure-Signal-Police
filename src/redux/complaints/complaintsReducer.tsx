import { COMPLAINT, COMPLAINTS_DATA, COMPLAINT_STATUS_TYPES} from "./action";


const inintialState ={
    complaints:[],
    complaint:Object,
    complaintStatus:"All",
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
        case COMPLAINT_STATUS_TYPES:
            return{
                ...state,
                complaintStatus:action.payload,
            }        
        default:
            return state;    
    }
}

export default complaintReducer;