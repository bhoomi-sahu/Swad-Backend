import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  useEffect(() => {

    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse saved user", error);
      localStorage.removeItem("user");
    }

  }, []);

  // LOGIN
  const login = (data) => {

    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    setUser(data);
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}