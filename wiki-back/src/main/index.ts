import { registerHandlers } from './ipcHandlers';
import { app, BrowserWindow } from 'electron';

// Estas constantes las genera el sistema de build.
// El PRELOAD es vital para la seguridad, así que lo mantenemos.
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  registerHandlers();

  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      // Aquí conectamos el puente de seguridad
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // NUEVO: Por seguridad, mantenemos esto así.
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // --- CAMBIO CLAVE AQUÍ ---
  // Verificamos si la app NO está empaquetada (es decir, estamos en modo desarrollo)
  if (!app.isPackaged) {
    // Modo Desarrollo: Cargamos el servidor de Vite
    mainWindow.loadURL('http://localhost:5173');
    // Abrimos las herramientas de desarrollador automáticamente para ayudarte
    mainWindow.webContents.openDevTools();
    console.log("--> Cargando desde VITE (Frontend)");
  } else {
    // Modo Producción: Cuando crees el instalador .exe, usará los archivos compilados
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});