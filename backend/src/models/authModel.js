
const pool = require("../config/db");

// =====================================================
// CREATE USER
// =====================================================

const createAuthUser = async (
  name,
  email,
  phone,
  password,
  address
) => {
  const query = `
    INSERT INTO users (
      name,
      email,
      phone,
      password,
      address
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    name,
    email,
    phone,
    password,
    address,
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
};

const createRegistrationAddress = async (
  userId,
  name,
  phone,
  address
) => {
  const query = `
    INSERT INTO addresses (
      user_id,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      landmark,
      is_default
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
       '',
       '',
       '',
       '',
       '',
      TRUE
    )
    RETURNING *;
  `;

  const values = [
    userId,
    name,
    phone,
    address,
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
};


// =====================================================
// FIND USER BY EMAIL
// =====================================================

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
  createRegistrationAddress,
  getUserByEmail,
  getUserByPhone,
};