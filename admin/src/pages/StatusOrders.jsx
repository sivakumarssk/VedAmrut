// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// import {
//   Box,
//   Button,
//   Card,
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

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import RefreshIcon from "@mui/icons-material/Refresh";

// import { API_BASE_URL } from "../api";

// const INTER_FONT = "'Inter', sans-serif";

// const VALID_STATUSES = [
//   "pending",
//   "confirmed",
//   "shipped",
//   "delivered",
//   "cancelled",
// ];

// export default function StatusOrders() {
//   const { status } = useParams();
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const selectedStatus = status?.toLowerCase();

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

//       const allOrders = response.data?.data || [];

//       const filteredOrders = allOrders.filter(
//         (order) =>
//           order.status?.toLowerCase() === selectedStatus
//       );

//       setOrders(filteredOrders);
//     } catch (error) {
//       console.error("FETCH STATUS ORDERS ERROR:", error);

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
//     if (VALID_STATUSES.includes(selectedStatus)) {
//       fetchOrders();
//     } else {
//       setLoading(false);
//       setError("Invalid order status.");
//     }
//   }, [selectedStatus]);

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: {
//         bg: "#fff3cd",
//         text: "#b45309",
//       },
//       confirmed: {
//         bg: "#dbeafe",
//         text: "#1d4ed8",
//       },
//       shipped: {
//         bg: "#cffafe",
//         text: "#0e7490",
//       },
//       delivered: {
//         bg: "#dcfce7",
//         text: "#15803d",
//       },
//       cancelled: {
//         bg: "#fee2e2",
//         text: "#dc2626",
//       },
//     };

//     return colors[status] || {
//       bg: "#f3f4f6",
//       text: "#374151",
//     };
//   };

//   const formatDate = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "70vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <CircularProgress sx={{ color: "#008f43" }} />
//       </Box>
//     );
//   }

//   if (!VALID_STATUSES.includes(selectedStatus)) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography color="error">
//           Invalid order status.
//         </Typography>

//         <Button
//           onClick={() => navigate("/orders")}
//           sx={{ mt: 2 }}
//         >
//           Back to Orders
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg, #f4faf6 0%, #f5f7f9 100%)",
//         p: { xs: 2, sm: 3, md: 4 },
//         fontFamily: INTER_FONT,
//         "& *": {
//           fontFamily: `${INTER_FONT} !important`,
//         },
//       }}
//     >
//       {/* HEADER */}

//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: 2,
//           mb: 3,
//         }}
//       >
//         <Box>
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={() => navigate("/orders")}
//             sx={{
//               color: "#008f43",
//               textTransform: "none",
//               mb: 1,
//             }}
//           >
//             Back to Orders
//           </Button>

//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: 700,
//               color: "#111827",
//               fontSize: { xs: 25, sm: 32 },
//               textTransform: "capitalize",
//             }}
//           >
//             {selectedStatus} Orders
//           </Typography>

//           <Typography
//             sx={{
//               mt: 1,
//               color: "#6b7280",
//               fontSize: 14,
//             }}
//           >
//             View all {selectedStatus} orders.
//           </Typography>
//         </Box>

//         <Button
//           variant="contained"
//           startIcon={<RefreshIcon />}
//           onClick={fetchOrders}
//           sx={{
//             background:
//               "linear-gradient(135deg, #008f43, #00a854)",
//             textTransform: "none",
//             fontWeight: 600,
//             borderRadius: "10px",
//             "&:hover": {
//               background: "#007638",
//             },
//           }}
//         >
//           Refresh
//         </Button>
//       </Box>

//       {/* ERROR */}

//       {error && (
//         <Typography
//           color="error"
//           sx={{ mb: 2 }}
//         >
//           {error}
//         </Typography>
//       )}

//       {/* TABLE */}

//       <Card
//         sx={{
//           borderRadius: "16px",
//           boxShadow: "0 5px 22px rgba(0,0,0,0.06)",
//           overflow: "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             p: 3,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             borderBottom: "1px solid #eeeeee",
//             gap: 2,
//           }}
//         >
//           <Typography
//             sx={{
//               fontSize: 19,
//               fontWeight: 700,
//               color: "#111827",
//             }}
//           >
//             {selectedStatus.charAt(0).toUpperCase() +
//               selectedStatus.slice(1)}{" "}
//             Orders
//           </Typography>

//           <Chip
//             label={`${orders.length} Orders`}
//             sx={{
//               backgroundColor: "#e8f7ee",
//               color: "#008f43",
//               fontWeight: 600,
//             }}
//           />
//         </Box>

//         {orders.length === 0 ? (
//           <Box sx={{ py: 10, textAlign: "center" }}>
//             <Typography
//               sx={{
//                 fontSize: 18,
//                 fontWeight: 600,
//                 color: "#374151",
//               }}
//             >
//               No {selectedStatus} orders found.
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer
//             component={Paper}
//             elevation={0}
//             sx={{ overflowX: "auto" }}
//           >
//             <Table sx={{ minWidth: 850 }}>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#f8faf9" }}>
//                   <TableCell sx={{ fontWeight: 600 }}>
//                     Order ID
//                   </TableCell>

//                   <TableCell sx={{ fontWeight: 600 }}>
//                     Customer
//                   </TableCell>

//                   <TableCell sx={{ fontWeight: 600 }}>
//                     Phone
//                   </TableCell>

//                   <TableCell sx={{ fontWeight: 600 }}>
//                     Amount
//                   </TableCell>

//                   <TableCell sx={{ fontWeight: 600 }}>
//                     Status
//                   </TableCell>

//                   <TableCell sx={{ fontWeight: 600 }}>
//                     Order Date
//                   </TableCell>

//                   <TableCell align="center" sx={{ fontWeight: 600 }}>
//                     Action
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {orders.map((order) => {
//                   const statusColor = getStatusColor(
//                     order.status?.toLowerCase()
//                   );

//                   return (
//                     <TableRow
//                       key={order.id}
//                       hover
//                       sx={{
//                         "&:last-child td": {
//                           borderBottom: 0,
//                         },
//                       }}
//                     >
//                       <TableCell>
//                         #{order.id}
//                       </TableCell>

//                       <TableCell>
//                         {order.full_name || "Customer"}
//                       </TableCell>

//                       <TableCell>
//                         {order.phone || "-"}
//                       </TableCell>

//                       <TableCell>
//                         ₹
//                         {Number(
//                           order.total_amount || 0
//                         ).toFixed(2)}
//                       </TableCell>

//                       <TableCell>
//                         <Chip
//                           label={order.status}
//                           size="small"
//                           sx={{
//                             backgroundColor: statusColor.bg,
//                             color: statusColor.text,
//                             fontWeight: 600,
//                             textTransform: "capitalize",
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell>
//                         {formatDate(order.created_at)}
//                       </TableCell>

//                       <TableCell align="center">
//                         <Button
//                           variant="contained"
//                           size="small"
//                           startIcon={<VisibilityIcon />}
//                           onClick={() =>
//                             navigate(`/orders/${order.id}`)
//                           }
//                           sx={{
//                             backgroundColor: "#008f43",
//                             textTransform: "none",
//                             fontWeight: 600,
//                             borderRadius: "8px",
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
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Card>
//     </Box>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
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

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";

import { API_BASE_URL } from "../api";

const INTER_FONT = "'Inter', sans-serif";

const VALID_STATUSES = [
  "all",
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function StatusOrders() {
  const { status } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedStatus = status?.toLowerCase();

  // FETCH ORDERS
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

      const allOrders = response.data?.data || [];

      // FILTER ORDERS
      const filteredOrders =
        selectedStatus === "all"
          ? allOrders
          : allOrders.filter(
              (order) =>
                order.status?.toLowerCase() === selectedStatus
            );

      setOrders(filteredOrders);
    } catch (error) {
      console.error("FETCH STATUS ORDERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD ORDERS WHEN STATUS CHANGES
  useEffect(() => {
    if (VALID_STATUSES.includes(selectedStatus)) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Invalid order status.");
    }
  }, [selectedStatus]);

  // STATUS COLORS
  const getStatusColor = (status) => {
    const colors = {
      pending: {
        bg: "#fff3cd",
        text: "#b45309",
      },
      confirmed: {
        bg: "#dbeafe",
        text: "#1d4ed8",
      },
      shipped: {
        bg: "#cffafe",
        text: "#0e7490",
      },
      delivered: {
        bg: "#dcfce7",
        text: "#15803d",
      },
      cancelled: {
        bg: "#fee2e2",
        text: "#dc2626",
      },
    };

    return (
      colors[status] || {
        bg: "#f3f4f6",
        text: "#374151",
      }
    );
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // LOADING
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#008f43" }} />
      </Box>
    );
  }

  // INVALID STATUS
  if (!VALID_STATUSES.includes(selectedStatus)) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          Invalid order status.
        </Typography>

        <Button
          onClick={() => navigate("/orders")}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  // PAGE
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4faf6 0%, #f5f7f9 100%)",
        p: { xs: 2, sm: 3, md: 4 },
        fontFamily: INTER_FONT,
        "& *": {
          fontFamily: `${INTER_FONT} !important`,
        },
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/orders")}
            sx={{
              color: "#008f43",
              textTransform: "none",
              mb: 1,
            }}
          >
            Back to Orders
          </Button>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
              fontSize: { xs: 25, sm: 32 },
            }}
          >
            {selectedStatus === "all"
              ? "All Orders"
              : `${selectedStatus.charAt(0).toUpperCase() +
                  selectedStatus.slice(1)} Orders`}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            {selectedStatus === "all"
              ? "View and manage all orders."
              : `View all ${selectedStatus} orders.`}
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
            fontWeight: 600,
            borderRadius: "10px",
            "&:hover": {
              background: "#007638",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* STATUS FILTER BUTTONS */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 3,
        }}
      >
        {VALID_STATUSES.map((filter) => (
          <Button
            key={filter}
            variant={
              selectedStatus === filter ? "contained" : "outlined"
            }
            onClick={() => navigate(`/orders/status/${filter}`)}
            sx={{
              textTransform: "capitalize",
              borderRadius: "10px",
              px: 2.5,
              py: 1,
              fontWeight: 600,
              borderColor: "#008f43",
              color:
                selectedStatus === filter ? "#ffffff" : "#008f43",
              backgroundColor:
                selectedStatus === filter ? "#008f43" : "#ffffff",
              "&:hover": {
                backgroundColor:
                  selectedStatus === filter ? "#007638" : "#e8f7ee",
                borderColor: "#008f43",
              },
            }}
          >
            {filter === "all" ? "All Orders" : filter}
          </Button>
        ))}
      </Box>

      {/* ERROR */}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* ORDERS TABLE */}

      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 5px 22px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}

        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eeeeee",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {selectedStatus === "all"
              ? "All Orders"
              : `${selectedStatus.charAt(0).toUpperCase() +
                  selectedStatus.slice(1)} Orders`}
          </Typography>

          <Chip
            label={`${orders.length} Orders`}
            sx={{
              backgroundColor: "#e8f7ee",
              color: "#008f43",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* EMPTY STATE */}

        {orders.length === 0 ? (
          <Box sx={{ py: 10, textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              {selectedStatus === "all"
                ? "No orders found."
                : `No ${selectedStatus} orders found.`}
            </Typography>
          </Box>
        ) : (
          /* TABLE */

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 850 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8faf9" }}>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Order ID
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    Customer
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    Phone
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    Amount
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    Status
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    Order Date
                  </TableCell>

                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => {
                  const statusColor = getStatusColor(
                    order.status?.toLowerCase()
                  );

                  return (
                    <TableRow
                      key={order.id}
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell>#{order.id}</TableCell>

                      <TableCell>
                        {order.full_name || "Customer"}
                      </TableCell>

                      <TableCell>
                        {order.phone || "-"}
                      </TableCell>

                      <TableCell>
                        ₹
                        {Number(
                          order.total_amount || 0
                        ).toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {formatDate(order.created_at)}
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            navigate(`/orders/${order.id}`)
                          }
                          sx={{
                            backgroundColor: "#008f43",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "8px",
                            boxShadow: "none",
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
}