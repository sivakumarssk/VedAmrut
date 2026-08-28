const {
  createAddress,
  getAddressesByUserId,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../models/addressModel");


// ==========================================
// CREATE ADDRESS
// ==========================================

const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      landmark,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required address fields",
      });
    }

    const address = await createAddress(
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
    );

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: address,
    });

  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};


// ==========================================
// GET ALL ADDRESSES
// ==========================================

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses =
      await getAddressesByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });

  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};


// ==========================================
// GET SINGLE ADDRESS
// ==========================================

const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await getAddressById(
      userId,
      id
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address,
    });

  } catch (error) {
    console.error("GET ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
    });
  }
};


// ==========================================
// UPDATE ADDRESS
// ==========================================

const editAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      landmark,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required address fields",
      });
    }

    const address = await updateAddress(
      userId,
      id,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      landmark,
      isDefault
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });

  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};


// ==========================================
// DELETE ADDRESS
// ==========================================

const removeAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await deleteAddress(
      userId,
      id
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================

const makeDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await setDefaultAddress(
      userId,
      id
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: address,
    });

  } catch (error) {
    console.error(
      "SET DEFAULT ADDRESS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to set default address",
    });
  }
};


module.exports = {
  addAddress,
  getAddresses,
  getAddress,
  editAddress,
  removeAddress,
  makeDefaultAddress,
};