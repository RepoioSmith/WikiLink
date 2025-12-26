import { contextBridge, ipcRenderer } from 'electron';

// Aquí exponemos funciones seguras al Frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Función para guardar: React envía 'content', Electron devuelve confirmación
  saveContent: (content: string) => ipcRenderer.invoke('dialog:saveContent', content),
  
  // Aquí agregaremos más funciones en el futuro (ej. loadFiles, createFolder)
});