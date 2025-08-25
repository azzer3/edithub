const { db } = require("./index.js");

const userId = 3; // remplacer par l'id du compte à promouvoir

const stmt = db.prepare("UPDATE users SET isAdmin = 1 WHERE id = ?");
stmt.run(userId);

console.log(`User ${userId} is now admin`);


// exécuter `node db/makeAdmin.js` pour promouvoir le compte