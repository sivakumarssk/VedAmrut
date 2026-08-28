
// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Grid,
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

// import { useNavigate } from "react-router-dom";

// import { API_BASE_URL } from "../api";

// export default function Orders() {
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // =====================================================
//   // FETCH ORDERS
//   // =====================================================

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       console.log("================================");
//       console.log("FETCH ADMIN ORDERS");
//       console.log(
//         "URL:",
//         `${API_BASE_URL}/api/orders/admin`
//       );

//       const response = await axios.get(
//         `${API_BASE_URL}/api/orders/admin`
//       );

//       console.log("ORDERS RESPONSE:", response.data);

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message ||
//             "Failed to fetch orders"
//         );
//       }

//       setOrders(response.data?.data || []);
//     } catch (error) {
//       console.error(
//         "FETCH ORDERS ERROR:",
//         error
//       );

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
//   }, []);

//   // =====================================================
//   // GROUP ORDERS BY CUSTOMER
//   // =====================================================

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
//           full_name:
//             order.full_name || "Customer",
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
//         grouped[key].latest_order =
//           order.created_at;
//       }
//     });

//     // Newest customer first
//     return Object.values(grouped).sort(
//       (a, b) =>
//         new Date(b.latest_order) -
//         new Date(a.latest_order)
//     );
//   }, [orders]);

//   // =====================================================
//   // STATUS COUNT
//   // =====================================================

//   const countStatus = (status) => {
//     return orders.filter(
//       (order) =>
//         order.status?.toLowerCase() ===
//         status
//     ).length;
//   };

//   // =====================================================
//   // VIEW CUSTOMER ORDERS
//   // =====================================================

// //   const handleViewCustomer = (customer) => {
// //     console.log("================================");
// //     console.log("OPEN CUSTOMER ORDERS");
// //     console.log(
// //       "CUSTOMER:",
// //       customer.full_name
// //     );
// //     console.log(
// //       "USER ID:",
// //       customer.user_id
// //     );
// //     console.log(
// //       "ORDER IDS:",
// //       customer.orders.map(
// //         (order) => order.id
// //       )
// //     );

// //     navigate(
// //       `/orders/customer/${customer.user_id}`,
// //       {
// //         state: {
// //           customer,
// //         },
// //       }
// //     );
// //   };
// const handleViewCustomer = (customer) => {
//   console.log("================================");
//   console.log("OPEN CUSTOMER ORDERS");
//   console.log("CUSTOMER:", customer.full_name);
//   console.log("USER ID:", customer.user_id);
//   console.log(
//     "ORDER IDS:",
//     customer.orders.map((order) => order.id)
//   );

// //   navigate("/orders/customer", {
// //     state: {
// //       customer,
// //     },
// //   });
// navigate(`/orders/customer/${customer.user_id}`, {
//   state: {
//     customer,
//   },
// });
// };
//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           backgroundColor: "#f5f7f9",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Box sx={{ textAlign: "center" }}>
//           <CircularProgress
//             sx={{ color: "#008f43" }}
//           />

//           <Typography
//             sx={{
//               mt: 2,
//               color: "#777",
//             }}
//           >
//             Loading orders...
//           </Typography>
//         </Box>
//       </Box>
//     );
//   }

//   // =====================================================
//   // MAIN
//   // =====================================================

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundColor: "#f5f7f9",
//         p: {
//           xs: 2,
//           sm: 3,
//           md: 4,
//         },
//       }}
//     >
//       {/* HEADER */}

//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: {
//             xs: "flex-start",
//             sm: "center",
//           },
//           flexDirection: {
//             xs: "column",
//             sm: "row",
//           },
//           gap: 2,
//           mb: 3,
//         }}
//       >
//         <Box>
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: 800,
//               color: "#111827",
//             }}
//           >
//             Orders
//           </Typography>

//           <Typography
//             sx={{
//               mt: 0.5,
//               color: "#777",
//               fontSize: 14,
//             }}
//           >
//             View customer orders and order history.
//           </Typography>
//         </Box>

//         <Button
//           variant="contained"
//           startIcon={<RefreshIcon />}
//           onClick={fetchOrders}
//           sx={{
//             backgroundColor: "#008f43",
//             textTransform: "none",
//             fontWeight: 600,
//             borderRadius: 2,
//             px: 2.5,
//             "&:hover": {
//               backgroundColor: "#007638",
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
//             mb: 3,
//             backgroundColor: "#fef2f2",
//             border: "1px solid #fecaca",
//             boxShadow: "none",
//             borderRadius: 3,
//           }}
//         >
//           <CardContent>
//             <Typography
//               color="error"
//               fontWeight={600}
//             >
//               {error}
//             </Typography>
//           </CardContent>
//         </Card>
//       )}

//       {/* SUMMARY */}

//       <Grid
//         container
//         spacing={2.5}
//         sx={{ mb: 3 }}
//       >
//         <SummaryCard
//           title="Customers"
//           value={customers.length}
//           color="#555"
//         />

//         <SummaryCard
//           title="Total Orders"
//           value={orders.length}
//           color="#008f43"
//         />

//         <SummaryCard
//           title="Pending"
//           value={countStatus("pending")}
//           color="#f59e0b"
//         />

//         <SummaryCard
//           title="Confirmed"
//           value={countStatus("confirmed")}
//           color="#2563eb"
//         />

//         <SummaryCard
//           title="Shipped"
//           value={countStatus("shipped")}
//           color="#0891b2"
//         />

//         <SummaryCard
//           title="Delivered"
//           value={countStatus("delivered")}
//           color="#1c9c57"
//         />
//       </Grid>

//       {/* CUSTOMER TABLE */}

//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow:
//             "0 3px 12px rgba(0,0,0,0.06)",
//           overflow: "hidden",
//         }}
//       >
//         <CardContent sx={{ p: 0 }}>
//           {customers.length === 0 ? (
//             <Box
//               sx={{
//                 py: 10,
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
//                   fontWeight: 600,
//                 }}
//               >
//                 No Orders Found
//               </Typography>
//             </Box>
//           ) : (
//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 overflowX: "auto",
//               }}
//             >
//               <Table sx={{ minWidth: 850 }}>
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#f7f8fa",
//                     }}
//                   >
//                     <TableCell sx={{ fontWeight: 700 }}>
//                       Customer
//                     </TableCell>

//                     <TableCell sx={{ fontWeight: 700 }}>
//                       Phone
//                     </TableCell>

//                     <TableCell sx={{ fontWeight: 700 }}>
//                       Orders
//                     </TableCell>

//                     <TableCell sx={{ fontWeight: 700 }}>
//                       Total Amount
//                     </TableCell>

//                     <TableCell sx={{ fontWeight: 700 }}>
//                       Latest Order
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{ fontWeight: 700 }}
//                     >
//                       View
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {customers.map((customer) => (
//                     <TableRow
//                       key={
//                         customer.user_id ||
//                         customer.phone
//                       }
//                       hover
//                     >
//                       {/* CUSTOMER */}

//                       <TableCell>
//                         <Typography
//                           fontWeight={700}
//                           color="#111827"
//                         >
//                           {customer.full_name}
//                         </Typography>
//                       </TableCell>

//                       {/* PHONE */}

//                       <TableCell>
//                         {customer.phone}
//                       </TableCell>

//                       {/* ORDERS */}

//                       <TableCell>
//                         <Chip
//                           label={`${customer.orders.length} ${
//                             customer.orders.length ===
//                             1
//                               ? "Order"
//                               : "Orders"
//                           }`}
//                           size="small"
//                           sx={{
//                             backgroundColor:
//                               "#e8f5ee",
//                             color: "#008f43",
//                             fontWeight: 700,
//                           }}
//                         />
//                       </TableCell>

//                       {/* TOTAL */}

//                       <TableCell>
//                         <Typography fontWeight={700}>
//                           ₹
//                           {customer.total_amount.toFixed(
//                             2
//                           )}
//                         </Typography>
//                       </TableCell>

//                       {/* DATE */}

//                       <TableCell>
//                         {customer.latest_order
//                           ? new Date(
//                               customer.latest_order
//                             ).toLocaleDateString(
//                               "en-IN",
//                               {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               }
//                             )
//                           : "-"}
//                       </TableCell>

//                       {/* VIEW */}

//                       <TableCell align="center">
//                         <Button
//                           variant="contained"
//                           size="small"
//                           startIcon={
//                             <VisibilityIcon />
//                           }
//                           onClick={() =>
//                             handleViewCustomer(
//                               customer
//                             )
//                           }
//                           sx={{
//                             backgroundColor:
//                               "#008f43",
//                             textTransform:
//                               "none",
//                             fontWeight: 600,
//                             borderRadius: 1.5,
//                             px: 2,

//                             "&:hover": {
//                               backgroundColor:
//                                 "#007638",
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

// // =====================================================
// // SUMMARY CARD
// // =====================================================

// function SummaryCard({
//   title,
//   value,
//   color,
// }) {
//   return (
//     <Grid
//       size={{
//         xs: 6,
//         sm: 4,
//         md: 2,
//       }}
//     >
//       <Card
//         sx={{
//           height: "100%",
//           borderRadius: 3,
//           borderLeft: `4px solid ${color}`,
//           boxShadow:
//             "0 2px 8px rgba(0,0,0,0.06)",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="body2"
//             color="text.secondary"
//           >
//             {title}
//           </Typography>

//           <Typography
//             variant="h4"
//             sx={{
//               mt: 1,
//               fontWeight: 800,
//             }}
//           >
//             {value}
//           </Typography>
//         </CardContent>
//       </Card>
//     </Grid>
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
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// =====================================================
// ICONS
// =====================================================

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

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("================================");
      console.log("FETCH ADMIN ORDERS");
      console.log(
        "URL:",
        `${API_BASE_URL}/api/orders/admin`
      );

      const response = await axios.get(
        `${API_BASE_URL}/api/orders/admin`
      );

      console.log("ORDERS RESPONSE:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to fetch orders"
        );
      }

      setOrders(response.data?.data || []);
    } catch (error) {
      console.error(
        "FETCH ORDERS ERROR:",
        error
      );

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
  }, []);

  // =====================================================
  // GROUP ORDERS BY CUSTOMER
  // =====================================================

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
          full_name:
            order.full_name || "Customer",
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
        grouped[key].latest_order =
          order.created_at;
      }
    });

    return Object.values(grouped).sort(
      (a, b) =>
        new Date(b.latest_order) -
        new Date(a.latest_order)
    );
  }, [orders]);

  // =====================================================
  // STATUS COUNT
  // =====================================================

  const countStatus = (status) => {
    return orders.filter(
      (order) =>
        order.status?.toLowerCase() ===
        status
    ).length;
  };

  // =====================================================
  // VIEW CUSTOMER
  // =====================================================

  const handleViewCustomer = (customer) => {
    console.log("================================");
    console.log("OPEN CUSTOMER ORDERS");
    console.log(
      "CUSTOMER:",
      customer.full_name
    );
    console.log(
      "USER ID:",
      customer.user_id
    );
    console.log(
      "ORDER IDS:",
      customer.orders.map(
        (order) => order.id
      )
    );

    navigate(
      `/orders/customer/${customer.user_id}`,
      {
        state: {
          customer,
        },
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f4faf6 0%, #f5f7f9 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            sx={{ color: "#008f43" }}
          />

          <Typography
            sx={{
              mt: 2,
              color: "#777",
              fontWeight: 600,
            }}
          >
            Loading orders...
          </Typography>
        </Box>
      </Box>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4faf6 0%, #f5f7f9 100%)",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
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
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, #008f43, #00a854)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 6px 15px rgba(0,143,67,0.22)",
              }}
            >
              <ShoppingCartOutlinedIcon
                sx={{
                  color: "#fff",
                  fontSize: 25,
                }}
              />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#111827",
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
            }}
          >
            View customer orders and order
            history.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          sx={{
            background:
              "linear-gradient(135deg, #008f43, #00a854)",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            px: 2.5,
            py: 1.1,
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

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <Card
          sx={{
            mb: 3,
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            boxShadow: "none",
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              color="error"
              fontWeight={600}
            >
              {error}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 4 }}
      >
        <SummaryCard
          title="Customers"
          value={customers.length}
          color="#6b7280"
          icon={<PeopleIcon />}
          background="#ffffff"
        />

        <SummaryCard
          title="Total Orders"
          value={orders.length}
          color="#008f43"
          icon={
            <ShoppingCartOutlinedIcon />
          }
          background="#ffffff"
        />

        <SummaryCard
          title="Pending"
          value={countStatus("pending")}
          color="#f59e0b"
          icon={<PendingActionsIcon />}
          background="#ffffff"
        />

        <SummaryCard
          title="Confirmed"
          value={countStatus("confirmed")}
          color="#2563eb"
          icon={<CheckCircleIcon />}
          background="#ffffff"
        />

        <SummaryCard
          title="Shipped"
          value={countStatus("shipped")}
          color="#0891b2"
          icon={
            <LocalShippingIcon />
          }
          background="#ffffff"
        />

        <SummaryCard
          title="Delivered"
          value={countStatus("delivered")}
          color="#1c9c57"
          icon={<DoneAllIcon />}
          background="#ffffff"
        />
      </Grid>

      {/* =================================================
          CUSTOMER TABLE
      ================================================= */}

      <Card
        sx={{
          borderRadius: "18px",
          boxShadow:
            "0 5px 22px rgba(0,0,0,0.06)",
          overflow: "hidden",
          border:
            "1px solid rgba(0,0,0,0.04)",
        }}
      >
        {/* TABLE HEADER */}

        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom:
              "1px solid #eeeeee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Customer Orders
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "#8a8f98",
                mt: 0.4,
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
              fontWeight: 700,
              borderRadius: "8px",
            }}
          />
        </Box>

        <CardContent sx={{ p: 0 }}>
          {customers.length === 0 ? (
            <Box
              sx={{
                py: 10,
                textAlign: "center",
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
                }}
              >
                No Orders Found
              </Typography>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                overflowX: "auto",
              }}
            >
              <Table
                sx={{
                  minWidth: 850,
                }}
              >
                {/* =================================================
                    TABLE HEAD
                ================================================= */}

                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        "#f8faf9",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#374151",
                        py: 2,
                      }}
                    >
                      Customer
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#374151",
                      }}
                    >
                      Phone
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#374151",
                      }}
                    >
                      Orders
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#374151",
                      }}
                    >
                      Total Amount
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#374151",
                      }}
                    >
                      Latest Order
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 800,
                        color: "#374151",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>
                  {customers.map(
                    (customer) => (
                      <TableRow
                        key={
                          customer.user_id ||
                          customer.phone
                        }
                        hover
                        sx={{
                          "&:last-child td": {
                            borderBottom: 0,
                          },

                          "&:hover": {
                            backgroundColor:
                              "#fafffc",
                          },
                        }}
                      >
                        {/* CUSTOMER */}

                        <TableCell
                          sx={{
                            py: 2.2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius:
                                  "50%",
                                backgroundColor:
                                  "#e8f7ee",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                color:
                                  "#008f43",
                                fontWeight: 800,
                                fontSize: 15,
                              }}
                            >
                              {customer.full_name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "C"}
                            </Box>

                            <Box>
                              <Typography
                                fontWeight={
                                  700
                                }
                                color="#111827"
                                fontSize={
                                  14
                                }
                              >
                                {
                                  customer.full_name
                                }
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color:
                                    "#9ca3af",
                                  mt: 0.3,
                                }}
                              >
                                User #
                                {
                                  customer.user_id
                                }
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* PHONE */}

                        <TableCell
                          sx={{
                            color: "#4b5563",
                            fontSize: 14,
                          }}
                        >
                          {customer.phone}
                        </TableCell>

                        {/* ORDERS */}

                        <TableCell>
                          <Chip
                            label={`${customer.orders.length} ${
                              customer.orders
                                .length ===
                              1
                                ? "Order"
                                : "Orders"
                            }`}
                            size="small"
                            sx={{
                              backgroundColor:
                                "#e8f7ee",
                              color:
                                "#008f43",
                              fontWeight: 700,
                              borderRadius:
                                "7px",
                            }}
                          />
                        </TableCell>

                        {/* TOTAL */}

                        <TableCell>
                          <Typography
                            fontWeight={800}
                            color="#111827"
                          >
                            ₹
                            {customer.total_amount.toFixed(
                              2
                            )}
                          </Typography>
                        </TableCell>

                        {/* DATE */}

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color:
                                "#4b5563",
                            }}
                          >
                            {customer.latest_order
                              ? new Date(
                                  customer.latest_order
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month:
                                      "short",
                                    year:
                                      "numeric",
                                  }
                                )
                              : "-"}
                          </Typography>
                        </TableCell>

                        {/* VIEW */}

                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={
                              <VisibilityIcon />
                            }
                            onClick={() =>
                              handleViewCustomer(
                                customer
                              )
                            }
                            sx={{
                              backgroundColor:
                                "#008f43",
                              textTransform:
                                "none",
                              fontWeight: 700,
                              borderRadius:
                                "8px",
                              px: 2,
                              boxShadow:
                                "none",

                              "&:hover": {
                                backgroundColor:
                                  "#007638",
                                boxShadow:
                                  "none",
                              },
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
  color,
  icon,
  background,
}) {
  return (
    <Grid
      item
      xs={6}
      sm={4}
      md={2}
    >
      <Card
        sx={{
          height: "100%",
          borderRadius: "15px",
          backgroundColor:
            background || "#fff",
          borderTop: `3px solid ${color}`,
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.05)",
          transition:
            "all 0.2s ease",

          "&:hover": {
            transform:
              "translateY(-2px)",
            boxShadow:
              "0 7px 20px rgba(0,0,0,0.08)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 2.2,
            "&:last-child": {
              pb: 2.2,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "#6b7280",
              }}
            >
              {title}
            </Typography>

            <Box
              sx={{
                width: 35,
                height: 35,
                borderRadius: "10px",
                backgroundColor: `${color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                color: color,

                "& svg": {
                  fontSize: 20,
                },
              }}
            >
              {icon}
            </Box>
          </Box>

          <Typography
            sx={{
              mt: 1.5,
              fontSize: 27,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}