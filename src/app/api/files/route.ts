import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
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
        
        if (Array.isArray(data) && data.length > 0) {
          const firstQuestion = data[0];
          if (firstQuestion.Category || firstQuestion.category) {
            category = firstQuestion.Category || firstQuestion.category;
          }
          if (firstQuestion.Topic || firstQuestion.topic) {
            title = firstQuestion.Topic || firstQuestion.topic;
          }
        }
        
        return {
          id: filename.replace('.json', ''),
          name: title,
          filename: filename.replace('.json', ''),
          description: description,
          questionCount: questionCount,
          category: category,
          fileSize: Buffer.byteLength(content, 'utf8')
        };
      } catch (error) {
        console.error(`Error reading file ${filename}:`, error);
        return {
          id: filename.replace('.json', ''),
          name: filename.replace('.json', ''),
          filename: filename.replace('.json', ''),
          description: 'Fichier de questions (erreur de lecture)',
          questionCount: 0,
          category: 'Inconnu',
          fileSize: 0
        };
      }
    });
    
    const filesInfo = await Promise.all(fileInfoPromises);
    
    return NextResponse.json({ files: filesInfo });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Impossible de lister les fichiers' },
      { status: 500 }
    );
  }
}