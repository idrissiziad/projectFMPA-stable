'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Question, Choice } from '@/types/question';

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
    <Card className="w-full max-w-4xl mx-auto dark:bg-gray-800">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Question {questionNumber} sur {totalQuestions}
            </CardTitle>
            <CardDescription className="mt-2">
              <Badge variant="outline" className="dark:bg-gray-700 dark:text-gray-300">{question.YearAsked}</Badge>
              <Badge variant="secondary" className="ml-2 dark:bg-gray-700 dark:text-gray-300">{question.Subtopic}</Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">
          {question.QuestionText}
        </div>
        
        <div className="space-y-3" key={shuffleKey}>
          {displayChoices.map((choice) => (
            <div key={choice.id} className="space-y-2">
              <div className={`flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${getChoiceStyle(choice.id)}`}>
                <Checkbox
                  id={`choice-${choice.id}`}
                  checked={safeUserAnswers.includes(choice.id)}
                  onCheckedChange={(checked) => onAnswerChange(choice.id, checked as boolean)}
                  disabled={showResult}
                  className="mt-1"
                />
                <Label
                  htmlFor={`choice-${choice.id}`}
                  className="flex-1 cursor-pointer leading-relaxed"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {choice.id}. {choice.text}
                    </span>
                    {getChoiceIcon(choice.id) && (
                      <span className={`text-lg font-bold ${
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
                <div className={`ml-12 p-3 rounded-lg text-sm ${
                  choice.isCorrect === true 
                    ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' 
                    : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                }`}>
                  <span className="font-semibold">
                    {choice.isCorrect === true ? '✓ Correct' : '✗ Incorrect'} :
                  </span> <span dangerouslySetInnerHTML={{ __html: choice.explanation }} />
                </div>
              )}
              
              {/* Show explanation for correct choices that weren't selected */}
              {showResult && !safeUserAnswers.includes(choice.id) && choice.isCorrect === true && choice.explanation && choice.explanation.trim() !== '' && (
                <div className="ml-12 p-3 rounded-lg text-sm bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700">
                  <span className="font-semibold">💡 Manqué :</span> <span dangerouslySetInnerHTML={{ __html: choice.explanation }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}