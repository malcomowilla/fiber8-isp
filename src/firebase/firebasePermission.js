
// src/requestPermission.js
import { messaging, getToken , onMessage} from './firebase';

export const requestPermission = async () => {

  try {
    // Request permission to show notifications
    const permission = await Notification.requestPermission();
    console.log('permsission=>',  permission)








    if (permission === 'granted') {
      const fcm_token = await getToken(messaging, {
        vapidKey: 'BCJefOwaCq_dH010n4_d9QBkurqyRD7-c2wDS5s4wxO00Dfaa3kcKgoKVd8AFWi5ykT1Oeli39x2MGDKGO6QfKs'
      });

      

    //   const fcm_token1 = await getToken(messaging, {
    //     vapidKey: 'BCJefOwaCq_dH010n4_d9QBkurqyRD7-c2wDS5s4wxO00Dfaa3kcKgoKVd8AFWi5ykT1Oeli39x2MGDKGO6QfKs',
    //   }).catch((err) => {
    //     console.error('Error while fetching token: ', err);
    //   });


console.log('fcm_token1=>', fcm_token)

      if (fcm_token) {
        console.log('Device token:', fcm_token);
        // Send the token to your server to store it and use it for sending notifications
        sendTokenToServer(fcm_token);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } else {
      console.log('Notification permission denied.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
};




const subdomain = window.location.hostname.split('.')[0]
const sendTokenToServer = async (fcm_token) => {
  try {
    const response = await fetch('/api/save_fcm_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain
      },
      body: JSON.stringify({ fcm_token})
    });
    if (response.ok) {
      console.log('Token saved successfully.');
    } else {
      console.log('Failed to save the token.');
    }
  } catch (error) {
    console.error('Failed to send token to server:', error);
  }
};
