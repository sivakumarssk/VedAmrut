const pool = require("../config/db");

// Create User (Register)
const createAuthUser = async (name, email, phone, password) => {
  const query = `
    INSERT INTO users (name, email, phone, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [name, email, phone, password];

  const result = await pool.query(query, values);

  return result.rows[0];
};

// Find User By Email (Login)
const getUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users
    WHERE email = $1;
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

const getUserByPhone = async (phone) => {
  const query = `
    SELECT *
    FROM users
    WHERE phone = $1;
  `;

  const result = await pool.query(query, [phone]);

  return result.rows[0];
};

module.exports = {
  createAuthUser,
  getUserByEmail,
  getUserByPhone,
};