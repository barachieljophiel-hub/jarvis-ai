import { logEvent } from '../main.js';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import sharp from 'sharp';

export async function analyzePDF(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);

    const analysis = {
      pages: data.numpages,
      text: data.text.substring(0, 500), // Premiers 500 caractères
      keywords: extractKeywords(data.text),
      summary: generateSummary(data.text)
    };

    logEvent(`PDF analysé: ${filePath}`, 'cognitive');
    return analysis;
  } catch (err) {
    logEvent(`Erreur analyse PDF: ${err.message}`, 'error');
    return null;
  }
}

export async function extractTextFromImage(imagePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'fra');
    logEvent(`Image OCR: ${imagePath}`, 'cognitive');
    return text;
  } catch (err) {
    logEvent(`Erreur OCR: ${err.message}`, 'error');
    return '';
  }
}

function extractKeywords(text) {
  const words = text.split(/\s+/).filter(w => w.length > 5);
  return [...new Set(words)].slice(0, 10);
}

function generateSummary(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.length > 10);
  return sentences.slice(0, 3).join('. ');
}