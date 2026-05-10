import { logEvent } from '../main.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function executeCommand(command) {
  try {
    const { stdout, stderr } = await execAsync(command);
    logEvent(`Commande exécutée: ${command}`, 'execution');
    return { success: true, output: stdout, error: stderr };
  } catch (err) {
    logEvent(`Erreur exécution: ${err.message}`, 'error');
    return { success: false, error: err.message };
  }
}

export async function executeScript(scriptPath) {
  try {
    const result = await executeCommand(`node ${scriptPath}`);
    logEvent(`Script exécuté: ${scriptPath}`, 'execution');
    return result;
  } catch (err) {
    logEvent(`Erreur script: ${err.message}`, 'error');
    return { success: false, error: err.message };
  }
}