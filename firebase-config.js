/* ===============================================================
   FIREBASE CONFIGURATION — NORUSH
   ----------------------------------------------------------------
   HOW TO FILL THIS IN (takes about 5 minutes):

   1. Go to https://console.firebase.google.com and sign in.
   2. Click "Add project". Name it (e.g. "norush") and continue.
      Google Analytics is NOT needed — turn it off.
   3. Once created, click the Web icon (</>) to register a web app.
      Give it any nickname and do NOT tick "Firebase Hosting".
   4. Firebase will show you a `firebaseConfig` object.
      Copy its values into the placeholder below, then delete
      the `YOUR_...` placeholders.

   5. IMPORTANT — turn on the database:
      In the left menu choose "Firestore Database" > "Create database".
      Pick "Start in production mode" and choose a region near you
      (southamerica-east1 is the closest to Argentina).
      Then go to the "Rules" tab and paste the contents of
      `firestore.rules` from this project.

   6. Save this file. The page picks it up automatically.

   Until this file contains real values, the survey keeps working and
   saves responses in the browser only — it never breaks.
   =============================================================== */

window.NORUSH_FIREBASE_CONFIG = {
  apiKey: "AIzaSyA5seoLcJEuhU7MrcrouHioRMnpgzl32OY",
  authDomain: "health-campaing-f64c4.firebaseapp.com",
  projectId: "health-campaing-f64c4",
  storageBucket: "health-campaing-f64c4.firebasestorage.app",
  messagingSenderId: "1042837375384",
  appId: "1:1042837375384:web:a97188b3c4ee6f8a3503ed",
  measurementId: "G-5R1520EBRE"
};