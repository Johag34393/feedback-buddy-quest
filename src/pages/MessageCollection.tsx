
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, Star, Download } from "lucide-react";

interface Message {
  id: string;
  name?: string; // Optionnel maintenant
  type: "positive" | "negative";
  content: string;
  date: string;
}

const MessageCollection = () => {
  const [name, setName] = useState("");
  const [messageType, setMessageType] = useState<"positive" | "negative">("positive");
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setIsAdmin(user.role === "admin");
    }

    // Charger les messages depuis localStorage
    const savedMessages = localStorage.getItem("feedbackMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!messageContent.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un message",
        variant: "destructive",
      });
      return;
    }

    // Créer le nouveau message
    const newMessage: Message = {
      id: Date.now().toString(),
      name: name.trim() || undefined, // Optionnel maintenant
      type: messageType,
      content: messageContent,
      date: new Date().toISOString(),
    };

    // Ajouter le message à la liste
    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    
    // Sauvegarder dans localStorage
    localStorage.setItem("feedbackMessages", JSON.stringify(updatedMessages));

    // Réinitialiser le formulaire
    setName("");
    setMessageType("positive");
    setMessageContent("");

    // Afficher un toast de confirmation
    toast({
      title: "Message envoyé",
      description: "Votre message a été enregistré avec succès",
    });
  };

  // Fonction pour exporter les messages en Excel (CSV)
  const exportToCSV = () => {
    // Entêtes CSV
    let csvContent = "ID,Type,Nom,Date,Message\n";
    
    // Ajouter chaque message
    messages.forEach(message => {
      const type = message.type === "positive" ? "Coup de cœur" : "Coup de gueule";
      const nom = message.name || "Anonyme";
      const date = new Date(message.date).toLocaleDateString();
      // Échapper les virgules et les guillemets dans le contenu
      const contenu = `"${message.content.replace(/"/g, '""')}"`;
      
      csvContent += `${message.id},${type},${nom},${date},${contenu}\n`;
    });
    
    // Créer un blob et le télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "messages_feedback.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: "Les messages ont été exportés avec succès",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Messages et Feedback</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de message simplifié */}
        <Card>
          <CardHeader>
            <CardTitle>Partagez votre expérience</CardTitle>
            <CardDescription>
              Que ce soit un coup de cœur ou un coup de gueule, partagez votre ressenti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom (optionnel)</Label>
                <Input
                  id="name"
                  placeholder="Votre nom (optionnel)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Type de message</Label>
                <RadioGroup
                  value={messageType}
                  onValueChange={(value) => setMessageType(value as "positive" | "negative")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="positive" id="positive" />
                    <Label htmlFor="positive" className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Coup de cœur</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="negative" id="negative" />
                    <Label htmlFor="negative" className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4 text-red-500" />
                      <span>Coup de gueule</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Partagez votre expérience ici..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <Button type="submit" className="w-full">
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liste des messages - visible uniquement par l'admin */}
        {isAdmin ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Messages reçus</h2>
              <Button 
                variant="outline" 
                onClick={exportToCSV}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter en CSV
              </Button>
            </div>
            
            {messages.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Aucun message n'a encore été envoyé.
                </CardContent>
              </Card>
            ) : (
              messages.map((message) => (
                <Card key={message.id} className={message.type === "positive" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {message.type === "positive" ? (
                          <Star className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <MessageCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span>{message.name || "Anonyme"}</span>
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Card className="p-6 text-center max-w-md">
              <CardContent>
                <p className="mb-4 text-muted-foreground">Les messages sont privés et seront consultés par l'administrateur.</p>
                <p className="text-primary font-medium">Merci pour votre contribution !</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCollection;
