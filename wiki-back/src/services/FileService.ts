import * as fs from 'fs';
import * as path from 'path';

export interface FileNode{
    name:string;
    path:string;
    type: 'file' | 'folder';
    children?: FileNode[];
}

export class FileService{
    /**
     * Escanea una carpeta recursivamente y devuelve el árbol de archivos.
     * Ignora carpetas ocultas (que empiezan con .)
     */
    public scanVault(vaultPath: string): FileNode[]{
        try{
            return this.readDirRecursive(vaultPath, vaultPath);
        } catch (error){
            console.error("Error escaneando vault:", error);
            return [];
        }
    }

    private readDirRecursive(currentPath: string, rootPath: string): FileNode[]{
        const entries = fs.readdirSync(currentPath, {withFileTypes: true});

        const nodes: FileNode[]=[];

        for (const entry of entries){
            // Ignoramos archivos y carpetas ocultos
            if (entry.name.startsWith('.')) continue;

            const fullPath=path.join(currentPath, entry.name);

            const relativePath=path.relative(rootPath, fullPath).replace(/\\/g, '/');

            if (entry.isDirectory()){
                nodes.push({
                    name:entry.name,
                    path:relativePath,
                    type:'folder',
                    children:this.readDirRecursive(fullPath, rootPath)
                });
            }else{
                if(entry.name.endsWith('.md')){
                    nodes.push({
                        name: entry.name,
                        path: relativePath,
                        type:'file'
                    });
                }
            }
        }

        return nodes;
    }

    /**
     * Lee el contenido de un archivo
     */
    public readFile(vaultPath:string, relativePath:string): string{
        const fullPath=path.join(vaultPath, relativePath);
        // SEGURIDAD : Evitar Path Traversal (que pidan ../../windows/passwords)
        if (!fullPath.startsWith(vaultPath)){
            throw new Error("Acceso denegado: Ruta fuera del Vault");
        }
        return fs.readFileSync(fullPath, 'utf-8');
    }
}

export const fileService = new FileService();
