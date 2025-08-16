'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuizFile, getAvailableQuizFiles } from '@/data/quiz-loader';
import { Heart, Stethoscope, Brain, Activity, Pill, Microscope, FileText, Code, Database, Globe, Shield, Network, User, GraduationCap, Hospital } from 'lucide-react';

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
          <div>
            <Stethoscope className="h-12 w-12 text-blue-600" />
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
              ProjectFMPA
            </h1>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Excellence Médicale - Réussite Assurée
            </p>
          </div>
          <div>
            <Heart className="h-12 w-12 text-red-500" />
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
          Plateforme d'entraînement médicale aux QCM
        </p>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
          Préparez-vous efficacement aux examens de faculté de médecine avec notre système de questions à choix multiples
        </p>
        <div className="bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-6 max-w-3xl mx-auto shadow-lg">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-blue-800 dark:text-blue-200 font-semibold mb-1">
                Ressources Pédagogiques Médicales
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                {quizFiles.length} fichier(s) d'entraînement disponible(s) couvrant diverses spécialités médicales
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quizFiles.map((file) => (
          <Card
            key={file.id}
            className={`cursor-pointer transition-all hover:shadow-xl border-2 ${
              selectedFile === file.id
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
            }`}
            onClick={() => handleFileSelect(file.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    {getFileIcon(file.filename)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                      {file.name}
                    </CardTitle>
                  </div>
                </div>
                {selectedFile === file.id && (
                  <div className="bg-green-500 text-white p-1 rounded-full">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {file.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Questions :</span>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-600">
                    {file.questionCount}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Spécialité :</span>
                  <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                    {file.category}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Format :</span>
                  <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    QCM
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulté :</span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${
                        i < Math.min(3, Math.ceil(file.questionCount / 10)) 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                    ))}
                  </div>
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
          className="px-12 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 dark:from-blue-600 dark:to-emerald-600 dark:hover:from-blue-700 dark:hover:to-emerald-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            {selectedFile 
              ? `Commencer l'entraînement médical`
              : 'Sélectionnez une spécialité médicale'
            }
          </div>
        </Button>
        {selectedFile && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Spécialité sélectionnée : <span className="font-semibold text-blue-600 dark:text-blue-400">
              {quizFiles.find(f => f.id === selectedFile)?.name}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}