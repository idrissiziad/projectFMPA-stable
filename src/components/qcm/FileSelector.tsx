'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuizFile, getAvailableQuizFiles } from '@/data/quiz-loader';
import { Heart, Stethoscope, Brain, Activity, Pill, Microscope, FileText, Code, Database, Globe, Shield, Network } from 'lucide-react';

interface FileSelectorProps {
  onFileSelect: (fileId: string) => void;
}

export function FileSelector({ onFileSelect }: FileSelectorProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [quizFiles, setQuizFiles] = useState<QuizFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizFiles = async () => {
      try {
        const files = await getAvailableQuizFiles();
        setQuizFiles(files);
      } catch (error) {
        console.error('Error loading quiz files:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizFiles();
  }, []);

  const handleFileSelect = (fileId: string) => {
    setSelectedFile(fileId);
  };

  const handleStartQuiz = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.includes('cardiologie') || filename.includes('coeur')) {
      return <Heart className="h-5 w-5 text-red-500" />;
    } else if (filename.includes('neurologie') || filename.includes('cerveau')) {
      return <Brain className="h-5 w-5 text-purple-500" />;
    } else if (filename.includes('medecine') || filename.includes('general')) {
      return <Stethoscope className="h-5 w-5 text-blue-500" />;
    } else if (filename.includes('pharmacologie') || filename.includes('pilule')) {
      return <Pill className="h-5 w-5 text-green-500" />;
    } else if (filename.includes('biologie') || filename.includes('labo')) {
      return <Microscope className="h-5 w-5 text-yellow-500" />;
    } else if (filename.includes('programmation') || filename.includes('code')) {
      return <Code className="h-5 w-5 text-indigo-500" />;
    } else if (filename.includes('bases-de-donnees') || filename.includes('database')) {
      return <Database className="h-5 w-5 text-orange-500" />;
    } else if (filename.includes('web') || filename.includes('developpement')) {
      return <Globe className="h-5 w-5 text-teal-500" />;
    } else if (filename.includes('securite') || filename.includes('security')) {
      return <Shield className="h-5 w-5 text-red-600" />;
    } else if (filename.includes('reseau') || filename.includes('network')) {
      return <Network className="h-5 w-5 text-blue-600" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Chargement des fichiers disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FileText className="h-10 w-10 text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ProjectFMPA
          </h1>
          <Activity className="h-10 w-10 text-green-500" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Plateforme d'entraînement aux questions
        </p>
        <p className="text-base text-gray-500 dark:text-gray-400 mb-6">
          Choisissez un fichier de questions pour commencer votre entraînement
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>💡 Astuce :</strong> {quizFiles.length} fichier(s) de questions disponible(s) dans le dossier src/data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quizFiles.map((file) => (
          <Card
            key={file.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedFile === file.id
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleFileSelect(file.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.filename)}
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {file.name}
                  </CardTitle>
                </div>
                {selectedFile === file.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                {file.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Questions :</span>
                  <Badge variant="outline" className="dark:bg-gray-800 dark:text-gray-300">
                    {file.questionCount}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Catégorie :</span>
                  <Badge variant="secondary" className="dark:bg-gray-800 dark:text-gray-300">
                    {file.category}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Format :</span>
                  <Badge variant="outline" className="dark:bg-gray-800 dark:text-gray-300">
                    JSON
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Taille :</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {file.fileSize > 1024 
                      ? `${(file.fileSize / 1024).toFixed(1)} KB` 
                      : `${file.fileSize} B`
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={handleStartQuiz}
          disabled={!selectedFile}
          size="lg"
          className="px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {selectedFile 
            ? `Commencer l'entraînement : ${quizFiles.find(f => f.id === selectedFile)?.name}` 
            : 'Sélectionnez un fichier pour commencer'
          }
        </Button>
      </div>
    </div>
  );
}