
const pool = require("../config/db");

// =====================================================
// CREATE USER
// =====================================================



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
// REPLACE THE SINGLE ADMIN ACCOUNT
//
// Only one admin should ever exist. Any existing admin
// row is deleted first, then the new one is inserted, so
// calling this again always replaces the previous admin
// instead of creating a second one.
// =====================================================

// const replaceAdminUser = async (
//   name,
//   email,
//   hashedPassword
// ) => {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     await client.query(
//       `DELETE FROM users WHERE role = 'admin'`
//     );

//     const result = await client.query(
//       `
//       INSERT INTO users (
//         name,
//         email,
//         phone,
//         password,
//         role
//       )
//       VALUES ($1, $2, $3, $4, 'admin')
//       RETURNING *;
//       `,
//       [name, email, null, hashedPassword]
//     );

//     await client.query("COMMIT");

//     return result.rows[0];
//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// };
const replaceAdminUser = async (name, email, hashedPassword) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`DELETE FROM users WHERE role = 'admin'`);

    const result = await client.query(`
      INSERT INTO users (name, email, phone, password, role)
      VALUES ($1, $2, $3, $4, 'admin')
      RETURNING *;
    `, [
      name,
      email,
      "0000000000",
      hashedPassword
    ]);

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createAuthUser,
  getUserByEmail,
  getUserByPhone,
  replaceAdminUser,
};
