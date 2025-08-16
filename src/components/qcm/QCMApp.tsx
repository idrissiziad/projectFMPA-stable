'use client';

import { useState } from 'react';
import { QuizComponent } from './QuizComponent';
import { FileSelector } from './FileSelector';
import { Question } from '@/types/question';
import { loadQuizQuestions, getAvailableQuizFiles, QuizFile } from '@/data/quiz-loader';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Heart, Stethoscope } from 'lucide-react';

interface QCMAppProps {
  onBackToHome?: () => void;
}

export function QCMApp({ onBackToHome }: QCMAppProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (fileId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Load questions using the new loader
      const files = await getAvailableQuizFiles();
      const selectedQuizFile = files.find(f => f.id === fileId);
      
      if (!selectedQuizFile) {
        throw new Error('Fichier non trouvé');
      }

      // Load the questions dynamically
      const questionsData = await loadQuizQuestions(selectedQuizFile.filename);
      setQuestions(questionsData);
      setSelectedFile(selectedQuizFile.filename);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Erreur lors du chargement des questions. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelection = () => {
    setSelectedFile(null);
    setQuestions([]);
    setError(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">Erreur</h2>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={handleBackToSelection}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retour à la sélection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedFile || questions.length === 0) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <FileSelector onFileSelect={handleFileSelect} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <QuizComponent
        questions={questions}
        quizFile={selectedFile}
        onBackToSelection={handleBackToSelection}
      />
    </div>
  );
}