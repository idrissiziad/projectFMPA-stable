import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
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
      const data = JSON.parse(content);
      
      return NextResponse.json({ questions: data });
    } catch (fileError) {
      return NextResponse.json(
        { error: `Fichier ${filename}.json non trouvé` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error loading quiz ${params.filename}:`, error);
    return NextResponse.json(
      { error: 'Impossible de charger le fichier de questions' },
      { status: 500 }
    );
  }
}