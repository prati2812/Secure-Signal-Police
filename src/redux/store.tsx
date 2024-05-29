import { legacy_createStore as createStore, applyMiddleware , combineReducers } from 'redux';
import credientialReducer from './credentials/credentialReducer';
import userProfileReducer from './userProfile/userProfileReducer';
import complaintReducer from './complaints/complaintsReducer';
import notificationReducer from './notifications/notificationReducer';
const thunkMiddleware = require('redux-thunk').thunk;


const rootReducer = combineReducers({
    credentials:credientialReducer,
    userProfile:userProfileReducer,
    complaint:complaintReducer,
    notification:notificationReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));


export default store;

