import React, { useEffect } from 'react';
import AppStack from './src/stack/AppStack';
import { notificationListener } from './src/utils/NotificationService';



const App = () => {
  
 
  useEffect(() => {
      notificationListener();
  },[]);

  return(
       <AppStack/>
  );
}

export default App;
