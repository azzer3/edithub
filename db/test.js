const { createUser, getUserByEmail, createGame, createCategory, addRun, getLeaderboard, createSubCategory } = require("./index");
const bcrypt = require("bcrypt");

(async () => {
  // Création d'un utilisateur
  const hashed = await bcrypt.hash("motdepasse", 10);
  createUser("testUser", "test@example.com", hashed);

  // Vérifier récupération
  const user = getUserByEmail("test@example.com");
  console.log("Utilisateur récupéré :", user);

  // Création d'un jeu et d'une catégorie

  createCategory("Layers");
  createSubCategory("very high");

  // Ajouter un run
  addRun(8, "https://youtu.be/test", 1, 1);

  // Vérifier leaderboard
  const leaderboard = getLeaderboard(1);
  console.log("Leaderboard :", leaderboard);
})();
