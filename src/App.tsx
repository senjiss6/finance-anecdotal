import { Redirect, Route, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { book, person, home } from 'ionicons/icons';
import Login from './pages/Login';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import axios from 'axios';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { AuthProvider } from './context/auth';

setupIonicReact();

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/home" component={Tab1} exact />
        <Route path="/report" component={Tab2} exact />
        <Route path="/profile" component={Tab3} exact />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" hidden={true}>
           <IonTabButton tab="home" href="/home">
             <IonIcon aria-hidden="true" icon={home} />
             <IonLabel>Home</IonLabel>
           </IonTabButton>
           <IonTabButton tab="report" href="/report">
             <IonIcon aria-hidden="true" icon={book} />
             <IonLabel>Report</IonLabel>
           </IonTabButton>
           <IonTabButton tab="profile" href="/profile">
             <IonIcon aria-hidden="true" icon={person} />
             <IonLabel>Profile</IonLabel>
          </IonTabButton>
         </IonTabBar>
    </IonTabs>
  );
};

const MainRouter: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  axios.defaults.baseURL = apiUrl;
  
  const location = useLocation(); 
  const isLoginPage = location.pathname === "/login";
  return (
    <IonRouterOutlet>
      <Route exact path="/login" component={Login} />
      <Redirect exact from="/" to="/login" />
      <Tabs />
    </IonRouterOutlet>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <MainRouter />
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
);

export default App;
