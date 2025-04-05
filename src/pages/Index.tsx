
import React, { useEffect } from "react";
import CustomNavigation from "@/components/CustomNavigation";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/login");
      return;
    }
    
    // Rediriger vers la page appropriée en fonction du rôle
    const user = JSON.parse(userString);
    if (user.role === "admin") {
      // Les administrateurs restent sur la page actuelle
    } else {
      // Les visiteurs sont redirigés vers la page Quiz s'ils sont sur la page d'accueil
      if (location.pathname === "/") {
        navigate("/quiz");
      }
      
      // Vérifier si l'utilisateur essaie d'accéder à une page non autorisée
      const allowedVisitorPaths = ["/quiz", "/revision", "/messages"];
      const isAllowedPath = allowedVisitorPaths.some(path => location.pathname.startsWith(path));
      
      if (!isAllowedPath && location.pathname !== "/") {
        navigate("/quiz");
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
