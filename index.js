import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import messaging from '@react-native-firebase/messaging';


const AppRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
)


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);     
});


AppRegistry.registerComponent(appName, () => AppRedux);
