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
        // Extract year from filename instead of loading JSON content
        const fileYear = extractYearFromFilename(filename);
        
        // Check if this file matches the specified year
        if (!fileYear || fileYear !== year) {
          return null; // Skip files that don't match the specified year
        }
        
        const filePath = join(dataDir, filename);
        const fileStats = await stat(filePath);
        
        // Use cleaned filename as title since we're not loading JSON
        const title = cleanFilename(filename);
        const description = `Fichier de questions - ${year}`;
        const category = 'Général';
        
        return {
          id: filename.replace('.json', ''),
          name: title,
          filename: filename.replace('.json', ''),
          description: description,
          questionCount: 0, // Unknown until file is loaded
          category: category,
          years: [year], // Only the year we extracted from filename
          fileSize: fileStats.size
        };
      } catch (error) {
        console.error(`Error processing file ${filename}:`, error);
        return null;
      }
    });
    
    const filesInfo = await Promise.all(fileInfoPromises);
    
    // Filter out null values (files that don't contain the specified year)
    const filteredFiles = filesInfo.filter(file => file !== null);
    
    return NextResponse.json({ files: filteredFiles });
  } catch (error) {
    console.error(`Error getting files for year:`, error);
    return NextResponse.json(
      { error: 'Impossible de récupérer les fichiers pour l\'année spécifiée' },
      { status: 500 }
    );
  }
}