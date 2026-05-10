import { logEvent } from '../main.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function openApplication(appName) {
  try {
    let command = '';
    const platform = process.platform;

    if (platform === 'win32') {
      const apps = {
        'vscode': 'code',
        'vs code': 'code',
        'chrome': 'chrome',
        'firefox': 'firefox',
        'notepad': 'notepad',
        'explorer': 'explorer'
      };
      command = apps[appName.toLowerCase()] || appName;
      execSync(`start ${command}`, { detached: true });
    } else if (platform === 'darwin') {
      command = `open -a ${appName}`;
      execSync(command);
    } else {
      command = `${appName} &`;
      execSync(command);
    }

    logEvent(`Application ouverte: ${appName}`, 'action');
  } catch (err) {
    logEvent(`Erreur ouverture app: ${err.message}`, 'error');
  }
}

export async function closeApplication(appName) {
  try {
    const platform = process.platform;

    if (platform === 'win32') {
      execSync(`taskkill /IM ${appName}.exe /F`);
    } else if (platform === 'darwin') {
      execSync(`pkill -9 ${appName}`);
    } else {
      execSync(`pkill -9 ${appName}`);
    }

    logEvent(`Application fermée: ${appName}`, 'action');
  } catch (err) {
    logEvent(`Erreur fermeture app: ${err.message}`, 'error');
  }
}

export async function listFiles(directory) {
  try {
    const files = fs.readdirSync(directory);
    logEvent(`Fichiers listés dans ${directory}`, 'action');
    return files;
  } catch (err) {
    logEvent(`Erreur listage fichiers: ${err.message}`, 'error');
    return [];
  }
}

export async function createFolder(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      logEvent(`Dossier créé: ${folderPath}`, 'action');
    }
  } catch (err) {
    logEvent(`Erreur création dossier: ${err.message}`, 'error');
  }
}

export async function classifyAndOrganizeFiles(sourceDir) {
  try {
    const files = fs.readdirSync(sourceDir);
    const folders = {
      'Factures': ['pdf', 'doc', 'docx'],
      'Codes': ['js', 'py', 'java', 'html', 'css'],
      'Cours': ['pdf', 'pptx', 'mp4'],
      'Images': ['jpg', 'png', 'gif', 'bmp'],
      'Autres': []
    };

    for (const file of files) {
      const ext = path.extname(file).substring(1);
      let destination = 'Autres';

      for (const [folder, extensions] of Object.entries(folders)) {
        if (extensions.includes(ext)) {
          destination = folder;
          break;
        }
      }

      const destPath = path.join(sourceDir, destination);
      await createFolder(destPath);

      const sourcePath = path.join(sourceDir, file);
      if (fs.statSync(sourcePath).isFile()) {
        fs.renameSync(sourcePath, path.join(destPath, file));
        logEvent(`Fichier classé: ${file} → ${destination}`, 'action');
      }
    }
  } catch (err) {
    logEvent(`Erreur classement fichiers: ${err.message}`, 'error');
  }
}