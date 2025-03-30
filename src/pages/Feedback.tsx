
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Type pour les feedbacks
type FeedbackType = "positive" | "negative";
type FeedbackItem = {
  id: number;
  type: FeedbackType;
  author: string;
  date: string;
  content: string;
  department: string;
};

const Feedback = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("positive");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [department, setDepartment] = useState("");
  const { toast } = useToast();
  
  // Données fictives pour les feedbacks
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: 1,
      type: "positive",
      author: "Sophie Dubois",
      date: "Il y a 2 jours",
      content: "J'ai été impressionné par la rapidité avec laquelle l'agent a résolu mon problème. Son professionnalisme et sa patience ont été exemplaires.",
      department: "Service Client"
    },
    {
      id: 2,
      type: "positive",
      author: "Thomas Martin",
      date: "Il y a 3 jours",
      content: "L'agent a fait preuve d'une grande empathie face à ma situation difficile. Je tiens à le féliciter pour sa compréhension et son accompagnement.",
      department: "Support Technique"
    },
    {
      id: 3,
      type: "negative",
      author: "Julie Leroy",
      date: "Il y a 1 jour",
      content: "J'ai dû attendre plus de 20 minutes avant d'être pris en charge, et l'agent semblait pressé de terminer l'appel. La procédure n'a pas été respectée.",
      department: "Comptabilité"
    },
    {
      id: 4,
      type: "negative",
      author: "Éric Dupont",
      date: "Il y a 4 jours",
      content: "Les informations fournies par l'agent étaient incorrectes, ce qui a causé des problèmes supplémentaires. J'ai dû rappeler plusieurs fois pour résoudre le problème.",
      department: "Logistique"
    }
  ]);
  
  const handleSubmit = () => {
    if (!feedbackContent.trim() || !department.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }
    
    const newFeedback: FeedbackItem = {
      id: feedbacks.length + 1,
      type: activeTab,
      author: "Vous",
      date: "À l'instant",
      content: feedbackContent,
      department: department
    };
    
    setFeedbacks([newFeedback, ...feedbacks]);
    setFeedbackContent("");
    setDepartment("");
    
    toast({
      title: activeTab === "positive" ? "Coup de cœur partagé" : "Coup de gueule partagé",
      description: "Votre feedback a été publié avec succès",
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Espace de Feedback</h1>
      
      <Tabs defaultValue="positive" onValueChange={(value) => setActiveTab(value as FeedbackType)}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger 
            value="positive" 
            className="flex items-center gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            Coups de cœur
          </TabsTrigger>
          <TabsTrigger 
            value="negative" 
            className="flex items-center gap-2"
          >
            <ThumbsDown className="h-4 w-4" />
            Coups de gueule
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <TabsContent value="positive" className="mt-0">
              <h2 className="text-xl font-semibold mb-4">Coups de cœur récents</h2>
              <div className="space-y-4">
                {feedbacks
                  .filter(feedback => feedback.type === "positive")
                  .map(feedback => (
                    <Card key={feedback.id} className="border-l-4 border-l-positive">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{feedback.author.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{feedback.author}</CardTitle>
                              <CardDescription>{feedback.department}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {feedback.date}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{feedback.content}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="negative" className="mt-0">
              <h2 className="text-xl font-semibold mb-4">Coups de gueule récents</h2>
              <div className="space-y-4">
                {feedbacks
                  .filter(feedback => feedback.type === "negative")
                  .map(feedback => (
                    <Card key={feedback.id} className="border-l-4 border-l-negative">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{feedback.author.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{feedback.author}</CardTitle>
                              <CardDescription>{feedback.department}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {feedback.date}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{feedback.content}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </div>
          
          <div>
            <Card className={cn(
              "border-t-4",
              activeTab === "positive" ? "border-t-positive" : "border-t-negative"
            )}>
              <CardHeader>
                <CardTitle>Partagez votre feedback</CardTitle>
                <CardDescription>
                  {activeTab === "positive" 
                    ? "Partagez une expérience positive avec un agent"
                    : "Partagez un problème rencontré avec un agent"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Département concerné</Label>
                  <Input 
                    id="department" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ex: Service Client, Support Technique..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback">Votre message</Label>
                  <Textarea 
                    id="feedback"
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    placeholder={activeTab === "positive" 
                      ? "Décrivez votre expérience positive..." 
                      : "Décrivez le problème rencontré..."
                    }
                    rows={6}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  className={cn(
                    "w-full",
                    activeTab === "positive" 
                      ? "bg-positive hover:bg-positive-hover" 
                      : "bg-negative hover:bg-negative-hover"
                  )}
                >
                  {activeTab === "positive" 
                    ? "Partager ce coup de cœur" 
                    : "Partager ce coup de gueule"
                  }
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Feedback;
