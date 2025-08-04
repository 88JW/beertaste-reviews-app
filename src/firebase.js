// Firebase configuration for BeerTaste app
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Your Firebase configuration (copied from original app)
const firebaseConfig = {
  apiKey: "AIzaSyCuxk4VE7CWO2ZvIjz9xbA06Lyq-5ZBvB8",
  authDomain: "Ybeertaste-apk.firebaseapp.com",
  projectId: "beertaste-apk",
  storageBucket: "beertaste-apk.firebasestorage.app",
  messagingSenderId: "714203363835",
  appId: "1:714203363835:web:ece8aff7b9ba741988f35e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firebase Cloud Messaging
export let messaging = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

// Funkcja do uzyskania tokenu FCM
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) return null;
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Brak uprawnień do powiadomień');
      return null;
    }
    
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    
    if (!vapidKey || vapidKey === 'undefined') {
      console.error('Brak poprawnego klucza VAPID. Sprawdź zmienną VITE_FIREBASE_VAPID_KEY w pliku .env');
      return null;
    }

    console.log("Using VAPID key:", vapidKey);
    
    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey
    });
    
    if (currentToken) {
      console.log('Token powiadomień uzyskany', currentToken);
      return currentToken;
    } else {
      console.log('Nie można uzyskać tokenu');
      return null;
    }
  } catch (error) {
    console.error('Błąd uzyskiwania tokenu:', error);
    
    if (error.name === 'InvalidAccessError') {
      console.error('Błędny format klucza VAPID. Klucz musi być w formacie base64url.');
    }
    
    return null;
  }
};

// Funkcja do nasłuchiwania powiadomień
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      resolve(null);
      return;
    }
    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export default app;
