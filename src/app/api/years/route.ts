import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
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

export async function GET(request: NextRequest) {
  try {
    const dataDir = join(process.cwd(), 'src', 'data');
    
    // Read all files in the data directory
    const files = await readdir(dataDir);
    
    // Filter for JSON files and exclude TypeScript files
    const jsonFiles = files.filter(file =>
      file.endsWith('.json') && !file.endsWith('.ts')
    );
    
    // Collect all unique years from filenames
    const allYears = new Set<string>();
    
    for (const filename of jsonFiles) {
      try {
        const year = extractYearFromFilename(filename);
        if (year) {
          allYears.add(year);
        }
      } catch (error) {
        console.error(`Error processing filename ${filename}:`, error);
      }
    }
    
    // Convert to array and sort
    const yearsArray = Array.from(allYears).sort((a, b) => {
      // Try to extract numeric year for sorting
      const aMatch = a.match(/(\d{4})/);
      const bMatch = b.match(/(\d{4})/);
      
      if (aMatch && bMatch) {
        const aNum = parseInt(aMatch[1]);
        const bNum = parseInt(bMatch[1]);
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