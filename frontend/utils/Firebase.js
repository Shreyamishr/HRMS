// // import { getAuth, GoogleAuthProvider } from "firebase/auth"
// // import { initializeApp } from "firebase/app";
// // const firebaseConfig = {
// //   apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
// //   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
// //   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
// //   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
// //   appId: import.meta.env.VITE_FIREBASE_APP_ID
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const auth = getAuth(app)
// // const provider = new GoogleAuthProvider()
// // export { auth, provider }

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getAuth, GoogleAuthProvider} from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
//   authDomain: "loginvirtualcourse-98e03.firebaseapp.com",
//   projectId: "loginvirtualcourse-98e03",
//   storageBucket: "loginvirtualcourse-98e03.firebasestorage.app",
//   messagingSenderId: "931756932660",
//   appId: "1:931756932660:web:9968803291993719c29461"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth=getAuth(app)
// const provider=new GoogleAuthProvider()
// export {auth,provider}
// export default app;

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration with direct API key
const firebaseConfig = {
  apiKey: "AIzaSyB9hAybFG7A21qdjpBAYrHOZcurx50Uar0",
  authDomain: "loginvirtualcourse-98e03.firebaseapp.com",
  projectId: "loginvirtualcourse-98e03",
  storageBucket: "loginvirtualcourse-98e03.firebasestorage.app",
  messagingSenderId: "931756932660",
  appId: "1:931756932660:web:9968803291993719c29461"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Add these lines to configure the Google provider
provider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, provider };
export default app;