import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* We just render the child pages (Login/Register) which have their own full layout */}
            <Outlet />
        </div>
    );
};

export default AuthLayout;
