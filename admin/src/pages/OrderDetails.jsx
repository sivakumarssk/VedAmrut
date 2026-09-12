// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Box,
//   Button,
//   Card,
//   Chip,
//   CircularProgress,
//   Divider,
//   Typography,
// } from "@mui/material";

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import PersonIcon from "@mui/icons-material/Person";
// import PhoneIcon from "@mui/icons-material/Phone";
// import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// import PaymentIcon from "@mui/icons-material/Payment";
// import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
// import CancelIcon from "@mui/icons-material/Cancel";

// import { useNavigate, useParams } from "react-router-dom";
// import { API_BASE_URL } from "../api";

// export default function OrderDetails() {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updating, setUpdating] = useState(false);

//   // =========================================================
//   // FETCH ORDER
//   // =========================================================

//   const fetchOrder = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("adminToken");

//       const response = await axios.get(
//         `${API_BASE_URL}/api/orders/admin/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("================================");
//       console.log("ORDER DETAILS RESPONSE:", response.data);
//       console.log("================================");

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message || "Failed to fetch order"
//         );
//       }

//       const orderData = response.data.data;

//       console.log("ORDER DATA:", orderData);
//       console.log("ORDER ITEMS:", orderData?.items);

//       setOrder(orderData);
//     } catch (err) {
//       console.error("FETCH ORDER DETAILS ERROR:", err);

//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to fetch order"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchOrder();
//     }
//   }, [id]);

//   // =========================================================
//   // BASE IMAGE URL
//   // =========================================================

//   const getUploadsCategoryUrl = (filename) => {
//     if (!filename) return null;

//     return `${API_BASE_URL}/uploads/categories/${filename}`;
//   };

//   // =========================================================
//   // NORMALIZE TEXT
//   // =========================================================

//   const normalizeText = (value) => {
//     return String(value || "")
//       .toLowerCase()
//       .replace(/[\s_-]+/g, "")
//       .trim();
//   };

//   // =========================================================
//   // GET CATEGORY FALLBACK IMAGE
//   // =========================================================

//   const getCategoryFallbackImage = (item) => {
//     if (!item) {
//       return getUploadsCategoryUrl("product1.png");
//     }

//     const categoryName = normalizeText(
//       item.category_name ||
//         item.category ||
//         item.categoryName ||
//         ""
//     );

//     const productName = normalizeText(
//       item.name ||
//         item.product_name ||
//         item.productName ||
//         ""
//     );

//     const combined = `${categoryName}${productName}`;

//     console.log("IMAGE FALLBACK CHECK:", {
//       categoryName,
//       productName,
//       combined,
//     });

//     // WOMEN'S WELLNESS
//     if (
//       combined.includes("womenswellness") ||
//       combined.includes("womenshealth") ||
//       combined.includes("womenwellness")
//     ) {
//       return getUploadsCategoryUrl("WomensWellnessCategory.png");
//     }

//     // HERBAL JUICES
//     if (
//       combined.includes("herbaljuice") ||
//       combined.includes("herbaljuices") ||
//       combined.includes("juice")
//     ) {
//       return getUploadsCategoryUrl("HerbalJuicesCategory.png");
//     }

//     // DIGESTIVE CARE
//     if (
//       combined.includes("digestive") ||
//       combined.includes("digestion")
//     ) {
//       return getUploadsCategoryUrl("DigestiveCare.png");
//     }

//     // HAIR CARE
//     if (
//       combined.includes("haircare") ||
//       combined.includes("hair")
//     ) {
//       return getUploadsCategoryUrl("HairCare.png");
//     }

//     // IMMUNITY
//     if (
//       combined.includes("immunity") ||
//       combined.includes("immunebooster")
//     ) {
//       return getUploadsCategoryUrl("ImmunityBooster.png");
//     }

//     // SKIN CARE
//     if (
//       combined.includes("skincare") ||
//       combined.includes("skin")
//     ) {
//       return getUploadsCategoryUrl("SkinCare.png");
//     }

//     // TOOTHPASTE
//     if (
//       combined.includes("toothpaste") ||
//       combined.includes("tooth")
//     ) {
//       return getUploadsCategoryUrl("toothpaste.png");
//     }

//     // GENERAL FALLBACK
//     return getUploadsCategoryUrl("product1.png");
//   };

//   // =========================================================
//   // GET PRODUCT IMAGE
//   // =========================================================

//   const getProductImageUrl = (item) => {
//     if (!item) {
//       return getUploadsCategoryUrl("product1.png");
//     }

//     const image = String(
//       item.image ||
//         item.product_image ||
//         item.productImage ||
//         item.image_url ||
//         ""
//     ).trim();

//     // COMPLETE URL
//     if (
//       image.startsWith("http://") ||
//       image.startsWith("https://")
//     ) {
//       return image;
//     }

//     // EMPTY IMAGE
//     if (!image) {
//       return getCategoryFallbackImage(item);
//     }

//     // EXTRACT FILENAME FROM STORED PATH
//     let filename = image
//       .replace(/\\/g, "/")
//       .split("/")
//       .pop();

//     filename = String(filename || "").trim();

//     if (!filename) {
//       return getCategoryFallbackImage(item);
//     }

//     // IGNORE OLD NUMERIC IMAGE NAMES
//     // Example: 1787292711422.png

//     const numericImageName =
//       /^\d+\.(png|jpg|jpeg|webp)$/i.test(filename);

//     if (numericImageName) {
//       console.log(
//         "OLD IMAGE NAME FOUND:",
//         filename,
//         "Using category fallback"
//       );

//       return getCategoryFallbackImage(item);
//     }

//     // KNOWN EXISTING FILES

//     const knownImages = [
//       "DigestiveCare.png",
//       "HairCare.png",
//       "HerbalJuicesCategory.png",
//       "ImmunityBooster.png",
//       "product1.png",
//       "SkinCare.png",
//       "toothpaste.png",
//       "WomensWellnessCategory.png",
//     ];

//     const knownImage = knownImages.find(
//       (existingImage) =>
//         existingImage.toLowerCase() === filename.toLowerCase()
//     );

//     if (knownImage) {
//       return getUploadsCategoryUrl(knownImage);
//     }

//     // UNKNOWN FILENAME
//     // Try original filename first.
//     // onError will use category fallback.

//     return getUploadsCategoryUrl(filename);
//   };

//   // =========================================================
//   // STATUS COLORS
//   // =========================================================

//   const getStatusColors = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return {
//           color: "#b45309",
//           background: "#fff7d6",
//           border: "#fcd34d",
//         };

//       case "confirmed":
//         return {
//           color: "#2563eb",
//           background: "#eff6ff",
//           border: "#93c5fd",
//         };

//       case "processing":
//         return {
//           color: "#7c3aed",
//           background: "#f5f3ff",
//           border: "#c4b5fd",
//         };

//       case "shipped":
//         return {
//           color: "#0891b2",
//           background: "#ecfeff",
//           border: "#67e8f9",
//         };

//       case "delivered":
//         return {
//           color: "#15803d",
//           background: "#f0fdf4",
//           border: "#86efac",
//         };

//       case "cancelled":
//         return {
//           color: "#dc2626",
//           background: "#fef2f2",
//           border: "#fca5a5",
//         };

//       default:
//         return {
//           color: "#6b7280",
//           background: "#f3f4f6",
//           border: "#d1d5db",
//         };
//     }
//   };

//   // =========================================================
//   // STATUS STEPS
//   // =========================================================

//   const statusSteps = [
//     {
//       key: "pending",
//       label: "Pending",
//       icon: <PendingActionsIcon />,
//       color: "#d97706",
//       background: "#fff7d6",
//     },
//     {
//       key: "confirmed",
//       label: "Confirmed",
//       icon: <CheckCircleIcon />,
//       color: "#2563eb",
//       background: "#eff6ff",
//     },
//     {
//       key: "processing",
//       label: "Processing",
//       icon: <InventoryIcon />,
//       color: "#7c3aed",
//       background: "#f5f3ff",
//     },
//     {
//       key: "shipped",
//       label: "Shipped",
//       icon: <LocalShippingIcon />,
//       color: "#0891b2",
//       background: "#ecfeff",
//     },
//     {
//       key: "delivered",
//       label: "Delivered",
//       icon: <DoneAllIcon />,
//       color: "#15803d",
//       background: "#f0fdf4",
//     },
//   ];

//   // =========================================================
//   // NEXT STATUS
//   // =========================================================

//   const getNextStatus = () => {
//     const current = order?.status?.toLowerCase();

//     switch (current) {
//       case "pending":
//         return {
//           status: "confirmed",
//           label: "Accept Order",
//           color: "#2563eb",
//         };

//       case "confirmed":
//         return {
//           status: "processing",
//           label: "Process Order",
//           color: "#7c3aed",
//         };

//       case "processing":
//         return {
//           status: "shipped",
//           label: "Ship Order",
//           color: "#0891b2",
//         };

//       case "shipped":
//         return {
//           status: "delivered",
//           label: "Mark as Delivered",
//           color: "#15803d",
//         };

//       default:
//         return null;
//     }
//   };

//   // =========================================================
//   // UPDATE STATUS
//   // =========================================================

//   const updateStatus = async (newStatus) => {
//     try {
//       setUpdating(true);

//       const token = localStorage.getItem("adminToken");

//       const response = await axios.put(
//         `${API_BASE_URL}/api/orders/${id}/status`,
//         {
//           status: newStatus,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message || "Failed to update status"
//         );
//       }

//       setOrder((previous) => ({
//         ...previous,
//         status: newStatus,
//         updated_at:
//           response.data?.data?.updated_at ||
//           previous.updated_at,
//       }));
//     } catch (err) {
//       console.error("UPDATE STATUS ERROR:", err);

//       alert(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to update order status"
//       );
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // =========================================================
//   // DATE
//   // =========================================================

//   const formatDate = (date) => {
//     if (!date) return "-";

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return "-";
//     }

//     return parsedDate.toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     });
//   };

//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           background: "#f6f8f7",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           px: 2,
//         }}
//       >
//         <Box sx={{ textAlign: "center" }}>
//           <CircularProgress
//             size={36}
//             sx={{ color: "#15803d" }}
//           />

//           <Typography
//             sx={{
//               mt: 1.5,
//               color: "#6b7280",
//               fontSize: 14,
//             }}
//           >
//             Loading order details...
//           </Typography>
//         </Box>
//       </Box>
//     );
//   }

//   // =========================================================
//   // ERROR
//   // =========================================================

//   if (error || !order) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           background: "#f6f8f7",
//           p: {
//             xs: 2,
//             sm: 3,
//           },
//         }}
//       >
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate(-1)}
//           sx={{
//             color: "#15803d",
//             textTransform: "none",
//             fontWeight: 700,
//           }}
//         >
//           Back to Orders
//         </Button>

//         <Card
//           sx={{
//             maxWidth: 600,
//             mx: "auto",
//             mt: 6,
//             borderRadius: 3,
//             border: "1px solid #e5e7eb",
//           }}
//         >
//           <Box
//             sx={{
//               textAlign: "center",
//               py: 7,
//               px: 3,
//             }}
//           >
//             <CancelIcon
//               sx={{
//                 fontSize: 50,
//                 color: "#dc2626",
//               }}
//             />

//             <Typography
//               sx={{
//                 mt: 1.5,
//                 fontWeight: 800,
//                 fontSize: 22,
//               }}
//             >
//               Order Not Found
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 0.8,
//                 color: "#6b7280",
//                 fontSize: 14,
//                 overflowWrap: "anywhere",
//               }}
//             >
//               {error || "Unable to find this order."}
//             </Typography>

//             <Button
//               variant="contained"
//               onClick={() => navigate("/orders")}
//               sx={{
//                 mt: 2.5,
//                 background: "#15803d",
//                 textTransform: "none",
//                 borderRadius: 2,
//                 fontWeight: 700,
//                 "&:hover": {
//                   background: "#166534",
//                 },
//               }}
//             >
//               Back to Orders
//             </Button>
//           </Box>
//         </Card>
//       </Box>
//     );
//   }

//   // =========================================================
//   // STATUS DATA
//   // =========================================================

//   const currentStatus = order.status?.toLowerCase();

//   const currentStepIndex = statusSteps.findIndex(
//     (step) => step.key === currentStatus
//   );

//   const nextAction = getNextStatus();

//   const statusColors = getStatusColors(currentStatus);

//   // =========================================================
//   // TOTAL ITEMS
//   // =========================================================

//   const totalItems =
//     order.items?.reduce(
//       (total, item) => total + Number(item.quantity || 0),
//       0
//     ) || 0;

//   // =========================================================
//   // ADDRESS
//   // =========================================================

//   const address = [
//     order.address_line,
//     order.area,
//     order.city,
//     order.state,
//   ]
//     .filter(Boolean)
//     .join(", ");

//   const completeAddress = order.pincode
//     ? `${address} - ${order.pincode}`
//     : address;

//   // =========================================================
//   // MAIN
//   // =========================================================

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100%",
//         overflowX: "hidden",
//         boxSizing: "border-box",
//         background:
//           "linear-gradient(180deg, #f7faf8 0%, #f4f7f5 100%)",
//         px: {
//           xs: 1.5,
//           sm: 2.5,
//           md: 3,
//         },
//         py: {
//           xs: 2,
//           md: 2.5,
//         },
//       }}
//     >
//       {/* HEADER */}

//       <Box
//         sx={{
//           maxWidth: 1100,
//           mx: "auto",
//           mb: 2,
//         }}
//       >
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate(-1)}
//           sx={{
//             color: "#15803d",
//             textTransform: "none",
//             fontWeight: 700,
//             px: 0,
//             mb: 0.5,
//             "&:hover": {
//               background: "transparent",
//               color: "#166534",
//             },
//           }}
//         >
//           Back to Customer Orders
//         </Button>

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: {
//               xs: "flex-start",
//               sm: "center",
//             },
//             justifyContent: "space-between",
//             flexDirection: {
//               xs: "column",
//               sm: "row",
//             },
//             gap: 1,
//           }}
//         >
//           <Box>
//             <Typography
//               sx={{
//                 fontSize: {
//                   xs: 22,
//                   sm: 25,
//                 },
//                 fontWeight: 800,
//                 color: "#17211b",
//               }}
//             >
//               Order #{order.id}
//             </Typography>

//             <Typography
//               sx={{
//                 color: "#6b7280",
//                 fontSize: 12,
//                 mt: 0.2,
//               }}
//             >
//               Placed on {formatDate(order.created_at)}
//             </Typography>
//           </Box>

//           <Chip
//             label={order.status || "Unknown"}
//             sx={{
//               height: 30,
//               px: 0.4,
//               textTransform: "capitalize",
//               fontWeight: 800,
//               fontSize: 12,
//               background: statusColors.background,
//               color: statusColors.color,
//               border: `1px solid ${statusColors.border}`,
//             }}
//           />
//         </Box>
//       </Box>

//       {/* ORDER STATUS */}

//       <Card
//         sx={{
//           maxWidth: 1100,
//           mx: "auto",
//           mb: 2,
//           borderRadius: 2.5,
//           border: "1px solid #e5ebe7",
//           boxShadow: "0 3px 14px rgba(25, 70, 40, 0.05)",
//         }}
//       >
//         <Box
//           sx={{
//             px: {
//               xs: 1.5,
//               sm: 2,
//             },
//             py: {
//               xs: 1.3,
//               sm: 1.5,
//             },
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               mb: 1.2,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontWeight: 800,
//                 fontSize: 15,
//                 color: "#17211b",
//               }}
//             >
//               Order Status
//             </Typography>

//             {currentStatus === "delivered" && (
//               <Typography
//                 sx={{
//                   color: "#15803d",
//                   fontSize: 11,
//                   fontWeight: 800,
//                 }}
//               >
//                 Completed
//               </Typography>
//             )}
//           </Box>

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               width: "100%",
//               overflowX: "auto",
//               pb: 0.3,
//               "&::-webkit-scrollbar": {
//                 height: 3,
//               },
//             }}
//           >
//             {statusSteps.map((step, index) => {
//               const completed = currentStepIndex >= index;
//               const active = currentStatus === step.key;

//               return (
//                 <React.Fragment key={step.key}>
//                   <Box
//                     sx={{
//                       flex: {
//                         xs: "0 0 90px",
//                         sm: 1,
//                       },
//                       minWidth: {
//                         xs: 90,
//                         sm: 0,
//                       },
//                       textAlign: "center",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: 28,
//                         height: 28,
//                         mx: "auto",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         background: completed
//                           ? step.color
//                           : "#edf0ee",
//                         color: completed
//                           ? "#fff"
//                           : "#9ca3af",
//                       }}
//                     >
//                       {React.cloneElement(step.icon, {
//                         sx: {
//                           fontSize: 15,
//                         },
//                       })}
//                     </Box>

//                     <Typography
//                       sx={{
//                         mt: 0.45,
//                         fontSize: 10,
//                         fontWeight: 800,
//                         color: completed
//                           ? step.color
//                           : "#9ca3af",
//                       }}
//                     >
//                       {step.label}
//                     </Typography>

//                     {active && (
//                       <Typography
//                         sx={{
//                           fontSize: 8,
//                           color: step.color,
//                           fontWeight: 700,
//                         }}
//                       >
//                         Current
//                       </Typography>
//                     )}
//                   </Box>

//                   {index < statusSteps.length - 1 && (
//                     <Box
//                       sx={{
//                         height: 2,
//                         flex: "0 0 20px",
//                         background:
//                           currentStepIndex > index
//                             ? statusSteps[index].color
//                             : "#e5e7eb",
//                         borderRadius: 3,
//                       }}
//                     />
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </Box>

//           {nextAction && (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: {
//                   xs: "stretch",
//                   sm: "flex-end",
//                 },
//                 mt: 1,
//               }}
//             >
//               <Button
//                 fullWidth={false}
//                 variant="contained"
//                 size="small"
//                 disabled={updating}
//                 onClick={() => updateStatus(nextAction.status)}
//                 sx={{
//                   width: {
//                     xs: "100%",
//                     sm: "auto",
//                   },
//                   background: nextAction.color,
//                   textTransform: "none",
//                   fontWeight: 800,
//                   borderRadius: 1.5,
//                   px: 1.8,
//                   py: 0.65,
//                   fontSize: 11.5,
//                   boxShadow: "none",
//                   "&:hover": {
//                     background: nextAction.color,
//                     filter: "brightness(0.92)",
//                     boxShadow: "none",
//                   },
//                 }}
//               >
//                 {updating ? "Updating..." : nextAction.label}
//               </Button>
//             </Box>
//           )}

//           {currentStatus === "delivered" && (
//             <Box
//               sx={{
//                 mt: 1,
//                 px: 1.2,
//                 py: 0.7,
//                 borderRadius: 1.5,
//                 background: "#f0fdf4",
//                 color: "#15803d",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 0.6,
//               }}
//             >
//               <DoneAllIcon sx={{ fontSize: 16 }} />

//               <Typography
//                 sx={{
//                   fontSize: 11,
//                   fontWeight: 800,
//                 }}
//               >
//                 Order Delivered Successfully
//               </Typography>
//             </Box>
//           )}

//           {currentStatus === "cancelled" && (
//             <Box
//               sx={{
//                 mt: 1,
//                 px: 1.2,
//                 py: 0.7,
//                 borderRadius: 1.5,
//                 background: "#fef2f2",
//                 color: "#dc2626",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 0.6,
//               }}
//             >
//               <CancelIcon sx={{ fontSize: 16 }} />

//               <Typography
//                 sx={{
//                   fontSize: 11,
//                   fontWeight: 800,
//                 }}
//               >
//                 Order Cancelled
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </Card>

//       {/* CUSTOMER DETAILS */}

//       <Card
//         sx={{
//           maxWidth: 1100,
//           mx: "auto",
//           mb: 2,
//           borderRadius: 2.5,
//           border: "1px solid #e5ebe7",
//           boxShadow: "0 3px 14px rgba(25, 70, 40, 0.05)",
//         }}
//       >
//         <Box
//           sx={{
//             p: {
//               xs: 1.7,
//               sm: 2,
//             },
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 0.8,
//               mb: 1.3,
//             }}
//           >
//             <Box
//               sx={{
//                 width: 31,
//                 height: 31,
//                 borderRadius: 1.3,
//                 background: "#eaf7ef",
//                 color: "#15803d",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <PersonIcon sx={{ fontSize: 17 }} />
//             </Box>

//             <Typography
//               sx={{
//                 fontSize: 15,
//                 fontWeight: 800,
//                 color: "#17211b",
//               }}
//             >
//               Customer Details
//             </Typography>
//           </Box>

//           <Divider sx={{ mb: 1.5 }} />

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "1fr 1fr",
//               },
//               gap: 1.3,
//             }}
//           >
//             {/* CUSTOMER NAME */}

//             <Box
//               sx={{
//                 background: "#fafcfb",
//                 border: "1px solid #edf1ee",
//                 borderRadius: 1.7,
//                 p: 1.3,
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: 10,
//                   color: "#6b7280",
//                   fontWeight: 700,
//                   mb: 0.3,
//                 }}
//               >
//                 CUSTOMER NAME
//               </Typography>

//               <Typography
//                 sx={{
//                   fontSize: 13.5,
//                   fontWeight: 800,
//                   color: "#17211b",
//                   overflowWrap: "anywhere",
//                 }}
//               >
//                 {order.full_name || "Customer"}
//               </Typography>
//             </Box>

//             {/* PHONE */}

//             <Box
//               sx={{
//                 background: "#fafcfb",
//                 border: "1px solid #edf1ee",
//                 borderRadius: 1.7,
//                 p: 1.3,
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: 10,
//                   color: "#6b7280",
//                   fontWeight: 700,
//                   mb: 0.3,
//                 }}
//               >
//                 PHONE
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.6,
//                 }}
//               >
//                 <PhoneIcon
//                   sx={{
//                     fontSize: 16,
//                     color: "#15803d",
//                   }}
//                 />

//                 <Typography
//                   sx={{
//                     fontSize: 13.5,
//                     fontWeight: 800,
//                     color: "#17211b",
//                     overflowWrap: "anywhere",
//                   }}
//                 >
//                   {order.phone || "-"}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* ADDRESS */}

//             <Box
//               sx={{
//                 gridColumn: {
//                   xs: "auto",
//                   sm: "1 / -1",
//                 },
//                 background: "#fafcfb",
//                 border: "1px solid #edf1ee",
//                 borderRadius: 1.7,
//                 p: 1.3,
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: 10,
//                   color: "#6b7280",
//                   fontWeight: 700,
//                   mb: 0.4,
//                 }}
//               >
//                 CUSTOMER ADDRESS
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   gap: 0.6,
//                 }}
//               >
//                 <LocationOnOutlinedIcon
//                   sx={{
//                     fontSize: 17,
//                     color: "#15803d",
//                     mt: 0.1,
//                     flexShrink: 0,
//                   }}
//                 />

//                 <Typography
//                   sx={{
//                     fontSize: 13,
//                     lineHeight: 1.5,
//                     color: "#374151",
//                     fontWeight: 600,
//                     overflowWrap: "anywhere",
//                   }}
//                 >
//                   {completeAddress || "Address not available"}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       </Card>

//       {/* ORDER DETAILS */}

//       <Card
//         sx={{
//           maxWidth: 1100,
//           mx: "auto",
//           borderRadius: 2.5,
//           border: "1px solid #e5ebe7",
//           boxShadow: "0 3px 14px rgba(25, 70, 40, 0.05)",
//           overflow: "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             p: {
//               xs: 1.7,
//               sm: 2,
//             },
//           }}
//         >
//           {/* HEADER */}

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 1,
//               mb: 1.3,
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 0.8,
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 31,
//                   height: 31,
//                   borderRadius: 1.3,
//                   background: "#eaf7ef",
//                   color: "#15803d",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                 }}
//               >
//                 <ShoppingBagOutlinedIcon sx={{ fontSize: 17 }} />
//               </Box>

//               <Typography
//                 sx={{
//                   fontSize: 15,
//                   fontWeight: 800,
//                   color: "#17211b",
//                 }}
//               >
//                 Order Details
//               </Typography>
//             </Box>

//             <Typography
//               sx={{
//                 fontSize: 11,
//                 color: "#6b7280",
//                 fontWeight: 700,
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {order.items?.length || 0} Product
//               {order.items?.length === 1 ? "" : "s"}
//             </Typography>
//           </Box>

//           <Divider />

//           {/* PRODUCTS */}

//           {order.items && order.items.length > 0 ? (
//             <Box>
//               {order.items.map((item, index) => {
//                 const imageUrl = getProductImageUrl(item);

//                 const quantity = Number(item.quantity || 0);
//                 const price = Number(item.price || 0);
//                 const itemTotal = quantity * price;

//                 return (
//                   <Box key={item.id || index}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: {
//                           xs: 1,
//                           sm: 1.5,
//                         },
//                         py: 1.4,
//                       }}
//                     >
//                       {/* IMAGE */}

//                       <ProductImage
//                         item={item}
//                         imageUrl={imageUrl}
//                         getFallbackImage={getCategoryFallbackImage}
//                       />

//                       {/* NAME + QTY */}

//                       <Box
//                         sx={{
//                           flex: 1,
//                           minWidth: 0,
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: 13.5,
//                             fontWeight: 800,
//                             color: "#17211b",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {item.name ||
//                             item.product_name ||
//                             "Product"}
//                         </Typography>

//                         <Typography
//                           sx={{
//                             mt: 0.35,
//                             fontSize: 11.5,
//                             color: "#6b7280",
//                           }}
//                         >
//                           Quantity: <strong>{quantity}</strong>
//                         </Typography>

//                         <Typography
//                           sx={{
//                             mt: 0.15,
//                             fontSize: 11.5,
//                             color: "#6b7280",
//                           }}
//                         >
//                           Price: ₹{price.toFixed(2)}
//                         </Typography>
//                       </Box>

//                       {/* TOTAL */}

//                       <Typography
//                         sx={{
//                           fontSize: {
//                             xs: 12.5,
//                             sm: 14,
//                           },
//                           fontWeight: 900,
//                           color: "#15803d",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         ₹{itemTotal.toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {index < order.items.length - 1 && <Divider />}
//                   </Box>
//                 );
//               })}
//             </Box>
//           ) : (
//             <Box
//               sx={{
//                 py: 4,
//                 textAlign: "center",
//               }}
//             >
//               <ShoppingBagOutlinedIcon
//                 sx={{
//                   fontSize: 36,
//                   color: "#c4cbc6",
//                 }}
//               />

//               <Typography
//                 sx={{
//                   mt: 0.7,
//                   color: "#6b7280",
//                   fontSize: 12,
//                 }}
//               >
//                 No products found
//               </Typography>
//             </Box>
//           )}

//           {/* PAYMENT + SUMMARY */}

//           <Divider sx={{ my: 1.5 }} />

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "1fr 1fr",
//               },
//               gap: 1.5,
//             }}
//           >
//             {/* PAYMENT */}

//             <Box
//               sx={{
//                 background: "#fafcfb",
//                 border: "1px solid #edf1ee",
//                 borderRadius: 1.7,
//                 p: 1.5,
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.7,
//                   mb: 0.8,
//                 }}
//               >
//                 <PaymentIcon
//                   sx={{
//                     fontSize: 17,
//                     color: "#15803d",
//                   }}
//                 />

//                 <Typography
//                   sx={{
//                     fontSize: 13.5,
//                     fontWeight: 800,
//                   }}
//                 >
//                   Payment
//                 </Typography>
//               </Box>

//               <Typography
//                 sx={{
//                   fontSize: 10,
//                   color: "#6b7280",
//                   fontWeight: 700,
//                 }}
//               >
//                 PAYMENT METHOD
//               </Typography>

//               <Typography
//                 sx={{
//                   mt: 0.3,
//                   fontSize: 13.5,
//                   fontWeight: 800,
//                   textTransform: "uppercase",
//                   color: "#17211b",
//                 }}
//               >
//                 {order.payment_method || "COD"}
//               </Typography>
//             </Box>

//             {/* SUMMARY */}

//             <Box
//               sx={{
//                 background: "#f0fdf4",
//                 border: "1px solid #d1fae5",
//                 borderRadius: 1.7,
//                 p: 1.5,
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: 13.5,
//                   fontWeight: 800,
//                   mb: 0.8,
//                 }}
//               >
//                 Order Summary
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: 11.5,
//                     color: "#6b7280",
//                   }}
//                 >
//                   Total Items
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: 12.5,
//                     fontWeight: 800,
//                   }}
//                 >
//                   {totalItems}
//                 </Typography>
//               </Box>

//               <Divider sx={{ my: 0.8 }} />

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   gap: 1,
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: 13,
//                     fontWeight: 800,
//                   }}
//                 >
//                   Total Amount
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: 17,
//                     fontWeight: 900,
//                     color: "#15803d",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   ₹{Number(order.total_amount || 0).toFixed(2)}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       </Card>

//       <Box sx={{ height: 25 }} />
//     </Box>
//   );
// }

// // =============================================================
// // PRODUCT IMAGE COMPONENT
// // =============================================================

// function ProductImage({
//   item,
//   imageUrl,
//   getFallbackImage,
// }) {
//   const [src, setSrc] = useState(imageUrl);

//   useEffect(() => {
//     setSrc(imageUrl);
//   }, [imageUrl]);

//   const handleImageError = () => {
//     console.error("IMAGE FAILED:", src, "ITEM:", item);

//     const fallback = getFallbackImage(item);

//     if (fallback && fallback !== src) {
//       console.log("USING FALLBACK IMAGE:", fallback);
//       setSrc(fallback);
//     } else {
//       setSrc(null);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: {
//           xs: 58,
//           sm: 66,
//         },
//         height: {
//           xs: 58,
//           sm: 66,
//         },
//         minWidth: {
//           xs: 58,
//           sm: 66,
//         },
//         borderRadius: 1.8,
//         background: "#f5f8f6",
//         border: "1px solid #e5ebe7",
//         overflow: "hidden",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {src ? (
//         <Box
//           component="img"
//           src={src}
//           alt={item?.name || "Product"}
//           onError={handleImageError}
//           sx={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             display: "block",
//           }}
//         />
//       ) : (
//         <ShoppingBagOutlinedIcon
//           sx={{
//             fontSize: 27,
//             color: "#aab4ad",
//           }}
//         />
//       )}
//     </Box>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";

import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../api";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // =========================================================
  // FETCH ORDER
  // =========================================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/api/orders/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("================================");
      console.log("ORDER DETAILS RESPONSE:", response.data);
      console.log("================================");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to fetch order"
        );
      }

      const orderData = response.data.data;

      console.log("ORDER DATA:", orderData);
      console.log("ORDER ITEMS:", orderData?.items);

      setOrder(orderData);
    } catch (err) {
      console.error("FETCH ORDER DETAILS ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  // =========================================================
  // BASE IMAGE URL
  // =========================================================

  const getUploadsCategoryUrl = (filename) => {
    if (!filename) return null;

    return `${API_BASE_URL}/uploads/categories/${filename}`;
  };

  // =========================================================
  // NORMALIZE TEXT
  // =========================================================

  const normalizeText = (value) => {
    return String(value || "")
      .toLowerCase()
      .replace(/[\s_-]+/g, "")
      .trim();
  };

  // =========================================================
  // GET CATEGORY FALLBACK IMAGE
  // =========================================================

  const getCategoryFallbackImage = (item) => {
    if (!item) {
      return getUploadsCategoryUrl("product1.png");
    }

    const categoryName = normalizeText(
      item.category_name ||
        item.category ||
        item.categoryName ||
        ""
    );

    const productName = normalizeText(
      item.name ||
        item.product_name ||
        item.productName ||
        ""
    );

    const combined = `${categoryName}${productName}`;

    console.log("IMAGE FALLBACK CHECK:", {
      categoryName,
      productName,
      combined,
    });

    // WOMEN'S WELLNESS
    if (
      combined.includes("womenswellness") ||
      combined.includes("womenshealth") ||
      combined.includes("womenwellness")
    ) {
      return getUploadsCategoryUrl("WomensWellnessCategory.png");
    }

    // HERBAL JUICES
    if (
      combined.includes("herbaljuice") ||
      combined.includes("herbaljuices") ||
      combined.includes("juice")
    ) {
      return getUploadsCategoryUrl("HerbalJuicesCategory.png");
    }

    // DIGESTIVE CARE
    if (
      combined.includes("digestive") ||
      combined.includes("digestion")
    ) {
      return getUploadsCategoryUrl("DigestiveCare.png");
    }

    // HAIR CARE
    if (
      combined.includes("haircare") ||
      combined.includes("hair")
    ) {
      return getUploadsCategoryUrl("HairCare.png");
    }

    // IMMUNITY
    if (
      combined.includes("immunity") ||
      combined.includes("immunebooster")
    ) {
      return getUploadsCategoryUrl("ImmunityBooster.png");
    }

    // SKIN CARE
    if (
      combined.includes("skincare") ||
      combined.includes("skin")
    ) {
      return getUploadsCategoryUrl("SkinCare.png");
    }

    // TOOTHPASTE
    if (
      combined.includes("toothpaste") ||
      combined.includes("tooth")
    ) {
      return getUploadsCategoryUrl("toothpaste.png");
    }

    // GENERAL FALLBACK
    return getUploadsCategoryUrl("product1.png");
  };

  // =========================================================
  // GET PRODUCT IMAGE
  // =========================================================

  const getProductImageUrl = (item) => {
    if (!item) {
      return getUploadsCategoryUrl("product1.png");
    }

    const image = String(
      item.image ||
        item.product_image ||
        item.productImage ||
        item.image_url ||
        ""
    ).trim();

    // COMPLETE URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // EMPTY IMAGE
    if (!image) {
      return getCategoryFallbackImage(item);
    }

    // EXTRACT FILENAME FROM STORED PATH
    let filename = image.replace(/\\/g, "/").split("/").pop();

    filename = String(filename || "").trim();

    if (!filename) {
      return getCategoryFallbackImage(item);
    }

    // IGNORE OLD NUMERIC IMAGE NAMES
    const numericImageName =
      /^\d+\.(png|jpg|jpeg|webp)$/i.test(filename);

    if (numericImageName) {
      console.log(
        "OLD IMAGE NAME FOUND:",
        filename,
        "Using category fallback"
      );

      return getCategoryFallbackImage(item);
    }

    // KNOWN EXISTING FILES
    const knownImages = [
      "DigestiveCare.png",
      "HairCare.png",
      "HerbalJuicesCategory.png",
      "ImmunityBooster.png",
      "product1.png",
      "SkinCare.png",
      "toothpaste.png",
      "WomensWellnessCategory.png",
    ];

    const knownImage = knownImages.find(
      (existingImage) =>
        existingImage.toLowerCase() === filename.toLowerCase()
    );

    if (knownImage) {
      return getUploadsCategoryUrl(knownImage);
    }

    // UNKNOWN FILENAME
    return getUploadsCategoryUrl(filename);
  };

  // =========================================================
  // STATUS COLORS
  // =========================================================

  const getStatusColors = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          color: "#b45309",
          background: "#fff7d6",
          border: "#fcd34d",
        };

      case "confirmed":
        return {
          color: "#2563eb",
          background: "#eff6ff",
          border: "#93c5fd",
        };

      case "processing":
        return {
          color: "#7c3aed",
          background: "#f5f3ff",
          border: "#c4b5fd",
        };

      case "shipped":
        return {
          color: "#0891b2",
          background: "#ecfeff",
          border: "#67e8f9",
        };

      case "delivered":
        return {
          color: "#15803d",
          background: "#f0fdf4",
          border: "#86efac",
        };

      case "cancelled":
        return {
          color: "#dc2626",
          background: "#fef2f2",
          border: "#fca5a5",
        };

      default:
        return {
          color: "#6b7280",
          background: "#f3f4f6",
          border: "#d1d5db",
        };
    }
  };

  // =========================================================
  // STATUS STEPS
  // =========================================================

  const statusSteps = [
    {
      key: "pending",
      label: "Pending",
      icon: <PendingActionsIcon />,
      color: "#d97706",
      background: "#fff7d6",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      icon: <CheckCircleIcon />,
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      key: "processing",
      label: "Processing",
      icon: <InventoryIcon />,
      color: "#7c3aed",
      background: "#f5f3ff",
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: <LocalShippingIcon />,
      color: "#0891b2",
      background: "#ecfeff",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: <DoneAllIcon />,
      color: "#15803d",
      background: "#f0fdf4",
    },
  ];

  // =========================================================
  // NEXT STATUS
  // =========================================================

  const getNextStatus = () => {
    const current = order?.status?.toLowerCase();

    switch (current) {
      case "pending":
        return {
          status: "confirmed",
          label: "Accept Order",
          color: "#2563eb",
        };

      case "confirmed":
        return {
          status: "processing",
          label: "Process Order",
          color: "#7c3aed",
        };

      case "processing":
        return {
          status: "shipped",
          label: "Ship Order",
          color: "#0891b2",
        };

      case "shipped":
        return {
          status: "delivered",
          label: "Mark as Delivered",
          color: "#15803d",
        };

      default:
        return null;
    }
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);

      const token = localStorage.getItem("adminToken");

      const response = await axios.put(
        `${API_BASE_URL}/api/orders/${id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to update status"
        );
      }

      setOrder((previous) => ({
        ...previous,
        status: newStatus,
        updated_at:
          response.data?.data?.updated_at ||
          previous.updated_at,
      }));
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f6f8f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          fontFamily: "Inter",
          "& *": {
            fontFamily: "Inter",
          },
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={36}
            sx={{ color: "#15803d" }}
          />

          <Typography
            sx={{
              mt: 1.5,
              color: "#6b7280",
              fontSize: 14,
              fontFamily: "Inter",
              fontWeight: 400,
            }}
          >
            Loading order details...
          </Typography>
        </Box>
      </Box>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !order) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f6f8f7",
          p: {
            xs: 2,
            sm: 3,
          },
          fontFamily: "Inter",
          "& *": {
            fontFamily: "Inter",
          },
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: "#15803d",
            textTransform: "none",
            fontWeight: 600,
            fontFamily: "Inter",
          }}
        >
          Back to Orders
        </Button>

        <Card
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 6,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              py: 7,
              px: 3,
            }}
          >
            <CancelIcon
              sx={{
                fontSize: 50,
                color: "#dc2626",
              }}
            />

            <Typography
              sx={{
                mt: 1.5,
                fontWeight: 700,
                fontSize: 22,
                fontFamily: "Inter",
              }}
            >
              Order Not Found
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: "#6b7280",
                fontSize: 14,
                overflowWrap: "anywhere",
                fontFamily: "Inter",
                fontWeight: 400,
              }}
            >
              {error || "Unable to find this order."}
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/orders")}
              sx={{
                mt: 2.5,
                background: "#15803d",
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
                fontFamily: "Inter",
                "&:hover": {
                  background: "#166534",
                },
              }}
            >
              Back to Orders
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  // =========================================================
  // STATUS DATA
  // =========================================================

  const currentStatus = order.status?.toLowerCase();

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === currentStatus
  );

  const nextAction = getNextStatus();
  const statusColors = getStatusColors(currentStatus);

  // =========================================================
  // TOTAL ITEMS
  // =========================================================

  const totalItems =
    order.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    ) || 0;

  // =========================================================
  // ADDRESS
  // =========================================================

  const address = [
    order.address_line,
    order.area,
    order.city,
    order.state,
  ]
    .filter(Boolean)
    .join(", ");

  const completeAddress = order.pincode
    ? `${address} - ${order.pincode}`
    : address;

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
        background:
          "linear-gradient(180deg, #f7faf8 0%, #f4f7f5 100%)",
        fontFamily: "Inter",
        "& *": {
          fontFamily: "Inter",
        },
        px: {
          xs: 1.5,
          sm: 2.5,
          md: 3,
        },
        py: {
          xs: 2,
          md: 2.5,
        },
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mb: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: "#15803d",
            textTransform: "none",
            fontWeight: 600,
            fontFamily: "Inter",
            px: 0,
            mb: 0.5,
            "&:hover": {
              background: "transparent",
              color: "#166534",
            },
          }}
        >
          Back to Customer Orders
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 25,
                },
                fontWeight: 700,
                color: "#17211b",
                fontFamily: "Inter",
              }}
            >
              Order #{order.id}
            </Typography>

            <Typography
              sx={{
                color: "#6b7280",
                fontSize: 12,
                mt: 0.2,
                fontFamily: "Inter",
                fontWeight: 400,
              }}
            >
              Placed on {formatDate(order.created_at)}
            </Typography>
          </Box>

          <Chip
            label={order.status || "Unknown"}
            sx={{
              height: 30,
              px: 0.4,
              textTransform: "capitalize",
              fontWeight: 600,
              fontFamily: "Inter",
              fontSize: 12,
              background: statusColors.background,
              color: statusColors.color,
              border: `1px solid ${statusColors.border}`,
              "& .MuiChip-label": {
                fontFamily: "Inter",
                fontWeight: 600,
              },
            }}
          />
        </Box>
      </Box>

      {/* ORDER STATUS */}

      <Card
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mb: 2,
          borderRadius: 2.5,
          border: "1px solid #e5ebe7",
          boxShadow: "0 3px 14px rgba(25, 70, 40, 0.05)",
        }}
      >
        <Box
          sx={{
            px: {
              xs: 1.5,
              sm: 2,
            },
            py: {
              xs: 1.3,
              sm: 1.5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 15,
                color: "#17211b",
                fontFamily: "Inter",
              }}
            >
              Order Status
            </Typography>

            {currentStatus === "delivered" && (
              <Typography
                sx={{
                  color: "#15803d",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "Inter",
                }}
              >
                Completed
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              overflowX: "auto",
              pb: 0.3,
              "&::-webkit-scrollbar": {
                height: 3,
              },
            }}
          >
            {statusSteps.map((step, index) => {
              const completed = currentStepIndex >= index;
              const active = currentStatus === step.key;

              return (
                <React.Fragment key={step.key}>
                  <Box
                    sx={{
                      flex: {
                        xs: "0 0 90px",
                        sm: 1,
                      },
                      minWidth: {
                        xs: 90,
                        sm: 0,
                      },
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        mx: "auto",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: completed
                          ? step.color
                          : "#edf0ee",
                        color: completed
                          ? "#fff"
                          : "#9ca3af",
                      }}
                    >
                      {React.cloneElement(step.icon, {
                        sx: {
                          fontSize: 15,
                        },
                      })}
                    </Box>

                    <Typography
                      sx={{
                        mt: 0.45,
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: "Inter",
                        color: completed
                          ? step.color
                          : "#9ca3af",
                      }}
                    >
                      {step.label}
                    </Typography>

                    {active && (
                      <Typography
                        sx={{
                          fontSize: 8,
                          color: step.color,
                          fontWeight: 600,
                          fontFamily: "Inter",
                        }}
                      >
                        Current
                      </Typography>
                    )}
                  </Box>

                  {index < statusSteps.length - 1 && (
                    <Box
                      sx={{
                        height: 2,
                        flex: "0 0 20px",
                        background:
                          currentStepIndex > index
                            ? statusSteps[index].color
                            : "#e5e7eb",
                        borderRadius: 3,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Box>

          {nextAction && (
            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "stretch",
                  sm: "flex-end",
                },
                mt: 1,
              }}
            >
              <Button
                fullWidth={false}
                variant="contained"
                size="small"
                disabled={updating}
                onClick={() => updateStatus(nextAction.status)}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                  background: nextAction.color,
                  textTransform: "none",
                  fontWeight: 600,
                  fontFamily: "Inter",
                  borderRadius: 1.5,
                  px: 1.8,
                  py: 0.65,
                  fontSize: 11.5,
                  boxShadow: "none",
                  "&:hover": {
                    background: nextAction.color,
                    filter: "brightness(0.92)",
                    boxShadow: "none",
                  },
                }}
              >
                {updating ? "Updating..." : nextAction.label}
              </Button>
            </Box>
          )}

          {currentStatus === "delivered" && (
            <Box
              sx={{
                mt: 1,
                px: 1.2,
                py: 0.7,
                borderRadius: 1.5,
                background: "#f0fdf4",
                color: "#15803d",
                display: "flex",
                alignItems: "center",
                gap: 0.6,
              }}
            >
              <DoneAllIcon sx={{ fontSize: 16 }} />

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "Inter",
                }}
              >
                Order Delivered Successfully
              </Typography>
            </Box>
          )}

          {currentStatus === "cancelled" && (
            <Box
              sx={{
                mt: 1,
                px: 1.2,
                py: 0.7,
                borderRadius: 1.5,
                background: "#fef2f2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                gap: 0.6,
              }}
            >
              <CancelIcon sx={{ fontSize: 16 }} />

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "Inter",
                }}
              >
                Order Cancelled
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      {/* CUSTOMER DETAILS */}

      <Card
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mb: 2,
          borderRadius: 2.5,
          border: "1px solid #e5ebe7",
          boxShadow: "0 3px 14px rgba(25, 70, 40, 0.05)",
        }}
      >
        <Box
          sx={{
            p: {
              xs: 1.7,
              sm: 2,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              mb: 1.3,
            }}
          >
            <Box
              sx={{
                width: 31,
                height: 31,
                borderRadius: 1.3,
                background: "#eaf7ef",
                color: "#15803d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonIcon sx={{ fontSize: 17 }} />
            </Box>

            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: "#17211b",
                fontFamily: "Inter",
              }}
            >
              Customer Details
            </Typography>
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 1.3,
            }}
          >
            {/* CUSTOMER NAME */}

            <Box
              sx={{
                background: "#fafcfb",
                border: "1px solid #edf1ee",
                borderRadius: 1.7,
                p: 1.3,
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#6b7280",
                  fontWeight: 500,
                  fontFamily: "Inter",
                  mb: 0.3,
                }}
              >
                CUSTOMER NAME
              </Typography>

              <Typography
                sx={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#17211b",
                  fontFamily: "Inter",
                  overflowWrap: "anywhere",
                }}
              >
                {order.full_name || "Customer"}
              </Typography>
            </Box>

            {/* PHONE */}

            <Box
              sx={{
                background: "#fafcfb",
                border: "1px solid #edf1ee",
                borderRadius: 1.7,
                p: 1.3,
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#6b7280",
                  fontWeight: 500,
                  fontFamily: "Inter",
                  mb: 0.3,
                }}
              >
                PHONE
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.6,
                }}
              >
                <PhoneIcon
                  sx={{
                    fontSize: 16,
                    color: "#15803d",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#17211b",
                    fontFamily: "Inter",
                    overflowWrap: "anywhere",
                  }}
                >
                  {order.phone || "-"}
                </Typography>
              </Box>
            </Box>

            {/* ADDRESS */}

            <Box
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
                background: "#fafcfb",
                border: "1px solid #edf1ee",
                borderRadius: 1.7,
                p: 1.3,
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#6b7280",
                  fontWeight: 500,
                  fontFamily: "Inter",
                  mb: 0.4,
                }}
              >
                CUSTOMER ADDRESS
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 0.6,
                }}
              >
                <LocationOnOutlinedIcon
                  sx={{
                    fontSize: 17,
                    color: "#15803d",
                    mt: 0.1,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "#374151",
                    fontWeight: 400,
                    fontFamily: "Inter",
                    overflowWrap: "anywhere",
                  }}
                >
                  {completeAddress || "Address not available"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* ORDER DETAILS */}

      <Card
        sx={{
          maxWidth: 1100,
          mx: "auto",
          borderRadius: 2.5,
          border: "1px solid #e5ebe7",
          boxShadow: "0 3px 14px rgba(25, 70, 40, 0.05)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: {
              xs: 1.7,
              sm: 2,
            },
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: 1.3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
              }}
            >
              <Box
                sx={{
                  width: 31,
                  height: 31,
                  borderRadius: 1.3,
                  background: "#eaf7ef",
                  color: "#15803d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 17 }} />
              </Box>

              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#17211b",
                  fontFamily: "Inter",
                }}
              >
                Order Details
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 11,
                color: "#6b7280",
                fontWeight: 500,
                fontFamily: "Inter",
                whiteSpace: "nowrap",
              }}
            >
              {order.items?.length || 0} Product
              {order.items?.length === 1 ? "" : "s"}
            </Typography>
          </Box>

          <Divider />

          {/* PRODUCTS */}

          {order.items && order.items.length > 0 ? (
            <Box>
              {order.items.map((item, index) => {
                const imageUrl = getProductImageUrl(item);
                const quantity = Number(item.quantity || 0);
                const price = Number(item.price || 0);
                const itemTotal = quantity * price;

                return (
                  <Box key={item.id || index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: {
                          xs: 1,
                          sm: 1.5,
                        },
                        py: 1.4,
                      }}
                    >
                      {/* IMAGE */}

                      <ProductImage
                        item={item}
                        imageUrl={imageUrl}
                        getFallbackImage={getCategoryFallbackImage}
                      />

                      {/* NAME + QTY */}

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "#17211b",
                            fontFamily: "Inter",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name ||
                            item.product_name ||
                            "Product"}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.35,
                            fontSize: 11.5,
                            color: "#6b7280",
                            fontFamily: "Inter",
                            fontWeight: 400,
                          }}
                        >
                          Quantity: <strong>{quantity}</strong>
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.15,
                            fontSize: 11.5,
                            color: "#6b7280",
                            fontFamily: "Inter",
                            fontWeight: 400,
                          }}
                        >
                          Price: ₹{price.toFixed(2)}
                        </Typography>
                      </Box>

                      {/* TOTAL */}

                      <Typography
                        sx={{
                          fontSize: {
                            xs: 12.5,
                            sm: 14,
                          },
                          fontWeight: 600,
                          color: "#15803d",
                          fontFamily: "Inter",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ₹{itemTotal.toFixed(2)}
                      </Typography>
                    </Box>

                    {index < order.items.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box
              sx={{
                py: 4,
                textAlign: "center",
              }}
            >
              <ShoppingBagOutlinedIcon
                sx={{
                  fontSize: 36,
                  color: "#c4cbc6",
                }}
              />

              <Typography
                sx={{
                  mt: 0.7,
                  color: "#6b7280",
                  fontSize: 12,
                  fontFamily: "Inter",
                  fontWeight: 400,
                }}
              >
                No products found
              </Typography>
            </Box>
          )}

          {/* PAYMENT + SUMMARY */}

          <Divider sx={{ my: 1.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 1.5,
            }}
          >
            {/* PAYMENT */}

            <Box
              sx={{
                background: "#fafcfb",
                border: "1px solid #edf1ee",
                borderRadius: 1.7,
                p: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  mb: 0.8,
                }}
              >
                <PaymentIcon
                  sx={{
                    fontSize: 17,
                    color: "#15803d",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    fontFamily: "Inter",
                  }}
                >
                  Payment
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: 10,
                  color: "#6b7280",
                  fontWeight: 500,
                  fontFamily: "Inter",
                }}
              >
                PAYMENT METHOD
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: 13.5,
                  fontWeight: 600,
                  fontFamily: "Inter",
                  textTransform: "uppercase",
                  color: "#17211b",
                }}
              >
                {order.payment_method || "COD"}
              </Typography>
            </Box>

            {/* SUMMARY */}

            <Box
              sx={{
                background: "#f0fdf4",
                border: "1px solid #d1fae5",
                borderRadius: 1.7,
                p: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  fontFamily: "Inter",
                  mb: 0.8,
                }}
              >
                Order Summary
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11.5,
                    color: "#6b7280",
                    fontFamily: "Inter",
                    fontWeight: 400,
                  }}
                >
                  Total Items
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    fontFamily: "Inter",
                  }}
                >
                  {totalItems}
                </Typography>
              </Box>

              <Divider sx={{ my: 0.8 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "Inter",
                  }}
                >
                  Total Amount
                </Typography>

                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#15803d",
                    fontFamily: "Inter",
                    whiteSpace: "nowrap",
                  }}
                >
                  ₹{Number(order.total_amount || 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      <Box sx={{ height: 25 }} />
    </Box>
  );
}

// =============================================================
// PRODUCT IMAGE COMPONENT
// =============================================================

function ProductImage({
  item,
  imageUrl,
  getFallbackImage,
}) {
  const [src, setSrc] = useState(imageUrl);

  useEffect(() => {
    setSrc(imageUrl);
  }, [imageUrl]);

  const handleImageError = () => {
    console.error("IMAGE FAILED:", src, "ITEM:", item);

    const fallback = getFallbackImage(item);

    if (fallback && fallback !== src) {
      console.log("USING FALLBACK IMAGE:", fallback);
      setSrc(fallback);
    } else {
      setSrc(null);
    }
  };

  return (
    <Box
      sx={{
        width: {
          xs: 58,
          sm: 66,
        },
        height: {
          xs: 58,
          sm: 66,
        },
        minWidth: {
          xs: 58,
          sm: 66,
        },
        borderRadius: 1.8,
        background: "#f5f8f6",
        border: "1px solid #e5ebe7",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter",
        "& *": {
          fontFamily: "Inter",
        },
      }}
    >
      {src ? (
        <Box
          component="img"
          src={src}
          alt={item?.name || "Product"}
          onError={handleImageError}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <ShoppingBagOutlinedIcon
          sx={{
            fontSize: 27,
            color: "#aab4ad",
          }}
        />
      )}
    </Box>
  );
}