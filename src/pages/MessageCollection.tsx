
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, Star } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  type: "positive" | "negative";
  content: string;
  date: string;
}

const MessageCollection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messageType, setMessageType] = useState<"positive" | "negative">("positive");
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Charger les messages depuis localStorage
    const savedMessages = localStorage.getItem("feedbackMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim() || !messageContent.trim()) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    // Créer le nouveau message
    const newMessage: Message = {
      id: Date.now().toString(),
      name,
      email,
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
    setEmail("");
    setMessageType("positive");
    setMessageContent("");

    // Afficher un toast de confirmation
    toast({
      title: "Message envoyé",
      description: "Votre message a été enregistré avec succès",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Messages et Feedback</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de message */}
        <Card>
          <CardHeader>
            <CardTitle>Partagez votre expérience</CardTitle>
            <CardDescription>
              Que ce soit un coup de cœur ou un coup de gueule, partagez votre expérience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
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

        {/* Liste des messages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Messages reçus</h2>
          
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
                      <span>{message.name}</span>
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.date).toLocaleDateString()}
                    </span>
                  </div>
                  <CardDescription>{message.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCollection;
