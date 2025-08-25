import bcrypt from "bcryptjs";

/**
 * Hash un mot de passe
 * @param {string} password
 * @returns {Promise<string>} hash
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * Vérifie qu'un mot de passe correspond à son hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
