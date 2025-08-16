'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface QuestionNavigatorProps {
  questions: any[];
  currentQuestionIndex: number;
  userAnswers: Map<number, string[]>;
  markedForReview: Set<number>;
  incorrectUnvalidatedQuestions: Set<number>;
  correctlyAnsweredQuestions: Set<number>;
  onQuestionSelect: (index: number) => void;
  onToggleMark: (index: number) => void;
}

export function QuestionNavigator({
  questions,
  currentQuestionIndex,
  userAnswers,
  markedForReview,
  incorrectUnvalidatedQuestions,
  correctlyAnsweredQuestions,
  onQuestionSelect,
  onToggleMark
}: QuestionNavigatorProps) {
  const getQuestionStatus = (questionIndex: number) => {
    if (correctlyAnsweredQuestions.has(questionIndex)) {
      return 'correctlyAnswered';
    }
    if (incorrectUnvalidatedQuestions.has(questionIndex)) {
      return 'incorrectUnvalidated';
    }
    const userAnswer = userAnswers.get(questionIndex);
    if (userAnswer && userAnswer.length > 0) {
      return 'answered';
    }
    if (markedForReview.has(questionIndex)) {
      return 'marked';
    }
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correctlyAnswered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700';
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'incorrectUnvalidated':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      case 'marked':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: string, index: number) => {
    switch (status) {
      case 'correctlyAnswered':
        return '★';
      case 'answered':
        return '✓';
      case 'incorrectUnvalidated':
        return '✗';
      case 'marked':
        return '!';
      default:
        return index + 1;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'correctlyAnswered':
        return 'Maîtrisé';
      case 'answered':
        return 'Répondu';
      case 'incorrectUnvalidated':
        return 'Incorrect';
      case 'marked':
        return 'À revoir';
      default:
        return 'Non répondu';
    }
  };

  const answeredCount = Array.from(userAnswers.values()).filter(answers => answers.length > 0).length;
  const markedCount = markedForReview.size;
  const incorrectUnvalidatedCount = incorrectUnvalidatedQuestions.size;
  const correctlyAnsweredCount = correctlyAnsweredQuestions.size;
  const totalCount = questions.length;

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Navigation des questions</h3>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>★ {correctlyAnsweredCount} maîtrisées</span>
          <span>✓ {answeredCount} répondues</span>
          <span>✗ {incorrectUnvalidatedCount} incorrectes</span>
          <span>! {markedCount} à revoir</span>
          <span>○ {totalCount - answeredCount} restantes</span>
        </div>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-4">
        {questions.map((_, index) => {
          const status = getQuestionStatus(index);
          const isCurrent = index === currentQuestionIndex;
          
          return (
            <button
              key={index}
              onClick={() => onQuestionSelect(index)}
              className={`
                w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all
                ${getStatusColor(status)}
                ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-blue-400' : 'hover:opacity-80'}
              `}
            >
              {getStatusIcon(status, index)}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700">
            ★ Maîtrisé
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
            ✓ Répondu
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">
            ✗ Incorrect
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700">
            ! À revoir
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
            ○ Non répondu
          </Badge>
        </div>
        
        <Button
          onClick={() => onToggleMark(currentQuestionIndex)}
          variant={markedForReview.has(currentQuestionIndex) ? "default" : "outline"}
          size="sm"
          className="text-xs dark:bg-gray-800 dark:text-gray-300"
        >
          {markedForReview.has(currentQuestionIndex) ? '✓ Retirer de revoir' : '+ Marquer à revoir'}
        </Button>
      </div>
    </div>
  );
}