import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const dataDir = join(process.cwd(), 'src', 'data');
    
    // Read all files in the data directory
    const files = await readdir(dataDir);
    
    // Filter for JSON files and exclude TypeScript files
    const jsonFiles = files.filter(file => 
      file.endsWith('.json') && !file.endsWith('.ts')
    );
    
    // Get file info for each JSON file, filtering by year
    const fileInfoPromises = jsonFiles.map(async (filename) => {
      try {
        const filePath = join(dataDir, filename);
        const content = await readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        
        // Check if this file contains questions from the specified year
        let hasYearQuestions = false;
        let years: string[] = [];
        
        if (Array.isArray(data)) {
          // Extract unique years from all questions
          years = [...new Set(data.map((q: any) => q.YearAsked).filter(Boolean))];
          hasYearQuestions = years.includes(year);
        }
        
        if (!hasYearQuestions) {
          return null; // Skip files that don't contain the specified year
        }
        
        // If it's an array, get the count
        const questionCount = Array.isArray(data) ? data.length : 0;
        
        // Get first question to extract metadata if available
        let title = filename.replace('.json', '');
        let description = `Fichier de questions - Année ${year}`;
        let category = 'Général';
        
        if (Array.isArray(data) && data.length > 0) {
          const firstQuestion = data[0];
          if (firstQuestion.Category || firstQuestion.category) {
            category = firstQuestion.Category || firstQuestion.category;
          }
          if (firstQuestion.Topic || firstQuestion.topic) {
            title = firstQuestion.Topic || firstQuestion.topic;
          }
          
          // Count questions specifically for this year
          const yearQuestions = data.filter((q: any) => q.YearAsked === year);
          description = `${yearQuestions.length} questions pour l'année ${year}`;
        }
        
        return {
          id: filename.replace('.json', ''),
          name: title,
          filename: filename.replace('.json', ''),
          description: description,
          questionCount: questionCount,
          category: category,
          years: years,
          fileSize: Buffer.byteLength(content, 'utf8')
        };
      } catch (error) {
        console.error(`Error reading file ${filename}:`, error);
        return null;
      }
    });
    
    const filesInfo = await Promise.all(fileInfoPromises);
    
    // Filter out null values (files that don't contain the specified year)
    const filteredFiles = filesInfo.filter(file => file !== null);
    
    return NextResponse.json({ files: filteredFiles });
  } catch (error) {
    console.error(`Error getting files for year ${year}:`, error);
    return NextResponse.json(
      { error: `Impossible de récupérer les fichiers pour l'année ${year}` },
      { status: 500 }
    );
  }
}