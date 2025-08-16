export interface QuizFile {
  id: string;
  name: string;
  filename: string;
  description: string;
  questionCount: number;
  category: string;
  fileSize: number;
}

export async function getAvailableQuizFiles(): Promise<QuizFile[]> {
  try {
    const response = await fetch('/api/files');
    if (!response.ok) {
      throw new Error('Impossible de récupérer la liste des fichiers');
    }
    
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error loading quiz files:', error);
    return [];
  }
}

export async function loadQuizQuestions(filename: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/quiz/${filename}`);
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