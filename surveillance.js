import robot from 'robotjs';
import { logEvent } from '../main.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isMonitoring = false;

export async function initializeSurveillance() {
  logEvent('Surveillance système initialisée', 'surveillance');
  isMonitoring = true;
  
  startMonitoring();
}

function startMonitoring() {
  setInterval(async () => {
    try {
      const screenSize = robot.getScreenSize();
      const mousePos = robot.getMousePos();
      
      const systemState = {
        timestamp: new Date().toISOString(),
        screen: screenSize,
        mouse: mousePos,
        activeWindow: getActiveWindow()
      };

      // Enregistrer l'état du système
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(tempDir, 'system-state.json'),
        JSON.stringify(systemState, null, 2)
      );

    } catch (err) {
      logEvent(`Erreur de surveillance: ${err.message}`, 'error');
    }
  }, 5000); // Vérifier toutes les 5 secondes
}

function getActiveWindow() {
  try {
    // Simulation - à adapter selon votre OS
    return 'Active Window Info';
  } catch (err) {
    return 'Impossible de récupérer';
  }
}

export function moveMouse(x, y) {
  try {
    robot.moveMouse(x, y);
    logEvent(`Souris déplacée vers (${x}, ${y})`, 'action');
  } catch (err) {
    logEvent(`Erreur déplacement souris: ${err.message}`, 'error');
  }
}

export function clickMouse(button = 'left') {
  try {
    robot.click(button);
    logEvent(`Clic souris: ${button}`, 'action');
  } catch (err) {
    logEvent(`Erreur clic souris: ${err.message}`, 'error');
  }
}

export function typeText(text) {
  try {
    robot.typeString(text);
    logEvent(`Texte saisi: ${text}`, 'action');
  } catch (err) {
    logEvent(`Erreur saisie texte: ${err.message}`, 'error');
  }
}

export function pressKey(key) {
  try {
    robot.keyTap(key);
    logEvent(`Touche pressée: ${key}`, 'action');
  } catch (err) {
    logEvent(`Erreur touche: ${err.message}`, 'error');
  }
}