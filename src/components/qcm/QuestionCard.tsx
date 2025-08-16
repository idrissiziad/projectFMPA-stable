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
  feedback?: {
    isCorrect: boolean | null;
    userChoices: string[];
    correctChoices: string[];
    allChoiceExplanations: {
      choice: string;
      explanation: string;
      isCorrect: boolean | null;
      isSelected: boolean;
    }[];
    overallExplanation: string;
  } | null;
  onValidateIncorrect?: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  userAnswers,
  onAnswerChange,
  showResult = false,
  feedback = null,
  onValidateIncorrect
}: QuestionCardProps) {
  // Ensure userAnswers is always an array
  const safeUserAnswers = Array.isArray(userAnswers) ? userAnswers : [];
  
  // State for shuffled choices and original order
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([]);
  const [originalOrder, setOriginalOrder] = useState<Choice[]>([]);
  const [shuffleKey, setShuffleKey] = useState(0); // Force re-render when needed

  // Create original choices array
  const createOriginalChoices = (): Choice[] => [
    { id: 'A', text: question.Choice_A_Text || '', isCorrect: question.Choice_A_isCorrect ?? null, explanation: question.Choice_A_Explanation || '' },
    { id: 'B', text: question.Choice_B_Text || '', isCorrect: question.Choice_B_isCorrect ?? null, explanation: question.Choice_B_Explanation || '' },
    { id: 'C', text: question.Choice_C_Text || '', isCorrect: question.Choice_C_isCorrect ?? null, explanation: question.Choice_C_Explanation || '' },
    { id: 'D', text: question.Choice_D_Text || '', isCorrect: question.Choice_D_isCorrect ?? null, explanation: question.Choice_D_Explanation || '' },
    { id: 'E', text: question.Choice_E_Text || '', isCorrect: question.Choice_E_isCorrect ?? null, explanation: question.Choice_E_Explanation || '' },
  ].filter(choice => choice.text && choice.text.trim() !== '');

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
    <Card className="w-full max-w-4xl mx-auto dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardContent className="p-6 space-y-6">
        {/* Question Header - Simplified */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                  {question.YearAsked || 'Année non spécifiée'}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {question.Subtopic || 'Sujet non spécifié'}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Question Text - Clean and Simple */}
          <div className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {question.QuestionText || 'Question text not available'}
          </div>
        </div>
        
        {/* Choices - Simplified */}
        <div className="space-y-3" key={shuffleKey}>
          {displayChoices.map((choice) => (
            <div key={choice.id} className="space-y-2">
              <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 ${
                getChoiceStyle(choice.id) || 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
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
              
              {/* Choice explanation - Always show when showing results */}
              {showResult && choice.explanation && choice.explanation.trim() !== '' && (
                <div className={`p-3 rounded-lg text-sm border-l-4 ${
                  choice.isCorrect === true
                    ? (safeUserAnswers.includes(choice.id)
                        ? 'bg-green-50 text-green-800 border-green-400 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600'
                        : 'bg-yellow-50 text-yellow-800 border-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600')
                    : (safeUserAnswers.includes(choice.id)
                        ? 'bg-red-50 text-red-800 border-red-400 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600'
                        : 'bg-gray-50 text-gray-800 border-gray-400 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-600')
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold ${
                      choice.isCorrect === true
                        ? (safeUserAnswers.includes(choice.id)
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-yellow-600 dark:text-yellow-400')
                        : (safeUserAnswers.includes(choice.id)
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400')
                    }`}>
                      {choice.isCorrect === true ? '✓' : '✗'} Option {choice.id}:
                    </span>
                    {safeUserAnswers.includes(choice.id) && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Votre sélection
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: choice.explanation.replace(/\n/g, '<br>') }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Overall Explanation - Always show when showing results */}
        {showResult && question.OverallExplanation && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 rounded-lg text-sm bg-purple-50 text-purple-800 border-l-4 border-purple-400 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-600">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  💡 Point important :
                </span>
              </div>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: question.OverallExplanation }} />
            </div>
          </div>
        )}

        {/* Integrated Feedback Section */}
        {feedback && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Result Summary */}
            <div className={`text-center p-4 rounded-lg border ${
              feedback.isCorrect === true
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-600'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-600'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
                  feedback.isCorrect === true
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {feedback.isCorrect === true ? '✓' : '✗'}
                </div>
                <span className={`font-semibold ${
                  feedback.isCorrect === true ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}>
                  {feedback.isCorrect === true ? 'Excellent !' : 'À revoir'}
                </span>
              </div>
            </div>


            {/* Validate Incorrect Button */}
            {feedback.isCorrect === false && onValidateIncorrect && (
              <div className="text-center">
                <button
                  onClick={onValidateIncorrect}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  🩺 Marquer comme compris
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}