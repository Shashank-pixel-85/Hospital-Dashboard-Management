import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Provider, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store/store";
import { AppLayout } from "./components/Layout";
import { Login, ForgotPassword, ResetPassword } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { Patients, Doctors, Appointments, Beds, Pharmacy, Billing } from "./pages/Management";
import { Notifications, Profile } from "./pages/Other";
import "./index.css";
function Protected({ children }) {
    const auth = useSelector((s) => s.auth.authenticated);
    return auth ? <>{children}</> : <Navigate to="/login" replace/>;
}
function Boot() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const dark = localStorage.getItem("theme") === "dark";
        document.documentElement.classList.toggle("dark", dark);
        const t = setTimeout(() => setLoading(false), 250);
        return () => clearTimeout(t);
    }, []);
    if (loading)
        return <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950"><div className="text-sm text-slate-500">Loading MediCare...</div></div>;
    return <Routes>
    <Route path="/login" element={<Login />}/>
    <Route path="/forgot-password" element={<ForgotPassword />}/>
    <Route path="/reset-password" element={<ResetPassword />}/>
    <Route path="/dashboard" element={<Protected><AppLayout><Dashboard /></AppLayout></Protected>}/>
    <Route path="/patients" element={<Protected><AppLayout><Patients /></AppLayout></Protected>}/>
    <Route path="/doctors" element={<Protected><AppLayout><Doctors /></AppLayout></Protected>}/>
    <Route path="/appointments" element={<Protected><AppLayout><Appointments /></AppLayout></Protected>}/>
    <Route path="/beds" element={<Protected><AppLayout><Beds /></AppLayout></Protected>}/>
    <Route path="/pharmacy" element={<Protected><AppLayout><Pharmacy /></AppLayout></Protected>}/>
    <Route path="/billing" element={<Protected><AppLayout><Billing /></AppLayout></Protected>}/>
    <Route path="/notifications" element={<Protected><AppLayout><Notifications /></AppLayout></Protected>}/>
    <Route path="/profile" element={<Protected><AppLayout><Profile /></AppLayout></Protected>}/>
    <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
    <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
  </Routes>;
}
export default function App() {
    return <Provider store={store}><BrowserRouter><Boot /><Toaster position="top-right"/></BrowserRouter></Provider>;
}
