import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export class DatabaseService {
    private db: Database.Database | null = null;

    public int(vaultPath: string){
        const configDir = path.join(vaultPath, '.wikilink');
        const dbPath=path.join(configDir, 'index.db');

        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir);
        }

        console.log(`Database path: ${dbPath}`);
        this.db = new Database(dbPath);

        this.db.pragma('journal_mode = WAL');

        this.createTables();
    }

    private createTables() {
        if (!this.db) return;

        const createFilesTable = `
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT UNIQUE NOT NULL,    -- Ruta relativa del archivo (ej: "Notas/Idea.md")
            title TEXT,                   -- Título extraído o nombre de archivo
            last_modified INTEGER,        -- Timestamp para detectar cambios externos
            tags TEXT                     -- Guardaremos los tags como JSON o texto separado por comas
        );
        `;

        this.db.exec(createFilesTable);
        console.log('Tables created or verified.');
    }

    public indexFile(relativePath: string, lastModified: number) {
        if (!this.db) return;

        const stmt = this.db.prepare(`
            INSERT INTO files (path, last_modified) 
            VALUES (@path, @mod)
            ON CONFLICT(path) DO UPDATE SET last_modified = @mod
        `);
    
        stmt.run({ path: relativePath, mod: lastModified });
    }

    public close(){
        this.db?.close();
    }
}

export const dbService = new DatabaseService();