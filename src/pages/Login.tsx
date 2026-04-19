import React, { useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonSpinner,
} from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import logoNero from '../assets/nero-logo.webp'
import { IonIcon } from '@ionic/react';
import { useAuth } from '../context/auth';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const { loginWithGoogle, isLoading, isAuthenticated } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      history.replace('/home');
    }
  }, [isAuthenticated, history]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="login-container">
          <div className="login-logo">
            <img src={logoNero} alt="Nero Logo" className="app-logo" />
          </div>
          <h1 className="login-title">Nero</h1>
          <p className="login-subtitle">Nyatet Rupiah Online</p>

          <IonCard className="login-card">
            <IonCardContent>
              <IonButton
                expand="block"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="google-login-btn"
              >
                {isLoading ? (
                  <IonSpinner name="crescent" />
                ) : (
                  <>
                    <IonIcon icon={logoGoogle} slot="start" />
                    Sign in with Google
                  </>
                )}
              </IonButton>
            </IonCardContent>
          </IonCard>

          <p className="login-footer">
            By signing in, you agree to use your Google account for authentication.
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
