
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Codes d'accès prédéfinis
const ACCESS_CODES = {
  "ADMIN2024": { role: "admin", name: "Administrateur" },
  "VISIT001": { role: "visitor", name: "Visiteur 1" },
  "VISIT002": { role: "visitor", name: "Visiteur 2" },
};

const Login = () => {
  const [accessCode, setAccessCode] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (accessCode.trim() === "") {
      toast.error("Veuillez saisir un code d'accès");
      return;
    }

    const userDetails = ACCESS_CODES[accessCode];
    
    if (userDetails) {
      // Stocker les informations d'utilisateur dans localStorage
      localStorage.setItem("user", JSON.stringify({
        role: userDetails.role,
        name: userDetails.name,
        accessCode: accessCode
      }));
      
      toast.success(`Bienvenue, ${userDetails.name}`);
      navigate("/");
    } else {
      toast.error("Code d'accès invalide");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            <span className="text-primary">EPHATA</span>
          </CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="accessCode" className="text-sm font-medium">
              Code d'accès
            </label>
            <Input
              id="accessCode"
              type="password"
              placeholder="Entrez votre code d'accès"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Se connecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
