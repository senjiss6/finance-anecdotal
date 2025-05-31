import { createContext, useContext, useState, useEffect } from "react";
import { database } from '../config/firebase.config';
import { ref, off, onValue } from "firebase/database";
import { useHistory } from "react-router";

interface UserDetail {
    user_id: Number,
    user_name: string,
    user_email: string,
    created_date: string,
    updated_date: string
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessToken:string, data:UserDetail) => void;
  logout: () => void;
  user: UserDetail,
  token: string,
  realtimeEvent: string
  id: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const history = useHistory();
    const [token, setToken] = useState("");
    const [dataUser, setdataUser] = useState<UserDetail>({
        user_id: 0,
        user_name: "string",
        user_email: "string",
        created_date: "string",
        updated_date: "string"
    });
    const [realtimeEvent, setrealtimeEvent] = useState("");
    const id=1;
    const [userRef, setuserRef] = useState<any>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("access_token");
        const savedUser = localStorage.getItem("user");
    
        if (savedToken) {
          setToken(savedToken);
        }
        if (savedUser) {
          setdataUser(JSON.parse(savedUser));
        }
      }, []);

  const login = (accessToken:string, data:UserDetail) => {
    setToken(accessToken);
    setdataUser(data);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    off(userRef);
    history.replace('/');
    setToken("");
  }

  useEffect(() => {
    if (!id) return;

    let refUser:any;
    if (!userRef) {
      refUser = ref(database, `users/${id}`)
      setuserRef(refUser);
    }

    onValue(refUser, (snap) => {
      if (snap.val()){
        setrealtimeEvent(snap.val().event);
      }
    });

    return () => {
      off(refUser);
    };
  }, [id]);

  const isAuthenticated = !!token;
  const user = dataUser;
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, token, realtimeEvent, id }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};