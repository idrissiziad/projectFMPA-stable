'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Question, Choice } from '@/types/question';
import { Stethoscope, Brain, Heart, Activity } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswers: string[]; // Changed to array for multiple selections
  onAnswerChange: (choiceId: string, checked: boolean) => void;
  showResult?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  userAnswers,
  onAnswerChange,
  showResult = false
}: QuestionCardProps) {
  // Ensure userAnswers is always an array
  const safeUserAnswers = Array.isArray(userAnswers) ? userAnswers : [];
  
  // State for shuffled choices and original order
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([]);
  const [originalOrder, setOriginalOrder] = useState<Choice[]>([]);
  const [shuffleKey, setShuffleKey] = useState(0); // Force re-render when needed

  // Create original choices array
  const createOriginalChoices = (): Choice[] => [
    { id: 'A', text: question.Choice_A_Text, isCorrect: question.Choice_A_isCorrect, explanation: question.Choice_A_Explanation },
    { id: 'B', text: question.Choice_B_Text, isCorrect: question.Choice_B_isCorrect, explanation: question.Choice_B_Explanation },
    { id: 'C', text: question.Choice_C_Text, isCorrect: question.Choice_C_isCorrect, explanation: question.Choice_C_Explanation },
    { id: 'D', text: question.Choice_D_Text, isCorrect: question.Choice_D_isCorrect, explanation: question.Choice_D_Explanation },
    { id: 'E', text: question.Choice_E_Text, isCorrect: question.Choice_E_isCorrect, explanation: question.Choice_E_Explanation },
  ].filter(choice => choice.text.trim() !== '');

  // Function to shuffle array using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize or re-shuffle when question changes or when showing/hiding results
  useEffect(() => {
    const original = createOriginalChoices();
    setOriginalOrder(original);
    
    if (!showResult) {
      // Shuffle when practicing (not showing results)
      setShuffledChoices(shuffleArray(original));
    } else {
      // Show original order when showing results
      setShuffledChoices(original);
    }
    setShuffleKey(prev => prev + 1); // Force re-render
  }, [question, showResult]);

  // Get the display choices (shuffled or original based on showResult)
  const displayChoices = showResult ? originalOrder : shuffledChoices;

  // Map to get original choice ID from display choice (needed for userAnswers)
  const getOriginalChoiceId = (displayChoice: Choice): string => {
    return displayChoice.id;
  };

  const getChoiceStyle = (choiceId: string) => {
    if (!showResult) return '';
    
    const choice = displayChoices.find(c => c.id === choiceId);
    if (!choice) return '';
    
    if (choice.isCorrect === true) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600';
    }
    
    if (safeUserAnswers.includes(choiceId) && choice.isCorrect === false) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600';
    }
    
    return '';
  };

  const getChoiceIcon = (choiceId: string) => {
    if (!showResult) return null;
    
    const choice = displayChoices.find(c => c.id === choiceId);
    if (!choice) return null;
    
    if (choice.isCorrect === true) {
      return '✓';
    }
    
    if (safeUserAnswers.includes(choiceId) && choice.isCorrect === false) {
      return '✗';
    }
    
    return null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Question {questionNumber} sur {totalQuestions}
              </CardTitle>
              <CardDescription className="mt-2">
                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-600">
                  {question.YearAsked}
                </Badge>
                <Badge variant="secondary" className="ml-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  {question.Subtopic}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <div className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border-l-4 border-blue-500">
          {question.QuestionText}
        </div>
        
        <div className="space-y-3" key={shuffleKey}>
          {displayChoices.map((choice) => (
            <div key={choice.id} className="space-y-2">
              <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                getChoiceStyle(choice.id) || 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
              }`}>
                <div className="flex items-center h-5 mt-1">
                  <Checkbox
                    id={`choice-${choice.id}`}
                    checked={safeUserAnswers.includes(choice.id)}
                    onCheckedChange={(checked) => onAnswerChange(choice.id, checked as boolean)}
                    disabled={showResult}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </div>
                <Label
                  htmlFor={`choice-${choice.id}`}
                  className="flex-1 cursor-pointer leading-relaxed"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {choice.text}
                    </span>
                    {getChoiceIcon(choice.id) && (
                      <span className={`text-xl font-bold ${
                        choice.isCorrect === true ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {getChoiceIcon(choice.id)}
                      </span>
                    )}
                  </div>
                </Label>
              </div>
              
              {/* Show explanation under the choice if it's selected and we're showing results */}
              {showResult && safeUserAnswers.includes(choice.id) && choice.explanation && choice.explanation.trim() !== '' && (
                <div className={`ml-14 p-4 rounded-xl text-sm border-l-4 ${
                  choice.isCorrect === true 
                    ? 'bg-green-50 text-green-800 border-green-400 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600' 
                    : 'bg-red-50 text-red-800 border-red-400 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-bold text-lg ${
                      choice.isCorrect === true ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {choice.isCorrect === true ? '✓' : '✗'}
                    </span>
                    <span className="font-semibold">
                      {choice.isCorrect === true ? 'Réponse Correcte' : 'Réponse Incorrecte'}
                    </span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: choice.explanation }} />
                </div>
              )}
              
              {/* Show explanation for correct choices that weren't selected */}
              {showResult && !safeUserAnswers.includes(choice.id) && choice.isCorrect === true && choice.explanation && choice.explanation.trim() !== '' && (
                <div className="ml-14 p-4 rounded-xl text-sm bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">💡</span>
                    <span className="font-semibold">Option Manquée</span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: choice.explanation }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}