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
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { API_BASE_URL } from "../api";

export default function Categories() {
  // =====================================================
  // STATE
  // =====================================================

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [image, setImage] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    bg_color: "transparent",
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
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/categories`
      );

      if (response.data?.success) {
        setCategories(response.data.data || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("FETCH CATEGORIES ERROR:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to fetch categories",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    setEditingCategory(null);

    setForm({
      name: "",
      description: "",
      bg_color: "transparent",
    });

    setImage(null);
    setOpenForm(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleOpenEdit = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      description: category.description || "",
      bg_color: category.bg_color || "transparent",
    });

    setImage(null);
    setOpenForm(true);
  };

  // =====================================================
  // SAVE CATEGORY
  // =====================================================

  const handleSubmit = async () => {
    try {
      if (!form.name.trim()) {
        showMessage("Category name is required", "error");
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "bg_color",
        form.bg_color || "transparent"
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

      if (editingCategory) {
        await axios.put(
          `${API_BASE_URL}/api/categories/${editingCategory.id}`,
          formData,
          config
        );

        showMessage("Category updated successfully");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/categories`,
          formData,
          config
        );

        showMessage("Category added successfully");
      }

      setOpenForm(false);
      setEditingCategory(null);
      setImage(null);

      await fetchCategories();
    } catch (error) {
      console.error("SAVE CATEGORY ERROR:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to save category",
        "error"
      );
    }
  };

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Products in this category will not be deleted, but will lose their category.`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/categories/${category.id}`
      );

      showMessage("Category deleted successfully");

      await fetchCategories();
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);

      showMessage(
        error?.response?.data?.message ||
          "Unable to delete category",
        "error"
      );
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return null;

    return `${API_BASE_URL}/uploads/categories/${image}`;
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
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

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
            Categories
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
            Manage product categories
          </Typography>
        </Box>

        <Button
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
          Add Category
        </Button>
      </Box>

      {/* =================================================
          COUNT
      ================================================= */}

      <Box sx={{ mb: 3 }}>
        <Chip
          label={`${categories.length} Categories`}
          sx={{
            backgroundColor: "#e8f7ee",
            color: "#00843d",
            fontFamily: "Inter",
            fontWeight: 600,
          }}
        />
      </Box>

      {/* =================================================
          LIST
      ================================================= */}

      {loading ? (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <CircularProgress sx={{ color: "#00843d" }} />

          <Typography
            sx={{
              mt: 2,
              color: "#6b7280",
              fontFamily: "Inter",
            }}
          >
            Loading categories...
          </Typography>
        </Box>
      ) : categories.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            p: { xs: 3, sm: 6 },
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
            No categories found
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#777",
              fontFamily: "Inter",
            }}
          >
            Add your first category so products can be
            assigned to it.
          </Typography>
        </Card>
      ) : (
        <Grid
          container
          spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
        >
          {categories.map((category) => (
            // <Grid
            //   key={category.id}
            //   size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            // >
            <Grid
  key={category.id}
  size={{ xs: 6, sm: 4, md: 3, lg: 3 }}
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
              {/* Category Image */}
<Box
  sx={{
    height: 150,
    width: "100%",
    flexShrink: 0,
    backgroundColor:
      category.bg_color && category.bg_color !== "transparent"
        ? category.bg_color
        : "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    p: 2,
  }}
>
  {category.image ? (
    <Box
      component="img"
      src={getImageUrl(category.image)}
      alt={category.name}
      sx={{
        maxWidth: "80%",
        maxHeight: "100%",
        width: "auto",
        height: "auto",
        objectFit: "contain",
        display: "block",
      }}
    />
  ) : (
    <Typography
      sx={{
        color: "#999",
        fontSize: 13,
        fontFamily: "Inter",
      }}
    >
      No Image
    </Typography>
  )}
</Box>

                <CardContent
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    flex: 1,
                    "&:last-child": {
                      pb: { xs: 1.5, sm: 2 },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: 16, sm: 18 },
                      fontFamily: "Inter",
                      fontWeight: 700,
                      color: "#17201b",
                      wordBreak: "break-word",
                    }}
                  >
                    {category.name}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      color: "#6b7280",
                      fontSize: 13,
                      fontFamily: "Inter",
                      minHeight: 36,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {category.description ||
                      "No description"}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() =>
                        handleOpenEdit(category)
                      }
                      sx={{
                        borderColor: "#1976d2",
                        color: "#1976d2",
                        borderRadius: "9px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        minHeight: 40,

                        "&:hover": {
                          borderColor: "#115293",
                          backgroundColor: "#eaf3ff",
                        },
                      }}
                    >
                      Edit
                    </Button>

                    <IconButton
                      onClick={() =>
                        handleDelete(category)
                      }
                      sx={{
                        flexShrink: 0,
                        width: 40,
                        height: 40,
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

      {/* =================================================
          ADD / EDIT DIALOG
      ================================================= */}

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            width: {
              xs: "calc(100% - 16px)",
              sm: "100%",
            },
            borderRadius: { xs: 2, sm: 3 },
            fontFamily: "Inter",

            "& *": {
              fontFamily: "inherit",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: { xs: 19, sm: 22 },
            px: { xs: 2, sm: 3 },
          }}
        >
          {editingCategory
            ? "Edit Category"
            : "Add Category"}
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Category Name"
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
              {image ? image.name : "Choose Category Image"}

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

            {/* =================================================
                IMAGE BACKGROUND COLOR
            ================================================= */}

            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontFamily: "Inter",
                  fontWeight: 600,
                  color: "#17201b",
                  mb: 1,
                }}
              >
                Image Background Color
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  component="input"
                  type="color"
                  value={
                    form.bg_color === "transparent"
                      ? "#ffffff"
                      : form.bg_color
                  }
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      bg_color: event.target.value,
                    }))
                  }
                  sx={{
                    width: 48,
                    height: 40,
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: 0,
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                />

                <TextField
                  size="small"
                  label="Color"
                  value={form.bg_color}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      bg_color: event.target.value,
                    }))
                  }
                  sx={{ flex: 1 }}
                />

                <Button
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      bg_color: "transparent",
                    }))
                  }
                  sx={{
                    color: "#6b7280",
                    fontFamily: "Inter",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Reset
                </Button>

                {/* PREVIEW */}

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    backgroundColor:
                      form.bg_color === "transparent"
                        ? "#ffffff"
                        : form.bg_color,
                    backgroundImage:
                      form.bg_color === "transparent"
                        ? "linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)"
                        : "none",
                    backgroundSize: "12px 12px",
                    backgroundPosition:
                      "0 0, 0 6px, 6px -6px, -6px 0px",
                    flexShrink: 0,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  fontFamily: "Inter",
                  color: "#6b7280",
                }}
              >
                This color shows behind the category image
                in the app. Default is transparent.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            pb: 2,
            gap: 1,
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            "& > button": {
              width: { xs: "100%", sm: "auto" },
              minHeight: 44,
              fontFamily: "Inter",
              fontWeight: 600,
            },
          }}
        >
          <Button
            onClick={() => setOpenForm(false)}
            sx={{ fontFamily: "Inter", fontWeight: 600 }}
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
            {editingCategory
              ? "Update Category"
              : "Add Category"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          SNACKBAR
      ================================================= */}

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
          sx={{ width: "100%", fontFamily: "Inter" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
