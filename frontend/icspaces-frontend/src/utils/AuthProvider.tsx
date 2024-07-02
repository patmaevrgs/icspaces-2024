// AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from "react";
import AuthContext from "./AuthContext";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await fetch("http://localhost:3001/is-logged-in", {
        credentials: "include",
      });
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
