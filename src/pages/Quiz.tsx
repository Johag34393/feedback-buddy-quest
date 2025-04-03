
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctAnswerId: string;
}

interface QuestionSet {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

const Quiz = () => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<QuestionSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(189); // 189 seconds timer
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load question sets from localStorage
  useEffect(() => {
    const savedQuestionSets = localStorage.getItem("questionSets");
    if (savedQuestionSets) {
      const parsedSets = JSON.parse(savedQuestionSets);
      setQuestionSets(parsedSets);
      
      // If there are sets with questions, select the first one
      const setsWithQuestions = parsedSets.filter((set: QuestionSet) => set.questions.length > 0);
      if (setsWithQuestions.length > 0) {
        setSelectedSet(setsWithQuestions[0]);
      }
    }
    setIsLoading(false);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!quizCompleted && selectedSet) {
      const timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [quizCompleted, selectedSet]);

  const handleTimeUp = () => {
    if (!selectedSet) return;
    
    // Auto-submit the quiz when time is up
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizCompleted(true);
    
    toast({
      title: "Temps écoulé !",
      description: `Votre score final est de ${finalScore}/${selectedSet.questions.length * 2} points`,
      variant: "destructive",
    });
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleNext = () => {
    if (selectedSet && currentQuestionIndex < selectedSet.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (value: string) => {
    if (!selectedSet) return;
    
    const currentQuestion = selectedSet.questions[currentQuestionIndex];
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: value
    });
  };

  const calculateScore = () => {
    if (!selectedSet) return 0;
    
    let totalScore = 0;
    
    selectedSet.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswerId) {
        totalScore += 2; // Chaque réponse correcte vaut 2 points
      }
    });
    
    return totalScore;
  };

  const handleSubmit = () => {
    if (!selectedSet) return;
    
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizCompleted(true);
    
    toast({
      title: "Quiz terminé !",
      description: `Votre score: ${finalScore}/${selectedSet.questions.length * 2} points`,
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(null);
    setQuizCompleted(false);
    setTimeRemaining(189); // Reset timer
  };

  const selectQuestionSet = (setId: string) => {
    const set = questionSets.find(s => s.id === setId);
    if (set) {
      setSelectedSet(set);
      resetQuiz();
    }
  };

  // If still loading or no question sets available
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Quiz de formation</h1>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Chargement du quiz...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No question sets available
  if (questionSets.length === 0 || !selectedSet) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Quiz de formation</h1>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Aucun quiz disponible</CardTitle>
            <CardDescription>
              Aucun ensemble de questions n'a été créé par l'administrateur.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-4 text-gray-500">
              Veuillez contacter un administrateur pour créer un ensemble de questions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If quiz is available and ready to take
  const currentQuestion = selectedSet.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedSet.questions.length) * 100;
  const currentAnswer = selectedAnswers[currentQuestion.id] || "";
  const isAnswered = !!currentAnswer;
  const isLastQuestion = currentQuestionIndex === selectedSet.questions.length - 1;
  const allQuestionsAnswered = selectedSet.questions.every(q => selectedAnswers[q.id]);

  // Calculate timer progress percentage
  const timerProgress = (timeRemaining / 189) * 100;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Quiz de formation</h1>
      
      {/* Question set selection */}
      {questionSets.length > 1 && !quizCompleted && (
        <Card className="max-w-3xl mx-auto mb-6">
          <CardHeader>
            <CardTitle>Sélectionner un ensemble de questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {questionSets.filter(set => set.questions.length > 0).map(set => (
                <Button 
                  key={set.id}
                  variant={selectedSet.id === set.id ? "default" : "outline"}
                  onClick={() => selectQuestionSet(set.id)}
                  className="justify-start overflow-hidden"
                >
                  {set.title} ({set.questions.length} questions)
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {!quizCompleted ? (
        <>
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Question {currentQuestionIndex + 1} sur {selectedSet.questions.length}</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center text-sm font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className={`${timeRemaining < 30 ? 'text-red-500 font-bold' : ''}`}>
                    Temps restant: {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              <Progress 
                value={timerProgress} 
                className={`w-full ${timeRemaining < 30 ? 'bg-red-200' : ''}`}
              />
            </div>
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
              Votre score final est de {score} sur {selectedSet.questions.length * 2} points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={(score! / (selectedSet.questions.length * 2)) * 100} 
                className="w-full h-4"
              />
              
              <div className="text-center text-xl font-semibold mt-4">
                {score! >= selectedSet.questions.length * 1.5 ? (
                  <p className="text-green-600">Excellent ! Vous maîtrisez bien les concepts.</p>
                ) : score! >= selectedSet.questions.length ? (
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

export default Quiz;
