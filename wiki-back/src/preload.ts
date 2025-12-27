import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Abrir carpeta (devuelve el árbol de archivos)
  openVault: () => ipcRenderer.invoke('dialog:openVault'),
  
  // Guardar archivo específico (path relativo + contenido)
  saveFile: (path: string, content: string) => ipcRenderer.invoke('app:saveFile', path, content)
});