
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Copy, KeyRound, Shield } from "lucide-react";

// Réutiliser les types définis dans Login.tsx
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

const AccessCodeManager = () => {
  const [ACCESS_CODES, setAccessCodes] = useState<AccessCodes>({});
  const [OTP_CODES, setOTPCodes] = useState<OTPCodes>({});
  const [newCodeRole, setNewCodeRole] = useState("visitor");
  const [newCodeName, setNewCodeName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newOTPCode, setNewOTPCode] = useState("");
  const [newOTPName, setNewOTPName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<{ code: string, isOTP: boolean }>({ code: "", isOTP: false });
  const [activeTab, setActiveTab] = useState("access");

  // Charger les codes depuis localStorage
  useEffect(() => {
    const storedCodes = localStorage.getItem("accessCodes");
    if (storedCodes) {
      setAccessCodes(JSON.parse(storedCodes));
    }

    const storedOTPCodes = localStorage.getItem("otpCodes");
    if (storedOTPCodes) {
      setOTPCodes(JSON.parse(storedOTPCodes));
    }
  }, []);

  // Sauvegarder les codes dans localStorage quand ils changent
  useEffect(() => {
    localStorage.setItem("accessCodes", JSON.stringify(ACCESS_CODES));
  }, [ACCESS_CODES]);

  useEffect(() => {
    localStorage.setItem("otpCodes", JSON.stringify(OTP_CODES));
  }, [OTP_CODES]);

  // Vérifier que l'utilisateur est administrateur
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role !== "admin") {
        toast.error("Accès non autorisé");
        window.location.href = "/";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const generateAccessCode = () => {
    if (!newCodeName.trim()) {
      toast.error("Veuillez saisir un nom pour le visiteur");
      return;
    }

    // Trouver le nombre de codes existants qui commencent par VISIT
    const existingVisitCodes = Object.keys(ACCESS_CODES).filter(code => 
      code.startsWith('VISIT')
    );
    
    // Déterminer le prochain numéro à utiliser
    let nextNumber = 1;
    if (existingVisitCodes.length > 0) {
      // Extraire les numéros des codes existants
      const existingNumbers = existingVisitCodes.map(code => {
        const numPart = code.substring(5); // Extraire la partie numérique
        return parseInt(numPart, 10);
      });
      
      // Trouver le numéro maximum
      const maxNumber = Math.max(...existingNumbers);
      nextNumber = maxNumber + 1;
    }
    
    // Formater le nouveau code avec le numéro séquentiel (format VISIT001)
    const formattedNumber = nextNumber.toString().padStart(3, '0');
    const newCode = `VISIT${formattedNumber}`;
    
    // Ajouter ce code à la liste
    setAccessCodes(prevCodes => ({
      ...prevCodes,
      [newCode]: { role: newCodeRole, name: newCodeName }
    }));
    
    setGeneratedCode(newCode);
    toast.success(`Code d'accès généré pour ${newCodeName}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copié dans le presse-papiers");
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

    // Vérifier que le code OTP n'existe pas déjà
    if (OTP_CODES[newOTPCode]) {
      toast.error("Ce code OTP existe déjà");
      return;
    }

    // Ajouter ce code OTP à la liste
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
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des codes d'accès</h1>
      
      <Tabs defaultValue="access" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="access" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Codes d'accès
          </TabsTrigger>
          <TabsTrigger value="otp" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Codes OTP
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="access">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Générer un nouveau code d'accès</CardTitle>
                <CardDescription>
                  Créez un code d'accès pour un visiteur ou un étudiant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
              <CardFooter>
                <Button onClick={generateAccessCode} className="w-full">
                  Générer un code
                </Button>
              </CardFooter>
            </Card>
            
            {generatedCode && (
              <Card>
                <CardHeader>
                  <CardTitle>Code généré</CardTitle>
                  <CardDescription>
                    Copiez ce code et partagez-le avec {newCodeName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-100 rounded-md mb-2">
                    <p className="text-2xl font-bold text-center py-2">{generatedCode}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => copyToClipboard(generatedCode)}
                  >
                    <Copy className="h-4 w-4" />
                    Copier le code
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Codes d'accès existants</CardTitle>
                <CardDescription>
                  Gérez les codes d'accès existants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
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
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => copyToClipboard(code)}
                              >
                                <Copy className="h-4 w-4 text-gray-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteCode(code, false)}
                                disabled={code === "ADMIN2024"}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="otp">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Générer un nouveau code OTP</CardTitle>
                <CardDescription>
                  Créez un code OTP permanent à 4 chiffres
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
              <CardFooter>
                <Button onClick={generateOTPCode} className="w-full">
                  Générer un code OTP
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Codes OTP permanents</CardTitle>
                <CardDescription>
                  Gérez les codes OTP existants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
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
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => copyToClipboard(code)}
                              >
                                <Copy className="h-4 w-4 text-gray-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteCode(code, true)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
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

export default AccessCodeManager;
