
const pool = require("../config/db");

// =====================================================
// CREATE USER
// =====================================================

// const createAuthUser = async (
//   name,
//   email,
//   phone,
//   password,
//   address
// ) => {
//   const query = `
//     INSERT INTO users (
//       name,
//       email,
//       phone,
//       password,
//       address
//     )
//     VALUES ($1, $2, $3, $4, $5)
//     RETURNING *;
//   `;

//   const values = [
//     name,
//     email,
//     phone,
//     password,
//     address,
//   ];

//   const result = await pool.query(
//     query,
//     values
//   );

//   return result.rows[0];
// };

const createAuthUser = async (
  name,
  email,
  phone,
  password
) => {
  const query = `
    INSERT INTO users (
      name,
      email,
      phone,
      password
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    name,
    email,
    phone,
    password,
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;

  const result = await pool.query(
    query,
    [email]
  );

  return result.rows[0];
};


// =====================================================
// FIND USER BY PHONE
// =====================================================

const getUserByPhone = async (phone) => {
  const query = `
    SELECT *
    FROM users
    WHERE phone = $1;
  `;

  const result = await pool.query(
    query,
    [phone]
  );

  return result.rows[0];
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createAuthUser,
  getUserByEmail,
  getUserByPhone,
};