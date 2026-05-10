import { logEvent } from '../main.js';

export async function initializeAI() {
  logEvent('Processeur IA initialisé (Mode Local)', 'init');
}

export async function processWithAI(prompt) {
  try {
    // Utiliser un modèle local ou une simulation
    const response = await localAIProcessing(prompt);
    logEvent(`IA traitement: ${prompt}`, 'ai');
    return response;
  } catch (err) {
    logEvent(`Erreur IA: ${err.message}`, 'error');
    return `Erreur: ${err.message}`;
  }
}

async function localAIProcessing(prompt) {
  // Logique simple de traitement sans API externe
  const keywords = {
    'ouvrir': 'Ouverture d\'une application',
    'fermer': 'Fermeture d\'une application',
    'écrire': 'Écriture de fichier',
    'lire': 'Lecture de fichier',
    'analyser': 'Analyse de document',
    'organiser': 'Classement de fichiers'
  };

  for (const [key, value] of Object.entries(keywords)) {
    if (prompt.toLowerCase().includes(key)) {
      return {
        intent: value,
        confidence: 0.85,
        command: extractCommand(prompt)
      };
    }
  }

  return {
    intent: 'Commande inconnue',
    confidence: 0.2,
    command: prompt
  };
}

function extractCommand(prompt) {
  return prompt.split(' ').slice(1).join(' ');
}