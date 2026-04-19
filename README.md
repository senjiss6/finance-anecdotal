# Finance Anecdotal
This app is for log your income and outcome about your self,
This app will store your data to Firebase database so it will had a real time update to your data and app login using your google mail account.

# App Installation

# Firebase config
1. You need to configure connection to firebase database,
2. Go to https://console.firebase.google.com,
3. Create new project for firebase project,
4. Add android project to your newly create firebase project,
5. Input android package name from capacitor.config.ts,
6. Download google-services.json, it will be use when building android app,
7. Then go to Realtime Database menu in firebase,
8. Create new realtime database and select rules to locked version for now, it can be edit later,
9. In realtime database menu, open rules menu and change to this:
{                                                                                                                                              
    "rules": {                                           
      "users": {
        ".read": true,
        ".write": true
      },
      "reports": {
        ".read": true,
        ".write": true
      },
      "transactions": {
        ".read": true,
        ".write": true
      }
    }
  }

# App settings
1. Create .env file in root folder
2. Open your google-services.json file
3. At your .env file add:
   a. VITE_APIKEY value from api_key
   b. VITE_AUTHDOMAIN value from your_firebase_project_name.firebaseapp.com
   c. VITE_PROJECTID value from project_id
   d. VITE_STORAGEBUCKET value from storage_bucket
   e. VITE_MESSAGINGSENDERID value from project_number
   f. VITE_APPID value from mobilesdk_app_id
   g. VITE_DATABASEURL value from firebase_url
   h. VITE_GOOGLE_WEB_CLIENT_ID
4. Open terminal and run npm install,
5. Run app using ionic serve,
6. To build app using ionic build,
7. To create android app:
   a. ionic cap add android
   b. ionic cap open android
