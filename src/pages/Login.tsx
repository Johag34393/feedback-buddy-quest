
import React, { useState, useEffect } from "react";
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
import { getAccessCodes, getOTPCodes, verifyAccessCode } from "@/services/accessCodeService";

const Login = () => {
  const [accessCode, setAccessCode] = useState("");
  const [useOTP, setUseOTP] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Initialise les tables si nécessaire au chargement
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Vérifiez si l'utilisateur est déjà connecté
        const userString = localStorage.getItem("user");
        if (userString) {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      if (useOTP) {
        if (otpValue.length !== 4) {
          toast.error("Veuillez saisir un code à 4 chiffres");
          return;
        }

        // Vérifier le code OTP
        const userDetails = await verifyAccessCode(otpValue, true);
        
        if (userDetails) {
          handleSuccessfulLogin(userDetails, true);
        } else {
          toast.error("Code OTP invalide");
        }
      } else {
        if (accessCode.trim() === "") {
          toast.error("Veuillez saisir un code d'accès");
          return;
        }

        if (accessCode === "ADMIN2024") {
          // Accès administrateur direct
          handleSuccessfulLogin({ role: "admin", name: "Administrateur" }, false);
          return;
        }

        // Vérifier le code d'accès
        const userDetails = await verifyAccessCode(accessCode, false);
        
        if (userDetails) {
          handleSuccessfulLogin(userDetails, false);
        } else {
          toast.error("Code d'accès invalide");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = (userDetails: { role: string, name: string }, isOTP: boolean) => {
    // Store user information in localStorage
    localStorage.setItem("user", JSON.stringify({
      role: userDetails.role,
      name: userDetails.name,
      accessCode: isOTP ? `OTP-${otpValue}` : accessCode
    }));
    
    toast.success(`Bienvenue, ${userDetails.name}`);
    navigate("/");
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
              <label className="text-sm font-medium block">Code à usage permanent (OTP)</label>
              <div className="flex justify-center">
                <InputOTP maxLength={4} value={otpValue} onChange={setOtpValue}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Saisissez le code à 4 chiffres qui vous a été communiqué
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
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                Connexion...
              </span>
            ) : (
              "Se connecter"
            )}
          </Button>
          {!useOTP && (
            <p className="text-xs text-center text-gray-500 mt-2">
              Pour l'accès administrateur, utilisez le code défini pour cet usage spécifique.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
