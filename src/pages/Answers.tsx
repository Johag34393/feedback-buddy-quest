
import React, { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  correctAnswerId: string;
}

const Answers = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Charger les questions depuis le localStorage
    const savedQuestions = localStorage.getItem("quizQuestions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    setLoading(false);
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestionIndex].id]: value
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswerId) {
        totalScore += 2; // Chaque réponse correcte vaut 2 points
      }
    });
    
    return totalScore;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizCompleted(true);
    
    toast({
      title: "Quiz terminé !",
      description: `Votre score: ${finalScore}/20 points`,
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(null);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Chargement des questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Aucune question disponible</CardTitle>
            <CardDescription>
              Veuillez d'abord créer des questions dans l'interface "Créer des questions"
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.location.href = "/"} className="w-full">
              Aller créer des questions
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestion.id] || "";
  const isAnswered = !!currentAnswer;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = questions.every(q => selectedAnswers[q.id]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Répondre au quiz</h1>
      
      {!quizCompleted ? (
        <>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Question {currentQuestionIndex + 1} sur {questions.length}</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription>{currentQuestion.text}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={currentAnswer}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                    <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Précédent
              </Button>
              
              {isLastQuestion ? (
                <Button 
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered}
                >
                  Terminer le quiz
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  disabled={!isAnswered}
                >
                  Suivant
                </Button>
              )}
            </CardFooter>
          </Card>
        </>
      ) : (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Résultats du quiz</CardTitle>
            <CardDescription>
              Votre score final est de {score} sur 20 points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={(score! / 20) * 100} 
                className="w-full h-4"
              />
              
              <div className="text-center text-xl font-semibold mt-4">
                {score! >= 15 ? (
                  <p className="text-green-600">Excellent ! Vous maîtrisez bien les concepts.</p>
                ) : score! >= 10 ? (
                  <p className="text-yellow-600">Bon travail ! Il y a encore quelques points à améliorer.</p>
                ) : (
                  <p className="text-red-600">Vous devriez revoir certains concepts fondamentaux.</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={resetQuiz}>
              Recommencer le quiz
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Answers;
