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
          width: "100%",
          overflowX: "hidden",
          backgroundColor: "#f5f7f9",
          boxSizing: "border-box",
          fontFamily: "Inter",
          "& *": {
            fontFamily: "Inter",
          },
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
            fontFamily: "Inter",
            fontWeight: 600,
            mb: 2,
            px: 0,
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
              px: 2,
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
                fontFamily: "Inter",
                fontWeight: 600,
              }}
            >
              Customer Orders Not Found
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#777",
                fontSize: 14,
                fontFamily: "Inter",
                fontWeight: 400,
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

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
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
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
        backgroundColor: "#f5f7f9",
        fontFamily: "Inter",

        "& *": {
          fontFamily: "Inter",
        },

        "& .MuiTypography-root": {
          fontFamily: "Inter",
        },

        "& .MuiButton-root": {
          fontFamily: "Inter",
        },

        "& .MuiChip-label": {
          fontFamily: "Inter",
        },

        p: {
          xs: 2,
          sm: 3,
          md: 3.5,
        },
      }}
    >
      {/* HEADER */}

      <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/orders")}
          sx={{
            color: "#008f43",
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: 600,
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
            fontFamily: "Inter",
            fontWeight: 700,
            color: "#17211b",
            fontSize: {
              xs: 25,
              sm: 30,
              md: 34,
            },
            lineHeight: 1.2,
          }}
        >
          Customer Orders
        </Typography>

        <Typography
          sx={{
            color: "#7b847f",
            mt: 0.5,
            fontSize: 14,
            fontFamily: "Inter",
            fontWeight: 400,
          }}
        >
          View all orders placed by this customer.
        </Typography>
      </Box>

      {/* CUSTOMER INFORMATION CARD */}

      <Card
        sx={{
          borderRadius: 3,
          mb: { xs: 2.5, md: 3 },
          border: "1px solid #e6ebe8",
          boxShadow: "0 3px 12px rgba(0,0,0,0.04)",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            "&:last-child": {
              pb: {
                xs: 2,
                sm: 2.5,
                md: 3,
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
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e9f7ef",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  color: "#008f43",
                  fontSize: 16,
                }}
              >
                {customer.full_name?.charAt(0)?.toUpperCase() || "C"}
              </Typography>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 600,
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
                  fontFamily: "Inter",
                  fontWeight: 400,
                }}
              >
                Customer details
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* CUSTOMER DETAILS */}

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8a938e",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                Customer
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                  fontFamily: "Inter",
                  fontWeight: 600,
                  color: "#202923",
                  overflowWrap: "anywhere",
                }}
              >
                {customer.full_name || "Customer"}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8a938e",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                Phone
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                  fontFamily: "Inter",
                  fontWeight: 600,
                  color: "#202923",
                  overflowWrap: "anywhere",
                }}
              >
                {customer.phone || "-"}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8a938e",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                Orders
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                  fontFamily: "Inter",
                  fontWeight: 600,
                  color: "#202923",
                }}
              >
                {orders.length}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8a938e",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                Total Amount
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 14,
                  fontFamily: "Inter",
                  fontWeight: 600,
                  color: "#008f43",
                  overflowWrap: "anywhere",
                }}
              >
                ₹{Number(customer.total_amount || 0).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ORDER HISTORY HEADER */}

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
              width: 36,
              height: 36,
              borderRadius: 1.5,
              backgroundColor: "#e9f7ef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
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
                fontFamily: "Inter",
                fontWeight: 600,
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
                fontFamily: "Inter",
                fontWeight: 400,
              }}
            >
              {orders.length} {orders.length === 1 ? "order" : "orders"} placed
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ORDER CARDS */}

     {/* ORDER CARDS */}

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
        px: 2,
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
          fontFamily: "Inter",
          fontWeight: 600,
          color: "#555",
        }}
      >
        No orders found
      </Typography>
    </CardContent>
  </Card>
) : (
  <Grid
    container
    spacing={{
      xs: 2,
      sm: 2.5,
      md: 3,
    }}
    alignItems="stretch"
  >
    {orders.map((order) => {
      const statusStyle = getStatusStyle(order.status);

      return (
        <Grid
          item
          key={order.id}
          xs={12}
          sm={6}
          lg={4}
          xl={3}
          sx={{
            display: "flex",
            minWidth: 0,
          }}
        >
          {/* INDIVIDUAL ORDER CARD */}

          <Card
            sx={{
              width: "100%",
              height: "100%",
              minHeight: {
                xs: 300,
                sm: 315,
                md: 330,
              },

              display: "flex",
              flexDirection: "column",

              borderRadius: "16px",
              border: "1px solid #e3e9e5",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",

              "&:hover": {
                transform: "translateY(-3px)",
                borderColor: "#b9dfca",
                boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
              },
            }}
          >
            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",

                p: {
                  xs: 2,
                  sm: 2.2,
                  md: 2.5,
                },

                "&:last-child": {
                  pb: {
                    xs: 2,
                    sm: 2.2,
                    md: 2.5,
                  },
                },
              }}
            >
              {/* ORDER TOP */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
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
                      fontSize: 16,
                      fontFamily: "Inter",
                      fontWeight: 600,
                      color: "#17211b",
                    }}
                  >
                    Order #{order.id}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#89918d",
                      mt: 0.5,
                      fontFamily: "Inter",
                      fontWeight: 400,
                    }}
                  >
                    {formatDate(order.created_at)}
                  </Typography>
                </Box>

                <Chip
                  label={order.status || "Unknown"}
                  size="small"
                  sx={{
                    height: 25,
                    maxWidth: "45%",
                    fontSize: 11,
                    textTransform: "capitalize",
                    fontFamily: "Inter",
                    fontWeight: 600,
                    flexShrink: 0,
                    ...statusStyle,
                  }}
                />
              </Box>

              <Divider sx={{ my: 1.8 }} />

              {/* ORDER DETAILS */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: {
                    xs: 1.8,
                    sm: 2,
                  },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#909893",
                      textTransform: "uppercase",
                      fontFamily: "Inter",
                      fontWeight: 500,
                    }}
                  >
                    Amount
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: 600,
                      mt: 0.4,
                      color: "#17211b",
                      overflowWrap: "anywhere",
                    }}
                  >
                    ₹{Number(order.total_amount || 0).toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#909893",
                      textTransform: "uppercase",
                      fontFamily: "Inter",
                      fontWeight: 500,
                    }}
                  >
                    Payment
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontFamily: "Inter",
                      fontWeight: 600,
                      mt: 0.4,
                      color: "#17211b",
                      textTransform: "uppercase",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {order.payment_method || "COD"}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#909893",
                      textTransform: "uppercase",
                      fontFamily: "Inter",
                      fontWeight: 500,
                    }}
                  >
                    Items
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontFamily: "Inter",
                      fontWeight: 600,
                      mt: 0.4,
                      color: "#17211b",
                    }}
                  >
                    {order.items?.length || order.item_count || 0}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#909893",
                      textTransform: "uppercase",
                      fontFamily: "Inter",
                      fontWeight: 500,
                    }}
                  >
                    Order ID
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontFamily: "Inter",
                      fontWeight: 600,
                      mt: 0.4,
                      color: "#008f43",
                      overflowWrap: "anywhere",
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
                      fontSize: "17px !important",
                    }}
                  />
                }
                onClick={() => handleViewOrder(order.id)}
                sx={{
                  mt: "auto",
                  pt: 1.5,
                  height: 38,
                  borderRadius: "9px",
                  borderColor: "#008f43",
                  color: "#008f43",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: 12,

                  "&:hover": {
                    backgroundColor: "#008f43",
                    borderColor: "#008f43",
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