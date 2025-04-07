
import React, { useEffect } from "react";
import CustomNavigation from "@/components/CustomNavigation";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

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
    
    // Pour les agents (non-admin), les rediriger correctement
    if (user.role !== "admin") {
      // Les pages autorisées pour les agents
      const allowedAgentPaths = ["/quiz", "/revision", "/messages"];
      
      // Si on est sur la page d'accueil, rediriger vers le quiz
      if (location.pathname === "/") {
        navigate("/quiz");
        return;
      }
      
      // Vérifier si l'utilisateur essaie d'accéder à une page non autorisée
      const currentMainPath = "/" + location.pathname.split("/")[1];
      if (!allowedAgentPaths.includes(currentMainPath)) {
        // Rediriger vers le quiz si la page actuelle n'est pas autorisée
        navigate("/quiz");
      }
    }
    
    // Vérifier si les questions existent pour l'utilisateur
    const hasQuestions = !!localStorage.getItem("questionSets");
    if (!hasQuestions && user.role !== "admin") {
      toast.info("Aucune question n'est disponible. Contactez l'administrateur.", {
        duration: 5000
      });
    }
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavigation />
      <main className="container mx-auto pt-4 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
