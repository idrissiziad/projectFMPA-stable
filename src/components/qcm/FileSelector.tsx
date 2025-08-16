'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuizFile, getAvailableQuizFiles, getAvailableYears, getFilesByYear, searchFiles } from '@/data/quiz-loader';
import { Heart, Stethoscope, Brain, Activity, Pill, Microscope, FileText, Code, Database, Globe, Shield, Network, User, GraduationCap, Hospital, Search, Calendar } from 'lucide-react';

interface FileSelectorProps {
  onFileSelect: (fileId: string, year?: string) => void;
}

export function FileSelector({ onFileSelect }: FileSelectorProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [quizFiles, setQuizFiles] = useState<QuizFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('Component mounted');

  console.log('FileSelector component rendered - loading:', loading, 'quizFiles length:', quizFiles.length);

  useEffect(() => {
    console.log('useEffect triggered');
    setDebugInfo('useEffect started');
    
    const loadData = async () => {
      console.log('Loading data...');
      setDebugInfo('Starting to load data');
      setLoading(true);
      try {
        // Load all available files initially
        console.log('Calling getAvailableQuizFiles...');
        setDebugInfo('Calling files API');
        const files = await getAvailableQuizFiles();
        console.log('Files response:', files);
        console.log('Files response type:', typeof files);
        console.log('Files response isArray:', Array.isArray(files));
        
        if (Array.isArray(files) && files.length > 0) {
          console.log('Setting quizFiles with', files.length, 'items');
          console.log('Files sample:', files[0]);
          setQuizFiles(files);
          setDebugInfo(`Loaded ${files.length} files`);
          console.log('quizFiles state updated');
        } else {
          console.error('Files response is empty or not an array:', files);
          setQuizFiles([]);
          setDebugInfo('Error: No files found or invalid response');
        }
        
        // Now load years separately
        console.log('Calling getAvailableYears...');
        setDebugInfo('Calling years API');
        try {
          const years = await getAvailableYears();
          console.log('Years response:', years);
          console.log('Years response type:', typeof years);
          console.log('Years response isArray:', Array.isArray(years));
          
          if (Array.isArray(years)) {
            console.log('Setting availableYears with', years.length, 'items');
            setAvailableYears(years);
            setDebugInfo(`Loaded ${files.length} files and ${years.length} years`);
          } else {
            console.error('Years response is not an array:', years);
            setAvailableYears([]);
            setDebugInfo(`Loaded ${files.length} files but years response is not an array`);
          }
        } catch (yearsError) {
          console.error('Error loading years:', yearsError);
          // Continue with empty years array
          setAvailableYears([]);
          setDebugInfo(`Loaded ${files.length} files but years API failed`);
        }
        
        setInitialLoad(false);
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty arrays to ensure UI renders
        setQuizFiles([]);
        setAvailableYears([]);
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Safety timeout to ensure loading state is cleared
    const timeoutId = setTimeout(() => {
      console.log('Safety timeout triggered, forcing loading state to false');
      setLoading(false);
      setInitialLoad(false);
    }, 10000); // Increased timeout to 10 seconds

    return () => clearTimeout(timeoutId);
  }, []);

  // Handle year selection change - only after initial load
  useEffect(() => {
    if (initialLoad) return;
    
    const handleYearChange = async () => {
      console.log('Year changed to:', selectedYear);
      try {
        if (selectedYear === 'all') {
          // Load all files when "all years" is selected
          const files = await getAvailableQuizFiles();
          setQuizFiles(files);
        } else {
          // Load files for specific year
          const files = await getFilesByYear(selectedYear);
          setQuizFiles(files);
        }
      } catch (error) {
        console.error('Error handling year change:', error);
      }
    };

    handleYearChange();
  }, [selectedYear, initialLoad]);

  // Handle search - only after initial load and when search term changes
  useEffect(() => {
    if (initialLoad) return;
    
    const handleSearch = async () => {
      console.log('Search term changed:', searchTerm);
      try {
        if (searchTerm.trim() === '') {
          // Reset to current year filter when search is empty
          if (selectedYear === 'all') {
            const files = await getAvailableQuizFiles();
            setQuizFiles(files);
          } else {
            const files = await getFilesByYear(selectedYear);
            setQuizFiles(files);
          }
        } else {
          // Search across all files
          const searchResults = await searchFiles(searchTerm);
          // If a year is selected, filter search results by that year
          const filteredResults = selectedYear === 'all' 
            ? searchResults 
            : searchResults.filter(file => file.years.includes(selectedYear));
          setQuizFiles(filteredResults);
        }
      } catch (error) {
        console.error('Error handling search:', error);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedYear, initialLoad]);

  const handleFileSelect = (fileId: string) => {
    setSelectedFile(fileId);
  };

  const handleStartQuiz = () => {
    if (selectedFile) {
      const yearToPass = selectedYear === 'all' ? undefined : selectedYear;
      onFileSelect(selectedFile, yearToPass);
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
      <div className="container mx-auto p-4 text-center min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Chargement des fichiers disponibles...</p>
        </div>
      </div>
    );
  }

  // Debug: Add state display
  console.log('Current state:', {
    loading,
    quizFiles: quizFiles.length,
    availableYears: availableYears.length,
    selectedYear,
    searchTerm,
    initialLoad,
    quizFilesData: quizFiles
  });

  // If we're not loading and have no files, show a message
  if (!loading && quizFiles.length === 0) {
    console.log('No files found, showing error message');
    return (
      <div className="container mx-auto p-4 text-center min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4">Aucun fichier trouvé</h2>
            <p className="text-yellow-600 dark:text-yellow-300 mb-4">
              Aucun fichier de questions n'est disponible pour le moment.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering file grid with', quizFiles.length, 'files');

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="text-center mb-12" style={{ width: '100%', overflow: 'visible' }}>
        <div className="mb-6" style={{ width: '100%', overflow: 'visible' }}>
          <div className="flex items-center justify-center" style={{ width: '100%', overflow: 'visible' }}>
            <div className="text-center" style={{ width: '100%', overflow: 'visible' }}>
              <div className="flex items-center justify-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 px-4 tracking-wide" style={{ fontFamily: 'Arial, Helvetica, sans-serif', display: 'inline-block', overflow: 'visible', letterSpacing: '0.02em', lineHeight: '1.2', textDecoration: 'none', textShadow: 'none' }}>
                  ProjectFMPA
                </h1>
                <Stethoscope className="h-12 w-12 text-emerald-600 ml-1" />
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-3">
                Excellence Médicale - Réussite Assurée
              </p>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
          Plateforme d'entraînement médicale aux QCM
        </p>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
          Préparez-vous efficacement aux examens de faculté de médecine avec notre système de questions à choix multiples
        </p>
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-xl p-6 max-w-3xl mx-auto shadow-lg">
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

      {/* Search and Filter Section */}
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Rechercher un fichier
            </label>
            <Input
              type="text"
              placeholder="Rechercher par nom, catégorie ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Year Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Filtrer par année
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les années</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(searchTerm || selectedYear !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filtres actifs :</span>
              {searchTerm && (
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  Recherche: "{searchTerm}"
                </Badge>
              )}
              {selectedYear !== 'all' && (
                <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  {selectedYear}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedYear('all');
                }}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Effacer tout
              </Button>
            </div>
          </div>
        )}
        
        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {quizFiles.length} fichier(s) trouvé(s)
          {selectedYear !== 'all' && ` pour ${selectedYear}`}
          {searchTerm && ` correspondant à "${searchTerm}"`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quizFiles.map((file) => (
          <Card
            key={file.id}
            className={`cursor-pointer transition-all hover:shadow-xl border-2 backdrop-blur-sm ${
              selectedFile === file.id
                ? 'border-blue-500 bg-white/98 dark:bg-slate-800/98 shadow-lg'
                : 'bg-white/95 dark:bg-slate-800/95 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white/98 dark:hover:bg-slate-800/98'
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Années :</span>
                  <div className="flex gap-1">
                    {file.years.length > 0 ? (
                      file.years.slice(0, 3).map(year => (
                        <Badge key={year} variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-600 text-xs">
                          {year}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs">
                        N/A
                      </Badge>
                    )}
                    {file.years.length > 3 && (
                      <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-600 text-xs">
                        +{file.years.length - 3}
                      </Badge>
                    )}
                  </div>
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