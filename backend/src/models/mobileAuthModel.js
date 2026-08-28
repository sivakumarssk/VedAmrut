const pool = require("../config/db");

// Save OTP
const saveOTP = async (phone, otp, expiresAt) => {
  // Remove old OTP for this phone
  await pool.query(
    `
    DELETE FROM otp_verifications
    WHERE phone = $1
    `,
    [phone]
  );

  const result = await pool.query(
    `
    INSERT INTO otp_verifications
    (phone, otp, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [phone, otp, expiresAt]
  );

  return result.rows[0];
};

// Get OTP
const getOTP = async (phone) => {
  const result = await pool.query(
    `
    SELECT *
    FROM otp_verifications
    WHERE phone = $1
    ORDER BY created_at DESC
    LIMIT 1;
    `,
    [phone]
  );

  return result.rows[0];
};

// Delete OTP
const deleteOTP = async (phone) => {
  await pool.query(
    `
    DELETE FROM otp_verifications
    WHERE phone = $1
    `,
    [phone]
  );
};

// Find user by phone
const getUserByPhone = async (phone) => {
  const result = await pool.query(
    `
    SELECT id, name, email, phone, role
    FROM users
    WHERE phone = $1
    `,
    [phone]
  );

  return result.rows[0];
};

module.exports = {
  saveOTP,
  getOTP,
  deleteOTP,
  getUserByPhone,
};