

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Box,
//   Card,
//   CardContent,
//   Grid,
//   Typography,
//   Button,
//   CircularProgress,
//   Chip,
// } from "@mui/material";

// import PeopleIcon from "@mui/icons-material/People";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
// import CancelIcon from "@mui/icons-material/Cancel";

// import { API_BASE_URL } from "../api";

// export default function Dashboard() {
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingOrder, setUpdatingOrder] = useState(null);

//   // =====================================================
//   // FETCH DASHBOARD DATA
//   // =====================================================

//   const fetchDashboard = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("adminToken");

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const orderResponse = await axios.get(
//         `${API_BASE_URL}/api/orders/admin`,
//         config
//       );

//       const userResponse = await axios.get(
//         `${API_BASE_URL}/api/users`,
//         config
//       );

//       setOrders(orderResponse.data?.data || []);
//       setUsers(userResponse.data?.data || []);
//     } catch (error) {
//       console.error("DASHBOARD ERROR:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   // =====================================================
//   // STATUS COUNT
//   // =====================================================

//   const countStatus = (status) => {
//     return orders.filter(
//       (order) => order.status?.toLowerCase() === status
//     ).length;
//   };

//   // =====================================================
//   // UPDATE ORDER STATUS
//   // =====================================================

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       setUpdatingOrder(orderId);

//       const token = localStorage.getItem("adminToken");

//       const response = await axios.put(
//         `${API_BASE_URL}/api/orders/${orderId}/status`,
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
//           response.data?.message || "Failed to update order status"
//         );
//       }

//       setOrders((previousOrders) =>
//         previousOrders.map((order) =>
//           order.id === orderId
//             ? {
//                 ...order,
//                 status: newStatus,
//               }
//             : order
//         )
//       );
//     } catch (error) {
//       console.error("UPDATE ORDER STATUS ERROR:", error);

//       alert(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to update order status"
//       );
//     } finally {
//       setUpdatingOrder(null);
//     }
//   };

//   // =====================================================
//   // STATUS ACTION
//   // =====================================================

//   const getNextStatusAction = (status) => {
//     const currentStatus = status?.toLowerCase();

//     switch (currentStatus) {
//       case "pending":
//         return {
//           nextStatus: "confirmed",
//           label: "Accept",
//           color: "#2563eb",
//         };

//       case "confirmed":
//         return {
//           nextStatus: "processing",
//           label: "Process",
//           color: "#7c3aed",
//         };

//       case "processing":
//         return {
//           nextStatus: "shipped",
//           label: "Ship",
//           color: "#0891b2",
//         };

//       case "shipped":
//         return {
//           nextStatus: "delivered",
//           label: "Deliver",
//           color: "#15803d",
//         };

//       default:
//         return null;
//     }
//   };

//   // =====================================================
//   // STATUS CHIP COLOR
//   // =====================================================

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return "#d97706";

//       case "confirmed":
//         return "#2563eb";

//       case "processing":
//         return "#7c3aed";

//       case "shipped":
//         return "#0891b2";

//       case "delivered":
//         return "#15803d";

//       case "cancelled":
//         return "#dc2626";

//       default:
//         return "#6b7280";
//     }
//   };

//   // =====================================================
//   // STAT CARD
//   // =====================================================

//   const StatCard = ({
//     title,
//     value,
//     icon,
//     background,
//   }) => {
//     return (
//    <Card
//   elevation={0}
//   sx={{
//     width: "100%",
//     height: "100%",
//     borderRadius: "16px",
//     background,
//     minHeight: {
//       xs: 110,
//       sm: 125,
//       md: 145,
//     },
//     boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
//     display: "flex",
//     flexDirection: "column",
//   }}
// >
//         <CardContent
//   sx={{
//     height: "100%",
//     flex: 1,
//             minHeight: {
//               xs: 110,
//               sm: 125,
//               md: 145,
//             },
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             px: {
//               xs: 2,
//               sm: 2.5,
//               md: 3,
//             },
//             py: {
//               xs: 2,
//               sm: 2.5,
//               md: 3,
//             },
//             "&:last-child": {
//               pb: {
//                 xs: 2,
//                 sm: 2.5,
//                 md: 3,
//               },
//             },
//           }}
//         >
//           <Box sx={{ minWidth: 0 }}>
//             <Typography
//               sx={{
//                 color: "#374151",
//                 fontFamily: "Inter",
//                 fontSize: {
//                   xs: 12,
//                   sm: 13,
//                   md: 14,
//                 },
//                 fontWeight: 500,
//               }}
//             >
//               {title}
//             </Typography>

//             <Typography
//               sx={{
//                 fontFamily: "Inter",
//                 fontSize: {
//                   xs: 25,
//                   sm: 29,
//                   md: 32,
//                 },
//                 fontWeight: 700,
//                 mt: 1,
//                 color: "#111827",
//               }}
//             >
//               {value}
//             </Typography>
//           </Box>

//           <Box
//             sx={{
//               width: {
//                 xs: 42,
//                 sm: 48,
//                 md: 54,
//               },
//               height: {
//                 xs: 42,
//                 sm: 48,
//                 md: 54,
//               },
//               flexShrink: 0,
//               borderRadius: "14px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundColor: "rgba(255,255,255,0.65)",
//               ml: 1,
//             }}
//           >
//             {icon}
//           </Box>
//         </CardContent>
//       </Card>
//     );
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "calc(100vh - 80px)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontFamily: "Inter",
//         }}
//       >
//         <CircularProgress
//           sx={{
//             color: "#00843d",
//           }}
//         />
//       </Box>
//     );
//   }

//   // =====================================================
//   // DASHBOARD
//   // =====================================================

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: "100%",
//         overflowX: "hidden",
//         p: {
//           xs: 1.5,
//           sm: 2.5,
//           md: 4,
//         },
//         backgroundColor: "#f5f7f8",
//         minHeight: "calc(100vh - 80px)",

//         fontFamily: "Inter",

//         "& .MuiTypography-root": {
//           fontFamily: "Inter",
//         },

//         "& .MuiButton-root": {
//           fontFamily: "Inter",
//         },

//         "& .MuiChip-root": {
//           fontFamily: "Inter",
//         },

//         "& .MuiCard-root": {
//           fontFamily: "Inter",
//         },
//       }}
//     >
//       {/* =================================================
//           HEADER
//       ================================================= */}
// <Box
//   sx={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexDirection: "row",
//     gap: 1.5,
//     mb: {
//       xs: 2.5,
//       md: 4,
//     },
//   }}
// >
    
//         <Box sx={{ minWidth: 0 }}>
//           <Typography
//             sx={{
//               fontFamily: "Inter",
//               fontSize: {
//                 xs: 15,
//                 sm: 27,
//                 md: 32,
//               },
//               lineHeight: 1.2,
//               fontWeight: 700,
//               color: "#00843d",
//               wordBreak: "break-word",
//             }}
//           >
//             Vedhamruth Admin Dashboard
//           </Typography>

//           <Typography
//             sx={{
//               mt: 0.5,
//               color: "#6b7280",
//               fontFamily: "Inter",
//               fontSize: {
//                 xs: 13,
//                 sm: 14,
//                 md: 15,
//               },
//               fontWeight: 400,
//             }}
//           >
//             Welcome back, Admin 👋
//           </Typography>
//         </Box>

//         <Button
//   variant="outlined"
//   onClick={fetchDashboard}
//  sx={{
//   width: "auto",
//   minWidth: {
//     xs: 90,
//     sm: 110,
//   },
//   height: {
//     xs: 38,
//     sm: 42,
//   },
//   alignSelf: "center",
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   textTransform: "none",
//   borderColor: "#00843d",
//   color: "#00843d",
//   borderRadius: "9px",
//   fontFamily: "Inter",
//   fontWeight: 600,
//   "&:hover": {
//     borderColor: "#006b32",
//     backgroundColor: "#e8f7ee",
//   },
// }}
// >
//   ↻ Refresh
// </Button>
//       </Box>

//       {/* =================================================
//           MAIN STATS
//       ================================================= */}

//       {/* =================================================
//     MAIN STATS
// ================================================= */}

// <Grid
//   container
//   spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
//   alignItems="stretch"
// >
//   <Grid item xs={6} sx={{ display: "flex" }}>
//     <StatCard
//       title="Total Users"
//       value={users.length}
//       background="#e8f0ff"
//       icon={
//         <PeopleIcon
//           sx={{
//             fontSize: {
//               xs: 25,
//               sm: 30,
//               md: 34,
//             },
//             color: "#2563eb",
//           }}
//         />
//       }
//     />
//   </Grid>

//   <Grid item xs={6} sx={{ display: "flex" }}>
//     <StatCard
//       title="Total Orders"
//       value={orders.length}
//       background="#f3e8ff"
//       icon={
//         <ShoppingCartIcon
//           sx={{
//             fontSize: {
//               xs: 25,
//               sm: 30,
//               md: 34,
//             },
//             color: "#7c3aed",
//           }}
//         />
//       }
//     />
//   </Grid>

//   <Grid item xs={6} sx={{ display: "flex" }}>
//     <StatCard
//       title="Pending"
//       value={countStatus("pending")}
//       background="#fff7d6"
//       icon={
//         <PendingActionsIcon
//           sx={{
//             fontSize: {
//               xs: 25,
//               sm: 30,
//               md: 34,
//             },
//             color: "#d97706",
//           }}
//         />
//       }
//     />
//   </Grid>

//   <Grid item xs={6} sx={{ display: "flex" }}>
//     <StatCard
//       title="Confirmed"
//       value={countStatus("confirmed")}
//       background="#e0ecff"
//       icon={
//         <CheckCircleIcon
//           sx={{
//             fontSize: {
//               xs: 25,
//               sm: 30,
//               md: 34,
//             },
//             color: "#2563eb",
//           }}
//         />
//       }
//     />
//   </Grid>

//   <Grid item xs={6} sx={{ display: "flex" }}>
//     <StatCard
//       title="Processing"
//       value={countStatus("processing")}
//       background="#f3e8ff"
//       icon={
//         <InventoryIcon
//           sx={{
//             fontSize: {
//               xs: 25,
//               sm: 30,
//               md: 34,
//             },
//             color: "#7c3aed",
//           }}
//         />
//       }
//     />
//   </Grid>

//   <Grid item xs={6} sx={{ display: "flex" }}>
//     <StatCard
//       title="Shipped"
//       value={countStatus("shipped")}
//       background="#e0f7fa"
//       icon={
//         <LocalShippingIcon
//           sx={{
//             fontSize: {
//               xs: 25,
//               sm: 30,
//               md: 34,
//             },
//             color: "#0891b2",
//           }}
//         />
//       }
//     />
//   </Grid>

//   <Grid item xs={6} sx={{ display: "flex" }}>
//     <StatCard
//       title="Delivered"
//       value={countStatus("delivered")}
//       background="#dcfce7"
//       icon={
//         <DoneAllIcon
//           sx={{
//             fontSize: {
//               xs: 25,
//               sm: 30,
//               md: 34,
//             },
//             color: "#15803d",
//           }}
//         />
//       }
//     />
//   </Grid>

//   <Grid item xs={6} sx={{ display: "flex" }}>
//     <StatCard
//       title="Cancelled"
//       value={countStatus("cancelled")}
//       background="#fee2e2"
//       icon={
//         <CancelIcon
//           sx={{
//             fontSize: {
//               xs: 25,
//               sm: 30,
//               md: 34,
//             },
//             color: "#dc2626",
//           }}
//         />
//       }
//     />
//   </Grid>
// </Grid>

//       {/* =================================================
//           RECENT ORDERS
//       ================================================= */}

//       <Box sx={{ mt: { xs: 2.5, md: 4 } }}>
//         <Card
//           elevation={0}
//           sx={{
//             width: "100%",
//             borderRadius: "16px",
//             boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
//           }}
//         >
//           <CardContent
//             sx={{
//               p: {
//                 xs: 1.5,
//                 sm: 2.5,
//                 md: 3,
//               },
//               "&:last-child": {
//                 pb: {
//                   xs: 1.5,
//                   sm: 2.5,
//                   md: 3,
//                 },
//               },
//             }}
//           >
//             {/* TITLE */}

//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: {
//                   xs: "flex-start",
//                   md: "center",
//                 },
//                 mb: 2,
//                 gap: 2,
//                 flexWrap: "wrap",
//               }}
//             >
//               <Box>
//                 <Typography
//                   sx={{
//                     fontFamily: "Inter",
//                     fontSize: {
//                       xs: 17,
//                       sm: 19,
//                       md: 20,
//                     },
//                     fontWeight: 700,
//                   }}
//                 >
//                   Recent Orders
//                 </Typography>

//                 <Typography
//                   sx={{
//                     color: "#6b7280",
//                     fontFamily: "Inter",
//                     fontSize: {
//                       xs: 12,
//                       sm: 13,
//                     },
//                     fontWeight: 400,
//                   }}
//                 >
//                   Latest customer orders
//                 </Typography>
//               </Box>
//             </Box>

//             {/* NO ORDERS */}

//             {orders.length === 0 ? (
//               <Box
//                 sx={{
//                   py: 6,
//                   textAlign: "center",
//                 }}
//               >
//                 <ShoppingCartIcon
//                   sx={{
//                     fontSize: 45,
//                     color: "#d1d5db",
//                   }}
//                 />

//                 <Typography
//                   sx={{
//                     mt: 1,
//                     color: "#9ca3af",
//                     fontFamily: "Inter",
//                     fontWeight: 400,
//                   }}
//                 >
//                   No Orders Found
//                 </Typography>
//               </Box>
//             ) : (
//               /* ORDER LIST */

//               orders.map((order) => {
//                 const action = getNextStatusAction(order.status);

//                 return (
//                   <Box
//                     key={order.id}
//                     sx={{
//                       py: {
//                         xs: 2,
//                         sm: 2.2,
//                       },
//                       borderBottom: "1px solid #eeeeee",
//                       display: "flex",
//                       alignItems: {
//                         xs: "flex-start",
//                         md: "center",
//                       },
//                       justifyContent: "space-between",
//                       gap: {
//                         xs: 1.5,
//                         md: 4,
//                       },
//                       flexWrap: "wrap",
//                     }}
//                   >
//                     {/* CUSTOMER */}

//                     <Box
//                       sx={{
//                         flex: {
//                           xs: "1 1 100%",
//                           sm: "1 1 220px",
//                           md: "1 1 190px",
//                         },
//                         minWidth: 0,
//                       }}
//                     >
//                       <Typography
//                         fontWeight={700}
//                         fontSize={{
//                           xs: 13,
//                           sm: 14,
//                         }}
//                         sx={{
//                           fontFamily: "Inter",
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         #{order.id}{" "}
//                         {order.full_name || "Customer"}
//                       </Typography>

//                       <Typography
//                         fontSize={12}
//                         sx={{
//                           color: "text.secondary",
//                           fontFamily: "Inter",
//                           fontWeight: 400,
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         {order.phone || "No phone"}
//                       </Typography>
//                     </Box>

//                     {/* AMOUNT */}

//                     <Box
//                       sx={{
//                         flex: {
//                           xs: "1 1 45%",
//                           sm: "0 0 auto",
//                         },
//                       }}
//                     >
//                       <Typography
//                         fontWeight={700}
//                         fontSize={{
//                           xs: 13,
//                           sm: 14,
//                         }}
//                         sx={{
//                           fontFamily: "Inter",
//                         }}
//                       >
//                         ₹{Number(order.total_amount || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* CURRENT STATUS */}

//                     <Box
//                       sx={{
//                         flex: {
//                           xs: "1 1 45%",
//                           sm: "0 0 auto",
//                         },
//                         display: "flex",
//                         justifyContent: {
//                           xs: "flex-end",
//                           sm: "flex-start",
//                         },
//                       }}
//                     >
//                       <Chip
//                         label={order.status || "Unknown"}
//                         size="small"
//                         sx={{
//                           minWidth: {
//                             xs: 85,
//                             sm: 100,
//                           },
//                           textTransform: "capitalize",
//                           fontFamily: "Inter",
//                           fontWeight: 700,
//                           color: "#fff",
//                           backgroundColor: getStatusColor(
//                             order.status
//                           ),
//                           fontSize: {
//                             xs: 11,
//                             sm: 12,
//                           },
//                         }}
//                       />
//                     </Box>

//                     {/* NEXT ACTION */}

//                     <Box
//                       sx={{
//                         flex: {
//                           xs: "1 1 100%",
//                           sm: "0 0 auto",
//                         },
//                         minWidth: {
//                           sm: 110,
//                         },
//                         display: "flex",
//                         justifyContent: {
//                           xs: "stretch",
//                           sm: "flex-end",
//                         },
//                       }}
//                     >
//                       {action ? (
//                         <Button
//                           variant="contained"
//                           fullWidth
//                           disabled={updatingOrder === order.id}
//                           onClick={() =>
//                             updateOrderStatus(
//                               order.id,
//                               action.nextStatus
//                             )
//                           }
//                           sx={{
//                             backgroundColor: action.color,
//                             textTransform: "none",
//                             fontFamily: "Inter",
//                             fontWeight: 700,
//                             borderRadius: "8px",
//                             minWidth: {
//                               sm: 100,
//                             },
//                             width: {
//                               xs: "100%",
//                               sm: "auto",
//                             },
//                             "&:hover": {
//                               backgroundColor: action.color,
//                               filter: "brightness(0.9)",
//                             },
//                           }}
//                         >
//                           {updatingOrder === order.id
//                             ? "Updating..."
//                             : action.label}
//                         </Button>
//                       ) : (
//                         <Box
//                           sx={{
//                             width: {
//                               xs: "100%",
//                               sm: "auto",
//                             },
//                             display: "flex",
//                             justifyContent: {
//                               xs: "flex-start",
//                               sm: "flex-end",
//                             },
//                           }}
//                         >
//                           <Chip
//                             label={
//                               order.status?.toLowerCase() ===
//                               "delivered"
//                                 ? "Completed"
//                                 : "No Action"
//                             }
//                             size="small"
//                             sx={{
//                               fontFamily: "Inter",
//                               fontWeight: 700,
//                               color:
//                                 order.status?.toLowerCase() ===
//                                 "delivered"
//                                   ? "#15803d"
//                                   : "#6b7280",
//                               backgroundColor:
//                                 order.status?.toLowerCase() ===
//                                 "delivered"
//                                   ? "#dcfce7"
//                                   : "#f3f4f6",
//                             }}
//                           />
//                         </Box>
//                       )}
//                     </Box>
//                   </Box>
//                 );
//               })
//             )}
//           </CardContent>
//         </Card>
//       </Box>
//     </Box>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";

import { API_BASE_URL } from "../api";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const orderResponse = await axios.get(
        `${API_BASE_URL}/api/orders/admin`,
        config
      );

      const userResponse = await axios.get(
        `${API_BASE_URL}/api/users`,
        config
      );

      setOrders(orderResponse.data?.data || []);
      setUsers(userResponse.data?.data || []);
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================================
  // STATUS COUNT
  // =====================================================

  const countStatus = (status) => {
    return orders.filter(
      (order) => order.status?.toLowerCase() === status
    ).length;
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);

      const token = localStorage.getItem("adminToken");

      const response = await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
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
          response.data?.message || "Failed to update order status"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error("UPDATE ORDER STATUS ERROR:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // =====================================================
  // STATUS ACTION
  // =====================================================

  const getNextStatusAction = (status) => {
    const currentStatus = status?.toLowerCase();

    switch (currentStatus) {
      case "pending":
        return {
          nextStatus: "confirmed",
          label: "Accept",
          color: "#2563eb",
        };

      case "confirmed":
        return {
          nextStatus: "processing",
          label: "Process",
          color: "#7c3aed",
        };

      case "processing":
        return {
          nextStatus: "shipped",
          label: "Ship",
          color: "#0891b2",
        };

      case "shipped":
        return {
          nextStatus: "delivered",
          label: "Deliver",
          color: "#15803d",
        };

      default:
        return null;
    }
  };

  // =====================================================
  // STATUS CHIP COLOR
  // =====================================================

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#d97706";

      case "confirmed":
        return "#2563eb";

      case "processing":
        return "#7c3aed";

      case "shipped":
        return "#0891b2";

      case "delivered":
        return "#15803d";

      case "cancelled":
        return "#dc2626";

      default:
        return "#6b7280";
    }
  };

  // =====================================================
  // STAT CARD
  // =====================================================

  const StatCard = ({
    title,
    value,
    icon,
    background,
  }) => {
    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: {
            xs: 108,
            sm: 125,
            md: 145,
          },
          borderRadius: {
            xs: "16px",
            sm: "18px",
          },
          background,
          boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: {
              xs: 1.5,
              sm: 2.5,
              md: 3,
            },
            py: {
              xs: 1.5,
              sm: 2.5,
              md: 3,
            },
            "&:last-child": {
              pb: {
                xs: 1.5,
                sm: 2.5,
                md: 3,
              },
            },
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                color: "#374151",
                fontFamily: "Inter",
                fontSize: {
                  xs: 11,
                  sm: 13,
                  md: 14,
                },
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: {
                  xs: 23,
                  sm: 29,
                  md: 32,
                },
                fontWeight: 700,
                mt: {
                  xs: 0.5,
                  sm: 1,
                },
                color: "#111827",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: {
                xs: 38,
                sm: 48,
                md: 54,
              },
              height: {
                xs: 38,
                sm: 48,
                md: 54,
              },
              flexShrink: 0,
              borderRadius: {
                xs: "11px",
                sm: "14px",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.65)",
              ml: {
                xs: 0.5,
                sm: 1,
              },
            }}
          >
            {icon}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
        }}
      >
        <CircularProgress
          sx={{
            color: "#00843d",
          }}
        />
      </Box>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        p: {
          xs: 1.5,
          sm: 2.5,
          md: 4,
        },
        backgroundColor: "#f5f7f8",
        minHeight: "calc(100vh - 80px)",
        fontFamily: "Inter",

        "& .MuiTypography-root": {
          fontFamily: "Inter",
        },

        "& .MuiButton-root": {
          fontFamily: "Inter",
        },

        "& .MuiChip-root": {
          fontFamily: "Inter",
        },

        "& .MuiCard-root": {
          fontFamily: "Inter",
        },
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: "row",
          gap: {
            xs: 1,
            sm: 1.5,
          },
          mb: {
            xs: 2.5,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: {
                xs: 15,
                sm: 27,
                md: 32,
              },
              lineHeight: 1.2,
              fontWeight: 700,
              color: "#00843d",
              wordBreak: "break-word",
            }}
          >
            Vedhamruth Admin Dashboard
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#6b7280",
              fontFamily: "Inter",
              fontSize: {
                xs: 12,
                sm: 14,
                md: 15,
              },
              fontWeight: 400,
            }}
          >
            Welcome back, Admin 👋
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={fetchDashboard}
          sx={{
            minWidth: {
              xs: 82,
              sm: 110,
            },
            height: {
              xs: 36,
              sm: 42,
            },
            flexShrink: 0,
            whiteSpace: "nowrap",
            textTransform: "none",
            borderColor: "#00843d",
            color: "#00843d",
            borderRadius: "9px",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: {
              xs: 12,
              sm: 14,
            },
            px: {
              xs: 1.2,
              sm: 2,
            },
            "&:hover": {
              borderColor: "#006b32",
              backgroundColor: "#e8f7ee",
            },
          }}
        >
          ↻ Refresh
        </Button>
      </Box>

      {/* =================================================
          MAIN STATS
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },
          alignItems: "stretch",
        }}
      >
        <StatCard
          title="Total Users"
          value={users.length}
          background="#e8f0ff"
          icon={
            <PeopleIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 30,
                  md: 34,
                },
                color: "#2563eb",
              }}
            />
          }
        />

        <StatCard
          title="Total Orders"
          value={orders.length}
          background="#f3e8ff"
          icon={
            <ShoppingCartIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 30,
                  md: 34,
                },
                color: "#7c3aed",
              }}
            />
          }
        />

        <StatCard
          title="Pending"
          value={countStatus("pending")}
          background="#fff7d6"
          icon={
            <PendingActionsIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 30,
                  md: 34,
                },
                color: "#d97706",
              }}
            />
          }
        />

        <StatCard
          title="Confirmed"
          value={countStatus("confirmed")}
          background="#e0ecff"
          icon={
            <CheckCircleIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 30,
                  md: 34,
                },
                color: "#2563eb",
              }}
            />
          }
        />

        <StatCard
          title="Processing"
          value={countStatus("processing")}
          background="#f3e8ff"
          icon={
            <InventoryIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 30,
                  md: 34,
                },
                color: "#7c3aed",
              }}
            />
          }
        />

        <StatCard
          title="Shipped"
          value={countStatus("shipped")}
          background="#e0f7fa"
          icon={
            <LocalShippingIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 30,
                  md: 34,
                },
                color: "#0891b2",
              }}
            />
          }
        />

        <StatCard
          title="Delivered"
          value={countStatus("delivered")}
          background="#dcfce7"
          icon={
            <DoneAllIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 30,
                  md: 34,
                },
                color: "#15803d",
              }}
            />
          }
        />

        <StatCard
          title="Cancelled"
          value={countStatus("cancelled")}
          background="#fee2e2"
          icon={
            <CancelIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 30,
                  md: 34,
                },
                color: "#dc2626",
              }}
            />
          }
        />
      </Box>

      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <Box
        sx={{
          mt: {
            xs: 2.5,
            md: 4,
          },
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 1.5,
                sm: 2.5,
                md: 3,
              },
              "&:last-child": {
                pb: {
                  xs: 1.5,
                  sm: 2.5,
                  md: 3,
                },
              },
            }}
          >
            {/* TITLE */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                mb: 2,
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: {
                      xs: 17,
                      sm: 19,
                      md: 20,
                    },
                    fontWeight: 700,
                  }}
                >
                  Recent Orders
                </Typography>

                <Typography
                  sx={{
                    color: "#6b7280",
                    fontFamily: "Inter",
                    fontSize: {
                      xs: 12,
                      sm: 13,
                    },
                    fontWeight: 400,
                  }}
                >
                  Latest customer orders
                </Typography>
              </Box>
            </Box>

            {/* NO ORDERS */}

            {orders.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  textAlign: "center",
                }}
              >
                <ShoppingCartIcon
                  sx={{
                    fontSize: 45,
                    color: "#d1d5db",
                  }}
                />

                <Typography
                  sx={{
                    mt: 1,
                    color: "#9ca3af",
                    fontFamily: "Inter",
                    fontWeight: 400,
                  }}
                >
                  No Orders Found
                </Typography>
              </Box>
            ) : (
              orders.map((order) => {
                const action = getNextStatusAction(order.status);

                return (
                  <Box
                    key={order.id}
                    sx={{
                      py: {
                        xs: 2,
                        sm: 2.2,
                      },
                      borderBottom: "1px solid #eeeeee",
                      display: "flex",
                      alignItems: {
                        xs: "flex-start",
                        md: "center",
                      },
                      justifyContent: "space-between",
                      gap: {
                        xs: 1.5,
                        md: 4,
                      },
                      flexWrap: "wrap",
                    }}
                  >
                    {/* CUSTOMER */}

                    <Box
                      sx={{
                        flex: {
                          xs: "1 1 100%",
                          sm: "1 1 220px",
                          md: "1 1 190px",
                        },
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        fontSize={{
                          xs: 13,
                          sm: 14,
                        }}
                        sx={{
                          fontFamily: "Inter",
                          wordBreak: "break-word",
                        }}
                      >
                        #{order.id} {order.full_name || "Customer"}
                      </Typography>

                      <Typography
                        fontSize={12}
                        sx={{
                          color: "text.secondary",
                          fontFamily: "Inter",
                          fontWeight: 400,
                          wordBreak: "break-word",
                        }}
                      >
                        {order.phone || "No phone"}
                      </Typography>
                    </Box>

                    {/* AMOUNT */}

                    <Box
                      sx={{
                        flex: {
                          xs: "1 1 45%",
                          sm: "0 0 auto",
                        },
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        fontSize={{
                          xs: 13,
                          sm: 14,
                        }}
                        sx={{
                          fontFamily: "Inter",
                        }}
                      >
                        ₹{Number(order.total_amount || 0).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* CURRENT STATUS */}

                    <Box
                      sx={{
                        flex: {
                          xs: "1 1 45%",
                          sm: "0 0 auto",
                        },
                        display: "flex",
                        justifyContent: {
                          xs: "flex-end",
                          sm: "flex-start",
                        },
                      }}
                    >
                      <Chip
                        label={order.status || "Unknown"}
                        size="small"
                        sx={{
                          minWidth: {
                            xs: 85,
                            sm: 100,
                          },
                          textTransform: "capitalize",
                          fontFamily: "Inter",
                          fontWeight: 700,
                          color: "#fff",
                          backgroundColor: getStatusColor(order.status),
                          fontSize: {
                            xs: 11,
                            sm: 12,
                          },
                        }}
                      />
                    </Box>

                    {/* NEXT ACTION */}

                    <Box
                      sx={{
                        flex: {
                          xs: "1 1 100%",
                          sm: "0 0 auto",
                        },
                        minWidth: {
                          sm: 110,
                        },
                        display: "flex",
                        justifyContent: {
                          xs: "stretch",
                          sm: "flex-end",
                        },
                      }}
                    >
                      {action ? (
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={updatingOrder === order.id}
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              action.nextStatus
                            )
                          }
                          sx={{
                            backgroundColor: action.color,
                            textTransform: "none",
                            fontFamily: "Inter",
                            fontWeight: 700,
                            borderRadius: "8px",
                            minWidth: {
                              sm: 100,
                            },
                            width: {
                              xs: "100%",
                              sm: "auto",
                            },
                            "&:hover": {
                              backgroundColor: action.color,
                              filter: "brightness(0.9)",
                            },
                          }}
                        >
                          {updatingOrder === order.id
                            ? "Updating..."
                            : action.label}
                        </Button>
                      ) : (
                        <Box
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "auto",
                            },
                            display: "flex",
                            justifyContent: {
                              xs: "flex-start",
                              sm: "flex-end",
                            },
                          }}
                        >
                          <Chip
                            label={
                              order.status?.toLowerCase() === "delivered"
                                ? "Completed"
                                : "No Action"
                            }
                            size="small"
                            sx={{
                              fontFamily: "Inter",
                              fontWeight: 700,
                              color:
                                order.status?.toLowerCase() === "delivered"
                                  ? "#15803d"
                                  : "#6b7280",
                              backgroundColor:
                                order.status?.toLowerCase() === "delivered"
                                  ? "#dcfce7"
                                  : "#f3f4f6",
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}