import { createContext, useContext, useState, useEffect } from "react";

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
  token: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
    const [token, setToken] = useState("");
    const [dataUser, setdataUser] = useState<UserDetail>({
        user_id: 0,
        user_name: "string",
        user_email: "string",
        created_date: "string",
        updated_date: "string"
    });

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
    setToken("");
  }
  const isAuthenticated = !!token;
  const user = dataUser;
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, token }}>
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