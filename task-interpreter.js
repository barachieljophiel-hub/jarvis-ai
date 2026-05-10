import { logEvent } from '../main.js';
import { moveMouse, clickMouse, typeText, pressKey } from '../core/surveillance.js';
import { openApplication, closeApplication, listFiles } from '../actions/file-manager.js';
import { executeCommand } from '../actions/system-executor.js';
import { speakText } from '../voice/tts-engine.js';
import { listenForCommand } from '../voice/stt-engine.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export async function startTaskInterpreter() {
  logEvent('Interpréteur de tâches actif', 'init');
  
  console.log('\n🎤 JARVIS vous écoute. Dites votre commande (ou tapez):');
  console.log('Exemples: "ouvrir vscode", "lire document.pdf", "organiser fichiers"\n');

  promptForCommand();
}

function promptForCommand() {
  rl.question('📝 Votre commande > ', async (input) => {
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quitter') {
      console.log('👋 JARVIS s\'arrête...');
      rl.close();
      process.exit(0);
    }

    await interpretAndExecute(input);
    promptForCommand();
  });
}

async function interpretAndExecute(command) {
  try {
    logEvent(`Commande reçue: ${command}`, 'command');

    // Analyse simple de la commande
    if (command.toLowerCase().includes('ouvrir')) {
      const app = extractAppName(command);
      await openApplication(app);
      await speakText(`Ouverture de ${app}`);
    } 
    else if (command.toLowerCase().includes('fermer')) {
      const app = extractAppName(command);
      await closeApplication(app);
      await speakText(`Fermeture de ${app}`);
    }
    else if (command.toLowerCase().includes('lire')) {
      const file = extractFileName(command);
      await speakText(`Lecture du fichier ${file}`);
      // À implémenter selon le type de fichier
    }
    else if (command.toLowerCase().includes('organiser')) {
      await speakText('Organisation des fichiers en cours');
      // À implémenter
    }
    else if (command.toLowerCase().includes('analyser')) {
      const file = extractFileName(command);
      await speakText(`Analyse du document ${file}`);
      // À implémenter
    }
    else {
      await speakText('Commande non reconnue');
    }

  } catch (err) {
    logEvent(`Erreur exécution commande: ${err.message}`, 'error');
    await speakText('Erreur lors de l\'exécution');
  }
}

function extractAppName(command) {
  const apps = ['vscode', 'vs code', 'chrome', 'firefox', 'notepad', 'word', 'excel', 'explorer'];
  for (const app of apps) {
    if (command.toLowerCase().includes(app)) return app;
  }
  return 'application';
}

function extractFileName(command) {
  const parts = command.split(' ');
  return parts[parts.length - 1] || 'fichier';
}