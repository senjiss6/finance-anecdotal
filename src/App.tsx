import { Route, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Tab1 from './pages/Tab1';

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

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <IonRouterOutlet>
      <Route exact path="/login" component={Login} />
      <Route exact path="/home" component={Tab1} />
      <Redirect exact from="/" to={isAuthenticated ? '/home' : '/login'} />
    </IonRouterOutlet>
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
