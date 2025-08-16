import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const { searchParams } = new URL(request.url);
    const yearFilter = searchParams.get('year');
    
    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Nom de fichier invalide' },
        { status: 400 }
      );
    }
    
    const filePath = join(process.cwd(), 'src', 'data', `${filename}.json`);
    
    try {
      const content = await readFile(filePath, 'utf-8');
      let data = JSON.parse(content);
      
      // Filter by year if specified
      if (yearFilter && Array.isArray(data)) {
        data = data.filter((question: any) => question.YearAsked === yearFilter);
      }
      
      return NextResponse.json({ 
        questions: data,
        filteredByYear: yearFilter || null,
        totalQuestions: Array.isArray(JSON.parse(content)) ? JSON.parse(content).length : data.length,
        filteredQuestions: data.length
      });
    } catch (fileError) {
      return NextResponse.json(
        { error: `Fichier ${filename}.json non trouvé` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error loading quiz ${filename}:`, error);
    return NextResponse.json(
      { error: 'Impossible de charger le fichier de questions' },
      { status: 500 }
    );
  }
}