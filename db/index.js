const Database = require("better-sqlite3");
const db = new Database("dev.db");

// ------------------------ UTILISATEURS ------------------------
function createUser(username, email, passwordHash) {
  const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
  stmt.run(username, email, passwordHash);
}

function getUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

function getUserById(id) {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id);
}

// ------------------------ CATEGORIES & SUBCATEGORIES ------------------------
function createCategory(name) {
  db.prepare("INSERT INTO categories (name) VALUES (?)").run(name);
}

function createSubCategory(name, categoryId) {
  db.prepare("INSERT INTO subCategories (name, categoryId) VALUES (?, ?)").run(name, categoryId);
}

function getCategories() {
  return db.prepare("SELECT * FROM categories").all();
}

function getSubCategoriesByCategory(categoryId) {
  return db.prepare("SELECT * FROM subCategories WHERE categoryId = ?").all(categoryId);
}

// ------------------------ RUNS ------------------------
function addRun(quantity, videoUrl, userId, subCategoryId, game) {
  db.prepare(
    "INSERT INTO runs (quantity, videoUrl, status, userId, subCategoryId, game) VALUES (?, ?, 'pending', ?, ?, ?)"
  ).run(quantity, videoUrl, userId, subCategoryId, game);
}

// Récupère les runs d'une catégorie et éventuellement d'une sous-catégorie
function getRunsByCategory(categoryId, subCategoryId = null) {
  let query = `
    SELECT runs.*, users.username, subCategories.name as subCategory
    FROM runs
    JOIN users ON runs.userId = users.id
    JOIN subCategories ON runs.subCategoryId = subCategories.id
    WHERE runs.status = 'approved' AND subCategories.categoryId = ?
  `;
  const params = [categoryId];

  if (subCategoryId) {
    query += " AND runs.subCategoryId = ?";
    params.push(subCategoryId);
  }

  return db.prepare(query).all(...params);
}

function getLeaderboard(subCategoryId) {
  return db.prepare(
    "SELECT runs.*, users.username FROM runs JOIN users ON runs.userId = users.id WHERE runs.subCategoryId = ? AND status = 'approved' ORDER BY quantity DESC"
  ).all(subCategoryId);
}

function validateRun(runId) {
  db.prepare("UPDATE runs SET status = 'approved' WHERE id = ?").run(runId);
}

function getPendingRuns() {
  return db.prepare(`
    SELECT runs.*, users.username, subCategories.name AS subCategory, categories.name AS category
    FROM runs
    JOIN users ON runs.userId = users.id
    JOIN subCategories ON runs.subCategoryId = subCategories.id
    JOIN categories ON subCategories.categoryId = categories.id
    WHERE runs.status = 'pending'
    ORDER BY categories.name, subCategories.name
  `).all();
}

function updateRunStatus(runId, newStatus) {
  db.prepare("UPDATE runs SET status = ? WHERE id = ?").run(newStatus, runId);
}

// ------------------------ DISCORD ------------------------
function linkDiscordAccount(userId, discordId) {
  return db.prepare("UPDATE users SET discordId = ? WHERE id = ?").run(discordId, userId);
}

function getUserByDiscordId(discordId) {
  return db.prepare("SELECT * FROM users WHERE discordId = ?").get(discordId);
}

// ------------------------ EXPORT ------------------------
module.exports = {
  db,
  createUser,
  getUserByEmail,
  getUserById,
  createCategory,
  createSubCategory,
  getCategories,
  getSubCategoriesByCategory,
  addRun,
  getRunsByCategory,
  getLeaderboard,
  validateRun,
  getPendingRuns,
  updateRunStatus,
  linkDiscordAccount,
  getUserByDiscordId
};
