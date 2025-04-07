
import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Trash2, Copy, KeyRound, Edit, Save } from "lucide-react";
import { toast } from "@/utils/toastUtils";

// Réutiliser les types définis dans Login.tsx
interface UserDetails {
  role: string;
  name: string;
}

interface AccessCodes {
  [key: string]: UserDetails;
}

const AccessCodeManager = () => {
  const [ACCESS_CODES, setAccessCodes] = useState<AccessCodes>({});
  const [newCodeRole, setNewCodeRole] = useState("visitor");
  const [newCodeName, setNewCodeName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<string>("");
  
  // États pour l'édition
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCode, setEditingCode] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingRole, setEditingRole] = useState("visitor");

  // Charger les codes depuis localStorage
  useEffect(() => {
    const storedCodes = localStorage.getItem("accessCodes");
    if (storedCodes) {
      setAccessCodes(JSON.parse(storedCodes));
    }
  }, []);

  // Sauvegarder les codes dans localStorage quand ils changent
  useEffect(() => {
    localStorage.setItem("accessCodes", JSON.stringify(ACCESS_CODES));
  }, [ACCESS_CODES]);

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
      toast.error("Veuillez saisir un nom pour l'agent");
      return;
    }

    // Générer un code aléatoire
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Ajouter ce code à la liste
    setAccessCodes(prevCodes => ({
      ...prevCodes,
      [randomCode]: { role: newCodeRole, name: newCodeName }
    }));
    
    setGeneratedCode(randomCode);
    toast.success(`Code d'accès généré pour ${newCodeName}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copié dans le presse-papiers");
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
  
  // Fonctions pour l'édition
  const handleEditCode = (code: string) => {
    const details = ACCESS_CODES[code];
    setEditingCode(code);
    setEditingName(details.name);
    setEditingRole(details.role);
    setShowEditDialog(true);
  };
  
  const confirmEditCode = () => {
    if (!editingName.trim()) {
      toast.error("Le nom ne peut pas être vide");
      return;
    }
    
    // Mise à jour pour les codes d'accès
    if (editingCode === "ADMIN2024" && editingRole !== "admin") {
      toast.error("Impossible de changer le rôle du code administrateur");
      return;
    }
    
    setAccessCodes(prevCodes => {
      const newCodes = { ...prevCodes };
      newCodes[editingCode] = { 
        role: editingRole, 
        name: editingName 
      };
      return newCodes;
    });
    
    toast.success("Code d'accès modifié avec succès");
    setShowEditDialog(false);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des codes d'accès</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Générer un nouveau code d'accès</CardTitle>
            <CardDescription>
              Créez un code d'accès pour un agent ou un administrateur
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(ACCESS_CODES).map(([code, details]) => (
                    <TableRow key={code}>
                      <TableCell className="font-medium">{code}</TableCell>
                      <TableCell>{details.name}</TableCell>
                      <TableCell>{details.role === "admin" ? "Administrateur" : details.role === "student" ? "Administrateur" : "Agent"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(code)}
                            title="Copier le code"
                          >
                            <Copy className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditCode(code)}
                            title="Modifier le code"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCode(code)}
                            disabled={code === "ADMIN2024"}
                            title="Supprimer le code"
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
      
      {/* Dialog for editing codes */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le code d'accès</DialogTitle>
            <DialogDescription>
              Modifiez les détails du code d'accès
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Code d'accès</Label>
              <Input
                value={editingCode}
                disabled
              />
              <p className="text-xs text-amber-600">Le code d'accès ne peut pas être modifié</p>
            </div>
            
            <div className="space-y-2">
              <Label>Nom de l'utilisateur</Label>
              <Input
                placeholder="Nom de l'utilisateur"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Type d'accès</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={editingRole}
                onChange={(e) => setEditingRole(e.target.value)}
                disabled={editingCode === "ADMIN2024"}
              >
                <option value="visitor">Agent</option>
                <option value="student">Administrateur</option>
                <option value="admin">Administrateur</option>
              </select>
              {editingCode === "ADMIN2024" && (
                <p className="text-xs text-amber-600">Le rôle du compte administrateur ne peut pas être modifié</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmEditCode} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessCodeManager;
