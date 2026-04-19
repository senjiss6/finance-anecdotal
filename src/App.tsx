import { Route, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect } from 'react';
import Login from './pages/Login';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import { homeOutline, calendarOutline } from 'ionicons/icons';

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

/* Theme variables */
import './theme/variables.css';
import { AuthProvider } from './context/auth';
import { TransactionProvider } from './context/transaction';
import { useAuth } from './context/auth';
import { useLocation } from 'react-router-dom';

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated and not on login page
    if (!isLoading && !isAuthenticated && location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading, location.pathname]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <IonRouterOutlet>
        <Route exact path="/login" component={Login} />
        <Redirect exact from="/" to="/login" />
      </IonRouterOutlet>
    );
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/login" component={Login} />
        <Route exact path="/home" component={Tab1} />
        <Route exact path="/history" component={Tab2} />
        <Redirect exact from="/" to="/home" />
        <Redirect exact from="/tabs" to="/home" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="history" href="/history">
          <IonIcon icon={calendarOutline} />
          <IonLabel>History</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <TransactionProvider>
      <IonApp>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </IonApp>
    </TransactionProvider>
  </AuthProvider>
);

export default App;
