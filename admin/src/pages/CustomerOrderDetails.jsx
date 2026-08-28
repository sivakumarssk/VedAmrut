
// import React from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   Typography,
// } from "@mui/material";

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import { useLocation, useNavigate } from "react-router-dom";

// export default function CustomerOrderDetails() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const customer = location.state?.customer;

//   // -----------------------------------------------------
//   // NO CUSTOMER DATA
//   // -----------------------------------------------------

//   if (!customer) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           backgroundColor: "#f5f7f9",
//           p: 4,
//         }}
//       >
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate("/orders")}
//           sx={{
//             color: "#008f43",
//             textTransform: "none",
//             fontWeight: 600,
//             mb: 3,
//           }}
//         >
//           Back to Orders
//         </Button>

//         <Card
//           sx={{
//             maxWidth: 700,
//             mx: "auto",
//             borderRadius: 3,
//           }}
//         >
//           <CardContent
//             sx={{
//               py: 8,
//               textAlign: "center",
//             }}
//           >
//             <ShoppingBagOutlinedIcon
//               sx={{
//                 fontSize: 55,
//                 color: "#aaa",
//               }}
//             />

//             <Typography
//               variant="h5"
//               sx={{
//                 mt: 2,
//                 fontWeight: 700,
//               }}
//             >
//               Customer Orders Not Found
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 1,
//                 color: "#777",
//               }}
//             >
//               Please go back to the orders page and try again.
//             </Typography>
//           </CardContent>
//         </Card>
//       </Box>
//     );
//   }

//   const orders = customer.orders || [];

//   // -----------------------------------------------------
//   // STATUS COLOR
//   // -----------------------------------------------------

//   const getStatusStyle = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return {
//           backgroundColor: "#fff7d6",
//           color: "#d97706",
//         };

//       case "confirmed":
//         return {
//           backgroundColor: "#e0ecff",
//           color: "#2563eb",
//         };

//       case "processing":
//         return {
//           backgroundColor: "#f3e8ff",
//           color: "#7c3aed",
//         };

//       case "shipped":
//         return {
//           backgroundColor: "#e0f7fa",
//           color: "#0891b2",
//         };

//       case "delivered":
//         return {
//           backgroundColor: "#dcfce7",
//           color: "#15803d",
//         };

//       case "cancelled":
//         return {
//           backgroundColor: "#fee2e2",
//           color: "#dc2626",
//         };

//       default:
//         return {
//           backgroundColor: "#f3f4f6",
//           color: "#6b7280",
//         };
//     }
//   };

//   // -----------------------------------------------------
//   // DATE
//   // -----------------------------------------------------

//   const formatDate = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // -----------------------------------------------------
//   // OPEN SINGLE ORDER
//   // -----------------------------------------------------

//   const handleViewOrder = (orderId) => {
//     console.log("================================");
//     console.log("OPEN ORDER DETAILS");
//     console.log("ORDER ID:", orderId);
//     console.log("================================");

//     navigate(`/orders/${orderId}`);
//   };

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

//       <Box sx={{ mb: 3 }}>
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate("/orders")}
//           sx={{
//             color: "#008f43",
//             textTransform: "none",
//             fontWeight: 600,
//             mb: 1,
//             px: 0,
//           }}
//         >
//           Back to Orders
//         </Button>

//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: 800,
//             color: "#111827",
//           }}
//         >
//           Customer Orders
//         </Typography>

//         <Typography
//           sx={{
//             color: "#777",
//             mt: 0.5,
//           }}
//         >
//           View all orders placed by this customer.
//         </Typography>
//       </Box>

//       {/* CUSTOMER CARD */}

//       <Card
//         sx={{
//           borderRadius: 3,
//           mb: 3,
//           boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
//         }}
//       >
//         <CardContent sx={{ p: 3 }}>
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: 800,
//               mb: 2,
//             }}
//           >
//             Customer Information
//           </Typography>

//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 5,
//             }}
//           >
//             <Box>
//               <Typography
//                 fontSize={13}
//                 color="text.secondary"
//               >
//                 Customer Name
//               </Typography>

//               <Typography
//                 fontWeight={700}
//                 sx={{ mt: 0.5 }}
//               >
//                 {customer.full_name || "Customer"}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography
//                 fontSize={13}
//                 color="text.secondary"
//               >
//                 Phone
//               </Typography>

//               <Typography
//                 fontWeight={700}
//                 sx={{ mt: 0.5 }}
//               >
//                 {customer.phone || "-"}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography
//                 fontSize={13}
//                 color="text.secondary"
//               >
//                 Total Orders
//               </Typography>

//               <Typography
//                 fontWeight={700}
//                 sx={{ mt: 0.5 }}
//               >
//                 {orders.length}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography
//                 fontSize={13}
//                 color="text.secondary"
//               >
//                 Total Amount
//               </Typography>

//               <Typography
//                 fontWeight={700}
//                 sx={{
//                   mt: 0.5,
//                   color: "#008f43",
//                 }}
//               >
//                 ₹{Number(
//                   customer.total_amount || 0
//                 ).toFixed(2)}
//               </Typography>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* ORDERS */}

//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
//         }}
//       >
//         <CardContent sx={{ p: 3 }}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               mb: 3,
//             }}
//           >
//             <ShoppingBagOutlinedIcon
//               sx={{ color: "#008f43" }}
//             />

//             <Typography
//               variant="h6"
//               fontWeight={800}
//             >
//               Order History
//             </Typography>
//           </Box>

//           {orders.length === 0 ? (
//             <Box
//               sx={{
//                 py: 8,
//                 textAlign: "center",
//               }}
//             >
//               <Typography
//                 color="text.secondary"
//               >
//                 No orders found.
//               </Typography>
//             </Box>
//           ) : (
//             <Box>
//               {orders.map((order, index) => {
//                 const statusStyle =
//                   getStatusStyle(order.status);

//                 return (
//                   <Box key={order.id}>
//                     <Box
//                       sx={{
//                         p: 2.5,
//                         borderRadius: 2.5,
//                         border: "1px solid #e5e7eb",
//                         backgroundColor: "#fff",
//                         transition: "0.2s",

//                         "&:hover": {
//                           borderColor: "#008f43",
//                           boxShadow:
//                             "0 4px 12px rgba(0,0,0,0.06)",
//                         },
//                       }}
//                     >
//                       {/* TOP */}

//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: {
//                             xs: "flex-start",
//                             sm: "center",
//                           },
//                           flexDirection: {
//                             xs: "column",
//                             sm: "row",
//                           },
//                           gap: 2,
//                         }}
//                       >
//                         <Box>
//                           <Typography
//                             fontWeight={800}
//                             fontSize={18}
//                           >
//                             Order #{order.id}
//                           </Typography>

//                           <Typography
//                             fontSize={13}
//                             color="text.secondary"
//                             sx={{ mt: 0.5 }}
//                           >
//                             {formatDate(
//                               order.created_at
//                             )}
//                           </Typography>
//                         </Box>

//                         <Chip
//                           label={
//                             order.status || "Unknown"
//                           }
//                           sx={{
//                             textTransform:
//                               "capitalize",
//                             fontWeight: 700,
//                             ...statusStyle,
//                           }}
//                         />
//                       </Box>

//                       <Divider sx={{ my: 2 }} />

//                       {/* ORDER INFO */}

//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: {
//                             xs: 3,
//                             sm: 6,
//                           },
//                         }}
//                       >
//                         <Box>
//                           <Typography
//                             fontSize={13}
//                             color="text.secondary"
//                           >
//                             Order Amount
//                           </Typography>

//                           <Typography
//                             fontWeight={800}
//                             sx={{ mt: 0.5 }}
//                           >
//                             ₹{Number(
//                               order.total_amount || 0
//                             ).toFixed(2)}
//                           </Typography>
//                         </Box>

//                         <Box>
//                           <Typography
//                             fontSize={13}
//                             color="text.secondary"
//                           >
//                             Payment
//                           </Typography>

//                           <Typography
//                             fontWeight={700}
//                             sx={{
//                               mt: 0.5,
//                               textTransform:
//                                 "uppercase",
//                             }}
//                           >
//                             {order.payment_method ||
//                               "COD"}
//                           </Typography>
//                         </Box>

//                         <Box>
//                           <Typography
//                             fontSize={13}
//                             color="text.secondary"
//                           >
//                             Items
//                           </Typography>

//                           <Typography
//                             fontWeight={700}
//                             sx={{ mt: 0.5 }}
//                           >
//                             {order.items?.length ||
//                               order.item_count ||
//                               0}
//                           </Typography>
//                         </Box>
//                       </Box>

//                       {/* VIEW BUTTON */}

//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "flex-end",
//                           mt: 2,
//                         }}
//                       >
//                         <Button
//                           variant="contained"
//                           startIcon={
//                             <VisibilityIcon />
//                           }
//                           onClick={() =>
//                             handleViewOrder(
//                               order.id
//                             )
//                           }
//                           sx={{
//                             backgroundColor:
//                               "#008f43",
//                             textTransform:
//                               "none",
//                             fontWeight: 700,
//                             borderRadius: 2,
//                             px: 2.5,

//                             "&:hover": {
//                               backgroundColor:
//                                 "#007638",
//                             },
//                           }}
//                         >
//                           View Order Details
//                         </Button>
//                       </Box>
//                     </Box>

//                     {index < orders.length - 1 && (
//                       <Divider sx={{ my: 2 }} />
//                     )}
//                   </Box>
//                 );
//               })}
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useLocation, useNavigate } from "react-router-dom";

export default function CustomerOrderDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const customer = location.state?.customer;

  // =====================================================
  // NO CUSTOMER DATA
  // =====================================================

  if (!customer) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f7f9",
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/orders")}
          sx={{
            color: "#008f43",
            textTransform: "none",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Back to Orders
        </Button>

        <Card
          sx={{
            maxWidth: 550,
            mx: "auto",
            borderRadius: 3,
            boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent
            sx={{
              py: 6,
              textAlign: "center",
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: 50,
                color: "#b0b8b4",
              }}
            />

            <Typography
              variant="h6"
              sx={{
                mt: 1.5,
                fontWeight: 800,
              }}
            >
              Customer Orders Not Found
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#777",
                fontSize: 14,
              }}
            >
              Please go back to the orders page and try again.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const orders = customer.orders || [];

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          backgroundColor: "#fff7e6",
          color: "#d97706",
        };

      case "confirmed":
        return {
          backgroundColor: "#eaf2ff",
          color: "#2563eb",
        };

      case "processing":
        return {
          backgroundColor: "#f3edff",
          color: "#7c3aed",
        };

      case "shipped":
        return {
          backgroundColor: "#e8f8fb",
          color: "#0891b2",
        };

      case "delivered":
        return {
          backgroundColor: "#e9f8ef",
          color: "#15803d",
        };

      case "cancelled":
        return {
          backgroundColor: "#fff0f0",
          color: "#dc2626",
        };

      default:
        return {
          backgroundColor: "#f1f3f5",
          color: "#6b7280",
        };
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // VIEW ORDER
  // =====================================================

  // const handleViewOrder = (orderId) => {
  //   navigate(`/orders/${orderId}`),{   
  //   }
  // };
const handleViewOrder = (orderId) => {
  navigate(`/orders/${orderId}`, {
    state: {
      customer,
    },
  });
};
  // =====================================================
  // MAIN
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7f9",
        p: {
          xs: 2,
          sm: 3,
          md: 3.5,
        },
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Box sx={{ mb: 2.5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/orders")}
          sx={{
            color: "#008f43",
            textTransform: "none",
            fontWeight: 700,
            px: 0,
            mb: 0.8,
            "&:hover": {
              backgroundColor: "transparent",
              color: "#006f34",
            },
          }}
        >
          Back to Orders
        </Button>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#17211b",
            fontSize: {
              xs: 26,
              sm: 30,
            },
          }}
        >
          Customer Orders
        </Typography>

        <Typography
          sx={{
            color: "#7b847f",
            mt: 0.3,
            fontSize: 14,
          }}
        >
          View all orders placed by this customer.
        </Typography>
      </Box>

      {/* =================================================
          SMALL CUSTOMER CARD
      ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 2.5,
          border: "1px solid #e6ebe8",
          boxShadow: "0 3px 12px rgba(0,0,0,0.04)",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            "&:last-child": {
              pb: {
                xs: 2,
                sm: 2.5,
              },
            },
          }}
        >
          {/* CARD TITLE */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e9f7ef",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#008f43",
                  fontSize: 16,
                }}
              >
                {customer.full_name
                  ?.charAt(0)
                  ?.toUpperCase() || "C"}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#17211b",
                }}
              >
                Customer Information
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#89918d",
                }}
              >
                Customer details
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* CUSTOMER DETAILS */}

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8a938e",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Customer
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#202923",
                }}
              >
                {customer.full_name || "Customer"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8a938e",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Phone
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#202923",
                }}
              >
                {customer.phone || "-"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8a938e",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Orders
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#202923",
                }}
              >
                {orders.length}
              </Typography>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8a938e",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Total Amount
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#008f43",
                }}
              >
                ₹
                {Number(
                  customer.total_amount || 0
                ).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* =================================================
          ORDER HISTORY HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              backgroundColor: "#e9f7ef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{
                color: "#008f43",
                fontSize: 19,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 18,
                color: "#17211b",
              }}
            >
              Order History
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#89918d",
              }}
            >
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}{" "}
              placed
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* =================================================
          SEPARATE SMALL ORDER CARDS
      ================================================= */}

      {orders.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #e6ebe8",
            boxShadow: "none",
          }}
        >
          <CardContent
            sx={{
              py: 7,
              textAlign: "center",
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: 45,
                color: "#b7bfbb",
              }}
            />

            <Typography
              sx={{
                mt: 1,
                fontWeight: 700,
                color: "#555",
              }}
            >
              No orders found
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => {
            const statusStyle =
              getStatusStyle(order.status);

            return (
              <Grid
                key={order.id}
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 4,
                  xl: 3,
                }}
              >
                {/* ======================================
                    INDIVIDUAL ORDER CARD
                ====================================== */}

                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 2.5,
                    border:
                      "1px solid #e3e9e5",
                    backgroundColor: "#ffffff",
                    boxShadow:
                      "0 3px 12px rgba(0,0,0,0.04)",
                    transition:
                      "all 0.2s ease",

                    "&:hover": {
                      transform:
                        "translateY(-3px)",
                      borderColor:
                        "#b9dfca",
                      boxShadow:
                        "0 8px 22px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      "&:last-child": {
                        pb: 2,
                      },
                    }}
                  >
                    {/* ORDER TOP */}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "flex-start",
                        justifyContent:
                          "space-between",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#17211b",
                          }}
                        >
                          Order #{order.id}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#89918d",
                            mt: 0.3,
                          }}
                        >
                          {formatDate(
                            order.created_at
                          )}
                        </Typography>
                      </Box>

                      <Chip
                        label={
                          order.status ||
                          "Unknown"
                        }
                        size="small"
                        sx={{
                          height: 25,
                          fontSize: 11,
                          textTransform:
                            "capitalize",
                          fontWeight: 700,
                          ...statusStyle,
                        }}
                      />
                    </Box>

                    <Divider
                      sx={{
                        my: 1.5,
                      }}
                    />

                    {/* ORDER DETAILS */}

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "1fr 1fr",
                        gap: 1.5,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            color: "#909893",
                            textTransform:
                              "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          Amount
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 800,
                            mt: 0.3,
                            color: "#17211b",
                          }}
                        >
                          ₹
                          {Number(
                            order.total_amount ||
                              0
                          ).toFixed(2)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            color: "#909893",
                            textTransform:
                              "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          Payment
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            mt: 0.3,
                            color: "#17211b",
                            textTransform:
                              "uppercase",
                          }}
                        >
                          {order.payment_method ||
                            "COD"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            color: "#909893",
                            textTransform:
                              "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          Items
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            mt: 0.3,
                          }}
                        >
                          {order.items
                            ?.length ||
                            order.item_count ||
                            0}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            color: "#909893",
                            textTransform:
                              "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          Order ID
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            mt: 0.3,
                            color:
                              "#008f43",
                          }}
                        >
                          #{order.id}
                        </Typography>
                      </Box>
                    </Box>

                    {/* VIEW BUTTON */}

                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={
                        <VisibilityIcon
                          sx={{
                            fontSize:
                              "17px !important",
                          }}
                        />
                      }
                      onClick={() =>
                        handleViewOrder(
                          order.id
                        )
                      }
                      sx={{
                        mt: 1.8,
                        height: 34,
                        borderRadius: 1.5,
                        borderColor:
                          "#008f43",
                        color: "#008f43",
                        textTransform:
                          "none",
                        fontWeight: 700,
                        fontSize: 12,

                        "&:hover": {
                          backgroundColor:
                            "#008f43",
                          borderColor:
                            "#008f43",
                          color: "#fff",
                        },
                      }}
                    >
                      View Order Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}