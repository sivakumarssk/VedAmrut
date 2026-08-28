import React, { useEffect, useState } from "react";
import axios from "axios";
import {Alert,Box,Button,Card,CardContent,Chip,CircularProgress,Dialog,DialogActions,DialogContent,  DialogTitle,Divider,
  FormControl, Grid,IconButton,InputLabel,MenuItem,Select,Snackbar,TextField,Typography,} from "@mui/material";
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

  const showMessage = (
    message,
    severity = "success"
  ) => {
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
      console.error(
        "FETCH PRODUCTS ERROR:",
        error
      );

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
        setCategories(
          response.data.data || []
        );
      }
    } catch (error) {
      console.error(
        "FETCH CATEGORIES ERROR:",
        error
      );

      showMessage(
        "Unable to fetch categories",
        "error"
      );
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
    const {
      name,
      value,
    } = event.target;

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
        showMessage(
          "Product name is required",
          "error"
        );
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
        showMessage(
          "Please select a category",
          "error"
        );
        return;
      }

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "price",
        String(form.price)
      );

      formData.append(
        "stock",
        String(form.stock)
      );

      formData.append(
        "category_id",
        String(form.category_id)
      );

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      const token = getToken();

      const config = {
        headers: {
          "Content-Type":
            "multipart/form-data",
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

        showMessage(
          "Product updated successfully"
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/products`,
          formData,
          config
        );

        showMessage(
          "Product added successfully"
        );
      }

      setOpenForm(false);
      setEditingProduct(null);
      setImage(null);

      await fetchProducts();
    } catch (error) {
      console.error(
        "SAVE PRODUCT ERROR:",
        error
      );

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

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/api/products/${product.id}`,
        getAuthConfig()
      );

      showMessage(
        "Product deleted successfully"
      );

      await fetchProducts();
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

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

  const fetchProductQRCodes = async (
    product
  ) => {
    try {
      setQrLoading(true);

      console.log(
        "================================"
      );
      console.log(
        "FETCH PRODUCT QR CODES"
      );
      console.log(
        "PRODUCT:",
        product.name
      );
      console.log(
        "PRODUCT ID:",
        product.id
      );
      console.log(
        "PRODUCT STOCK:",
        product.stock
      );

      const response = await axios.get(
        `${QR_API_BASE}/product/${product.id}`
      );

      console.log(
        "QR API STATUS:",
        response.status
      );

      console.log(
        "QR API RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        const codes =
          response.data?.data?.qrCodes || [];

        setQrCodes(codes);

        return codes;
      }

      setQrCodes([]);

      return [];
    } catch (error) {
      console.error(
        "FETCH PRODUCT QR ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error?.response?.status
      );

      console.error(
        "RESPONSE:",
        error?.response?.data
      );

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

  const generateProductQRCodes = async (
    product
  ) => {
    try {
      setQrGenerating(true);

      const stock = Number(
        product.stock || 0
      );

      if (stock <= 0) {
        showMessage(
          `${product.name} has no stock`,
          "error"
        );

        return [];
      }

      console.log(
        "================================"
      );
      console.log(
        "GENERATE PRODUCT QR"
      );
      console.log(
        "PRODUCT:",
        product.name
      );
      console.log(
        "PRODUCT ID:",
        product.id
      );
      console.log(
        "STOCK:",
        stock
      );

      /*
       IMPORTANT:
       Backend expects:
       {
         stock: product.stock
       }
      */

      const response = await axios.post(
        `${QR_API_BASE}/product/${product.id}/generate`,
        {
          stock,
        }
      );

      console.log(
        "GENERATE RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        /*
         Backend returns newly generated
         codes only.

         Fetch again so we get ALL codes.
        */

        const allCodes =
          await fetchProductQRCodes(
            product
          );

        showMessage(
          `${product.name}: ${allCodes.length} QR codes available`
        );

        return allCodes;
      }

      return [];
    } catch (error) {
      console.error(
        "GENERATE QR ERROR:",
        error
      );

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
      showMessage(
        "No products available",
        "error"
      );
      return;
    }

    const confirmed = window.confirm(
      `Generate QR codes for all ${products.length} products according to their stock?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setGeneratingAll(true);

      let totalGenerated = 0;
      let totalProducts = 0;

      for (const product of products) {
        const stock = Number(
          product.stock || 0
        );

        if (stock <= 0) {
          continue;
        }

        totalProducts++;

        try {
          console.log(
            "================================"
          );
          console.log(
            "GENERATING ALL QR"
          );
          console.log(
            "PRODUCT:",
            product.name
          );
          console.log(
            "PRODUCT ID:",
            product.id
          );
          console.log(
            "STOCK:",
            stock
          );

          const response =
            await axios.post(
              `${QR_API_BASE}/product/${product.id}/generate`,
              {
                stock,
              }
            );

          const generated =
            response.data?.data || [];

          /*
           Backend currently returns
           newly generated QR codes.

           Count only newly generated.
          */

          if (
            Array.isArray(generated)
          ) {
            totalGenerated +=
              generated.length;
          }

          console.log(
            `${product.name}: generated ${generated.length}`
          );
        } catch (error) {
          console.error(
            `QR GENERATION FAILED FOR ${product.name}:`,
            error?.response?.data ||
              error.message
          );
        }
      }

      showMessage(
        `QR generation completed. ${totalGenerated} new QR codes generated for ${totalProducts} products.`,
        "success"
      );
    } catch (error) {
      console.error(
        "GENERATE ALL QR ERROR:",
        error
      );

      showMessage(
        "QR generation failed",
        "error"
      );
    } finally {
      setGeneratingAll(false);
    }
  };

  // =====================================================
  // OPEN QR DIALOG
  // =====================================================

  const handleOpenQR = async (
    product
  ) => {
    console.log(
      "================================"
    );
    console.log(
      "OPEN QR MANAGEMENT"
    );
    console.log(
      "PRODUCT:",
      product.name
    );
    console.log(
      "PRODUCT ID:",
      product.id
    );
    console.log(
      "PRODUCT STOCK:",
      product.stock
    );

    setSelectedProduct(product);
    setQrCodes([]);
    setOpenQR(true);

    const existing =
      await fetchProductQRCodes(
        product
      );

    /*
     If existing QR count is less than
     stock, generate the missing ones.
    */

    if (
      existing.length <
        Number(product.stock) &&
      Number(product.stock) > 0
    ) {
      console.log(
        "MISSING QR CODES"
      );

      await generateProductQRCodes(
        product
      );
    }
  };

  // =====================================================
  // REFRESH QR
  // =====================================================

  const handleRefreshQR = async () => {
    if (!selectedProduct) {
      return;
    }

    const existing =
      await fetchProductQRCodes(
        selectedProduct
      );

    if (
      existing.length <
        Number(
          selectedProduct.stock
        ) &&
      Number(
        selectedProduct.stock
      ) > 0
    ) {
      await generateProductQRCodes(
        selectedProduct
      );
    }
  };

  // =====================================================
  // DOWNLOAD ONE QR
  // =====================================================

  const downloadSingleQR = (
    qr
  ) => {
    const element =
      document.getElementById(
        `qr-${qr.id}`
      );

    if (!element) {
      showMessage(
        "QR code is not ready",
        "error"
      );
      return;
    }

    const canvas =
      element.querySelector(
        "canvas"
      );

    if (!canvas) {
      showMessage(
        "QR canvas not found",
        "error"
      );
      return;
    }

    const image =
      canvas.toDataURL(
        "image/png"
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = image;

    link.download =
      `${selectedProduct?.name || "product"}-unit-${qr.unit_number}-QR.png`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );
  };

  // =====================================================
  // DOWNLOAD ALL
  // =====================================================

  const downloadAllQRCodes = () => {
    if (qrCodes.length === 0) {
      showMessage(
        "No QR codes available",
        "error"
      );
      return;
    }

    qrCodes.forEach(
      (qr, index) => {
        setTimeout(() => {
          downloadSingleQR(qr);
        }, index * 250);
      }
    );
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (
    image
  ) => {
    if (!image) {
      return null;
    }

    return `${API_BASE_URL}/uploads/${image}`;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8f7",
        p: {
          xs: 2,
          md: 3,
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
            xs: "flex-start",
            md: "center",
          },
          justifyContent:
            "space-between",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              color: "#17201b",
            }}
          >
            Products
          </Typography>

          <Typography
            sx={{
              color: "#6b7280",
              mt: 0.5,
            }}
          >
            Manage Vedhamruth products,
            stock and QR codes
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {/* GENERATE ALL */}

          <Button
            variant="outlined"
            startIcon={
              generatingAll ? (
                <CircularProgress
                  size={18}
                />
              ) : (
                <QrCode2Icon />
              )
            }
            disabled={
              generatingAll ||
              products.length === 0
            }
            onClick={
              generateAllProductQRCodes
            }
            sx={{
              borderColor: "#00843d",
              color: "#00843d",
              borderRadius: "10px",
              px: 2,
              py: 1.2,
              fontWeight: 700,

              "&:hover": {
                borderColor:
                  "#006f34",
                backgroundColor:
                  "#e8f7ee",
              },
            }}
          >
            {generatingAll
              ? "Generating..."
              : "Generate All QR"}
          </Button>

          {/* ADD PRODUCT */}

          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
            onClick={
              handleOpenAdd
            }
            sx={{
              backgroundColor:
                "#00843d",
              borderRadius:
                "10px",
              px: 2.5,
              py: 1.2,
              fontWeight: 700,

              "&:hover": {
                backgroundColor:
                  "#006f34",
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

      <Box
        sx={{
          mb: 3,
        }}
      >
        <Chip
          label={`${products.length} Products`}
          sx={{
            backgroundColor:
              "#e8f7ee",
            color: "#00843d",
            fontWeight: 700,
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
            }}
          >
            Loading products...
          </Typography>
        </Box>
      ) : products.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            p: 6,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            No products found
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#777",
            }}
          >
            Add your first
            Vedhamruth product.
          </Typography>
        </Card>
      ) : (
        <Grid
          container
          spacing={2.5}
        >
          {products.map(
            (product) => (
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
                    border:
                      "1px solid #e5e7eb",
                    boxShadow:
                      "0 3px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* IMAGE */}

                  <Box
                    sx={{
                      height: 190,
                      backgroundColor:
                        "#f5f5f5",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    {product.image ? (
                      <Box
                        component="img"
                        src={getImageUrl(
                          product.image
                        )}
                        alt={
                          product.name
                        }
                        sx={{
                          width: "70%",
                          height: "100%",
                          objectFit:
                            "contain",
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          color:
                            "#999",
                        }}
                      >
                        No Image
                      </Typography>
                    )}
                  </Box>

                  <CardContent>
                    {/* NAME */}

                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 800,
                        color:
                          "#17201b",
                      }}
                    >
                      {
                        product.name
                      }
                    </Typography>

                    {/* CATEGORY */}

                    <Typography
                      sx={{
                        mt: 0.5,
                        color:
                          "#00843d",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {product.category_name ||
                        "No Category"}
                    </Typography>

                    {/* PRICE */}

                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: 20,
                        fontWeight: 800,
                      }}
                    >
                      ₹
                      {Number(
                        product.price
                      ).toFixed(2)}
                    </Typography>

                    {/* STOCK */}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        mt: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            "#6b7280",
                          fontSize: 14,
                        }}
                      >
                        Stock
                      </Typography>

                      <Chip
                        size="small"
                        label={
                          product.stock
                        }
                        sx={{
                          backgroundColor:
                            Number(
                              product.stock
                            ) > 0
                              ? "#e8f7ee"
                              : "#ffebee",

                          color:
                            Number(
                              product.stock
                            ) > 0
                              ? "#00843d"
                              : "#d32f2f",

                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    {/* ACTIONS */}

                    <Box
                      sx={{
                        display:
                          "flex",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={
                          <QrCodeIcon />
                        }
                        onClick={() =>
                          handleOpenQR(
                            product
                          )
                        }
                        sx={{
                          borderColor:
                            "#00843d",
                          color:
                            "#00843d",
                          fontWeight: 700,
                          borderRadius:
                            "9px",

                          "&:hover": {
                            borderColor:
                              "#006f34",
                            backgroundColor:
                              "#e8f7ee",
                          },
                        }}
                      >
                        QR
                      </Button>

                      <IconButton
                        onClick={() =>
                          handleOpenEdit(
                            product
                          )
                        }
                        sx={{
                          color:
                            "#1976d2",
                          backgroundColor:
                            "#eaf3ff",
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          handleDelete(
                            product
                          )
                        }
                        sx={{
                          color:
                            "#d32f2f",
                          backgroundColor:
                            "#ffebee",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      )}

      {/* =====================================================
          ADD / EDIT PRODUCT
      ===================================================== */}

      <Dialog
        open={openForm}
        onClose={() =>
          setOpenForm(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          {editingProduct
            ? "Edit Product"
            : "Add Product"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection:
                "column",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              fullWidth
              multiline
              rows={3}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <TextField
                label="Price"
                name="price"
                type="number"
                value={form.price}
                onChange={
                  handleChange
                }
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
                onChange={
                  handleChange
                }
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>
                Category
              </InputLabel>

              <Select
                label="Category"
                name="category_id"
                value={
                  form.category_id
                }
                onChange={
                  handleChange
                }
              >
                {categories.map(
                  (category) => (
                    <MenuItem
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.name
                      }
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <Button
              component="label"
              variant="outlined"
              sx={{
                borderRadius:
                  "10px",
                borderColor:
                  "#00843d",
                color:
                  "#00843d",
              }}
            >
              {image
                ? image.name
                : "Choose Product Image"}

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(
                  event
                ) => {
                  setImage(
                    event.target
                      .files?.[0] ||
                      null
                  );
                }}
              />
            </Button>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={() =>
              setOpenForm(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleSubmit
            }
            sx={{
              backgroundColor:
                "#00843d",
              borderRadius:
                "9px",

              "&:hover": {
                backgroundColor:
                  "#006f34",
              },
            }}
          >
            {editingProduct
              ? "Update Product"
              : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          QR DIALOG
      ===================================================== */}

      <Dialog
        open={openQR}
        onClose={() =>
          setOpenQR(false)
        }
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            fontWeight: 800,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              Product QR Codes
            </Typography>

            {selectedProduct && (
              <Typography
                sx={{
                  color:
                    "#6b7280",
                  fontSize: 14,
                  mt: 0.5,
                }}
              >
                {
                  selectedProduct.name
                }{" "}
                • Stock:{" "}
                {
                  selectedProduct.stock
                }
              </Typography>
            )}
          </Box>

          <IconButton
            onClick={() =>
              setOpenQR(false)
            }
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* QR ACTIONS */}

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
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
                  backgroundColor:
                    "#e8f7ee",
                  color:
                    "#00843d",
                  fontWeight:
                    700,
                }}
              />

              <Chip
                label={`Unclaimed: ${
                  qrCodes.filter(
                    (qr) =>
                      !qr.is_claimed
                  ).length
                }`}
                sx={{
                  backgroundColor:
                    "#fff8e1",
                  color:
                    "#a66b00",
                  fontWeight:
                    700,
                }}
              />

              <Chip
                label={`Claimed: ${
                  qrCodes.filter(
                    (qr) =>
                      qr.is_claimed
                  ).length
                }`}
                sx={{
                  backgroundColor:
                    "#eeeeee",
                  color:
                    "#555",
                  fontWeight:
                    700,
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                startIcon={
                  <RefreshIcon />
                }
                onClick={
                  handleRefreshQR
                }
                disabled={
                  qrLoading ||
                  qrGenerating
                }
                sx={{
                  borderColor:
                    "#00843d",
                  color:
                    "#00843d",
                  borderRadius:
                    "9px",
                }}
              >
                Refresh
              </Button>

              <Button
                variant="contained"
                startIcon={
                  <DownloadIcon />
                }
                onClick={
                  downloadAllQRCodes
                }
                disabled={
                  qrCodes.length ===
                  0
                }
                sx={{
                  backgroundColor:
                    "#00843d",
                  borderRadius:
                    "9px",

                  "&:hover": {
                    backgroundColor:
                      "#006f34",
                  },
                }}
              >
                Download All
              </Button>
            </Box>
          </Box>

          <Divider
            sx={{
              mb: 3,
            }}
          />

          {/* LOADING */}

          {qrLoading ||
          qrGenerating ? (
            <Box
              sx={{
                py: 8,
                textAlign:
                  "center",
              }}
            >
              <CircularProgress
                sx={{
                  color:
                    "#00843d",
                }}
              />

              <Typography
                sx={{
                  mt: 2,
                  color:
                    "#6b7280",
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
                textAlign:
                  "center",
              }}
            >
              <QrCodeIcon
                sx={{
                  fontSize: 60,
                  color:
                    "#cccccc",
                }}
              />

              <Typography
                sx={{
                  mt: 2,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                No QR codes found
              </Typography>

              {selectedProduct &&
                Number(
                  selectedProduct.stock
                ) > 0 && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      generateProductQRCodes(
                        selectedProduct
                      )
                    }
                    sx={{
                      mt: 2,
                      backgroundColor:
                        "#00843d",
                    }}
                  >
                    Generate{" "}
                    {
                      selectedProduct.stock
                    }{" "}
                    QR Codes
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
                }}
              >
                Each physical product
                unit has one unique QR
                code. If stock is 55,
                there will be 55 QR
                codes for this product.
              </Alert>

              <Grid
                container
                spacing={2}
              >
                {qrCodes.map(
                  (qr) => (
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
                          border:
                            "1px solid #e5e7eb",
                          boxShadow:
                            "0 3px 10px rgba(0,0,0,0.05)",
                        }}
                      >
                        <CardContent
                          sx={{
                            textAlign:
                              "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 17,
                              fontWeight: 800,
                            }}
                          >
                            Unit #
                            {
                              qr.unit_number
                            }
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
                              backgroundColor:
                                qr.is_claimed
                                  ? "#eeeeee"
                                  : "#e8f7ee",

                              color:
                                qr.is_claimed
                                  ? "#666"
                                  : "#00843d",

                              fontWeight:
                                700,
                            }}
                          />

                          <Box
                            id={`qr-${qr.id}`}
                            sx={{
                              display:
                                "flex",
                              justifyContent:
                                "center",
                              alignItems:
                                "center",
                              p: 2,
                              mt: 1,
                            }}
                          >
                            <QRCodeCanvas
                              value={
                                qr.qr_code
                              }
                              size={170}
                              level="H"
                              includeMargin
                            />
                          </Box>

                          <Typography
                            sx={{
                              fontFamily:
                                "monospace",
                              fontSize: 10,
                              color:
                                "#777",
                              wordBreak:
                                "break-all",
                              px: 1,
                            }}
                          >
                            {
                              qr.qr_code
                            }
                          </Typography>

                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={
                              <DownloadIcon />
                            }
                            onClick={() =>
                              downloadSingleQR(
                                qr
                              )
                            }
                            sx={{
                              mt: 2,
                              borderColor:
                                "#00843d",
                              color:
                                "#00843d",
                              borderRadius:
                                "9px",
                              fontWeight:
                                700,
                            }}
                          >
                            Download QR
                          </Button>

                          {qr.is_claimed && (
                            <Typography
                              sx={{
                                mt: 1.5,
                                fontSize:
                                  11,
                                color:
                                  "#888",
                              }}
                            >
                              Already
                              claimed
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={() =>
              setOpenQR(false)
            }
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
          setSnackbar(
            (previous) => ({
              ...previous,
              open: false,
            })
          )
        }
      >
        <Alert
          severity={
            snackbar.severity
          }
          onClose={() =>
            setSnackbar(
              (previous) => ({
                ...previous,
                open: false,
              })
            )
          }
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}