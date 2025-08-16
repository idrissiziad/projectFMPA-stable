import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ query: string }> }
) {
  try {
    const { query } = await params;
    const decodedQuery = decodeURIComponent(query.toLowerCase());
    const dataDir = join(process.cwd(), 'src', 'data');
    
    // Read all files in the data directory
    const files = await readdir(dataDir);
    
    // Filter for JSON files and exclude TypeScript files
    const jsonFiles = files.filter(file => 
      file.endsWith('.json') && !file.endsWith('.ts')
    );
    
    // Get file info for each JSON file
    const fileInfoPromises = jsonFiles.map(async (filename) => {
      try {
        const filePath = join(dataDir, filename);
        const content = await readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        
        // If it's an array, get the count
        const questionCount = Array.isArray(data) ? data.length : 0;
        
        // Get first question to extract metadata if available
        let title = filename.replace('.json', '');
        let description = 'Fichier de questions';
        let category = 'Général';
        let years: string[] = [];
        let matchScore = 0;
        
        if (Array.isArray(data) && data.length > 0) {
          const firstQuestion = data[0];
          if (firstQuestion.Category || firstQuestion.category) {
            category = firstQuestion.Category || firstQuestion.category;
          }
          if (firstQuestion.Topic || firstQuestion.topic) {
            title = firstQuestion.Topic || firstQuestion.topic;
          }
          
          // Extract unique years from all questions
          years = [...new Set(data.map((q: any) => q.YearAsked).filter(Boolean))];
          
          // Calculate match score based on search query
          const searchableText = [
            title.toLowerCase(),
            category.toLowerCase(),
            filename.toLowerCase(),
            description.toLowerCase(),
            ...years.map(year => year.toLowerCase()),
            ...data.map((q: any) => [
              q.QuestionText?.toLowerCase() || '',
              q.Subtopic?.toLowerCase() || '',
              q.Choice_A_Text?.toLowerCase() || '',
              q.Choice_B_Text?.toLowerCase() || '',
              q.Choice_C_Text?.toLowerCase() || '',
              q.Choice_D_Text?.toLowerCase() || '',
              q.Choice_E_Text?.toLowerCase() || ''
            ]).flat()
          ].join(' ');
          
          // Count occurrences of query terms
          const queryTerms = decodedQuery.split(' ');
          queryTerms.forEach(term => {
            const regex = new RegExp(term, 'gi');
            const matches = searchableText.match(regex);
            if (matches) {
              matchScore += matches.length;
            }
          });
        }
        
        // Only return files that match the search query
        if (matchScore === 0) {
          return null;
        }
        
        return {
          id: filename.replace('.json', ''),
          name: title,
          filename: filename.replace('.json', ''),
          description: description,
          questionCount: questionCount,
          category: category,
          years: years,
          fileSize: Buffer.byteLength(content, 'utf8'),
          matchScore: matchScore
        };
      } catch (error) {
        console.error(`Error reading file ${filename}:`, error);
        return null;
      }
    });
    
    const filesInfo = await Promise.all(fileInfoPromises);
    
    // Filter out null values (files that don't match the search)
    const matchedFiles = filesInfo.filter(file => file !== null);
    
    // Sort by match score (highest first)
    matchedFiles.sort((a: any, b: any) => b.matchScore - a.matchScore);
    
    return NextResponse.json({ files: matchedFiles });
  } catch (error) {
    console.error(`Error searching files for query ${query}:`, error);
    return NextResponse.json(
      { error: 'Impossible de rechercher les fichiers' },
      { status: 500 }
    );
  }
}