import { ReactNode, useContext, useState, createContext } from "react";

const apiURL = import.meta.env.VITE_API_URL;

//===============================================
// ==> Auth Context
//===============================================
interface AuthContextType {
  user: any;
  register: (formData: any) => any;
  login: (formData: any) => any;
  logout: () => void;
  getUser: () => any;
}

const AuthContext = createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  let [user, setUser] = useState<any>(null);

  const register = async (formData: any) => {
    try {
      const res = await fetch(`${apiURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (res.status === 200) {
        // on success, redirect to user's page
        const resJson = await res.json();
        // setUser(resJson.user);
        return resJson.user;
      } else if (res.status === 400) {
        const { error } = await res.json();
        throw error.msg;
      } else {
        throw "Somwthing wrong happend! Please try again later!";
      }
    } catch (error: any) {
      throw error;
    }
  };

  const login = async (formData: any) => {
    try {
      const res = await fetch(`${apiURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (res.status === 200) {
        const resJson = await res.json();
        // setUser(resJson.user);
        console.log(resJson.user);
        return resJson.user;
      } else {
        throw "Invalid email or password!";
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${apiURL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error: any) {
    } finally {
      // On success
      setUser(null);
      return;
    }
  };

  const getUser = async () => {
    try {
      const res = await fetch(`${apiURL}/user`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 200) {
        // on success, redirect to user's page
        const resJson = await res.json();
        setUser(resJson);
        return resJson;
      } else {
        throw "Unauthorised!";
      }
    } catch (error: any) {
      throw error;
    }
  };

  let value = { user, register, login, logout, getUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
