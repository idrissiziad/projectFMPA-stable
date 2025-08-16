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
    
    // Collect all unique years from all files
    const allYears = new Set<string>();
    
    for (const filename of jsonFiles) {
      try {
        const filePath = join(dataDir, filename);
        const content = await readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        
        if (Array.isArray(data)) {
          // Extract years from all questions
          data.forEach((question: any) => {
            if (question.YearAsked) {
              allYears.add(question.YearAsked);
            }
          });
        }
      } catch (error) {
        console.error(`Error reading file ${filename}:`, error);
      }
    }
    
    // Convert to array and sort
    const yearsArray = Array.from(allYears).sort((a, b) => {
      // Sort numerically if possible, otherwise alphabetically
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return bNum - aNum; // Descending order for years
      }
      return a.localeCompare(b);
    });
    
    return NextResponse.json({ years: yearsArray });
  } catch (error) {
    console.error('Error getting available years:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer les années disponibles' },
      { status: 500 }
    );
  }
}