
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle, Divider,
  FormControl, Grid, IconButton, InputLabel, MenuItem, Select,
  Snackbar, TextField, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode2";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { QRCodeCanvas } from "qrcode.react";
import { API_BASE_URL } from "../api";

const QR_API_BASE = `${API_BASE_URL}/api/product-qr`;

const emptyForm = {
  name: "", description: "", price: "", stock: "", category_id: "", bg_color: "transparent",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [openQR, setOpenQR] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Newly selected image files and local previews.
 const [images, setImages] = useState([]);
const [imagePreviews, setImagePreviews] = useState([]);
const [imageBgColors, setImageBgColors] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});

  const [qrCodes, setQrCodes] = useState([]);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrGenerating, setQrGenerating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [form, setForm] = useState(emptyForm);
  const [rewardTiers, setRewardTiers] = useState([{ amount: "", quantity: "" }]);

  const getToken = () => localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
  const getAuthConfig = () => {
    const token = getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };
  const showMessage = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data?.success ? response.data.data || [] : []);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
      showMessage(error?.response?.data?.message || "Unable to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      if (response.data?.success) setCategories(response.data.data || []);
    } catch (error) {
      console.error("FETCH CATEGORIES ERROR:", error);
      showMessage("Unable to fetch categories", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => imagePreviews.forEach((preview) => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    });
  }, [imagePreviews]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRewardTierChange = (index, field, value) => {
    setRewardTiers((prev) => prev.map((tier, i) => i === index ? { ...tier, [field]: value } : tier));
  };
  const handleAddRewardTier = () => setRewardTiers((prev) => [...prev, { amount: "", quantity: "" }]);
  const handleRemoveRewardTier = (index) =>
    setRewardTiers((prev) => prev.length === 1 ? prev : prev.filter((_, i) => i !== index));

  const getValidRewardTiers = () => rewardTiers
    .map((tier) => ({ amount: Number(tier.amount), quantity: Number(tier.quantity) }))
    .filter((tier) => Number.isFinite(tier.amount) && tier.amount >= 0 && Number.isInteger(tier.quantity) && tier.quantity > 0);
  const getRewardTiersTotal = () => getValidRewardTiers().reduce((sum, tier) => sum + tier.quantity, 0);

  const clearSelectedImages = () => {
  imagePreviews.forEach((preview) => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
  });

  setImages([]);
  setImagePreviews([]);
  setImageBgColors([]);
};

 const handleImageSelection = (event) => {
  const files = Array.from(event.target.files || []).filter((file) =>
    file.type.startsWith("image/")
  );

  if (images.length + files.length > 10) {
    showMessage("You can select up to 10 images", "error");
    event.target.value = "";
    return;
  }

  setImages((prev) => [...prev, ...files]);

  setImagePreviews((prev) => [
    ...prev,
    ...files.map((file) => URL.createObjectURL(file)),
  ]);

  setImageBgColors((prev) => [
    ...prev,
    ...files.map(() => "#FFFFFF"),
  ]);

  event.target.value = "";
};
const handleImageBgColorChange = (index, color) => {
  setImageBgColors((prev) =>
    prev.map((item, i) => (i === index ? color : item))
  );
};
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({ ...emptyForm });
    setRewardTiers([{ amount: "", quantity: "" }]);
    clearSelectedImages();
    setFormStep(1);
    setOpenForm(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      category_id: product.category_id || "",
      bg_color: product.bg_color || "transparent",
    });
    setRewardTiers([{ amount: "", quantity: "" }]);
    clearSelectedImages();
    setFormStep(1);
    setOpenForm(true);
  };

  const validateStepOne = () => {
    if (!form.name.trim()) return showMessage("Product name is required", "error"), false;
    if (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0)
      return showMessage("Valid product price is required", "error"), false;
    if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
      return showMessage("Valid product stock is required", "error"), false;
    if (!form.category_id) return showMessage("Please select a category", "error"), false;
    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateStepOne()) return;

      const validRewardTiers = getValidRewardTiers();
      const rewardTiersTotal = getRewardTiersTotal();
      const stockForRewardTiers = editingProduct
        ? Math.max(Number(form.stock) - Number(editingProduct.stock || 0), 0)
        : Number(form.stock);

      if (stockForRewardTiers > 0 && validRewardTiers.length === 0) {
        showMessage("QR reward tiers are required", "error");
        return;
      }
      if (stockForRewardTiers > 0 && rewardTiersTotal !== stockForRewardTiers) {
        showMessage(
          editingProduct
            ? "Reward tier quantities must add up to exactly the newly added stock"
            : "Reward tier quantities must add up to exactly the total stock",
          "error"
        );
        return;
      }

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("price", String(form.price));
      formData.append("stock", String(form.stock));
      formData.append("category_id", String(form.category_id));
      formData.append("bg_color", form.bg_color || "transparent");
      if (validRewardTiers.length) formData.append("reward_tiers", JSON.stringify(validRewardTiers));
     images.forEach((file) => {
  formData.append("images", file);
});

const imageBackgrounds = images.map((file, index) => ({
  image: file.name,
  bg_color: imageBgColors[index] || "#FFFFFF",
}));

formData.append(
  "image_backgrounds",
  JSON.stringify(imageBackgrounds)
);
      const token = getToken();
      const config = {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };

      if (editingProduct) {
        await axios.put(`${API_BASE_URL}/api/products/${editingProduct.id}`, formData, config);
        showMessage("Product updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, formData, config);
        showMessage("Product added successfully");
      }

      setOpenForm(false);
      setEditingProduct(null);
      clearSelectedImages();
      await fetchProducts();
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);
      showMessage(error?.response?.data?.message || "Unable to save product", "error");
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${product.id}`, getAuthConfig());
      showMessage("Product deleted successfully");
      await fetchProducts();
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      showMessage(error?.response?.data?.message || "Unable to delete product", "error");
    }
  };

  const fetchProductQRCodes = async (product) => {
    try {
      setQrLoading(true);
      const response = await axios.get(`${QR_API_BASE}/product/${product.id}`);
      const codes = response.data?.success && Array.isArray(response.data.data) ? response.data.data : [];
      setQrCodes(codes);
      return codes;
    } catch (error) {
      console.error("FETCH PRODUCT QR ERROR:", error);
      setQrCodes([]);
      showMessage(error?.response?.data?.message || "Unable to fetch QR codes", "error");
      return [];
    } finally {
      setQrLoading(false);
    }
  };

  const generateProductQRCodes = async (product) => {
    try {
      setQrGenerating(true);
      const stock = Number(product.stock || 0);
      if (stock <= 0) {
        showMessage(`${product.name} has no stock`, "error");
        return [];
      }
      const response = await axios.post(`${QR_API_BASE}/product/${product.id}/generate`, { stock });
      if (response.data?.success) {
        const allCodes = await fetchProductQRCodes(product);
        showMessage(`${product.name}: ${allCodes.length} QR codes available`);
        return allCodes;
      }
      return [];
    } catch (error) {
      console.error("GENERATE QR ERROR:", error);
      showMessage(error?.response?.data?.message || `Unable to generate QR codes for ${product.name}`, "error");
      return [];
    } finally {
      setQrGenerating(false);
    }
  };

  const handleOpenQR = async (product) => {
    setSelectedProduct(product);
    setQrCodes([]);
    setOpenQR(true);
    const existing = await fetchProductQRCodes(product);
    if (existing.length < Number(product.stock) && Number(product.stock) > 0) {
      await generateProductQRCodes(product);
    }
  };

  const handleRefreshQR = async () => {
    if (!selectedProduct) return;
    const existing = await fetchProductQRCodes(selectedProduct);
    if (existing.length < Number(selectedProduct.stock) && Number(selectedProduct.stock) > 0) {
      await generateProductQRCodes(selectedProduct);
    }
  };

  const downloadSingleQR = (qr) => {
    const element = document.getElementById(`qr-${qr.id}`);
    const canvas = element?.querySelector("canvas");
    if (!canvas) return showMessage("QR code is not ready", "error");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${selectedProduct?.name || "product"}-unit-${qr.unit_number}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllQRCodes = () => {
    if (!qrCodes.length) return showMessage("No QR codes available", "error");
    qrCodes.forEach((qr, index) => setTimeout(() => downloadSingleQR(qr), index * 250));
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === "string" && /^https?:\/\//i.test(image)) return image;
    const filename = typeof image === "object" ? image.filename || image.image || image.url : image;
    if (!filename) return null;
    if (/^https?:\/\//i.test(filename)) return filename;
    return `${API_BASE_URL}/uploads/${String(filename).replace(/^\/?uploads\//, "")}`;
  };

  const getProductImages = (product) => {
    let list = [];
    if (Array.isArray(product.images)) list = product.images;
    else if (typeof product.images === "string" && product.images.trim()) {
      try {
        const parsed = JSON.parse(product.images);
        list = Array.isArray(parsed) ? parsed : [product.images];
      } catch {
        list = product.images.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    if (!list.length && product.image) list = [product.image];
    return list.map(getImageUrl).filter(Boolean);
  };

  const fontStyles = { fontFamily: "Inter" };

  return (
    <Box sx={{
      minHeight: "100vh", width: "100%", maxWidth: "100%", overflowX: "hidden",
      backgroundColor: "#f6f8f7", fontFamily: "Inter", fontWeight: 400,
      p: { xs: 1.5, sm: 2, md: 3 }, boxSizing: "border-box",
      "& *": { boxSizing: "border-box", fontFamily: "inherit" },
      "& .MuiTypography-root, & .MuiButton-root, & .MuiChip-root, & .MuiChip-label, & .MuiInputBase-root, & .MuiInputBase-input, & .MuiInputLabel-root, & .MuiFormLabel-root, & .MuiSelect-select, & .MuiMenuItem-root, & .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root, & .MuiAlert-root, & .MuiAlert-message": { fontFamily: "Inter" },
    }}>
      <Box sx={{ display: "flex", alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 3 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: { xs: 24, sm: 28 }, fontWeight: 700, color: "#17201b", wordBreak: "break-word" }}>Products</Typography>
          <Typography sx={{ color: "#6b7280", mt: 0.5, fontSize: { xs: 13, sm: 14 } }}>Manage Vedhamruth products, stock and QR codes</Typography>
        </Box>
        <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}
          sx={{ width: { xs: "100%", sm: "auto" }, backgroundColor: "#00843d", borderRadius: "10px", px: 2.5, py: 1.2, fontWeight: 600, minHeight: 44, whiteSpace: "nowrap", "&:hover": { backgroundColor: "#006f34" } }}>
          Add Product
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}><Chip label={`${products.length} Products`} sx={{ backgroundColor: "#e8f7ee", color: "#00843d", fontWeight: 600 }} /></Box>

      {loading ? (
        <Box sx={{ py: 10, textAlign: "center" }}><CircularProgress sx={{ color: "#00843d" }} /><Typography sx={{ mt: 2, color: "#6b7280" }}>Loading products...</Typography></Box>
      ) : products.length === 0 ? (
        <Card sx={{ borderRadius: 3, p: { xs: 3, sm: 6 }, textAlign: "center" }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>No products found</Typography>
          <Typography sx={{ mt: 1, color: "#777" }}>Add your first Vedhamruth product.</Typography>
        </Card>
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          {products.map((product) => {
            const productImages = getProductImages(product);
            const activeIndex = Math.min(imageIndexes[product.id] || 0, Math.max(productImages.length - 1, 0));
            const changeImage = (direction) => setImageIndexes((prev) => ({
              ...prev,
              [product.id]: (activeIndex + direction + productImages.length) % productImages.length,
            }));
            return (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card sx={{ height: "100%", borderRadius: 3, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 3px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                  <Box sx={{ height: { xs: 170, sm: 190 }, width: "100%", position: "relative", backgroundColor: product.bg_color && product.bg_color !== "transparent" ? product.bg_color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pt: { xs: 2, sm: 2.5 } }}>
                    {productImages.length ? (
                      <>
                        <Box component="img" src={productImages[activeIndex]} alt={`${product.name} ${activeIndex + 1}`} onError={(e) => { e.currentTarget.style.display = "none"; }}
                          sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        {productImages.length > 1 && <>
                          <IconButton aria-label="Previous image" onClick={() => changeImage(-1)} sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,.9)", width: 32, height: 32, "&:hover": { bgcolor: "#fff" } }}><ArrowBackIosNewIcon sx={{ fontSize: 15 }} /></IconButton>
                          <IconButton aria-label="Next image" onClick={() => changeImage(1)} sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,.9)", width: 32, height: 32, "&:hover": { bgcolor: "#fff" } }}><ArrowForwardIosIcon sx={{ fontSize: 15 }} /></IconButton>
                          <Box sx={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 0.7 }}>
                            {productImages.map((_, i) => <Box key={i} onClick={() => setImageIndexes((prev) => ({ ...prev, [product.id]: i }))} sx={{ width: i === activeIndex ? 18 : 7, height: 7, borderRadius: 5, bgcolor: i === activeIndex ? "#00843d" : "rgba(0,0,0,.25)", cursor: "pointer" }} />)}
                          </Box>
                        </>}
                      </>
                    ) : <Typography sx={{ color: "#999", fontSize: 13 }}>No Image</Typography>}
                  </Box>
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 }, flex: 1, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
                    <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 700, color: "#17201b", lineHeight: 1.3, minHeight: { xs: "auto", sm: 46 }, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}>{product.name}</Typography>
                    <Typography sx={{ mt: 0.5, color: "#00843d", fontSize: 13, fontWeight: 600, wordBreak: "break-word" }}>{product.category_name || "No Category"}</Typography>
                    <Typography sx={{ mt: 1, fontSize: { xs: 18, sm: 20 }, fontWeight: 700 }}>₹{Number(product.price).toFixed(2)}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5, gap: 1 }}>
                      <Typography sx={{ color: "#6b7280", fontSize: 14 }}>Stock</Typography>
                      <Chip size="small" label={product.stock} sx={{ backgroundColor: Number(product.stock) > 0 ? "#e8f7ee" : "#ffebee", color: Number(product.stock) > 0 ? "#00843d" : "#d32f2f", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, mt: 2, alignItems: "stretch" }}>
                      <Button fullWidth variant="outlined" startIcon={<QrCodeIcon />} onClick={() => handleOpenQR(product)}
                        sx={{ minWidth: 0, borderColor: "#00843d", color: "#00843d", fontWeight: 600, borderRadius: "9px", px: { xs: 1, sm: 1.5 }, fontSize: { xs: 12, sm: 14 }, "& .MuiButton-startIcon": { mr: { xs: 0.5, sm: 1 } }, "&:hover": { borderColor: "#006f34", backgroundColor: "#e8f7ee" } }}>QR</Button>
                      <IconButton onClick={() => handleOpenEdit(product)} sx={{ flexShrink: 0, width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 }, color: "#1976d2", backgroundColor: "#eaf3ff", "&:hover": { backgroundColor: "#dcecff" } }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton onClick={() => handleDelete(product)} sx={{ flexShrink: 0, width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 }, color: "#d32f2f", backgroundColor: "#ffebee", "&:hover": { backgroundColor: "#ffdde1" } }}><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* ADD / EDIT PRODUCT */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { m: { xs: 1, sm: 2 }, width: { xs: "calc(100% - 16px)", sm: "100%" }, borderRadius: { xs: 2, sm: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: { xs: 19, sm: 22 }, px: { xs: 2, sm: 3 } }}>
          {editingProduct ? "Edit Product" : "Add Product"}
          <Typography sx={{ mt: 0.5, fontSize: 13, fontWeight: 500, color: "#6b7280" }}>Step {formStep} of 2 — {formStep === 1 ? "Basic Details" : "Rewards & Appearance"}</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          {formStep === 1 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField label="Product Name" name="name" value={form.name} onChange={handleChange} fullWidth />
              <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} />
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} fullWidth slotProps={{ htmlInput: { min: 0 } }} />
                <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} fullWidth slotProps={{ htmlInput: { min: 0, step: 1 } }} />
              </Box>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category" name="category_id" value={form.category_id} onChange={handleChange}>
                  {categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#17201b", mb: 1 }}>
                  QR Reward Tiers *{editingProduct ? " (applies to newly added stock only)" : ""}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {rewardTiers.map((tier, index) => (
                    <Box key={index} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 1, alignItems: "center" }}>
                      <TextField label="Reward Amount (₹)" type="number" size="small" value={tier.amount} onChange={(e) => handleRewardTierChange(index, "amount", e.target.value)} slotProps={{ htmlInput: { min: 0 } }} />
                      <TextField label="Quantity" type="number" size="small" value={tier.quantity} onChange={(e) => handleRewardTierChange(index, "quantity", e.target.value)} slotProps={{ htmlInput: { min: 1, step: 1 } }} />
                      <IconButton onClick={() => handleRemoveRewardTier(index)} disabled={rewardTiers.length === 1} sx={{ color: "#d32f2f" }}><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  ))}
                </Box>
                <Button startIcon={<AddIcon />} onClick={handleAddRewardTier} sx={{ mt: 1, color: "#00843d", fontWeight: 600, textTransform: "none" }}>Add Reward Tier</Button>
                <Typography sx={{ mt: 0.5, fontSize: 12, color: "#6b7280" }}>
                  {(() => {
                    const total = getRewardTiersTotal();
                    const applicableStock = editingProduct ? Math.max(Number(form.stock || 0) - Number(editingProduct.stock || 0), 0) : Number(form.stock || 0);
                    const remaining = applicableStock - total;
                    if (applicableStock === 0) return "No new QR codes will be generated for this product.";
                    return `${total} of ${applicableStock} QR codes assigned. ${remaining > 0 ? `Add ${remaining} more (use a ₹0 tier for no-gift units) to continue.` : remaining < 0 ? `${Math.abs(remaining)} too many - reduce a quantity.` : "All units accounted for."}`;
                  })()}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>Product Images (up to 10)</Typography>
                <Button component="label" variant="outlined" fullWidth sx={{ borderRadius: "10px", borderColor: "#00843d", color: "#00843d", minHeight: 48, fontWeight: 600 }}>
                  {images.length ? `${images.length} image(s) selected` : "Choose Product Images"}
                  <input type="file" hidden accept="image/*" multiple onChange={handleImageSelection} />
                </Button>
                {editingProduct && !images.length && (
                  <Typography sx={{ mt: 1, fontSize: 12, color: "#6b7280" }}>
                    Current images will be kept unless you select new images.
                  </Typography>
                )}
                {!!imagePreviews.length && (
  <Grid container spacing={2} sx={{ mt: 1 }}>
    {imagePreviews.map((src, index) => (
      <Grid key={`${src}-${index}`} size={{ xs: 12, sm: 6 }}>
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            p: 1.5,
            backgroundColor: "#fff",
          }}
        >
          <Box
            component="img"
            src={src}
            alt={`Selected image ${index + 1}`}
            sx={{
              width: "100%",
              height: 150,
              objectFit: "contain",
              borderRadius: 1,
              backgroundColor: imageBgColors[index] || "#FFFFFF",
            }}
          />

          <Typography
            sx={{
              mt: 1,
              fontSize: 12,
              color: "#6b7280",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {images[index]?.name}
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              mb: 1,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Image {index + 1} Background Color
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component="input"
              type="color"
              value={imageBgColors[index] || "#FFFFFF"}
              onChange={(e) =>
                handleImageBgColorChange(index, e.target.value)
              }
              sx={{
                width: 48,
                height: 40,
                border: "1px solid #d1d5db",
                borderRadius: 1,
                cursor: "pointer",
              }}
            />

            <TextField
              size="small"
              label="Color"
              value={imageBgColors[index] || "#FFFFFF"}
              onChange={(e) =>
                handleImageBgColorChange(index, e.target.value)
              }
              fullWidth
            />
          </Box>
        </Box>
      </Grid>
    ))}
  </Grid>
)}
                {!!images.length && <Button onClick={clearSelectedImages} color="error" size="small" sx={{ mt: 0.5 }}>Clear selected images</Button>}
              </Box>

              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#17201b", mb: 1 }}>Image Background Color</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                  <Box component="input" type="color" value={form.bg_color === "transparent" ? "#ffffff" : form.bg_color} onChange={(e) => setForm((prev) => ({ ...prev, bg_color: e.target.value }))} sx={{ width: 48, height: 40, border: "1px solid #d1d5db", borderRadius: "8px", padding: 0, cursor: "pointer", backgroundColor: "transparent" }} />
                  <TextField size="small" label="Color" value={form.bg_color} onChange={(e) => setForm((prev) => ({ ...prev, bg_color: e.target.value }))} sx={{ flex: 1, minWidth: 120 }} />
                  <Button onClick={() => setForm((prev) => ({ ...prev, bg_color: "transparent" }))} sx={{ color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>Reset</Button>
                  <Box sx={{ width: 48, height: 48, borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: form.bg_color === "transparent" ? "#fff" : form.bg_color, backgroundImage: form.bg_color === "transparent" ? "linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)" : "none", backgroundSize: "12px 12px", backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px", flexShrink: 0 }} />
                </Box>
                <Typography sx={{ mt: 0.5, fontSize: 12, color: "#6b7280" }}>This color shows behind the product images in the app. Default is transparent.</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, gap: 1, flexDirection: { xs: "column-reverse", sm: "row" }, "& > button": { width: { xs: "100%", sm: "auto" }, minHeight: 44, fontWeight: 600 } }}>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          {formStep === 2 && <Button onClick={() => setFormStep(1)}>Back</Button>}
          {formStep === 1 ? (
            <Button variant="contained" onClick={() => { if (validateStepOne()) setFormStep(2); }} sx={{ backgroundColor: "#00843d", borderRadius: "9px", "&:hover": { backgroundColor: "#006f34" } }}>Next</Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "#00843d", borderRadius: "9px", "&:hover": { backgroundColor: "#006f34" } }}>{editingProduct ? "Update Product" : "Add Product"}</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* QR DIALOG */}
      <Dialog open={openQR} onClose={() => setOpenQR(false)} fullWidth maxWidth="lg" PaperProps={{ sx: { m: { xs: 1, sm: 2 }, width: { xs: "calc(100% - 16px)", sm: "100%" }, maxHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" }, borderRadius: { xs: 2, sm: 3 } } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 700 }}>Product QR Codes</Typography>
            {selectedProduct && <Typography sx={{ color: "#6b7280", fontSize: { xs: 12, sm: 14 }, mt: 0.5, wordBreak: "break-word" }}>{selectedProduct.name} • Stock: {selectedProduct.stock}</Typography>}
          </Box>
          <IconButton onClick={() => setOpenQR(false)} sx={{ flexShrink: 0 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 1.5, sm: 3 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, flexWrap: "wrap", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label={`Generated: ${qrCodes.length}`} sx={{ bgcolor: "#e8f7ee", color: "#00843d", fontWeight: 600 }} />
              <Chip label={`Unclaimed: ${qrCodes.filter((qr) => !qr.is_claimed).length}`} sx={{ bgcolor: "#fff8e1", color: "#a66b00", fontWeight: 600 }} />
              <Chip label={`Claimed: ${qrCodes.filter((qr) => qr.is_claimed).length}`} sx={{ bgcolor: "#eeeeee", color: "#555", fontWeight: 600 }} />
            </Box>
            <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" }, flexDirection: { xs: "column", sm: "row" } }}>
              <Button fullWidth variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshQR} disabled={qrLoading || qrGenerating} sx={{ borderColor: "#00843d", color: "#00843d", borderRadius: "9px", minHeight: 44 }}>Refresh</Button>
              <Button fullWidth variant="contained" startIcon={<DownloadIcon />} onClick={downloadAllQRCodes} disabled={!qrCodes.length} sx={{ bgcolor: "#00843d", borderRadius: "9px", minHeight: 44, "&:hover": { bgcolor: "#006f34" } }}>Download All</Button>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          {qrLoading || qrGenerating ? (
            <Box sx={{ py: 8, textAlign: "center" }}><CircularProgress sx={{ color: "#00843d" }} /><Typography sx={{ mt: 2, color: "#6b7280" }}>{qrGenerating ? "Generating QR codes..." : "Loading QR codes..."}</Typography></Box>
          ) : qrCodes.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <QrCodeIcon sx={{ fontSize: 60, color: "#ccc" }} />
              <Typography sx={{ mt: 2, fontSize: 18, fontWeight: 700 }}>No QR codes found</Typography>
              {selectedProduct && Number(selectedProduct.stock) > 0 && <Button variant="contained" onClick={() => generateProductQRCodes(selectedProduct)} sx={{ mt: 2, bgcolor: "#00843d", borderRadius: "9px", minHeight: 44, "&:hover": { bgcolor: "#006f34" } }}>Generate {selectedProduct.stock} QR Codes</Button>}
            </Box>
          ) : (
            <>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>Each physical product unit has one unique QR code. If stock is 55, there will be 55 QR codes for this product.</Alert>
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {qrCodes.map((qr) => (
                  <Grid key={qr.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card sx={{ borderRadius: 3, border: "1px solid #e5e7eb", boxShadow: "0 3px 10px rgba(0,0,0,0.05)", height: "100%" }}>
                      <CardContent sx={{ textAlign: "center", p: { xs: 1.5, sm: 2 } }}>
                        <Typography sx={{ fontSize: { xs: 15, sm: 17 }, fontWeight: 700 }}>Unit #{qr.unit_number}</Typography>
                        <Chip size="small" label={qr.is_claimed ? "Claimed" : "Unclaimed"} sx={{ mt: 1, bgcolor: qr.is_claimed ? "#eee" : "#e8f7ee", color: qr.is_claimed ? "#666" : "#00843d", fontWeight: 600 }} />
                        <Box id={`qr-${qr.id}`} sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: { xs: 1, sm: 2 }, mt: 1, width: "100%", overflow: "hidden", "& canvas": { maxWidth: "100%", width: { xs: "min(100%, 150px) !important", sm: "170px !important" }, height: { xs: "auto !important", sm: "170px !important" } } }}>
                          <QRCodeCanvas value={qr.qr_code} size={170} level="H" includeMargin />
                        </Box>
                        <Typography sx={{ fontFamily: "monospace", fontSize: { xs: 9, sm: 10 }, color: "#777", wordBreak: "break-all", overflowWrap: "anywhere", px: 1 }}>{qr.qr_code}</Typography>
                        <Button fullWidth variant="outlined" startIcon={<DownloadIcon />} onClick={() => downloadSingleQR(qr)} sx={{ mt: 2, borderColor: "#00843d", color: "#00843d", borderRadius: "9px", minHeight: 44, fontSize: { xs: 12, sm: 14 } }}>Download QR</Button>
                        {qr.is_claimed && <Typography sx={{ mt: 1.5, fontSize: 11, color: "#888" }}>Already claimed</Typography>}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}><Button fullWidth onClick={() => setOpenQR(false)} sx={{ minHeight: 44, fontWeight: 600 }}>Close</Button></DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
