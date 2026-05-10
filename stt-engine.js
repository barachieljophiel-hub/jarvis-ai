import { logEvent } from '../main.js';

export async function initializeSTT() {
  logEvent('Module STT initialisé', 'init');
}

export async function listenForCommand() {
  try {
    // À implémenter avec une bibliothèque STT
    // Pour l'instant, retourner une chaîne vide
    logEvent('Écoute vocale activée', 'voice');
    return '';
  } catch (err) {
    logEvent(`Erreur STT: ${err.message}`, 'error');
    return '';
  }
}