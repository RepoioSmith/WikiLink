import { ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export function registerHandlers() {
  
  // Escuchamos el evento 'saveContent'
  ipcMain.handle('dialog:saveContent', async (event, content: string) => {
    
    // Por ahora, abriremos un cuadro de diálogo para probar que funciona
    const { canceled, filePath } = await dialog.showSaveDialog({
      filters: [{ name: 'Markdown', extensions: ['md'] }]
    });

    if (canceled || !filePath) {
      return { success: false };
    }

    // Escribimos el archivo en el disco
    fs.writeFileSync(filePath, content);
    console.log(`Archivo guardado en: ${filePath}`);
    
    return { success: true, filePath };
  });
}