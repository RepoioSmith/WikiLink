import { useState } from 'react';

interface ElectronAPI {
  saveContent: (content: string) => Promise<{ success: boolean; filePath?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

function App() {
  const [status, setStatus] = useState('Listo para trabajar');

  const handleSave = async () => {
    setStatus('Guardando...');
    
    // Llamamos a la función segura que creamos en el preload
    const result = await window.electronAPI.saveContent('# Hola WikiLink! \nEste archivo fue creado desde React.');
    
    if (result.success) {
      setStatus(`¡Guardado exitosamente en: ${result.filePath}!`);
    } else {
      setStatus('Guardado cancelado.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>WikiLink Base</h1>
      <p>Estado: <strong>{status}</strong></p>
      
      <button 
        onClick={handleSave}
        style={{ padding: '10px 20px', fontSize: '1.2em', cursor: 'pointer' }}
      >
        💾 Probar Guardado de Archivo
      </button>
    </div>
  );
}

export default App;