import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode2";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import QrCode2Icon from "@mui/icons-material/QrCode2";

import { QRCodeCanvas } from "qrcode.react";
import { API_BASE_URL } from "../api";

const QR_API_BASE = `${API_BASE_URL}/api/product-qr`;

export default function Products() {
  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [openQR, setOpenQR] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [image, setImage] = useState(null);

  const [qrCodes, setQrCodes] = useState([]);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrGenerating, setQrGenerating] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      ""
    );
  };

  // =====================================================
  // AUTH CONFIG
  // =====================================================

  const getAuthConfig = () => {
    const token = getToken();

    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
  };

  // =====================================================
  // MESSAGE
  // =====================================================

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/products`
      );

      if (response.data?.success) {
        setProducts(response.data.data || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to fetch products",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/categories`
      );

      if (response.data?.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error("FETCH CATEGORIES ERROR:", error);

      showMessage("Unable to fetch categories", "error");
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN ADD
  // =====================================================

  const handleOpenAdd = () => {
    setEditingProduct(null);

    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
    });

    setImage(null);
    setOpenForm(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleOpenEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      category_id: product.category_id || "",
    });

    setImage(null);
    setOpenForm(true);
  };

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const handleSubmit = async () => {
    try {
      if (!form.name.trim()) {
        showMessage("Product name is required", "error");
        return;
      }

      if (
        form.price === "" ||
        Number(form.price) < 0
      ) {
        showMessage(
          "Valid product price is required",
          "error"
        );
        return;
      }

      if (
        form.stock === "" ||
        Number(form.stock) < 0
      ) {
        showMessage(
          "Valid product stock is required",
          "error"
        );
        return;
      }

      if (!form.category_id) {
        showMessage("Please select a category", "error");
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append("price", String(form.price));
      formData.append("stock", String(form.stock));
      formData.append(
        "category_id",
        String(form.category_id)
      );

      if (image) {
        formData.append("image", image);
      }

      const token = getToken();

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      };

      if (editingProduct) {
        await axios.put(
          `${API_BASE_URL}/api/products/${editingProduct.id}`,
          formData,
          config
        );

        showMessage("Product updated successfully");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/products`,
          formData,
          config
        );

        showMessage("Product added successfully");
      }

      setOpenForm(false);
      setEditingProduct(null);
      setImage(null);

      await fetchProducts();
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to save product",
        "error"
      );
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/products/${product.id}`,
        getAuthConfig()
      );

      showMessage("Product deleted successfully");

      await fetchProducts();
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to delete product",
        "error"
      );
    }
  };

  // =====================================================
  // GET QR CODES
  // =====================================================

  // =====================================================
// GET QR CODES
// =====================================================

const fetchProductQRCodes = async (product) => {
  try {
    setQrLoading(true);

    const response = await axios.get(
      `${QR_API_BASE}/product/${product.id}`
    );

    if (response.data?.success) {
      const codes = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setQrCodes(codes);

      return codes;
    }

    setQrCodes([]);

    return [];
  } catch (error) {
    console.error("FETCH PRODUCT QR ERROR:", error);

    setQrCodes([]);

    showMessage(
      error?.response?.data?.message ||
        "Unable to fetch QR codes",
      "error"
    );

    return [];
  } finally {
    setQrLoading(false);
  }
};

  // =====================================================
  // GENERATE QR FOR ONE PRODUCT
  // =====================================================

  const generateProductQRCodes = async (product) => {
    try {
      setQrGenerating(true);

      const stock = Number(product.stock || 0);

      if (stock <= 0) {
        showMessage(
          `${product.name} has no stock`,
          "error"
        );

        return [];
      }

      const response = await axios.post(
        `${QR_API_BASE}/product/${product.id}/generate`,
        {
          stock,
        }
      );

      if (response.data?.success) {
        const allCodes = await fetchProductQRCodes(
          product
        );

        showMessage(
          `${product.name}: ${allCodes.length} QR codes available`
        );

        return allCodes;
      }

      return [];
    } catch (error) {
      console.error("GENERATE QR ERROR:", error);

      showMessage(
        error?.response?.data?.message ||
          `Unable to generate QR codes for ${product.name}`,
        "error"
      );

      return [];
    } finally {
      setQrGenerating(false);
    }
  };

  // =====================================================
  // GENERATE QR FOR ALL PRODUCTS
  // =====================================================

  const generateAllProductQRCodes = async () => {
    if (products.length === 0) {
      showMessage("No products available", "error");
      return;
    }

    const confirmed = window.confirm(
      `Generate QR codes for all ${products.length} products according to their stock?`
    );

    if (!confirmed) return;

    try {
      setGeneratingAll(true);

      let totalGenerated = 0;
      let totalProducts = 0;

      for (const product of products) {
        const stock = Number(product.stock || 0);

        if (stock <= 0) continue;

        totalProducts++;

        try {
          const response = await axios.post(
            `${QR_API_BASE}/product/${product.id}/generate`,
            {
              stock,
            }
          );

         const generated = response.data?.data;

if (Array.isArray(generated)) {
  totalGenerated += generated.length;
} else if (generated?.createdCount) {
  totalGenerated += Number(generated.createdCount);
}
        } catch (error) {
          console.error(
            `QR GENERATION FAILED FOR ${product.name}:`,
            error?.response?.data || error.message
          );
        }
      }

      showMessage(
        `QR generation completed. ${totalGenerated} new QR codes generated for ${totalProducts} products.`,
        "success"
      );
    } catch (error) {
      console.error("GENERATE ALL QR ERROR:", error);

      showMessage("QR generation failed", "error");
    } finally {
      setGeneratingAll(false);
    }
  };

  // =====================================================
  // OPEN QR DIALOG
  // =====================================================

  const handleOpenQR = async (product) => {
    setSelectedProduct(product);
    setQrCodes([]);
    setOpenQR(true);

    const existing = await fetchProductQRCodes(product);

    if (
      existing.length < Number(product.stock) &&
      Number(product.stock) > 0
    ) {
      await generateProductQRCodes(product);
    }
  };

  // =====================================================
  // REFRESH QR
  // =====================================================

  const handleRefreshQR = async () => {
    if (!selectedProduct) return;

    const existing = await fetchProductQRCodes(
      selectedProduct
    );

    if (
      existing.length < Number(selectedProduct.stock) &&
      Number(selectedProduct.stock) > 0
    ) {
      await generateProductQRCodes(selectedProduct);
    }
  };

  // =====================================================
  // DOWNLOAD ONE QR
  // =====================================================

  const downloadSingleQR = (qr) => {
    const element = document.getElementById(
      `qr-${qr.id}`
    );

    if (!element) {
      showMessage("QR code is not ready", "error");
      return;
    }

    const canvas = element.querySelector("canvas");

    if (!canvas) {
      showMessage("QR canvas not found", "error");
      return;
    }

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");

    link.href = image;

    link.download = `${
      selectedProduct?.name || "product"
    }-unit-${qr.unit_number}-QR.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =====================================================
  // DOWNLOAD ALL
  // =====================================================

  const downloadAllQRCodes = () => {
    if (qrCodes.length === 0) {
      showMessage("No QR codes available", "error");
      return;
    }

    qrCodes.forEach((qr, index) => {
      setTimeout(() => {
        downloadSingleQR(qr);
      }, index * 250);
    });
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return null;

    return `${API_BASE_URL}/uploads/${image}`;
  };

  // =====================================================
  // COMMON FONT STYLES
  // =====================================================

  const fontStyles = {
    fontFamily: "Inter",
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        backgroundColor: "#f6f8f7",
        fontFamily: "Inter",
        fontWeight: 400,

        p: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },

        boxSizing: "border-box",

        "& *": {
          boxSizing: "border-box",
          fontFamily: "inherit",
        },

        "& .MuiTypography-root": {
          fontFamily: "Inter",
        },

        "& .MuiButton-root": {
          fontFamily: "Inter",
        },

        "& .MuiChip-root": {
          fontFamily: "Inter",
        },

        "& .MuiChip-label": {
          fontFamily: "Inter",
        },

        "& .MuiTableCell-root": {
          fontFamily: "Inter",
        },

        "& .MuiInputBase-root": {
          fontFamily: "Inter",
        },

        "& .MuiInputBase-input": {
          fontFamily: "Inter",
        },

        "& .MuiInputLabel-root": {
          fontFamily: "Inter",
        },

        "& .MuiFormLabel-root": {
          fontFamily: "Inter",
        },

        "& .MuiSelect-select": {
          fontFamily: "Inter",
        },

        "& .MuiMenuItem-root": {
          fontFamily: "Inter",
        },

        "& .MuiDialogTitle-root": {
          fontFamily: "Inter",
        },

        "& .MuiDialogContent-root": {
          fontFamily: "Inter",
        },

        "& .MuiDialogActions-root": {
          fontFamily: "Inter",
        },

        "& .MuiAlert-root": {
          fontFamily: "Inter",
        },

        "& .MuiAlert-message": {
          fontFamily: "Inter",
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "stretch",
            md: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: {
                xs: 24,
                sm: 28,
              },
              fontFamily: "Inter",
              fontWeight: 700,
              color: "#17201b",
              wordBreak: "break-word",
            }}
          >
            Products
          </Typography>

          <Typography
            sx={{
              color: "#6b7280",
              mt: 0.5,
              fontSize: {
                xs: 13,
                sm: 14,
              },
              fontFamily: "Inter",
              fontWeight: 400,
            }}
          >
            Manage Vedhamruth products, stock and QR codes
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={
              generatingAll ? (
                <CircularProgress size={18} />
              ) : (
                <QrCode2Icon />
              )
            }
            disabled={
              generatingAll || products.length === 0
            }
            onClick={generateAllProductQRCodes}
            sx={{
              borderColor: "#00843d",
              color: "#00843d",
              borderRadius: "10px",
              px: 2,
              py: 1.2,
              fontFamily: "Inter",
              fontWeight: 600,
              minHeight: 44,
              whiteSpace: "nowrap",

              "&:hover": {
                borderColor: "#006f34",
                backgroundColor: "#e8f7ee",
              },
            }}
          >
            {generatingAll
              ? "Generating..."
              : "Generate All QR"}
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              backgroundColor: "#00843d",
              borderRadius: "10px",
              px: 2.5,
              py: 1.2,
              fontFamily: "Inter",
              fontWeight: 600,
              minHeight: 44,
              whiteSpace: "nowrap",

              "&:hover": {
                backgroundColor: "#006f34",
              },
            }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* =====================================================
          PRODUCT COUNT
      ===================================================== */}

      <Box sx={{ mb: 3 }}>
        <Chip
          label={`${products.length} Products`}
          sx={{
            backgroundColor: "#e8f7ee",
            color: "#00843d",
            fontFamily: "Inter",
            fontWeight: 600,
          }}
        />
      </Box>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      {loading ? (
        <Box
          sx={{
            py: 10,
            textAlign: "center",
          }}
        >
          <CircularProgress
            sx={{
              color: "#00843d",
            }}
          />

          <Typography
            sx={{
              mt: 2,
              color: "#6b7280",
              fontFamily: "Inter",
              fontWeight: 400,
            }}
          >
            Loading products...
          </Typography>
        </Box>
      ) : products.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            p: {
              xs: 3,
              sm: 6,
            },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontFamily: "Inter",
              fontWeight: 700,
            }}
          >
            No products found
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#777",
              fontFamily: "Inter",
              fontWeight: 400,
            }}
          >
            Add your first Vedhamruth product.
          </Typography>
        </Card>
      ) : (
        <Grid
          container
          spacing={{
            xs: 1.5,
            sm: 2,
            md: 2.5,
          }}
        >
          {products.map((product) => (
            <Grid
              key={product.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 3px 12px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* IMAGE */}

                {/* <Box
                  sx={{
                    height: {
                      xs: 170,
                      sm: 190,
                    },
                    width: "100%",
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {product.image ? (
                    <Box
                      component="img"
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        mixBlendMode: "multiply",
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        color: "#999",
                        fontSize: 13,
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      No Image
                    </Typography>
                  )}
                </Box> */}

<Box
  sx={{
    height: {
      xs: 170,
      sm: 190,
    },
    width: "100%",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    pt: {
      xs: 2,
      sm: 2.5,
    },
  }}
>
  {product.image ? (
    <Box
      component="img"
      src={getImageUrl(product.image)}
      alt={product.name}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        mixBlendMode: "multiply",
      }}
    />
  ) : (
    <Typography
      sx={{
        color: "#999",
        fontSize: 13,
        fontFamily: "Inter",
        fontWeight: 400,
      }}
    >
      No Image
    </Typography>
  )}
</Box>
                <CardContent
                  sx={{
                    p: {
                      xs: 1.5,
                      sm: 2,
                    },
                    flex: 1,
                    "&:last-child": {
                      pb: {
                        xs: 1.5,
                        sm: 2,
                      },
                    },
                  }}
                >
                  {/* NAME */}

                  <Typography
                    sx={{
                      fontSize: {
                        xs: 16,
                        sm: 18,
                      },
                      fontFamily: "Inter",
                      fontWeight: 700,
                      color: "#17201b",
                      lineHeight: 1.3,
                      minHeight: {
                        xs: "auto",
                        sm: 46,
                      },
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      wordBreak: "break-word",
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* CATEGORY */}

                  <Typography
                    sx={{
                      mt: 0.5,
                      color: "#00843d",
                      fontSize: 13,
                      fontFamily: "Inter",
                      fontWeight: 600,
                      wordBreak: "break-word",
                    }}
                  >
                    {product.category_name || "No Category"}
                  </Typography>

                  {/* PRICE */}

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: {
                        xs: 18,
                        sm: 20,
                      },
                      fontFamily: "Inter",
                      fontWeight: 700,
                    }}
                  >
                    ₹{Number(product.price).toFixed(2)}
                  </Typography>

                  {/* STOCK */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1.5,
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#6b7280",
                        fontSize: 14,
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      Stock
                    </Typography>

                    <Chip
                      size="small"
                      label={product.stock}
                      sx={{
                        backgroundColor:
                          Number(product.stock) > 0
                            ? "#e8f7ee"
                            : "#ffebee",

                        color:
                          Number(product.stock) > 0
                            ? "#00843d"
                            : "#d32f2f",

                        fontFamily: "Inter",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* ACTIONS */}

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 2,
                      alignItems: "stretch",
                    }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<QrCodeIcon />}
                      onClick={() => handleOpenQR(product)}
                      sx={{
                        minWidth: 0,
                        borderColor: "#00843d",
                        color: "#00843d",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        borderRadius: "9px",
                        px: {
                          xs: 1,
                          sm: 1.5,
                        },
                        fontSize: {
                          xs: 12,
                          sm: 14,
                        },

                        "& .MuiButton-startIcon": {
                          mr: {
                            xs: 0.5,
                            sm: 1,
                          },
                        },

                        "&:hover": {
                          borderColor: "#006f34",
                          backgroundColor: "#e8f7ee",
                        },
                      }}
                    >
                      QR
                    </Button>

                    <IconButton
                      onClick={() => handleOpenEdit(product)}
                      sx={{
                        flexShrink: 0,
                        width: {
                          xs: 40,
                          sm: 44,
                        },
                        height: {
                          xs: 40,
                          sm: 44,
                        },
                        color: "#1976d2",
                        backgroundColor: "#eaf3ff",

                        "&:hover": {
                          backgroundColor: "#dcecff",
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDelete(product)}
                      sx={{
                        flexShrink: 0,
                        width: {
                          xs: 40,
                          sm: 44,
                        },
                        height: {
                          xs: 40,
                          sm: 44,
                        },
                        color: "#d32f2f",
                        backgroundColor: "#ffebee",

                        "&:hover": {
                          backgroundColor: "#ffdde1",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* =====================================================
          ADD / EDIT PRODUCT DIALOG
      ===================================================== */}

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            m: {
              xs: 1,
              sm: 2,
            },
            width: {
              xs: "calc(100% - 16px)",
              sm: "100%",
            },
            borderRadius: {
              xs: 2,
              sm: 3,
            },
            fontFamily: "Inter",

            "& *": {
              fontFamily: "inherit",
            },

            "& .MuiTypography-root": {
              fontFamily: "Inter",
            },

            "& .MuiButton-root": {
              fontFamily: "Inter",
            },

            "& .MuiInputBase-input": {
              fontFamily: "Inter",
            },

            "& .MuiInputLabel-root": {
              fontFamily: "Inter",
            },

            "& .MuiSelect-select": {
              fontFamily: "Inter",
            },

            "& .MuiMenuItem-root": {
              fontFamily: "Inter",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: {
              xs: 19,
              sm: 22,
            },
            px: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          {editingProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>

        <DialogContent
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            {/* PRICE + STOCK */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                label="Price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />

              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
              />
            </Box>

            {/* CATEGORY */}

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>

              <Select
                label="Category"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* IMAGE */}

            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: "10px",
                borderColor: "#00843d",
                color: "#00843d",
                minHeight: 48,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                fontFamily: "Inter",
                fontWeight: 600,
              }}
            >
              {image ? image.name : "Choose Product Image"}

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(event) => {
                  setImage(
                    event.target.files?.[0] || null
                  );
                }}
              />
            </Button>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
            pb: 2,
            gap: 1,
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            "& > button": {
              width: {
                xs: "100%",
                sm: "auto",
              },
              minHeight: 44,
              fontFamily: "Inter",
              fontWeight: 600,
            },
          }}
        >
          <Button
            onClick={() => setOpenForm(false)}
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#00843d",
              borderRadius: "9px",
              fontFamily: "Inter",
              fontWeight: 600,

              "&:hover": {
                backgroundColor: "#006f34",
              },
            }}
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          QR DIALOG
      ===================================================== */}

      <Dialog
        open={openQR}
        onClose={() => setOpenQR(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            m: {
              xs: 1,
              sm: 2,
            },
            width: {
              xs: "calc(100% - 16px)",
              sm: "100%",
            },
            maxHeight: {
              xs: "calc(100% - 16px)",
              sm: "calc(100% - 32px)",
            },
            borderRadius: {
              xs: 2,
              sm: 3,
            },
            fontFamily: "Inter",

            "& *": {
              fontFamily: "inherit",
            },

            "& .MuiTypography-root": {
              fontFamily: "Inter",
            },

            "& .MuiButton-root": {
              fontFamily: "Inter",
            },

            "& .MuiChip-root": {
              fontFamily: "Inter",
            },

            "& .MuiChip-label": {
              fontFamily: "Inter",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
            fontFamily: "Inter",
            fontWeight: 700,
            px: {
              xs: 2,
              sm: 3,
            },
            py: {
              xs: 1.5,
              sm: 2,
            },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: {
                  xs: 18,
                  sm: 22,
                },
                fontFamily: "Inter",
                fontWeight: 700,
              }}
            >
              Product QR Codes
            </Typography>

            {selectedProduct && (
              <Typography
                sx={{
                  color: "#6b7280",
                  fontSize: {
                    xs: 12,
                    sm: 14,
                  },
                  mt: 0.5,
                  wordBreak: "break-word",
                  fontFamily: "Inter",
                  fontWeight: 400,
                }}
              >
                {selectedProduct.name} • Stock:{" "}
                {selectedProduct.stock}
              </Typography>
            )}
          </Box>

          <IconButton
            onClick={() => setOpenQR(false)}
            sx={{
              flexShrink: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            px: {
              xs: 1.5,
              sm: 3,
            },
          }}
        >
          {/* QR ACTIONS */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              flexWrap: "wrap",
              gap: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={`Generated: ${qrCodes.length}`}
                sx={{
                  backgroundColor: "#e8f7ee",
                  color: "#00843d",
                  fontFamily: "Inter",
                  fontWeight: 600,
                }}
              />

              <Chip
                label={`Unclaimed: ${
                  qrCodes.filter(
                    (qr) => !qr.is_claimed
                  ).length
                }`}
                sx={{
                  backgroundColor: "#fff8e1",
                  color: "#a66b00",
                  fontFamily: "Inter",
                  fontWeight: 600,
                }}
              />

              <Chip
                label={`Claimed: ${
                  qrCodes.filter(
                    (qr) => qr.is_claimed
                  ).length
                }`}
                sx={{
                  backgroundColor: "#eeeeee",
                  color: "#555",
                  fontFamily: "Inter",
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefreshQR}
                disabled={qrLoading || qrGenerating}
                sx={{
                  borderColor: "#00843d",
                  color: "#00843d",
                  borderRadius: "9px",
                  minHeight: 44,
                  fontFamily: "Inter",
                  fontWeight: 600,
                }}
              >
                Refresh
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadAllQRCodes}
                disabled={qrCodes.length === 0}
                sx={{
                  backgroundColor: "#00843d",
                  borderRadius: "9px",
                  minHeight: 44,
                  fontFamily: "Inter",
                  fontWeight: 600,

                  "&:hover": {
                    backgroundColor: "#006f34",
                  },
                }}
              >
                Download All
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* LOADING */}

          {qrLoading || qrGenerating ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <CircularProgress
                sx={{
                  color: "#00843d",
                }}
              />

              <Typography
                sx={{
                  mt: 2,
                  color: "#6b7280",
                  fontFamily: "Inter",
                  fontWeight: 400,
                }}
              >
                {qrGenerating
                  ? "Generating QR codes..."
                  : "Loading QR codes..."}
              </Typography>
            </Box>
          ) : qrCodes.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <QrCodeIcon
                sx={{
                  fontSize: 60,
                  color: "#cccccc",
                }}
              />

              <Typography
                sx={{
                  mt: 2,
                  fontSize: 18,
                  fontFamily: "Inter",
                  fontWeight: 700,
                }}
              >
                No QR codes found
              </Typography>

              {selectedProduct &&
                Number(selectedProduct.stock) > 0 && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      generateProductQRCodes(
                        selectedProduct
                      )
                    }
                    sx={{
                      mt: 2,
                      backgroundColor: "#00843d",
                      borderRadius: "9px",
                      minHeight: 44,
                      fontFamily: "Inter",
                      fontWeight: 600,

                      "&:hover": {
                        backgroundColor: "#006f34",
                      },
                    }}
                  >
                    Generate {selectedProduct.stock} QR Codes
                  </Button>
                )}
            </Box>
          ) : (
            <>
              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  fontFamily: "Inter",

                  "& .MuiAlert-message": {
                    fontFamily: "Inter",
                    fontWeight: 500,
                  },
                }}
              >
                Each physical product unit has one unique QR
                code. If stock is 55, there will be 55 QR codes
                for this product.
              </Alert>

              <Grid
                container
                spacing={{
                  xs: 1.5,
                  sm: 2,
                }}
              >
                {qrCodes.map((qr) => (
                  <Grid
                    key={qr.id}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                      lg: 3,
                    }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        boxShadow:
                          "0 3px 10px rgba(0,0,0,0.05)",
                        height: "100%",
                      }}
                    >
                      <CardContent
                        sx={{
                          textAlign: "center",
                          p: {
                            xs: 1.5,
                            sm: 2,
                          },
                          "&:last-child": {
                            pb: {
                              xs: 1.5,
                              sm: 2,
                            },
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: 15,
                              sm: 17,
                            },
                            fontFamily: "Inter",
                            fontWeight: 700,
                          }}
                        >
                          Unit #{qr.unit_number}
                        </Typography>

                        <Chip
                          size="small"
                          label={
                            qr.is_claimed
                              ? "Claimed"
                              : "Unclaimed"
                          }
                          sx={{
                            mt: 1,
                            backgroundColor: qr.is_claimed
                              ? "#eeeeee"
                              : "#e8f7ee",

                            color: qr.is_claimed
                              ? "#666"
                              : "#00843d",

                            fontFamily: "Inter",
                            fontWeight: 600,
                          }}
                        />

                        <Box
                          id={`qr-${qr.id}`}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: {
                              xs: 1,
                              sm: 2,
                            },
                            mt: 1,
                            width: "100%",
                            overflow: "hidden",

                            "& canvas": {
                              maxWidth: "100%",
                              width: {
                                xs: "min(100%, 150px) !important",
                                sm: "170px !important",
                              },
                              height: {
                                xs: "auto !important",
                                sm: "170px !important",
                              },
                            },
                          }}
                        >
                          <QRCodeCanvas
                            value={qr.qr_code}
                            size={170}
                            level="H"
                            includeMargin
                          />
                        </Box>

                        <Typography
                          sx={{
                            fontFamily: "monospace",
                            fontSize: {
                              xs: 9,
                              sm: 10,
                            },
                            color: "#777",
                            wordBreak: "break-all",
                            overflowWrap: "anywhere",
                            px: 1,
                          }}
                        >
                          {qr.qr_code}
                        </Typography>

                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          onClick={() =>
                            downloadSingleQR(qr)
                          }
                          sx={{
                            mt: 2,
                            borderColor: "#00843d",
                            color: "#00843d",
                            borderRadius: "9px",
                            fontFamily: "Inter",
                            fontWeight: 600,
                            minHeight: 44,
                            fontSize: {
                              xs: 12,
                              sm: 14,
                            },
                          }}
                        >
                          Download QR
                        </Button>

                        {qr.is_claimed && (
                          <Typography
                            sx={{
                              mt: 1.5,
                              fontSize: 11,
                              color: "#888",
                              fontFamily: "Inter",
                              fontWeight: 400,
                            }}
                          >
                            Already claimed
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
            pb: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Button
            fullWidth
            onClick={() => setOpenQR(false)}
            sx={{
              minHeight: 44,
              fontFamily: "Inter",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          SNACKBAR
      ===================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
          sx={{
            width: "100%",
            fontFamily: "Inter",

            "& .MuiAlert-message": {
              fontFamily: "Inter",
              fontWeight: 500,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}