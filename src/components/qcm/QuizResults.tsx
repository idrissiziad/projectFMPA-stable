'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuestionCard } from './QuestionCard';
import { Question, QuizResult } from '@/types/question';

interface QuizResultsProps {
  results: QuizResult;
  questions: Question[];
  onRestart: () => void;
  userAnswers: Map<number, string[]>; // Changed to array for multiple selections
  onBackToSelection?: () => void;
}

export function QuizResults({ results, questions, onRestart, userAnswers, onBackToSelection }: QuizResultsProps) {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent !';
    if (score >= 60) return 'Bon travail !';
    if (score >= 40) return 'Peut mieux faire';
    return 'À revoir';
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-6xl">
      {/* Results Summary */}
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Résultats Détaillés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
              {results.score}%
            </div>
            <div className="text-xl text-gray-600">
              {getScoreMessage(results.score)}
            </div>
            <div className="text-lg text-gray-600">
              {results.correctAnswers} réponses correctes sur {results.totalQuestions}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Liste des Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {questions.map((question, index) => {
                const userAnswer = userAnswers.get(index) || [];
                const isAnswered = userAnswer.length > 0;
                const isCorrect = results.answers[index].isCorrect === true;
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedQuestionIndex(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedQuestionIndex === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          Question {index + 1}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {question.Subtopic}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAnswered && (
                          <Badge variant={isCorrect ? "default" : "destructive"}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        )}
                        {!isAnswered && (
                          <Badge variant="outline">
                            Non répondu
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Question Details */}
        <div className="lg:col-span-2">
          <QuestionCard
            question={questions[selectedQuestionIndex]}
            questionNumber={selectedQuestionIndex + 1}
            totalQuestions={questions.length}
            userAnswers={userAnswers.get(selectedQuestionIndex) || []}
            onAnswerChange={() => {}} // No-op for results view
            showResult={true}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {onBackToSelection && (
          <Button onClick={onBackToSelection} variant="outline" size="lg">
            Choisir un autre fichier
          </Button>
        )}
        <Button onClick={onRestart} variant="outline" size="lg">
          Recommencer le quiz
        </Button>
      </div>
    </div>
  );
}