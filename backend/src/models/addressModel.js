const pool = require("../config/db");

// ==========================================
// CREATE ADDRESS
// ==========================================

const createAddress = async (
  userId,
  fullName,
  phone,
  addressLine1,
  addressLine2,
  city,
  state,
  pincode,
  landmark,
  isDefault
) => {
  // If this address should be default,
  // remove default from other addresses
  if (isDefault) {
    await pool.query(
      `
      UPDATE addresses
      SET is_default = FALSE,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      `,
      [userId]
    );
  }

  const result = await pool.query(
    `
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
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10
    )
    RETURNING *
    `,
    [
      userId,
      fullName,
      phone,
      addressLine1,
      addressLine2 || null,
      city,
      state,
      pincode,
      landmark || null,
      isDefault || false,
    ]
  );

  return result.rows[0];
};


// ==========================================
// GET ALL ADDRESSES FOR USER
// ==========================================

const getAddressesByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM addresses
    WHERE user_id = $1
    ORDER BY is_default DESC, created_at DESC
    `,
    [userId]
  );

  return result.rows;
};


// ==========================================
// GET ADDRESS BY ID
// ==========================================

const getAddressById = async (userId, addressId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM addresses
    WHERE id = $1
      AND user_id = $2
    `,
    [addressId, userId]
  );

  return result.rows[0];
};


// ==========================================
// UPDATE ADDRESS
// ==========================================

const updateAddress = async (
  userId,
  addressId,
  fullName,
  phone,
  addressLine1,
  addressLine2,
  city,
  state,
  pincode,
  landmark,
  isDefault
) => {
  if (isDefault) {
    await pool.query(
      `
      UPDATE addresses
      SET is_default = FALSE,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
        AND id != $2
      `,
      [userId, addressId]
    );
  }

  const result = await pool.query(
    `
    UPDATE addresses
    SET
      full_name = $1,
      phone = $2,
      address_line1 = $3,
      address_line2 = $4,
      city = $5,
      state = $6,
      pincode = $7,
      landmark = $8,
      is_default = $9,
      updated_at = CURRENT_TIMESTAMP

    WHERE id = $10
      AND user_id = $11

    RETURNING *
    `,
    [
      fullName,
      phone,
      addressLine1,
      addressLine2 || null,
      city,
      state,
      pincode,
      landmark || null,
      isDefault || false,
      addressId,
      userId,
    ]
  );

  return result.rows[0];
};


// ==========================================
// DELETE ADDRESS
// ==========================================

const deleteAddress = async (userId, addressId) => {
  const result = await pool.query(
    `
    DELETE FROM addresses
    WHERE id = $1
      AND user_id = $2

    RETURNING *
    `,
    [addressId, userId]
  );

  return result.rows[0];
};


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================

const setDefaultAddress = async (
  userId,
  addressId
) => {
  // Remove default from all user's addresses
  await pool.query(
    `
    UPDATE addresses
    SET is_default = FALSE,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $1
    `,
    [userId]
  );

  // Set selected address as default
  const result = await pool.query(
    `
    UPDATE addresses
    SET is_default = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND user_id = $2

    RETURNING *
    `,
    [addressId, userId]
  );

  return result.rows[0];
};


module.exports = {
  createAddress,
  getAddressesByUserId,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};