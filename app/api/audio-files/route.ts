import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * API route that returns a list of MP3 files for a given company
 * Works by scanning the public/audio/[company] directory at runtime
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const companyId = request.nextUrl.searchParams.get('company');
    const modelId = request.nextUrl.searchParams.get('model') || '';
    
    // Validate company ID to prevent path traversal
    if (!companyId || companyId.includes('..') || companyId.includes('/')) {
      return NextResponse.json({ error: 'Invalid company ID' }, { status: 400 });
    }
    
    // Special case for Google DeepMind
    if (companyId === 'google-deepmind') {
      const audioDir = path.join(process.cwd(), 'public', 'audio', 'google-deepmind');
      
      if (fs.existsSync(audioDir)) {
        // List all files in the Google DeepMind directory
        const files = fs.readdirSync(audioDir)
          .filter(file => file.endsWith('.mp3'))
          .map(file => {
            return {
              filename: file,
              path: `/audio/google-deepmind/${file}`,
              displayName: file
                .replace(/\.mp3$/, '')
                .replace(/[-_]/g, ' ')
                .replace(/(UK|US|DJ)/g, (m) => m.toUpperCase())
                .split(' ')
                .map(word => {
                  if (word.toUpperCase() === word && word.length > 1) return word;
                  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                })
                .join(' ')
            };
          });
                   
        return NextResponse.json({ files });
      }
    }
    
    // Path to the audio directory for this company
    const audioDir = path.join(process.cwd(), 'public', 'audio', companyId);
    
    // Check if the directory exists
    if (!fs.existsSync(audioDir)) {
      // Try alternative company ID formats
      // Sometimes IDs like "google-deepmind" might be stored as "googledeepmind" or "google_deepmind"
      const alternativeFormats = [
        companyId.replace(/-/g, ''),     // Remove hyphens
        companyId.replace(/-/g, '_'),    // Replace hyphens with underscores
        companyId.replace(/_/g, '-'),    // Replace underscores with hyphens
        companyId.toLowerCase(),         // Lowercase
        companyId.replace(/\s+/g, '-')   // Replace spaces with hyphens
      ];
      
      // Try each alternative format
      for (const altFormat of alternativeFormats) {
        if (altFormat === companyId) continue; // Skip if same as original
        
        const altDir = path.join(process.cwd(), 'public', 'audio', altFormat);
        
        if (fs.existsSync(altDir)) {
          // Use this directory instead
          return NextResponse.json({ 
            files: fs.readdirSync(altDir)
              .filter(file => file.endsWith('.mp3'))
              .map(file => {
                return {
                  filename: file,
                  path: `/audio/${altFormat}/${file}`,
                  displayName: file
                    .replace(/\.mp3$/, '')
                    .replace(/[-_]/g, ' ')
                    .replace(/(UK|US|DJ)/g, (m) => m.toUpperCase())
                    .split(' ')
                    .map(word => {
                      if (word.toUpperCase() === word && word.length > 1) return word;
                      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    })
                    .join(' ')
                };
              })
          });
        }
      }
      
      // If no alternatives found, return empty list
      return NextResponse.json({ files: [] });
    }
    
    // Read the directory and filter for MP3 files
    const files = fs.readdirSync(audioDir)
      .filter(file => file.endsWith('.mp3'))
      .map(file => {
        return {
          filename: file,
          path: `/audio/${companyId}/${file}`,
          displayName: file
            .replace(/\.mp3$/, '')                           // Remove file extension
            .replace(/[-_]/g, ' ')                           // Replace dashes and underscores with spaces
            .replace(/(UK|US|DJ)/g, (m) => m.toUpperCase())  // Keep acronyms uppercase
            .split(' ')
            .map(word => {
              // Skip capitalizing acronyms which are already uppercase
              if (word.toUpperCase() === word && word.length > 1) return word;
              // Capitalize first letter of each word
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ')
        };
      });
    
    // Return the list of files
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error reading audio files:', error);
    return NextResponse.json({ error: 'Failed to read audio files' }, { status: 500 });
  }
}