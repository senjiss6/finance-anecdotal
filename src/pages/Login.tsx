import React, { useState } from "react";
import {
  IonApp,
  IonContent,
  IonInput,
  IonButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import "./Login.css";
import { useAuth } from "../context/auth";
import { useHistory } from "react-router";
import axios from "axios";

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [validations, setvalidations] = useState({
    email: "",
    password: ""
  });

  const handleInputEmail = (event: CustomEvent) => {
    setemail(event.detail.value!);
  };
  const handleInputPassword = (event: CustomEvent) => {
    setpassword(event.detail.value!);
  };
  const loginFunc = async () => {
    let formData = new FormData();
    formData.append("user_email", email);
    formData.append("user_password", password);
    
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "auth/login/",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: formData,
    };
    const response = await axios.request(config);
    if (response.status === 200) {
      const accessToken = response.data.access_token;
      login(accessToken, response.data.user);
      setloading(false);
      axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token.access_token}`;
      history.push("/home");
    } else {
      console.log(response)
      // setvalidations(response.response.data);
      setloading(false);
    }
  }

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding login-container">
          <div className="login-wrapper">
            <div className="login-box">
              <IonInput 
                value={email} 
                onIonChange={handleInputEmail} 
                placeholder="Email" 
                type="email" 
                className="input-field" />
              {validations.email && <span>{validations.email}</span> }
              <IonInput
                placeholder="Password"
                type="password"
                className="input-field"
                value={password}
                onIonChange={handleInputPassword}
              />
              {validations.password && <span>{validations.password}</span> }
              <IonButton disabled={loading} onClick={() => loginFunc()} expand="full">{loading ? "Loading..." : "Login"}</IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default Login;
