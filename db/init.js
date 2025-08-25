const Database = require('better-sqlite3');
const db = new Database('dev.db');

db.exec(`
ALTER TABLE users ADD COLUMN username TEXT;
`);

console.log("colonne ajoutée");
