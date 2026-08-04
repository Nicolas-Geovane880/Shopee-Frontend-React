import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Home from "./pages/home"
import Auth from "./pages/unauthenticatedHome";
import Signup from "./pages/signup";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import ValidateCode from "./pages/validate-code";
import ListDashboard from "./pages/list-dashboard";

const DefaultRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/unauthenticated-home" element={<Auth />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                <Route path="/reset-password" element={<ResetPassword />}></Route>
                <Route path="/validate-code" element={<ValidateCode />}></Route>
                <Route path="/list-dashboard" element={<ListDashboard />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default DefaultRouter;