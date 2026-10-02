# Finance Anecdotal
This app is for log your income and outcome about your self,
This app will store your data to Firebase database so it will had a real time update to your data and app login using your google mail account.
demo-app: nero.senjilabs.my.id

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
```
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
```
# App settings
1. Create .env file in root folder
2. Open your google-services.json file
3. At your .env file add:
   ```
   VITE_APIKEY=value from api_key
   VITE_AUTHDOMAIN=value from your_firebase_project_name.firebaseapp.com
   VITE_PROJECTID=value from project_id
   VITE_STORAGEBUCKET=value from storage_bucket
   VITE_MESSAGINGSENDERID=value from project_number
   VITE_APPID=value from mobilesdk_app_id
   VITE_DATABASEURL=value from firebase_url 
5. Open terminal and run npm install,
6. Run app using ionic serve,
7. Then build app using ionic build,
8. Create android app:
   a. ionic cap add android
   b. ionic cap open android

# Setup google login android
1. Go to https://console.cloud.google.com,
2. Create or open existing project,
3. Open Api & Service menu, then open credential,
4. Create credential and select OAuth client id and select android,
5. Input package name from capacitor.config.ts,
6. Input sha-1 certificate login generate from android studio terminal keytool -keystore path-to-debug-or-production-keystore -list -v,
7. Create other OAuth client id and select web, input Authorized JavaScript origins
 with http://localhost:8100 and Authorized redirect URIs with http://localhost:8100/login
8. At your .env file add:
   ```
   VITE_GOOGLE_WEB_CLIENT_ID=value from Client ID for Web application
10. Rebuild your app, ionic build, then ionic cap sync android, ionic cap open android,
11. Modify MainActivity.java with:
    ```import ee.forgr.capacitor.social.login.GoogleProvider;
    import ee.forgr.capacitor.social.login.SocialLoginPlugin;
    import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;
    import com.getcapacitor.PluginHandle;
    import com.getcapacitor.Plugin;
    import android.content.Intent;
    import android.util.Log;
    import com.getcapacitor.BridgeActivity;

    // ModifiedMainActivityForSocialLoginPlugin is VERY VERY important !!!!!!
    public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {

      @Override
      public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode >= GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN && requestCode < GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MAX) {
          PluginHandle pluginHandle = getBridge().getPlugin("SocialLogin");
          if (pluginHandle == null) {
            Log.i("Google Activity Result", "SocialLogin login handle is null");
            return;
          }
          Plugin plugin = pluginHandle.getInstance();
          if (!(plugin instanceof SocialLoginPlugin)) {
            Log.i("Google Activity Result", "SocialLogin plugin instance is not SocialLoginPlugin");
            return;
          }
          ((SocialLoginPlugin) plugin).handleGoogleLoginIntent(requestCode, data);
        }
      }

      // This function will never be called, leave it empty
      @Override
      public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {}
    }
12. Build your android app.
