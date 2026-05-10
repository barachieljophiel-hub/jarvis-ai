import { initializeSurveillance } from './core/surveillance.js';
import { initializeVoice } from './voice/tts-engine.js';
import { initializeAI } from './brain/ai-processor.js';
import { startTaskInterpreter } from './brain/task-interpreter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🤖 JARVIS - Assistant Autonome en démarrage...\n');

// Initialiser les logs
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'jarvis-logs.json');
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, JSON.stringify([], null, 2));
}

// Fonction pour enregistrer les logs
export function logEvent(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, type, message };
  
  try {
    const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    console.log(`[${type.toUpperCase()}] ${message}`);
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement du log:', err);
  }
}

// Lancer tous les modules
async function startJARVIS() {
  try {
    logEvent('Initialisation de la surveillance système...', 'init');
    await initializeSurveillance();

    logEvent('Initialisation du moteur vocal...', 'init');
    await initializeVoice();

    logEvent('Initialisation de l\'IA...', 'init');
    await initializeAI();

    logEvent('Démarrage de l\'interpréteur de tâches...', 'init');
    await startTaskInterpreter();

    console.log('\n✅ JARVIS est maintenant actif et en écoute!\n');
    logEvent('JARVIS totalement opérationnel', 'success');

  } catch (err) {
    logEvent(`Erreur critique au démarrage: ${err.message}`, 'error');
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

startJARVIS();