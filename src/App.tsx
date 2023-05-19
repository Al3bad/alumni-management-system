// Modules & External Components
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AlumniProfile from "./pages/AlumniProfile/AlumniProfile";
import NotFound from "./pages/NotFound/NotFound";
import AuthProvider, { useAuth } from "./context/authCtx";

import "./App.scss";

//===============================================
// ==> Component
//===============================================
export default function App() {
  const [user, setUser] = useState(null);
  const auth = useAuth();

  console.log("auth: ", auth);
  // const [certificate, setCertificate] = useState(null);
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/profile" element={<AlumniProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
