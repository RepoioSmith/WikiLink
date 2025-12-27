export interface FileNode {
  name: string;
  path: string; // Ruta relativa (ej: "Notas/Idea.md")
  type: 'file' | 'folder';
  children?: FileNode[]; // Solo si es folder
}

export interface VaultResponse {
  success: boolean;
  path?: string;
  files?: FileNode[];
  error?: string;
}