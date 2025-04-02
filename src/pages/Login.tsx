
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Trash2, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

// Define types for our access codes and OTP codes
interface UserDetails {
  role: string;
  name: string;
}

interface AccessCodes {
  [key: string]: UserDetails;
}

interface OTPCodes {
  [key: string]: UserDetails;
}

// Initialize access codes
const initializeAccessCodes = (): AccessCodes => {
  const storedCodes = localStorage.getItem("accessCodes");
  if (storedCodes) {
    return JSON.parse(storedCodes);
  }
  return {
    "ADMIN2024": { role: "admin", name: "Administrateur" },
    "VISIT001": { role: "visitor", name: "Visiteur 1" },
    "VISIT002": { role: "visitor", name: "Visiteur 2" },
  };
};

// Initialize OTP codes
const initializeOTPCodes = (): OTPCodes => {
  const storedOTPCodes = localStorage.getItem("otpCodes");
  if (storedOTPCodes) {
    return JSON.parse(storedOTPCodes);
  }
  return {
    "1234": { role: "visitor", name: "Visiteur OTP 1" },
  };
};

const Login = () => {
  const [ACCESS_CODES, setAccessCodes] = useState<AccessCodes>(initializeAccessCodes());
  const [OTP_CODES, setOTPCodes] = useState<OTPCodes>(initializeOTPCodes());
  const [accessCode, setAccessCode] = useState("");
  const [useOTP, setUseOTP] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newCodeRole, setNewCodeRole] = useState("visitor");
  const [newCodeName, setNewCodeName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newOTPCode, setNewOTPCode] = useState("");
  const [newOTPName, setNewOTPName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<{ code: string, isOTP: boolean }>({ code: "", isOTP: false });
  const navigate = useNavigate();

  // Save codes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("accessCodes", JSON.stringify(ACCESS_CODES));
  }, [ACCESS_CODES]);

  useEffect(() => {
    localStorage.setItem("otpCodes", JSON.stringify(OTP_CODES));
  }, [OTP_CODES]);

  const handleLogin = () => {
    if (useOTP) {
      if (otpValue.length !== 4) {
        toast.error("Veuillez saisir un code à 4 chiffres");
        return;
      }

      // Check OTP code
      const otpDetails = OTP_CODES[otpValue];
      if (otpDetails) {
        handleSuccessfulLogin(otpDetails, true);
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
        handleSuccessfulLogin(userDetails, false);
      } else {
        toast.error("Code d'accès invalide");
      }
    }
  };

  const handleSuccessfulLogin = (userDetails: UserDetails, isOTP: boolean) => {
    // Store user information in localStorage
    localStorage.setItem("user", JSON.stringify({
      role: userDetails.role,
      name: userDetails.name,
      accessCode: isOTP ? `OTP-${otpValue}` : accessCode
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

    // Generate a random code (in practice, you should use a more secure function)
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Add this code to the list of access codes
    setAccessCodes(prevCodes => ({
      ...prevCodes,
      [randomCode]: { role: newCodeRole, name: newCodeName }
    }));
    
    setGeneratedCode(randomCode);
    toast.success(`Code d'accès généré pour ${newCodeName}`);
  };

  const generateOTPCode = () => {
    if (!newOTPName.trim()) {
      toast.error("Veuillez saisir un nom pour l'utilisateur OTP");
      return;
    }

    if (newOTPCode.length !== 4 || !/^\d+$/.test(newOTPCode)) {
      toast.error("Le code OTP doit être composé de 4 chiffres");
      return;
    }

    // Add this OTP code to the list
    setOTPCodes(prevCodes => ({
      ...prevCodes,
      [newOTPCode]: { role: "visitor", name: newOTPName }
    }));

    toast.success(`Code OTP permanent généré pour ${newOTPName}`);
    setNewOTPCode("");
    setNewOTPName("");
  };

  const handleDeleteCode = (code: string, isOTP: boolean) => {
    setCodeToDelete({ code, isOTP });
    setShowDeleteDialog(true);
  };

  const confirmDeleteCode = () => {
    const { code, isOTP } = codeToDelete;
    
    if (isOTP) {
      if (code === "1234" && Object.keys(OTP_CODES).length === 1) {
        toast.error("Impossible de supprimer le dernier code OTP par défaut");
      } else {
        setOTPCodes(prevCodes => {
          const newCodes = { ...prevCodes };
          delete newCodes[code];
          return newCodes;
        });
        toast.success("Code OTP révoqué avec succès");
      }
    } else {
      if (code === "ADMIN2024") {
        toast.error("Impossible de supprimer le code administrateur");
      } else if ((code === "VISIT001" || code === "VISIT002") && Object.keys(ACCESS_CODES).length <= 3) {
        toast.error("Impossible de supprimer les codes visiteurs par défaut");
      } else {
        setAccessCodes(prevCodes => {
          const newCodes = { ...prevCodes };
          delete newCodes[code];
          return newCodes;
        });
        toast.success("Code d'accès révoqué avec succès");
      }
    }
    
    setShowDeleteDialog(false);
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
          <Button className="w-full" onClick={handleLogin}>
            Se connecter
          </Button>
          <Button variant="outline" className="w-full" onClick={handleAdminLogin}>
            Accès administrateur
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog for access code generation and management */}
      <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gestion des codes d'accès</DialogTitle>
            <DialogDescription>
              Créez et gérez les codes d'accès pour vos visiteurs
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-4 py-4 md:w-1/2">
              <h3 className="text-lg font-medium">Générer un code d'accès</h3>
              
              <div className="space-y-2">
                <Label>Type d'accès</Label>
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
                <Label>Nom du visiteur</Label>
                <Input
                  placeholder="Nom du visiteur"
                  value={newCodeName}
                  onChange={(e) => setNewCodeName(e.target.value)}
                />
              </div>
              
              <Button onClick={generateAccessCode} className="w-full">
                Générer un code
              </Button>
              
              {generatedCode && (
                <div className="p-4 bg-gray-100 rounded-md">
                  <p className="text-sm font-medium">Code généré :</p>
                  <p className="text-xl font-bold text-center py-2">{generatedCode}</p>
                  <p className="text-xs text-gray-500">Copiez ce code et partagez-le avec {newCodeName}</p>
                </div>
              )}
              
              <h3 className="text-lg font-medium mt-6">Générer un code OTP permanent</h3>
              
              <div className="space-y-2">
                <Label>Code OTP (4 chiffres)</Label>
                <Input
                  placeholder="1234"
                  value={newOTPCode}
                  onChange={(e) => setNewOTPCode(e.target.value)}
                  maxLength={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Nom de l'utilisateur</Label>
                <Input
                  placeholder="Nom de l'utilisateur"
                  value={newOTPName}
                  onChange={(e) => setNewOTPName(e.target.value)}
                />
              </div>
              
              <Button onClick={generateOTPCode} className="w-full">
                Générer un code OTP
              </Button>
            </div>
            
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-lg font-medium">Codes d'accès existants</h3>
              <div className="max-h-60 overflow-y-auto border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(ACCESS_CODES).map(([code, details]) => (
                      <TableRow key={code}>
                        <TableCell className="font-medium">{code}</TableCell>
                        <TableCell>{details.name}</TableCell>
                        <TableCell>{details.role}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCode(code, false)}
                            disabled={code === "ADMIN2024"}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <h3 className="text-lg font-medium mt-4">Codes OTP permanents</h3>
              <div className="max-h-60 overflow-y-auto border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(OTP_CODES).map(([code, details]) => (
                      <TableRow key={code}>
                        <TableCell className="font-medium">{code}</TableCell>
                        <TableCell>{details.name}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCode(code, true)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for code deletion */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir révoquer ce code d'accès ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCode} className="bg-red-600 hover:bg-red-700">
              Révoquer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;
