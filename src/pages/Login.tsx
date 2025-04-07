
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "@/utils/toastUtils";

// Define types for our access codes
interface UserDetails {
  role: string;
  name: string;
}

interface AccessCodes {
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
    "VISIT001": { role: "visitor", name: "Agent 1" },
    "VISIT002": { role: "visitor", name: "Agent 2" },
  };
};

const Login = () => {
  const [ACCESS_CODES, setAccessCodes] = useState<AccessCodes>(initializeAccessCodes());
  const [accessCode, setAccessCode] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newCodeRole, setNewCodeRole] = useState("visitor");
  const [newCodeName, setNewCodeName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<string>("");
  const navigate = useNavigate();

  // Save codes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("accessCodes", JSON.stringify(ACCESS_CODES));
  }, [ACCESS_CODES]);

  const handleLogin = () => {
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
  };

  const handleSuccessfulLogin = (userDetails: UserDetails) => {
    // Store user information in localStorage
    localStorage.setItem("user", JSON.stringify({
      role: userDetails.role,
      name: userDetails.name,
      accessCode: accessCode
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
      toast.error("Veuillez saisir un nom pour l'agent");
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

  const handleDeleteCode = (code: string) => {
    setCodeToDelete(code);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCode = () => {
    if (codeToDelete === "ADMIN2024") {
      toast.error("Impossible de supprimer le code administrateur");
    } else if ((codeToDelete === "VISIT001" || codeToDelete === "VISIT002") && Object.keys(ACCESS_CODES).length <= 3) {
      toast.error("Impossible de supprimer les codes agents par défaut");
    } else {
      setAccessCodes(prevCodes => {
        const newCodes = { ...prevCodes };
        delete newCodes[codeToDelete];
        return newCodes;
      });
      toast.success("Code d'accès révoqué avec succès");
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
              Créez et gérez les codes d'accès pour vos agents
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
                  <option value="visitor">Agent</option>
                  <option value="student">Administrateur</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Nom de l'agent</Label>
                <Input
                  placeholder="Nom de l'agent"
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
                        <TableCell>{details.role === "admin" ? "Administrateur" : details.role === "student" ? "Administrateur" : "Agent"}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCode(code)}
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
