
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  
  const totalSteps = 5;
  
  const questions = [
    {
      id: 1,
      question: "Comment évaluez-vous la communication de l'agent ?",
      options: [
        { value: "1", label: "Très insatisfaisante" },
        { value: "2", label: "Insatisfaisante" },
        { value: "3", label: "Neutre" },
        { value: "4", label: "Satisfaisante" },
        { value: "5", label: "Très satisfaisante" }
      ]
    },
    {
      id: 2,
      question: "L'agent a-t-il fait preuve de professionnalisme ?",
      options: [
        { value: "1", label: "Pas du tout" },
        { value: "2", label: "Un peu" },
        { value: "3", label: "Moyennement" },
        { value: "4", label: "Beaucoup" },
        { value: "5", label: "Totalement" }
      ]
    },
    {
      id: 3,
      question: "Comment évaluez-vous la résolution du problème par l'agent ?",
      options: [
        { value: "1", label: "Très mauvaise" },
        { value: "2", label: "Mauvaise" },
        { value: "3", label: "Moyenne" },
        { value: "4", label: "Bonne" },
        { value: "5", label: "Excellente" }
      ]
    },
    {
      id: 4,
      question: "L'agent a-t-il respecté les procédures établies ?",
      options: [
        { value: "1", label: "Pas du tout" },
        { value: "2", label: "Partiellement" },
        { value: "3", label: "Généralement" },
        { value: "4", label: "Presque toujours" },
        { value: "5", label: "Parfaitement" }
      ]
    },
    {
      id: 5,
      question: "Recommanderiez-vous cet agent à vos collègues ?",
      options: [
        { value: "1", label: "Pas du tout" },
        { value: "2", label: "Probablement pas" },
        { value: "3", label: "Peut-être" },
        { value: "4", label: "Probablement" },
        { value: "5", label: "Absolument" }
      ]
    }
  ];
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = () => {
    console.log("Réponses soumises:", { ...answers, comment });
    toast({
      title: "Questionnaire soumis avec succès",
      description: "Merci pour votre feedback précieux !",
    });
    
    // Réinitialiser le formulaire
    setCurrentStep(1);
    setAnswers({});
    setComment("");
  };
  
  const currentQuestion = questions[currentStep - 1];
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Questionnaire d'évaluation</h1>
      
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Question {currentStep} sur {totalSteps}</span>
          <span className="text-sm font-medium">{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
      </div>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Question {currentStep}</CardTitle>
          <CardDescription>{currentQuestion.question}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={answers[`question-${currentQuestion.id}`] || ""}
            onValueChange={(value) => {
              setAnswers({
                ...answers,
                [`question-${currentQuestion.id}`]: value
              });
            }}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`q${currentQuestion.id}-option-${option.value}`} />
                <Label htmlFor={`q${currentQuestion.id}-option-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          
          {currentStep === totalSteps && (
            <div className="mt-6">
              <Label htmlFor="comment">Commentaires additionnels (optionnel)</Label>
              <Textarea 
                id="comment" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez vos impressions sur l'agent..."
                className="mt-2"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>
          
          {currentStep < totalSteps ? (
            <Button 
              onClick={handleNext}
              disabled={!answers[`question-${currentQuestion.id}`]}
            >
              Suivant
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!answers[`question-${currentQuestion.id}`]}
            >
              Soumettre
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Questionnaire;
