import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

// Function to extract year from filename
function extractYearFromFilename(filename: string): string | null {
  // Match pattern like "(Février 2025)" and extract the year part
  const match = filename.match(/\(([^)]+)\)/);
  if (match) {
    // Return the full content inside parentheses (e.g., "Février 2025")
    return match[1];
  }
  return null;
}

// Function to clean filename by removing parentheses
function cleanFilename(filename: string): string {
  return filename.replace(/\s*\([^)]*\)\s*/, '').replace('.json', '');
}

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
        const fileStats = await stat(filePath);
        
        // Extract year from filename instead of loading JSON content
        const year = extractYearFromFilename(filename);
        const years = year ? [year] : [];
        
        // Use cleaned filename as title since we're not loading JSON
        const title = cleanFilename(filename);
        const description = year ? `Fichier de questions - ${year}` : 'Fichier de questions';
        const category = 'Général';
        
        return {
          id: filename.replace('.json', ''),
          name: title,
          filename: filename.replace('.json', ''),
          description: description,
          questionCount: 0, // Unknown until file is loaded
          category: category,
          years: years,
          fileSize: fileStats.size
        };
      } catch (error) {
        console.error(`Error processing file ${filename}:`, error);
        return {
          id: filename.replace('.json', ''),
          name: cleanFilename(filename),
          filename: filename.replace('.json', ''),
          description: 'Fichier de questions (erreur de lecture)',
          questionCount: 0,
          category: 'Inconnu',
          years: [],
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