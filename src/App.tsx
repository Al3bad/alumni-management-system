// Modules & External Components
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AlumniProfile from "./pages/AlumniProfile/AlumniProfile";
import Admin from "./pages/Admin/Admin";
import NotFound from "./pages/NotFound/NotFound";
import AuthProvider from "./context/authCtx";

import "./App.scss";

//===============================================
// ==> Component
//===============================================
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alumni" element={<AlumniProfile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
