import { ALL_NOTIFICATION_READ, LIVE_LOCATION_NOTIFICATION_DATA } from "./action";


const inintialState = {
    notifications:[],
    notificationAllReadOrNot:null,
}

const notificationReducer = (state = inintialState ,action:{type:any , payload:any}) => {
    switch(action.type){
        case LIVE_LOCATION_NOTIFICATION_DATA:
            return{
                ...state,
                notifications:action.payload,
            }
        case ALL_NOTIFICATION_READ:
            return{
                ...state,
                notificationAllReadOrNot:action.payload,
            }        
        default:
            return state;         
    }
}

export default notificationReducer;