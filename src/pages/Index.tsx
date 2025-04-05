
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
    
    // Obtenir le rôle de l'utilisateur
    const user = JSON.parse(userString);
    
    // Pour les visiteurs (non-admin), les rediriger correctement
    if (user.role !== "admin") {
      // Les pages autorisées pour les visiteurs
      const allowedVisitorPaths = ["/quiz", "/revision", "/messages"];
      
      // Si on est sur la page d'accueil, rediriger vers le quiz
      if (location.pathname === "/") {
        navigate("/quiz");
        return;
      }
      
      // Si la page n'est pas autorisée, rediriger vers /quiz
      const currentMainPath = "/" + location.pathname.split("/")[1];
      if (!allowedVisitorPaths.includes(currentMainPath)) {
        navigate("/quiz");
        return;
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavigation />
      <main className="pt-4 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
