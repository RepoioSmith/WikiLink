import { ipcMain, dialog, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { dbService } from '../services/DatabaseService';
import { fileService } from '../services/FileService';

// Variable para guardar en memoria qué carpeta está abierta actualmente
let currentVaultPath: string | null = null;

export function registerHandlers() {
  
  // --- ABRIR BÓVEDA ---
  ipcMain.handle('dialog:openVault', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'] // Solo permitir seleccionar carpetas
    });

    if (canceled || filePaths.length === 0) {
      return { success: false };
    }

    const vaultPath = filePaths[0];
    currentVaultPath = vaultPath;

    // 1. Inicializar la DB en esta carpeta
    try {
      dbService.init(vaultPath);
    } catch (e) {
      console.error("Error iniciando DB:", e);
      return { success: false, error: 'Error de base de datos' };
    }

    // 2. Escanear archivos
    const files = fileService.scanVault(vaultPath);

    return { 
      success: true, 
      path: vaultPath,
      files: files 
    };
  });

  // --- GUARDAR CONTENIDO (Actualizado) ---
  ipcMain.handle('app:saveFile', async (event, relativePath: string, content: string) => {
    if (!currentVaultPath) return { success: false, error: 'No hay vault abierto' };

    const fullPath = path.join(currentVaultPath, relativePath);
    
    try {
      fs.writeFileSync(fullPath, content);
      // OJO: Aquí más adelante avisaremos a la DB que el archivo cambió
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  });
}