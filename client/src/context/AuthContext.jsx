import { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authenticated, setAuthenticated] = useState(
//     localStorage.getItem("auth") === "true"
//   );


//   const login = () => {
//     localStorage.setItem("auth", "true");
//     setAuthenticated(true);    
//   };

//   const logout = () => {
//     localStorage.removeItem("auth");
//     setAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ authenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
      setAuthenticated(true)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    setAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setAuthenticated(false)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, authenticated, login, logout }}>{children}</AuthContext.Provider>
  )
}