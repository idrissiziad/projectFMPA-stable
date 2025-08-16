'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';
import { QuestionNavigator } from './QuestionNavigator';
import { Question, UserAnswer, QuizResult } from '@/types/question';
import { ProgressStorage, ProgressData } from '@/lib/progress-storage';

interface QuizComponentProps {
  questions: Question[];
  quizFile: string;
  onBackToSelection?: () => void;
}

interface AnswerFeedbackProps {
  feedback: {
    isCorrect: boolean | null;
    userChoices: string[];
    correctChoices: string[];
    explanations: string;
    overallExplanation: string;
  } | null;
  onValidateIncorrect?: () => void;
}

function AnswerFeedback({ feedback, onValidateIncorrect }: AnswerFeedbackProps) {
  if (!feedback) return null;

  return (
    <div className="space-y-4">
      <div className={`text-center p-6 rounded-xl border-2 ${
        feedback.isCorrect === true 
          ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-600' 
          : 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-600'
      }`}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
            feedback.isCorrect === true 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {feedback.isCorrect === true ? '✓' : '✗'}
          </div>
          <div>
            <span className={`text-xl font-bold ${
              feedback.isCorrect === true ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
            }`}>
              {feedback.isCorrect === true ? 'Excellent !' : 'À revoir'}
            </span>
            <p className={`text-sm mt-1 ${
              feedback.isCorrect === true ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'
            }`}>
              {feedback.isCorrect === true ? 'La réponse est correcte' : 'La réponse est incorrecte'}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-400">Votre réponse :</span>
              <p className={`font-medium ${
                feedback.isCorrect === true ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
              }`}>
                {feedback.userChoices.length > 0 ? feedback.userChoices.join(', ') : 'Aucune réponse'}
              </p>
            </div>
            {feedback.correctChoices.length > 0 && (
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Bonne(s) réponse(s) :</span>
                <p className="font-medium text-blue-700 dark:text-blue-300">
                  {feedback.correctChoices.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {feedback.isCorrect === false && onValidateIncorrect && (
          <button
            onClick={onValidateIncorrect}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            🩺 Marquer comme compris
          </button>
        )}
        {feedback.explanations && (
          <div className={`mt-4 p-4 rounded-xl text-sm border-l-4 ${
            feedback.isCorrect === true 
              ? 'bg-green-50 text-green-800 border-green-400 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600' 
              : 'bg-red-50 text-red-800 border-red-400 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-bold ${
                feedback.isCorrect === true ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                📚 Explications détaillées :
              </span>
            </div>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: feedback.explanations.replace(/\n\n/g, '<br><br>') }} />
          </div>
        )}
        {feedback.overallExplanation && (
          <div className="mt-4 p-4 rounded-xl text-sm bg-blue-50 text-blue-800 border-l-4 border-blue-400 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-blue-600 dark:text-blue-400">
                💡 Point important :
              </span>
            </div>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: feedback.overallExplanation }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function QuizComponent({ questions, quizFile, onBackToSelection }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string[]>>(new Map());
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [incorrectUnvalidatedQuestions, setIncorrectUnvalidatedQuestions] = useState<Set<number>>(new Set());
  const [correctlyAnsweredQuestions, setCorrectlyAnsweredQuestions] = useState<Set<number>>(new Set());
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [hasVerifiedCurrentQuestion, setHasVerifiedCurrentQuestion] = useState(false);

  const getQuestionsHash = (questions: Question[]) => {
    return questions.map(q => q.QuestionText).join('|');
  };

  // Load saved correct answers on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('quizCorrectAnswers');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.questionsHash === getQuestionsHash(questions)) {
          setCorrectlyAnsweredQuestions(new Set(progress.correctlyAnsweredQuestions || []));
          setHasSavedProgress(progress.correctlyAnsweredQuestions && progress.correctlyAnsweredQuestions.length > 0);
        }
      } catch (error) {
        console.error('Error loading saved correct answers:', error);
      }
    }
  }, [questions]);

  // Save correct answers when they change
  useEffect(() => {
    const progress = {
      questionsHash: getQuestionsHash(questions),
      correctlyAnsweredQuestions: Array.from(correctlyAnsweredQuestions),
      timestamp: Date.now()
    };
    localStorage.setItem('quizCorrectAnswers', JSON.stringify(progress));
    setHasSavedProgress(correctlyAnsweredQuestions.size > 0);
  }, [correctlyAnsweredQuestions, questions]);

  const clearSavedProgress = () => {
    clearCorrectAnswers();
    setHasSavedProgress(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (choiceId: string, checked: boolean) => {
    const newAnswers = new Map(userAnswers);
    const currentAnswers = newAnswers.get(currentQuestionIndex) || [];
    
    if (checked) {
      // Add choice if not already present
      if (!currentAnswers.includes(choiceId)) {
        newAnswers.set(currentQuestionIndex, [...currentAnswers, choiceId]);
      }
    } else {
      // Remove choice if present
      const updatedAnswers = currentAnswers.filter(id => id !== choiceId);
      newAnswers.set(currentQuestionIndex, updatedAnswers);
    }
    
    setUserAnswers(newAnswers);
    setHasVerifiedCurrentQuestion(false); // Reset verification status when answers change
  };

  const handleVerifyAnswer = () => {
    checkAndMarkIncorrectAnswer(currentQuestionIndex, userAnswers);
    setHasVerifiedCurrentQuestion(true);
    setShowFeedback(true);
  };

  const handleValidateIncorrect = () => {
    // Remove from incorrect unvalidated questions
    const newIncorrectUnvalidated = new Set(incorrectUnvalidatedQuestions);
    newIncorrectUnvalidated.delete(currentQuestionIndex);
    setIncorrectUnvalidatedQuestions(newIncorrectUnvalidated);
  };

  const checkAndMarkIncorrectAnswer = (questionIndex: number, answers: Map<number, string[]>) => {
    const userChoices = answers.get(questionIndex) || [];
    if (userChoices.length === 0) return;

    const question = questions[questionIndex];
    
    // Get all correct choices for this question
    const correctChoices: string[] = [];
    if (question.Choice_A_isCorrect === true) correctChoices.push('A');
    if (question.Choice_B_isCorrect === true) correctChoices.push('B');
    if (question.Choice_C_isCorrect === true) correctChoices.push('C');
    if (question.Choice_D_isCorrect === true) correctChoices.push('D');
    if (question.Choice_E_isCorrect === true) correctChoices.push('E');

    // Check if user selected exactly the correct choices
    const userChoicesSorted = [...userChoices].sort();
    const correctChoicesSorted = [...correctChoices].sort();
    
    const isCorrect = userChoicesSorted.length === correctChoicesSorted.length &&
                     userChoicesSorted.every((choice, i) => choice === correctChoicesSorted[i]);

    // If incorrect and not already in the set, add it
    if (!isCorrect && !incorrectUnvalidatedQuestions.has(questionIndex)) {
      const newIncorrectUnvalidated = new Set(incorrectUnvalidatedQuestions);
      newIncorrectUnvalidated.add(questionIndex);
      setIncorrectUnvalidatedQuestions(newIncorrectUnvalidated);
    }
    // If correct and was in the set, remove it
    else if (isCorrect && incorrectUnvalidatedQuestions.has(questionIndex)) {
      const newIncorrectUnvalidated = new Set(incorrectUnvalidatedQuestions);
      newIncorrectUnvalidated.delete(questionIndex);
      setIncorrectUnvalidatedQuestions(newIncorrectUnvalidated);
    }
    
    // If correct and not already in correctlyAnsweredQuestions, add it
    if (isCorrect && !correctlyAnsweredQuestions.has(questionIndex)) {
      const newCorrectlyAnswered = new Set(correctlyAnsweredQuestions);
      newCorrectlyAnswered.add(questionIndex);
      setCorrectlyAnsweredQuestions(newCorrectlyAnswered);
    }
    // If incorrect and was in correctlyAnsweredQuestions, remove it
    else if (!isCorrect && correctlyAnsweredQuestions.has(questionIndex)) {
      const newCorrectlyAnswered = new Set(correctlyAnsweredQuestions);
      newCorrectlyAnswered.delete(questionIndex);
      setCorrectlyAnsweredQuestions(newCorrectlyAnswered);
    }
  };

  const handleNext = () => {
    // Require verification before moving to next question
    if (!hasVerifiedCurrentQuestion) {
      // Check if user has answered anything
      const currentAnswers = userAnswers.get(currentQuestionIndex) || [];
      if (currentAnswers.length > 0) {
        // User has answered but not verified - show feedback
        setShowFeedback(true);
        return;
      }
      // User hasn't answered anything, allow to proceed
    }

    setShowFeedback(false);
    setHasVerifiedCurrentQuestion(false); // Reset for next question
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setShowFeedback(false);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setQuizCompleted(false);
    setShowResults(false);
    setShowFeedback(false);
    setMarkedForReview(new Set());
    setIncorrectUnvalidatedQuestions(new Set());
    setHasVerifiedCurrentQuestion(false);
    // Ne pas réinitialiser correctlyAnsweredQuestions pour garder les réponses correctes sauvegardées
  };

  const clearCorrectAnswers = () => {
    setCorrectlyAnsweredQuestions(new Set());
    localStorage.removeItem('quizCorrectAnswers');
  };

  const toggleMarkForReview = (questionIndex: number) => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(questionIndex)) {
      newMarked.delete(questionIndex);
    } else {
      newMarked.add(questionIndex);
    }
    setMarkedForReview(newMarked);
  };

  const goToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setShowFeedback(false);
    setHasVerifiedCurrentQuestion(false);
  };

  const getQuestionStatus = (questionIndex: number) => {
    const userAnswer = userAnswers.get(questionIndex);
    if (userAnswer && userAnswer.length > 0) {
      return 'answered';
    }
    if (markedForReview.has(questionIndex)) {
      return 'marked';
    }
    return 'unanswered';
  };

  const calculateResults = (): QuizResult => {
    let correctAnswers = 0;
    const answers: UserAnswer[] = [];

    questions.forEach((question, index) => {
      const userChoices = userAnswers.get(index) || [];
      let isCorrect: boolean | null = null;

      // Get all correct choices for this question
      const correctChoices: string[] = [];
      if (question.Choice_A_isCorrect === true) correctChoices.push('A');
      if (question.Choice_B_isCorrect === true) correctChoices.push('B');
      if (question.Choice_C_isCorrect === true) correctChoices.push('C');
      if (question.Choice_D_isCorrect === true) correctChoices.push('D');
      if (question.Choice_E_isCorrect === true) correctChoices.push('E');

      // Check if user selected exactly the correct choices
      const userChoicesSorted = [...userChoices].sort();
      const correctChoicesSorted = [...correctChoices].sort();
      
      isCorrect = userChoicesSorted.length === correctChoicesSorted.length &&
                  userChoicesSorted.every((choice, i) => choice === correctChoicesSorted[i]);

      if (isCorrect === true) correctAnswers++;

      answers.push({
        questionId: index,
        selectedChoices: userChoices,
        isCorrect
      });
    });

    return {
      totalQuestions: questions.length,
      correctAnswers,
      score: Math.round((correctAnswers / questions.length) * 100),
      answers
    };
  };

  const getAnsweredCount = () => {
    return userAnswers.size;
  };

  const getCurrentAnswerFeedback = () => {
    const userChoices = userAnswers.get(currentQuestionIndex) || [];
    if (userChoices.length === 0) return null;

    const question = currentQuestion;
    
    // Get all correct choices for this question
    const correctChoices: string[] = [];
    if (question.Choice_A_isCorrect === true) correctChoices.push('A');
    if (question.Choice_B_isCorrect === true) correctChoices.push('B');
    if (question.Choice_C_isCorrect === true) correctChoices.push('C');
    if (question.Choice_D_isCorrect === true) correctChoices.push('D');
    if (question.Choice_E_isCorrect === true) correctChoices.push('E');

    // Check if user selected exactly the correct choices
    const userChoicesSorted = [...userChoices].sort();
    const correctChoicesSorted = [...correctChoices].sort();
    
    const isCorrect = userChoicesSorted.length === correctChoicesSorted.length &&
                     userChoicesSorted.every((choice, i) => choice === correctChoicesSorted[i]);

    // Get explanations for selected choices
    const explanations: string[] = [];
    userChoices.forEach(choice => {
      let explanation = '';
      switch (choice) {
        case 'A':
          explanation = question.Choice_A_Explanation;
          break;
        case 'B':
          explanation = question.Choice_B_Explanation;
          break;
        case 'C':
          explanation = question.Choice_C_Explanation;
          break;
        case 'D':
          explanation = question.Choice_D_Explanation;
          break;
        case 'E':
          explanation = question.Choice_E_Explanation;
          break;
      }
      if (explanation.trim() !== '') {
        explanations.push(`Pour ${choice}: ${explanation}`);
      }
    });

    return {
      isCorrect,
      userChoices,
      correctChoices,
      explanations: explanations.join('\n\n'),
      overallExplanation: question.OverallExplanation
    };
  };

  if (showResults) {
    return (
      <QuizResults
        results={calculateResults()}
        questions={questions}
        onRestart={handleRestart}
        userAnswers={userAnswers}
        onBackToSelection={onBackToSelection}
      />
    );
  }

  if (quizCompleted) {
    const results = calculateResults();
    
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Quiz Terminé !</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-blue-600">
                {results.score}%
              </div>
              <div className="text-xl text-gray-600">
                Vous avez répondu correctement à {results.correctAnswers} questions sur {results.totalQuestions}
              </div>
              
              <div className="flex justify-center gap-4 mt-8">
                <Button onClick={() => setShowResults(true)} variant="outline" size="lg">
                  Voir les réponses détaillées
                </Button>
                <Button onClick={handleRestart} size="lg">
                  Recommencer le quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Question Navigator */}
      <QuestionNavigator
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        markedForReview={markedForReview}
        incorrectUnvalidatedQuestions={incorrectUnvalidatedQuestions}
        correctlyAnsweredQuestions={correctlyAnsweredQuestions}
        onQuestionSelect={goToQuestion}
        onToggleMark={toggleMarkForReview}
      />

      {/* Progress Bar */}
      <Card className="w-full bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-md">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-blue-700 dark:text-blue-300">
                Question {currentQuestionIndex + 1} sur {questions.length}
              </span>
              <span className="font-medium text-emerald-700 dark:text-emerald-300">
                {getAnsweredCount()} réponse(s) sur {questions.length}
              </span>
            </div>
            <div className="relative">
              <Progress value={progress} className="w-full h-3 bg-blue-100 dark:bg-blue-900/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        userAnswers={Array.isArray(userAnswers.get(currentQuestionIndex)) ? userAnswers.get(currentQuestionIndex) : []}
        onAnswerChange={handleAnswerChange}
        showResult={showFeedback}
      />

      {/* Feedback Panel */}
      {showFeedback && (
        <Card className="w-full dark:bg-gray-800">
          <CardContent className="pt-6">
            <AnswerFeedback 
              feedback={getCurrentAnswerFeedback()} 
              onValidateIncorrect={handleValidateIncorrect}
            />
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {correctlyAnsweredQuestions.size > 0 && (
            <Button onClick={clearCorrectAnswers} variant="outline" className="dark:bg-gray-800 dark:text-gray-300">
              Effacer les réponses correctes ({correctlyAnsweredQuestions.size})
            </Button>
          )}
          {onBackToSelection && (
            <Button onClick={onBackToSelection} variant="outline" className="dark:bg-gray-800 dark:text-gray-300">
              Retour à la sélection
            </Button>
          )}
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="dark:bg-gray-800 dark:text-gray-300"
          >
            Question précédente
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setQuizCompleted(true);
            }}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Terminer l'entraînement
          </Button>
          
          {userAnswers.has(currentQuestionIndex) && userAnswers.get(currentQuestionIndex)!.length > 0 && !showFeedback && (
            <Button
              onClick={handleVerifyAnswer}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500"
              disabled={hasVerifiedCurrentQuestion}
            >
              <div className="flex items-center gap-2">
                {hasVerifiedCurrentQuestion ? (
                  <>
                    <span>✓</span>
                    Réponse vérifiée
                  </>
                ) : (
                  <>
                    <span>🩺</span>
                    Vérifier la réponse
                  </>
                )}
              </div>
            </Button>
          )}
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Question suivante
            </Button>
          ) : (
            <Button
              onClick={() => {
                setQuizCompleted(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Terminer le quiz
            </Button>
          )}
        </div>
      </div>
      
      {/* Saved Progress Indicator */}
      {hasSavedProgress && (
        <Card className="w-full bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">💾</span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Progrès sauvegardé automatiquement
                </span>
              </div>
              <Button 
                onClick={clearSavedProgress} 
                variant="outline" 
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-100 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/30"
              >
                Effacer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}