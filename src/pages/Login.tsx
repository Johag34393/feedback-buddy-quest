
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Codes d'accès prédéfinis
const ACCESS_CODES = {
  "ADMIN2024": { role: "admin", name: "Administrateur" },
  "VISIT001": { role: "visitor", name: "Visiteur 1" },
  "VISIT002": { role: "visitor", name: "Visiteur 2" },
};

const Login = () => {
  const [accessCode, setAccessCode] = useState("");
  const [useOTP, setUseOTP] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newCodeRole, setNewCodeRole] = useState("visitor");
  const [newCodeName, setNewCodeName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (useOTP) {
      if (otpValue.length !== 6) {
        toast.error("Veuillez saisir un code à 6 chiffres");
        return;
      }

      // Vérifier le code OTP (à implémenter avec une vraie logique de vérification)
      // Pour l'exemple, on accepte 123456 comme code valide
      if (otpValue === "123456") {
        handleSuccessfulLogin({ role: "visitor", name: "Visiteur OTP" });
      } else {
        toast.error("Code OTP invalide");
      }
    } else {
      if (accessCode.trim() === "") {
        toast.error("Veuillez saisir un code d'accès");
        return;
      }

      const userDetails = ACCESS_CODES[accessCode];
      
      if (userDetails) {
        handleSuccessfulLogin(userDetails);
      } else {
        toast.error("Code d'accès invalide");
      }
    }
  };

  const handleSuccessfulLogin = (userDetails) => {
    // Stocker les informations d'utilisateur dans localStorage
    localStorage.setItem("user", JSON.stringify({
      role: userDetails.role,
      name: userDetails.name,
      accessCode: useOTP ? "OTP" : accessCode
    }));
    
    toast.success(`Bienvenue, ${userDetails.name}`);
    navigate("/");
  };

  const handleAdminLogin = () => {
    if (accessCode === "ADMIN2024") {
      setShowAdminPanel(true);
    } else {
      toast.error("Accès non autorisé");
    }
  };

  const generateAccessCode = () => {
    if (!newCodeName.trim()) {
      toast.error("Veuillez saisir un nom pour le visiteur");
      return;
    }

    // Générer un code aléatoire (en pratique, vous devriez utiliser une fonction plus sécurisée)
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Ajouter ce code à la liste des codes d'accès (dans une application réelle, cela serait stocké en base de données)
    ACCESS_CODES[randomCode] = { role: newCodeRole, name: newCodeName };
    
    setGeneratedCode(randomCode);
    toast.success(`Code d'accès généré pour ${newCodeName}`);
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
          <div className="flex justify-center space-x-2 mb-4">
            <Button 
              variant={!useOTP ? "default" : "outline"} 
              onClick={() => setUseOTP(false)}
            >
              Code d'accès
            </Button>
            <Button 
              variant={useOTP ? "default" : "outline"} 
              onClick={() => setUseOTP(true)}
            >
              Code OTP
            </Button>
          </div>

          {useOTP ? (
            <div className="space-y-2">
              <label className="text-sm font-medium block">Code à usage unique (OTP)</label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Saisissez le code à 6 chiffres qui vous a été communiqué
              </p>
            </div>
          ) : (
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
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleLogin}>
            Se connecter
          </Button>
          <Button variant="outline" className="w-full" onClick={handleAdminLogin}>
            Accès administrateur
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog pour la génération de codes d'accès */}
      <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer des codes d'accès</DialogTitle>
            <DialogDescription>
              Créez des codes d'accès pour vos visiteurs
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'accès</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newCodeRole}
                onChange={(e) => setNewCodeRole(e.target.value)}
              >
                <option value="visitor">Visiteur</option>
                <option value="student">Étudiant</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du visiteur</label>
              <Input
                placeholder="Nom du visiteur"
                value={newCodeName}
                onChange={(e) => setNewCodeName(e.target.value)}
              />
            </div>
            
            {generatedCode && (
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm font-medium">Code généré :</p>
                <p className="text-xl font-bold text-center py-2">{generatedCode}</p>
                <p className="text-xs text-gray-500">Copiez ce code et partagez-le avec {newCodeName}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={generateAccessCode}>
              Générer un code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
