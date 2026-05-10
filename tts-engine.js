import { logEvent } from '../main.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function initializeVoice() {
  logEvent('Moteur vocal initialisé', 'init');
}

export async function speakText(text) {
  try {
    const platform = process.platform;

    if (platform === 'win32') {
      // Windows - utiliser PowerShell
      const psCommand = `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('${text.replace(/'/g, "''")}')`;
      await execAsync(`powershell -Command "${psCommand}"`);
    } else if (platform === 'darwin') {
      // macOS - utiliser say
      await execAsync(`say "${text}"`);
    } else {
      // Linux - utiliser espeak
      await execAsync(`espeak "${text}"`);
    }

    logEvent(`TTS: ${text}`, 'voice');
    console.log(`🔊 JARVIS: ${text}`);
  } catch (err) {
    logEvent(`Erreur TTS: ${err.message}`, 'error');
    console.log(`🔊 JARVIS: ${text}`); // Afficher en texte en cas d'erreur
  }
}