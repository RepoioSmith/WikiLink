import { useState } from 'react';
import type { FileNode, VaultResponse } from './types'; // Importamos nuestros tipos

// Declaración global para TS
declare global {
  interface Window {
    electronAPI: {
      openVault: () => Promise<VaultResponse>;
      saveFile: (path: string, content: string) => Promise<{ success: boolean }>;
    };
  }
}

// --- COMPONENTE RECURSIVO PARA EL ÁRBOL DE ARCHIVOS ---
const FileTreeItem = ({ node, onSelect }: { node: FileNode; onSelect: (path: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Si es carpeta, permitimos expandir/contraer
  if (node.type === 'folder') {
    return (
      <div style={{ marginLeft: '10px' }}>
        <div 
          onClick={() => setIsOpen(!isOpen)} 
          style={{ cursor: 'pointer', fontWeight: 'bold', padding: '2px 0' }}
        >
          {isOpen ? '📂' : '📁'} {node.name}
        </div>
        {isOpen && node.children && (
          <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '5px' }}>
            {node.children.map((child) => (
              <FileTreeItem key={child.path} node={child} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Si es archivo
  return (
    <div 
      onClick={() => onSelect(node.path)}
      style={{ marginLeft: '15px', cursor: 'pointer', padding: '2px 0', color: '#555' }}
      className="file-item" // Podremos estilizar esto con CSS luego
    >
      📄 {node.name}
    </div>
  );
};

// --- APP PRINCIPAL ---
function App() {
  const [vaultName, setVaultName] = useState<string | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const handleOpenVault = async () => {
    const result = await window.electronAPI.openVault();
    
    if (result.success && result.files && result.path) {
      setFiles(result.files);
      // Extraemos solo el nombre de la carpeta para mostrarlo
      const name = result.path.split(/[/\\]/).pop(); 
      setVaultName(name || 'Bóveda');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR (Izquierda) */}
      <div style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '10px', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: '20px' }}>
          {vaultName ? `📚 ${vaultName}` : 'WikiLink'}
        </h3>
        
        {!vaultName ? (
          <button 
            onClick={handleOpenVault}
            style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
          >
            Abrir Carpeta
          </button>
        ) : (
          <div>
            {files.map((node) => (
              <FileTreeItem key={node.path} node={node} onSelect={(path) => setActiveFile(path)} />
            ))}
          </div>
        )}
      </div>

      {/* EDITOR (Derecha) */}
      <div style={{ flex: 1, padding: '40px' }}>
        {activeFile ? (
          <div>
            <h1>Editando: {activeFile}</h1>
            <p>Aquí irá el editor de texto (CodeMirror o similar)...</p>
          </div>
        ) : (
          <div style={{ color: '#888', marginTop: '100px', textAlign: 'center' }}>
            Selecciona un archivo para empezar a escribir
          </div>
        )}
      </div>

    </div>
  );
}

export default App;