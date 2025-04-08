
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
    
    // Si on est sur la page d'accueil, rediriger vers le quiz
    if (location.pathname === "/" || location.pathname === "") {
      navigate("/quiz");
      return;
    }
    
    // Vérifier si les questions existent pour l'utilisateur
    const hasQuestions = !!localStorage.getItem("questionSets");
    if (!hasQuestions) {
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
