import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAkQwdR76mhj5GCXDABGsbRhM1EASM_Zdk",
    authDomain: "bernard-kangave.firebaseapp.com",
    projectId: "bernard-kangave",
    storageBucket: "bernard-kangave.firebasestorage.app",
    messagingSenderId: "1022605063036",
    appId: "1:1022605063036:web:45541f132666d87f58eaf9",
    measurementId: "G-LN32Q4CTKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Analytics is only available in the browser, so we need to check window definition
// let analytics;
// if (typeof window !== "undefined") {
//   analytics = getAnalytics(app);
// }
// export { analytics };
