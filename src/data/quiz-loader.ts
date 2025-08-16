export interface QuizFile {
  id: string;
  name: string;
  filename: string;
  description: string;
  questionCount: number;
  category: string;
  fileSize: number;
  years: string[]; // Add years array
}

export async function getAvailableQuizFiles(): Promise<QuizFile[]> {
  try {
    console.log('Fetching from /api/files...');
    const response = await fetch('/api/files');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Impossible de récupérer la liste des fichiers: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data.files || [];
  } catch (error) {
    console.error('Error in getAvailableQuizFiles:', error);
    return [];
  }
}

export async function getAvailableYears(): Promise<string[]> {
  try {
    console.log('Fetching from /api/years...');
    const response = await fetch('/api/years');
    console.log('Years response status:', response.status);
    console.log('Years response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Years error response:', errorText);
      throw new Error(`Impossible de récupérer les années disponibles: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Years response data:', data);
    return data.years || [];
  } catch (error) {
    console.error('Error in getAvailableYears:', error);
    return [];
  }
}

export async function getFilesByYear(year: string): Promise<QuizFile[]> {
  try {
    const response = await fetch(`/api/files-by-year/${encodeURIComponent(year)}`);
    if (!response.ok) {
      throw new Error(`Impossible de récupérer les fichiers pour l'année ${year}`);
    }
    
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error(`Error loading files for year ${year}:`, error);
    return [];
  }
}

export async function searchFiles(query: string): Promise<QuizFile[]> {
  try {
    const response = await fetch(`/api/search-files/${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Impossible de rechercher les fichiers');
    }
    
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error searching files:', error);
    return [];
  }
}

export async function loadQuizQuestions(filename: string, year?: string): Promise<any[]> {
  try {
    const url = year ? `/api/quiz/${filename}?year=${year}` : `/api/quiz/${filename}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Impossible de charger les questions depuis ${filename}`);
    }
    
    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error(`Error loading questions from ${filename}:`, error);
    throw new Error(`Impossible de charger les questions depuis ${filename}`);
  }
}