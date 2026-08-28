

const pool = require("../config/db");

// ==========================================
// CREATE USER
// ==========================================
const createUser = async (name, email, phone) => {
  const query = `
    INSERT INTO users (name, email, phone)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [name, email, phone];

  const result = await pool.query(query, values);

  return result.rows[0];
};

// ==========================================
// GET ALL USERS WITH ADDRESS
// ==========================================
const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.phone,
      u.dob,
      u.role,
      u.created_at,
      u.updated_at,

      COALESCE(
        NULLIF(u.address, ''),
        CONCAT_WS(
          ', ',
          a.address_line1,
          a.address_line2,
          a.city,
          a.state,
          a.pincode,
          a.landmark
        )
      ) AS address

    FROM users u

    LEFT JOIN LATERAL (
      SELECT
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        landmark
      FROM addresses
      WHERE addresses.user_id = u.id
      ORDER BY
        is_default DESC,
        created_at DESC
      LIMIT 1
    ) a ON TRUE

    ORDER BY u.id ASC;
  `);

  return result.rows;
};

// ==========================================
// GET USER BY ID WITH ADDRESS
// ==========================================
const getUserById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.phone,
      u.dob,
      u.role,
      u.created_at,
      u.updated_at,

      COALESCE(
        NULLIF(u.address, ''),
        CONCAT_WS(
          ', ',
          a.address_line1,
          a.address_line2,
          a.city,
          a.state,
          a.pincode,
          a.landmark
        )
      ) AS address

    FROM users u

    LEFT JOIN LATERAL (
      SELECT
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        landmark
      FROM addresses
      WHERE addresses.user_id = u.id
      ORDER BY
        is_default DESC,
        created_at DESC
      LIMIT 1
    ) a ON TRUE

    WHERE u.id = $1;
    `,
    [id]
  );

  return result.rows[0];
};

// ==========================================
// UPDATE USER
// ==========================================
const updateUser = async (
  id,
  name,
  email,
  phone,
  address,
  dob
) => {
  const result = await pool.query(
    `
    UPDATE users
    SET
      name = $1,
      email = $2,
      phone = $3,
      address = $4,
      dob = $5,
      updated_at = NOW()

    WHERE id = $6

    RETURNING
      id,
      name,
      email,
      phone,
      address,
      dob,
      role,
      created_at,
      updated_at;
    `,
    [
      name,
      email,
      phone,
      address || null,
      dob || null,
      id,
    ]
  );

  return result.rows[0];
};

// ==========================================
// DELETE USER
// ==========================================
const deleteUser = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0];
};
// ==========================================
// DELETE LOGGED-IN USER ACCOUNT
// ==========================================
const deleteMyAccount = async (userId) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING id;
    `,
    [userId]
  );

  return result.rows[0];
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
   deleteMyAccount,
};