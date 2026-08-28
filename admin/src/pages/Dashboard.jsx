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

      // ORDERS
      const orderResponse = await axios.get(
        `${API_BASE_URL}/api/orders/admin`,
        config
      );

      // USERS
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
      (order) =>
        order.status?.toLowerCase() === status
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
          response.data?.message ||
            "Failed to update order status"
        );
      }

      // Update order immediately on dashboard
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
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

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
    const currentStatus =
      status?.toLowerCase();

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
          borderRadius: "16px",
          background: background,
          minHeight: 145,
          boxShadow:
            "0 5px 18px rgba(0,0,0,0.07)",
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#374151",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: 32,
                fontWeight: 800,
                mt: 1,
                color: "#111827",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 200,
              height: 54,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "rgba(255,255,255,0.65)",
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
        p: 4,
        backgroundColor: "#f5f7f8",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 32,
              fontWeight: 800,
              color: "#00843d",
            }}
          >
            Vedhamruth Admin Dashboard
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#6b7280",
              fontSize: 15,
            }}
          >
            Welcome back, Admin 👋
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={fetchDashboard}
          sx={{
            textTransform: "none",
            borderColor: "#00843d",
            color: "#00843d",
            borderRadius: "9px",

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

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="Total Users"
            value={users.length}
            background="#e8f0ff"
            icon={
              <PeopleIcon
                sx={{
                  fontSize: 34,
                  color: "#2563eb",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="Total Orders"
            value={orders.length}
            background="#f3e8ff"
            icon={
              <ShoppingCartIcon
                sx={{
                  fontSize: 34,
                  color: "#7c3aed",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={countStatus("pending")}
            background="#fff7d6"
            icon={
              <PendingActionsIcon
                sx={{
                  fontSize: 34,
                  color: "#d97706",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Confirmed"
            value={countStatus("confirmed")}
            background="#e0ecff"
            icon={
              <CheckCircleIcon
                sx={{
                  fontSize: 34,
                  color: "#2563eb",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Processing"
            value={countStatus("processing")}
            background="#f3e8ff"
            icon={
              <InventoryIcon
                sx={{
                  fontSize: 34,
                  color: "#7c3aed",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Shipped"
            value={countStatus("shipped")}
            background="#e0f7fa"
            icon={
              <LocalShippingIcon
                sx={{
                  fontSize: 34,
                  color: "#0891b2",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="Delivered"
            value={countStatus("delivered")}
            background="#dcfce7"
            icon={
              <DoneAllIcon
                sx={{
                  fontSize: 34,
                  color: "#15803d",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="Cancelled"
            value={countStatus("cancelled")}
            background="#fee2e2"
            icon={
              <CancelIcon
                sx={{
                  fontSize: 34,
                  color: "#dc2626",
                }}
              />
            }
          />
        </Grid>
      </Grid>

      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <Box sx={{ mt: 4 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            boxShadow:
              "0 5px 18px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
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
        fontSize: 20,
        fontWeight: 800,
      }}
    >
      Recent Orders
    </Typography>

    <Typography
      sx={{
        color: "#6b7280",
        fontSize: 13,
      }}
    >
      Latest customer orders
    </Typography>
  </Box>

  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      flexWrap: "wrap",
    }}
  >
  </Box>
</Box>

            {/* =================================================
                NO ORDERS
            ================================================= */}

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
                  }}
                >
                No Orders Found
                </Typography>
              </Box>
            ) : (
              /* =================================================
                 ORDER LIST
              ================================================= */

            orders.map((order) => {
                const action =
                  getNextStatusAction(
                    order.status
                  );

                return (
                  <Box
                    key={order.id}
                    sx={{
                      py: 2.2,
                      borderBottom:
                        "1px solid #eeeeee",

                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",

                      gap: 4,

                      flexWrap: {
                        xs: "wrap",
                        md: "nowrap",
                      },
                    }}
                  >
                    {/* CUSTOMER */}

                    <Box
                      sx={{
                        minWidth: 190,
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        fontSize={14}
                      >
                        #{order.id}{" "}
                        {order.full_name ||
                          "Customer"}
                      </Typography>

                      <Typography
                        fontSize={12}
                        color="text.secondary"
                      >
                        {order.phone ||
                          "No phone"}
                      </Typography>
                    </Box>

                    {/* AMOUNT */}

                    <Typography
                      fontWeight={700}
                      sx={{
                        minWidth: 100,
                      }}
                    >
                      ₹
                      {Number(
                        order.total_amount || 0
                      ).toFixed(2)}
                    </Typography>

                    {/* CURRENT STATUS */}

                    <Chip
                      label={
                        order.status ||
                        "Unknown"
                      }
                      size="small"
                      sx={{
                        minWidth: 100,
                        textTransform:
                          "capitalize",
                        fontWeight: 700,
                        color: "#fff",
                        backgroundColor:
                          getStatusColor(
                            order.status
                          ),
                      }}
                    />

                    {/* =================================================
                        NEXT ACTION
                    ================================================= */}

                    <Box
                      sx={{
                        minWidth: 110,
                        display: "flex",
                        justifyContent:
                          "flex-end",
                      }}
                    >
                      {action ? (
                        <Button
                          variant="contained"
                          disabled={
                            updatingOrder ===
                            order.id
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              action.nextStatus
                            )
                          }
                          sx={{
                            backgroundColor:
                              action.color,
                            textTransform:
                              "none",
                            fontWeight: 700,
                            borderRadius:
                              "8px",
                            minWidth: 100,

                            "&:hover": {
                              backgroundColor:
                                action.color,
                              filter:
                                "brightness(0.9)",
                            },
                          }}
                        >
                          {updatingOrder ===
                          order.id
                            ? "Updating..."
                            : action.label}
                        </Button>
                      ) : (
                        <Chip
                          label={
                            order.status?.toLowerCase() ===
                            "delivered"
                              ? "Completed"
                              : "No Action"
                          }
                          size="small"
                          sx={{
                            fontWeight: 700,
                            color:
                              order.status?.toLowerCase() ===
                              "delivered"
                                ? "#15803d"
                                : "#6b7280",
                            backgroundColor:
                              order.status?.toLowerCase() ===
                              "delivered"
                                ? "#dcfce7"
                                : "#f3f4f6",
                          }}
                        />
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
