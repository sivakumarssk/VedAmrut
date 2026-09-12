// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";

// import RefreshIcon from "@mui/icons-material/Refresh";
// import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PeopleIcon from "@mui/icons-material/People";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
// import CancelIcon from "@mui/icons-material/Cancel";

// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../api";

// export default function Orders() {
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await axios.get(
//         `${API_BASE_URL}/api/orders/admin`
//       );

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message || "Failed to fetch orders"
//         );
//       }

//       setOrders(response.data?.data || []);
//     } catch (error) {
//       console.error("FETCH ORDERS ERROR:", error);

//       setError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch orders"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();

//     const interval = setInterval(() => {
//       fetchOrders();
//     }, 15000);

//     return () => clearInterval(interval);
//   }, []);

//   const customers = useMemo(() => {
//     const grouped = {};

//     orders.forEach((order) => {
//       const key =
//         order.user_id ||
//         order.phone ||
//         order.full_name ||
//         `customer-${order.id}`;

//       if (!grouped[key]) {
//         grouped[key] = {
//           user_id: order.user_id,
//           full_name: order.full_name || "Customer",
//           phone: order.phone || "-",
//           orders: [],
//           total_amount: 0,
//           latest_order: order.created_at,
//         };
//       }

//       grouped[key].orders.push(order);

//       grouped[key].total_amount += Number(
//         order.total_amount || 0
//       );

//       if (
//         order.created_at &&
//         new Date(order.created_at) >
//           new Date(grouped[key].latest_order)
//       ) {
//         grouped[key].latest_order = order.created_at;
//       }
//     });

//     return Object.values(grouped).sort(
//       (a, b) =>
//         new Date(b.latest_order) -
//         new Date(a.latest_order)
//     );
//   }, [orders]);

//   const countStatus = (status) => {
//     return orders.filter(
//       (order) => order.status?.toLowerCase() === status
//     ).length;
//   };

//   const handleViewCustomer = (customer) => {
//     navigate(`/orders/customer/${customer.user_id}`, {
//       state: {
//         customer,
//       },
//     });
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           background:
//             "linear-gradient(135deg, #f4faf6 0%, #f5f7f9 100%)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontFamily: "Inter",
//         }}
//       >
//         <Box sx={{ textAlign: "center" }}>
//           <CircularProgress sx={{ color: "#008f43" }} />

//           <Typography
//             sx={{
//               mt: 2,
//               color: "#777",
//               fontFamily: "Inter",
//               fontWeight: 500,
//             }}
//           >
//             Loading orders...
//           </Typography>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100%",
//         maxWidth: "100%",
//         overflowX: "hidden",
//         boxSizing: "border-box",

//         background:
//           "linear-gradient(135deg, #f4faf6 0%, #f5f7f9 100%)",

//         p: 0,

//         fontFamily: "Inter",

//         "& *": {
//           fontFamily: "Inter",
//         },
//       }}
//     >
//       {/* HEADER */}

//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//           flexDirection: "row",
//           gap: 2,
//           mb: {
//             xs: 2,
//             md: 3,
//           },
//           px: {
//             xs: 2,
//             sm: 3,
//             md: 4,
//           },
//           pt: {
//             xs: 2,
//             sm: 3,
//             md: 4,
//           },
//         }}
//       >
//         <Box
//           sx={{
//             flex: 1,
//             minWidth: 0,
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1.5,
//             }}
//           >
//             <Box
//               sx={{
//                 width: {
//                   xs: 42,
//                   sm: 46,
//                 },
//                 height: {
//                   xs: 42,
//                   sm: 46,
//                 },
//                 borderRadius: "14px",
//                 background:
//                   "linear-gradient(135deg, #008f43, #00a854)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//                 boxShadow:
//                   "0 6px 15px rgba(0,143,67,0.22)",
//               }}
//             >
//               <ShoppingCartOutlinedIcon
//                 sx={{
//                   color: "#fff",
//                   fontSize: {
//                     xs: 23,
//                     sm: 25,
//                   },
//                 }}
//               />
//             </Box>

//             <Typography
//               variant="h4"
//               sx={{
//                 fontFamily: "Inter",
//                 fontWeight: 700,
//                 color: "#111827",
//                 fontSize: {
//                   xs: 27,
//                   sm: 32,
//                   md: 34,
//                 },
//               }}
//             >
//               Orders
//             </Typography>
//           </Box>

//           <Typography
//             sx={{
//               mt: 1,
//               color: "#6b7280",
//               fontSize: 14,
//               fontFamily: "Inter",
//               fontWeight: 400,
//             }}
//           >
//             View customer orders and order history.
//           </Typography>
//         </Box>

//         {/* REFRESH BUTTON */}

//         <Button
//           variant="contained"
//           startIcon={<RefreshIcon />}
//           onClick={fetchOrders}
//           sx={{
//             background:
//               "linear-gradient(135deg, #008f43, #00a854)",
//             textTransform: "none",
//             fontFamily: "Inter",
//             fontWeight: 600,
//             borderRadius: "10px",

//             px: {
//               xs: 1.5,
//               sm: 2.5,
//             },

//             py: 1.1,

//             minWidth: {
//               xs: 95,
//               sm: 120,
//             },

//             flexShrink: 0,

//             boxShadow:
//               "0 5px 12px rgba(0,143,67,0.20)",

//             "&:hover": {
//               background:
//                 "linear-gradient(135deg, #007638, #008f43)",
//               boxShadow:
//                 "0 7px 15px rgba(0,143,67,0.25)",
//             },
//           }}
//         >
//           Refresh
//         </Button>
//       </Box>

//       {/* ERROR */}

//       {error && (
//         <Card
//           sx={{
//             mx: {
//               xs: 2,
//               sm: 3,
//               md: 4,
//             },
//             mb: 3,
//             backgroundColor: "#fef2f2",
//             border: "1px solid #fecaca",
//             boxShadow: "none",
//             borderRadius: 3,
//           }}
//         >
//           <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//             <Typography
//               color="error"
//               sx={{
//                 fontFamily: "Inter",
//                 fontWeight: 600,
//               }}
//             >
//               {error}
//             </Typography>

//             <Button
//               onClick={fetchOrders}
//               sx={{
//                 mt: 1,
//                 color: "#008f43",
//                 textTransform: "none",
//                 fontFamily: "Inter",
//                 fontWeight: 600,
//               }}
//             >
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       {/* SUMMARY CARDS */}

//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: {
//             xs: "repeat(2, minmax(0, 1fr))",
//             sm: "repeat(2, minmax(0, 1fr))",
//             md: "repeat(4, minmax(0, 1fr))",
//           },
//           gap: {
//             xs: 1.5,
//             sm: 2,
//             md: 2.5,
//           },
//           mb: {
//             xs: 3,
//             md: 4,
//           },
//           px: {
//             xs: 2,
//             sm: 3,
//             md: 4,
//           },
//           alignItems: "stretch",
//         }}
//       >
//         <SummaryCard
//           title="Customers"
//           value={customers.length}
//           color="#6b7280"
//           icon={<PeopleIcon />}
//         />

//         <SummaryCard
//           title="Total Orders"
//           value={orders.length}
//           color="#008f43"
//           icon={<ShoppingCartOutlinedIcon />}
//         />

//         <SummaryCard
//           title="Pending"
//           value={countStatus("pending")}
//           color="#f59e0b"
//           icon={<PendingActionsIcon />}
//         />

//         <SummaryCard
//           title="Confirmed"
//           value={countStatus("confirmed")}
//           color="#2563eb"
//           icon={<CheckCircleIcon />}
//         />

//         <SummaryCard
//           title="Shipped"
//           value={countStatus("shipped")}
//           color="#0891b2"
//           icon={<LocalShippingIcon />}
//         />

//         <SummaryCard
//           title="Delivered"
//           value={countStatus("delivered")}
//           color="#1c9c57"
//           icon={<DoneAllIcon />}
//         />

//         <SummaryCard
//           title="Cancelled"
//           value={countStatus("cancelled")}
//           color="#dc2626"
//           icon={<CancelIcon />}
//           last
//         />
//       </Box>

//       {/* CUSTOMER TABLE */}

//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: "100%",
//           borderRadius: {
//             xs: 0,
//             sm: "18px",
//           },
//           boxShadow: "0 5px 22px rgba(0,0,0,0.06)",
//           overflow: "hidden",
//           border: "1px solid rgba(0,0,0,0.04)",
//           fontFamily: "Inter",

//           "& *": {
//             fontFamily: "Inter",
//           },
//         }}
//       >
//         <Box
//           sx={{
//             px: {
//               xs: 2,
//               sm: 3,
//             },
//             py: {
//               xs: 2,
//               sm: 2.5,
//             },
//             borderBottom: "1px solid #eeeeee",
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
//             gap: 1.5,
//           }}
//         >
//           <Box>
//             <Typography
//               sx={{
//                 fontSize: {
//                   xs: 17,
//                   sm: 19,
//                 },
//                 fontFamily: "Inter",
//                 fontWeight: 700,
//                 color: "#111827",
//               }}
//             >
//               Customer Orders
//             </Typography>

//             <Typography
//               sx={{
//                 fontSize: 13,
//                 color: "#8a8f98",
//                 mt: 0.4,
//                 fontFamily: "Inter",
//                 fontWeight: 400,
//               }}
//             >
//               Customers who have placed orders
//             </Typography>
//           </Box>

//           <Chip
//             label={`${orders.length} Orders`}
//             sx={{
//               backgroundColor: "#e8f7ee",
//               color: "#008f43",
//               fontFamily: "Inter",
//               fontWeight: 600,
//               borderRadius: "8px",
//             }}
//           />
//         </Box>

//         <CardContent
//           sx={{
//             p: 0,
//             "&:last-child": {
//               pb: 0,
//             },
//           }}
//         >
//           {customers.length === 0 ? (
//             <Box
//               sx={{
//                 py: 10,
//                 px: 2,
//                 textAlign: "center",
//               }}
//             >
//               <ShoppingCartOutlinedIcon
//                 sx={{
//                   fontSize: 55,
//                   color: "#aaa",
//                 }}
//               />

//               <Typography
//                 variant="h6"
//                 sx={{
//                   mt: 1,
//                   fontFamily: "Inter",
//                   fontWeight: 600,
//                 }}
//               >
//                 No Orders Found
//               </Typography>

//               <Typography
//                 color="text.secondary"
//                 sx={{
//                   mt: 0.5,
//                   fontFamily: "Inter",
//                   fontWeight: 400,
//                 }}
//               >
//                 Customer orders will appear here.
//               </Typography>
//             </Box>
//           ) : (
//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 width: "100%",
//                 maxWidth: "100%",
//                 p: 0,
//                 m: 0,
//                 overflowX: "auto",
//                 WebkitOverflowScrolling: "touch",
//               }}
//             >
//               <Table
//                 sx={{
//                   width: "100%",
//                   minWidth: {
//                     xs: 850,
//                     md: "100%",
//                   },
//                   tableLayout: "fixed",
//                   borderCollapse: "collapse",
//                 }}
//               >
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#f8faf9",
//                     }}
//                   >
//                     <TableCell
//                       sx={{
//                         ...tableCellSx,
//                         width: "26%",
//                         fontWeight: 600,
//                         color: "#374151",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Customer
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         ...tableCellSx,
//                         width: "16%",
//                         fontWeight: 600,
//                         color: "#374151",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Phone
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         ...tableCellSx,
//                         width: "14%",
//                         fontWeight: 600,
//                         color: "#374151",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Orders
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         ...tableCellSx,
//                         width: "16%",
//                         fontWeight: 600,
//                         color: "#374151",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Total Amount
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         ...tableCellSx,
//                         width: "16%",
//                         fontWeight: 600,
//                         color: "#374151",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Latest Order
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         ...tableCellSx,
//                         width: "12%",
//                         fontWeight: 600,
//                         color: "#374151",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {customers.map((customer) => (
//                     <TableRow
//                       key={
//                         customer.user_id ||
//                         customer.phone ||
//                         customer.full_name
//                       }
//                       hover
//                       sx={{
//                         "&:last-child td": {
//                           borderBottom: 0,
//                         },
//                         "&:hover": {
//                           backgroundColor: "#fafffc",
//                         },
//                       }}
//                     >
//                       <TableCell
//                         sx={{
//                           ...tableCellSx,
//                           width: "26%",
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 1.5,
//                             minWidth: 0,
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               width: 40,
//                               height: 40,
//                               borderRadius: "50%",
//                               backgroundColor: "#e8f7ee",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               color: "#008f43",
//                               fontWeight: 700,
//                               fontSize: 15,
//                               flexShrink: 0,
//                             }}
//                           >
//                             {customer.full_name
//                               ?.charAt(0)
//                               ?.toUpperCase() || "C"}
//                           </Box>

//                           <Box
//                             sx={{
//                               minWidth: 0,
//                             }}
//                           >
//                             <Typography
//                               sx={{
//                                 whiteSpace: "nowrap",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 fontWeight: 600,
//                                 color: "#111827",
//                                 fontSize: 14,
//                               }}
//                             >
//                               {customer.full_name}
//                             </Typography>

//                             <Typography
//                               sx={{
//                                 fontSize: 11,
//                                 color: "#9ca3af",
//                                 mt: 0.3,
//                                 whiteSpace: "nowrap",
//                               }}
//                             >
//                               User #{customer.user_id || "-"}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </TableCell>

//                       <TableCell
//                         sx={{
//                           ...tableCellSx,
//                           width: "16%",
//                           color: "#4b5563",
//                           fontSize: 14,
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {customer.phone}
//                       </TableCell>

//                       <TableCell
//                         sx={{
//                           ...tableCellSx,
//                           width: "14%",
//                         }}
//                       >
//                         <Chip
//                           label={`${customer.orders.length} ${
//                             customer.orders.length === 1
//                               ? "Order"
//                               : "Orders"
//                           }`}
//                           size="small"
//                           sx={{
//                             backgroundColor: "#e8f7ee",
//                             color: "#008f43",
//                             fontWeight: 600,
//                             borderRadius: "7px",
//                             whiteSpace: "nowrap",
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell
//                         sx={{
//                           ...tableCellSx,
//                           width: "16%",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             whiteSpace: "nowrap",
//                             fontWeight: 600,
//                             color: "#111827",
//                             fontSize: 14,
//                           }}
//                         >
//                           ₹{customer.total_amount.toFixed(2)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell
//                         sx={{
//                           ...tableCellSx,
//                           width: "16%",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: 13,
//                             color: "#4b5563",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {customer.latest_order
//                             ? new Date(
//                                 customer.latest_order
//                               ).toLocaleDateString("en-IN", {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               })
//                             : "-"}
//                         </Typography>
//                       </TableCell>

//                       <TableCell
//                         align="center"
//                         sx={{
//                           ...tableCellSx,
//                           width: "12%",
//                         }}
//                       >
//                         <Button
//                           variant="contained"
//                           size="small"
//                           startIcon={<VisibilityIcon />}
//                           onClick={() =>
//                             handleViewCustomer(customer)
//                           }
//                           sx={{
//                             backgroundColor: "#008f43",
//                             textTransform: "none",
//                             fontWeight: 600,
//                             borderRadius: "8px",
//                             px: 2,
//                             boxShadow: "none",

//                             "&:hover": {
//                               backgroundColor: "#007638",
//                               boxShadow: "none",
//                             },
//                           }}
//                         >
//                           View
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// /* =====================================================
//    TABLE CELL COMMON STYLE
// ===================================================== */

// const tableCellSx = {
//   px: {
//     xs: 1,
//     sm: 1.5,
//     md: 2,
//   },
//   py: {
//     xs: 1.5,
//     sm: 1.8,
//   },
//   verticalAlign: "middle",
//   boxSizing: "border-box",
// };

// /* =====================================================
//    SUMMARY CARD COMPONENT
// ===================================================== */

// function SummaryCard({
//   title,
//   value,
//   color,
//   icon,
//   last = false,
// }) {
//   return (
//     <Box
//       sx={{
//         minWidth: 0,
//         width: "100%",

//         ...(last && {
//           gridColumn: "1 / -1",
//           width: "100%",
//           justifySelf: "stretch",
//         }),
//       }}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           height: "100%",
//           minHeight: {
//             xs: 125,
//             sm: 145,
//             md: 150,
//           },

//           borderRadius: "16px",
//           backgroundColor: "#ffffff",
//           borderTop: `3px solid ${color}`,

//           boxShadow: "0 4px 15px rgba(0,0,0,0.05)",

//           display: "flex",
//           flexDirection: "column",

//           transition: "all 0.2s ease",

//           "&:hover": {
//             transform: "translateY(-2px)",
//             boxShadow: "0 7px 20px rgba(0,0,0,0.08)",
//           },
//         }}
//       >
//         <CardContent
//           sx={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",

//             p: {
//               xs: 1.8,
//               sm: 2.2,
//             },

//             "&:last-child": {
//               pb: {
//                 xs: 1.8,
//                 sm: 2.2,
//               },
//             },
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 1,
//               minWidth: 0,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: {
//                   xs: 11,
//                   sm: 12,
//                 },
//                 fontWeight: 500,
//                 color: "#6b7280",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {title}
//             </Typography>

//             <Box
//               sx={{
//                 width: {
//                   xs: 32,
//                   sm: 36,
//                 },
//                 height: {
//                   xs: 32,
//                   sm: 36,
//                 },

//                 borderRadius: "10px",
//                 backgroundColor: `${color}15`,

//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",

//                 color: color,
//                 flexShrink: 0,

//                 "& svg": {
//                   fontSize: {
//                     xs: 18,
//                     sm: 20,
//                   },
//                 },
//               }}
//             >
//               {icon}
//             </Box>
//           </Box>

//           <Typography
//             sx={{
//               mt: 1.5,
//               fontSize: {
//                 xs: 24,
//                 sm: 28,
//               },
//               fontWeight: 700,
//               color: "#111827",
//             }}
//           >
//             {value}
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";

import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const INTER_FONT = "'Inter', sans-serif";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/orders/admin`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to fetch orders"
        );
      }

      setOrders(response.data?.data || []);
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const customers = useMemo(() => {
    const grouped = {};

    orders.forEach((order) => {
      const key =
        order.user_id ||
        order.phone ||
        order.full_name ||
        `customer-${order.id}`;

      if (!grouped[key]) {
        grouped[key] = {
          user_id: order.user_id,
          full_name: order.full_name || "Customer",
          phone: order.phone || "-",
          orders: [],
          total_amount: 0,
          latest_order: order.created_at,
        };
      }

      grouped[key].orders.push(order);

      grouped[key].total_amount += Number(
        order.total_amount || 0
      );

      if (
        order.created_at &&
        new Date(order.created_at) >
          new Date(grouped[key].latest_order)
      ) {
        grouped[key].latest_order = order.created_at;
      }
    });

    return Object.values(grouped).sort(
      (a, b) =>
        new Date(b.latest_order) -
        new Date(a.latest_order)
    );
  }, [orders]);

  const countStatus = (status) => {
    return orders.filter(
      (order) => order.status?.toLowerCase() === status
    ).length;
  };

  const handleViewCustomer = (customer) => {
    navigate(`/orders/customer/${customer.user_id}`, {
      state: {
        customer,
      },
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          background:
            "linear-gradient(135deg, #f4faf6 0%, #f5f7f9 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          fontFamily: INTER_FONT,

          "& *": {
            fontFamily: `${INTER_FONT} !important`,
          },
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ color: "#008f43" }} />

          <Typography
            sx={{
              mt: 2,
              color: "#777",
              fontWeight: 500,
              fontFamily: `${INTER_FONT} !important`,
            }}
          >
            Loading orders...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",

        background:
          "linear-gradient(135deg, #f4faf6 0%, #f5f7f9 100%)",

        p: 0,

        fontFamily: INTER_FONT,

        "& *": {
          fontFamily: `${INTER_FONT} !important`,
        },
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: "row",
          gap: 2,

          mb: {
            xs: 2,
            md: 3,
          },

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          pt: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          fontFamily: INTER_FONT,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: {
                  xs: 42,
                  sm: 46,
                },

                height: {
                  xs: 42,
                  sm: 46,
                },

                borderRadius: "14px",

                background:
                  "linear-gradient(135deg, #008f43, #00a854)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                flexShrink: 0,

                boxShadow:
                  "0 6px 15px rgba(0,143,67,0.22)",
              }}
            >
              <ShoppingCartOutlinedIcon
                sx={{
                  color: "#fff",
                  fontSize: {
                    xs: 23,
                    sm: 25,
                  },
                }}
              />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontFamily: `${INTER_FONT} !important`,
                fontWeight: 700,
                color: "#111827",

                fontSize: {
                  xs: 27,
                  sm: 32,
                  md: 34,
                },
              }}
            >
              Orders
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 1,
              color: "#6b7280",
              fontSize: 14,
              fontWeight: 400,
              fontFamily: `${INTER_FONT} !important`,
            }}
          >
            View customer orders and order history.
          </Typography>
        </Box>

        {/* REFRESH BUTTON */}

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          sx={{
            background:
              "linear-gradient(135deg, #008f43, #00a854)",

            textTransform: "none",
            fontFamily: `${INTER_FONT} !important`,
            fontWeight: 600,
            borderRadius: "10px",

            px: {
              xs: 1.5,
              sm: 2.5,
            },

            py: 1.1,

            minWidth: {
              xs: 95,
              sm: 120,
            },

            flexShrink: 0,

            boxShadow:
              "0 5px 12px rgba(0,143,67,0.20)",

            "&:hover": {
              background:
                "linear-gradient(135deg, #007638, #008f43)",

              boxShadow:
                "0 7px 15px rgba(0,143,67,0.25)",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* ================= ERROR ================= */}

      {error && (
        <Card
          sx={{
            mx: {
              xs: 2,
              sm: 3,
              md: 4,
            },

            mb: 3,

            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            boxShadow: "none",
            borderRadius: 3,

            fontFamily: INTER_FONT,

            "& *": {
              fontFamily: `${INTER_FONT} !important`,
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography
              color="error"
              sx={{
                fontWeight: 600,
                fontFamily: `${INTER_FONT} !important`,
              }}
            >
              {error}
            </Typography>

            <Button
              onClick={fetchOrders}
              sx={{
                mt: 1,
                color: "#008f43",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: `${INTER_FONT} !important`,
              }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ================= SUMMARY CARDS ================= */}

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

          mb: {
            xs: 3,
            md: 4,
          },

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          alignItems: "stretch",

          fontFamily: INTER_FONT,

          "& *": {
            fontFamily: `${INTER_FONT} !important`,
          },
        }}
      >
        <SummaryCard
          title="Customers"
          value={customers.length}
          color="#6b7280"
          icon={<PeopleIcon />}
        />

        <SummaryCard
          title="Total Orders"
          value={orders.length}
          color="#008f43"
          icon={<ShoppingCartOutlinedIcon />}
        />

        <SummaryCard
          title="Pending"
          value={countStatus("pending")}
          color="#f59e0b"
          icon={<PendingActionsIcon />}
        />

        <SummaryCard
          title="Confirmed"
          value={countStatus("confirmed")}
          color="#2563eb"
          icon={<CheckCircleIcon />}
        />

        <SummaryCard
          title="Shipped"
          value={countStatus("shipped")}
          color="#0891b2"
          icon={<LocalShippingIcon />}
        />

        <SummaryCard
          title="Delivered"
          value={countStatus("delivered")}
          color="#1c9c57"
          icon={<DoneAllIcon />}
        />

        <SummaryCard
          title="Cancelled"
          value={countStatus("cancelled")}
          color="#dc2626"
          icon={<CancelIcon />}
          last
        />
      </Box>

      {/* ================= CUSTOMER TABLE ================= */}

      <Card
        sx={{
          width: "100%",
          maxWidth: "100%",

          borderRadius: {
            xs: 0,
            sm: "18px",
          },

          boxShadow: "0 5px 22px rgba(0,0,0,0.06)",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.04)",

          fontFamily: INTER_FONT,

          "& *": {
            fontFamily: `${INTER_FONT} !important`,
          },
        }}
      >
        {/* TABLE HEADER */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },

            py: {
              xs: 2,
              sm: 2.5,
            },

            borderBottom: "1px solid #eeeeee",

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

            gap: 1.5,

            fontFamily: INTER_FONT,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 17,
                  sm: 19,
                },

                fontWeight: 700,
                color: "#111827",
                fontFamily: `${INTER_FONT} !important`,
              }}
            >
              Customer Orders
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "#8a8f98",
                mt: 0.4,
                fontWeight: 400,
                fontFamily: `${INTER_FONT} !important`,
              }}
            >
              Customers who have placed orders
            </Typography>
          </Box>

          <Chip
            label={`${orders.length} Orders`}
            sx={{
              backgroundColor: "#e8f7ee",
              color: "#008f43",
              fontWeight: 600,
              borderRadius: "8px",
              fontFamily: `${INTER_FONT} !important`,

              "& .MuiChip-label": {
                fontFamily: `${INTER_FONT} !important`,
              },
            }}
          />
        </Box>

        <CardContent
          sx={{
            p: 0,

            "&:last-child": {
              pb: 0,
            },
          }}
        >
          {customers.length === 0 ? (
            <Box
              sx={{
                py: 10,
                px: 2,
                textAlign: "center",
                fontFamily: INTER_FONT,

                "& *": {
                  fontFamily: `${INTER_FONT} !important`,
                },
              }}
            >
              <ShoppingCartOutlinedIcon
                sx={{
                  fontSize: 55,
                  color: "#aaa",
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  mt: 1,
                  fontWeight: 600,
                  fontFamily: `${INTER_FONT} !important`,
                }}
              >
                No Orders Found
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontWeight: 400,
                  fontFamily: `${INTER_FONT} !important`,
                }}
              >
                Customer orders will appear here.
              </Typography>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: "100%",
                p: 0,
                m: 0,
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",

                fontFamily: INTER_FONT,

                "& *": {
                  fontFamily: `${INTER_FONT} !important`,
                },
              }}
            >
              <Table
                sx={{
                  width: "100%",

                  minWidth: {
                    xs: 850,
                    md: "100%",
                  },

                  tableLayout: "fixed",
                  borderCollapse: "collapse",

                  fontFamily: INTER_FONT,

                  "& *": {
                    fontFamily: `${INTER_FONT} !important`,
                  },
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#f8faf9",
                    }}
                  >
                    <TableCell
                      sx={{
                        ...tableCellSx,
                        width: "26%",
                        fontWeight: 600,
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Customer
                    </TableCell>

                    <TableCell
                      sx={{
                        ...tableCellSx,
                        width: "16%",
                        fontWeight: 600,
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Phone
                    </TableCell>

                    <TableCell
                      sx={{
                        ...tableCellSx,
                        width: "14%",
                        fontWeight: 600,
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Orders
                    </TableCell>

                    <TableCell
                      sx={{
                        ...tableCellSx,
                        width: "16%",
                        fontWeight: 600,
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Total Amount
                    </TableCell>

                    <TableCell
                      sx={{
                        ...tableCellSx,
                        width: "16%",
                        fontWeight: 600,
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Latest Order
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        ...tableCellSx,
                        width: "12%",
                        fontWeight: 600,
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={
                        customer.user_id ||
                        customer.phone ||
                        customer.full_name
                      }
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },

                        "&:hover": {
                          backgroundColor: "#fafffc",
                        },
                      }}
                    >
                      {/* CUSTOMER */}

                      <TableCell
                        sx={{
                          ...tableCellSx,
                          width: "26%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: "#e8f7ee",

                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",

                              color: "#008f43",
                              fontWeight: 700,
                              fontSize: 15,
                              flexShrink: 0,

                              fontFamily: `${INTER_FONT} !important`,
                            }}
                          >
                            {customer.full_name
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </Box>

                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",

                                fontWeight: 600,
                                color: "#111827",
                                fontSize: 14,

                                fontFamily: `${INTER_FONT} !important`,
                              }}
                            >
                              {customer.full_name}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 11,
                                color: "#9ca3af",
                                mt: 0.3,
                                whiteSpace: "nowrap",
                                fontFamily: `${INTER_FONT} !important`,
                              }}
                            >
                              User #{customer.user_id || "-"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* PHONE */}

                      <TableCell
                        sx={{
                          ...tableCellSx,
                          width: "16%",
                          color: "#4b5563",
                          fontSize: 14,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {customer.phone}
                      </TableCell>

                      {/* ORDERS */}

                      <TableCell
                        sx={{
                          ...tableCellSx,
                          width: "14%",
                        }}
                      >
                        <Chip
                          label={`${customer.orders.length} ${
                            customer.orders.length === 1
                              ? "Order"
                              : "Orders"
                          }`}
                          size="small"
                          sx={{
                            backgroundColor: "#e8f7ee",
                            color: "#008f43",
                            fontWeight: 600,
                            borderRadius: "7px",
                            whiteSpace: "nowrap",

                            fontFamily: `${INTER_FONT} !important`,

                            "& .MuiChip-label": {
                              fontFamily: `${INTER_FONT} !important`,
                            },
                          }}
                        />
                      </TableCell>

                      {/* TOTAL AMOUNT */}

                      <TableCell
                        sx={{
                          ...tableCellSx,
                          width: "16%",
                        }}
                      >
                        <Typography
                          sx={{
                            whiteSpace: "nowrap",
                            fontWeight: 600,
                            color: "#111827",
                            fontSize: 14,
                            fontFamily: `${INTER_FONT} !important`,
                          }}
                        >
                          ₹{customer.total_amount.toFixed(2)}
                        </Typography>
                      </TableCell>

                      {/* LATEST ORDER */}

                      <TableCell
                        sx={{
                          ...tableCellSx,
                          width: "16%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: "#4b5563",
                            whiteSpace: "nowrap",
                            fontFamily: `${INTER_FONT} !important`,
                          }}
                        >
                          {customer.latest_order
                            ? new Date(
                                customer.latest_order
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </Typography>
                      </TableCell>

                      {/* ACTION */}

                      <TableCell
                        align="center"
                        sx={{
                          ...tableCellSx,
                          width: "12%",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            handleViewCustomer(customer)
                          }
                          sx={{
                            backgroundColor: "#008f43",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "8px",
                            px: 2,
                            boxShadow: "none",

                            fontFamily: `${INTER_FONT} !important`,

                            "& .MuiButton-startIcon": {
                              fontFamily: `${INTER_FONT} !important`,
                            },

                            "&:hover": {
                              backgroundColor: "#007638",
                              boxShadow: "none",
                            },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

/* =====================================================
   COMMON TABLE CELL STYLE
===================================================== */

const tableCellSx = {
  px: {
    xs: 1,
    sm: 1.5,
    md: 2,
  },

  py: {
    xs: 1.5,
    sm: 1.8,
  },

  verticalAlign: "middle",
  boxSizing: "border-box",

  fontFamily: `${INTER_FONT} !important`,
};

/* =====================================================
   SUMMARY CARD COMPONENT
===================================================== */

function SummaryCard({
  title,
  value,
  color,
  icon,
  last = false,
}) {
  return (
    <Box
      sx={{
        minWidth: 0,
        width: "100%",

        ...(last && {
          gridColumn: "1 / -1",
          width: "100%",
          justifySelf: "stretch",
        }),
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",

          minHeight: {
            xs: 125,
            sm: 145,
            md: 150,
          },

          borderRadius: "16px",
          backgroundColor: "#ffffff",
          borderTop: `3px solid ${color}`,

          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",

          display: "flex",
          flexDirection: "column",

          fontFamily: INTER_FONT,

          "& *": {
            fontFamily: `${INTER_FONT} !important`,
          },

          transition: "all 0.2s ease",

          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 7px 20px rgba(0,0,0,0.08)",
          },
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",

            p: {
              xs: 1.8,
              sm: 2.2,
            },

            fontFamily: INTER_FONT,

            "&:last-child": {
              pb: {
                xs: 1.8,
                sm: 2.2,
              },
            },

            "& *": {
              fontFamily: `${INTER_FONT} !important`,
            },
          }}
        >
          {/* CARD TITLE AND ICON */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 11,
                  sm: 12,
                },

                fontWeight: 500,
                color: "#6b7280",

                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",

                fontFamily: `${INTER_FONT} !important`,
              }}
            >
              {title}
            </Typography>

            <Box
              sx={{
                width: {
                  xs: 32,
                  sm: 36,
                },

                height: {
                  xs: 32,
                  sm: 36,
                },

                borderRadius: "10px",
                backgroundColor: `${color}15`,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: color,
                flexShrink: 0,

                "& svg": {
                  fontSize: {
                    xs: 18,
                    sm: 20,
                  },
                },
              }}
            >
              {icon}
            </Box>
          </Box>

          {/* CARD VALUE */}

          <Typography
            sx={{
              mt: 1.5,

              fontSize: {
                xs: 24,
                sm: 28,
              },

              fontWeight: 700,
              color: "#111827",

              fontFamily: `${INTER_FONT} !important`,
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}