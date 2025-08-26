// db/index.js
import pool from "./postgres.js"; // ton fichier de connexion à Supabase/PostgreSQL

// -------------------- UTILISATEURS --------------------
async function createUser(username, email, passwordHash) {
  await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
    [username, email, passwordHash]
  );
}

async function getUserByEmail(email) {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
}

async function getUserById(id) {
  const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0];
}

// -------------------- CATEGORIES & SUBCATEGORIES --------------------
async function createCategory(name) {
  await pool.query("INSERT INTO categories (name) VALUES ($1)", [name]);
}

async function createSubCategory(name, categoryId) {
  await pool.query("INSERT INTO subCategories (name, categoryId) VALUES ($1, $2)", [
    name,
    categoryId,
  ]);
}

async function getCategories() {
  const res = await pool.query("SELECT * FROM categories ORDER BY id ASC");
  return res.rows;
}

async function getSubCategoriesByCategory(categoryId) {
  const res = await pool.query("SELECT * FROM subCategories WHERE categoryId = $1 ORDER BY id ASC", [
    categoryId,
  ]);
  return res.rows;
}

// -------------------- RUNS --------------------
async function addRun(quantity, videoUrl, userId, subCategoryId, game) {
  await pool.query(
    "INSERT INTO runs (quantity, videoUrl, status, userId, subCategoryId, game) VALUES ($1, $2, 'pending', $3, $4, $5)",
    [quantity, videoUrl, userId, subCategoryId, game]
  );
}

async function getRuns(subCategoryId, showModded = true) {
  let query = `
    SELECT runs.*, users.username, subCategories.name as subCategory
    FROM runs
    JOIN users ON runs.userId = users.id
    JOIN subCategories ON runs.subCategoryId = subCategories.id
    WHERE runs.status = 'approved'
  `;
  const params = [];

  if (subCategoryId) {
    query += " AND runs.subCategoryId = $1";
    params.push(subCategoryId);
  }

  if (!showModded) {
    query += params.length ? " AND runs.game = 'standard'" : " AND runs.game = 'standard'";
  }

  query += " ORDER BY runs.quantity DESC";

  const res = await pool.query(query, params);
  return res.rows;
}

async function getLeaderboard(subCategoryId) {
  const res = await pool.query(
    "SELECT runs.*, users.username FROM runs JOIN users ON runs.userId = users.id WHERE subCategoryId = $1 AND status = 'validated' ORDER BY quantity DESC",
    [subCategoryId]
  );
  return res.rows;
}

async function validateRun(runId) {
  await pool.query("UPDATE runs SET status = 'validated' WHERE id = $1", [runId]);
}

async function getPendingRuns() {
  const res = await pool.query(`
    SELECT runs.*, users.username, subCategories.name as subCategory, categories.name as category
    FROM runs
    JOIN users ON runs.userId = users.id
    JOIN subCategories ON runs.subCategoryId = subCategories.id
    JOIN categories ON subCategories.categoryId = categories.id
    WHERE runs.status = 'pending'
    ORDER BY categories.id, subCategories.id
  `);
  return res.rows;
}

async function updateRunStatus(runId, newStatus) {
  await pool.query("UPDATE runs SET status = $1 WHERE id = $2", [newStatus, runId]);
}

async function getRunsByCategory(categoryId, subCategoryId = null, showModded = true) {
  let query = `
    SELECT runs.*, users.username, subCategories.name as subCategory
    FROM runs
    JOIN users ON runs.userId = users.id
    JOIN subCategories ON runs.subCategoryId = subCategories.id
    WHERE runs.status = 'approved' AND subCategories.categoryId = $1
  `;
  const params = [categoryId];

  if (subCategoryId) {
    query += " AND subCategories.id = $2";
    params.push(subCategoryId);
  }

  if (!showModded) {
    query += " AND runs.game = 'standard'";
  }

  query += " ORDER BY runs.quantity DESC";

  const res = await pool.query(query, params);
  return res.rows;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  createCategory,
  createSubCategory,
  getCategories,
  getSubCategoriesByCategory,
  addRun,
  getRuns,
  getLeaderboard,
  validateRun,
  getPendingRuns,
  updateRunStatus,
  getRunsByCategory
};