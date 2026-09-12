

import React, { useEffect, useRef, useState } from "react";

import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { API_BASE_URL } from "../api";

// export default function Header() {
export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const previousOrderCount = useRef(null);
  const previousUserCount = useRef(null);
  

  // =====================================================
  // GLOBAL SEARCH
  // =====================================================

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    try {
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

      const orders = orderResponse.data?.data || [];

      let users = [];

      try {
        const userResponse = await axios.get(
          `${API_BASE_URL}/api/users`,
          config
        );

        users = userResponse.data?.data || [];
      } catch (userError) {
        console.log("USER NOTIFICATION API ERROR:", userError);
      }

      const orderCount = orders.length;
      const userCount = users.length;

      if (previousOrderCount.current === null) {
        previousOrderCount.current = orderCount;
      }

      if (previousUserCount.current === null) {
        previousUserCount.current = userCount;
      }

      if (orderCount > previousOrderCount.current) {
        const newOrders = orderCount - previousOrderCount.current;

        setNotifications((previous) => [
          ...previous,
          {
            id: Date.now() + Math.random(),
            type: "order",
            title: "New Order",
            message: `${newOrders} new order${
              newOrders > 1 ? "s" : ""
            } placed`,
          },
        ]);
      }

      if (userCount > previousUserCount.current) {
        const newUsers = userCount - previousUserCount.current;

        setNotifications((previous) => [
          ...previous,
          {
            id: Date.now() + Math.random(),
            type: "user",
            title: "New User",
            message: `${newUsers} new user${
              newUsers > 1 ? "s" : ""
            } registered`,
          },
        ]);
      }

      previousOrderCount.current = orderCount;
      previousUserCount.current = userCount;
    } catch (error) {
      console.error("NOTIFICATION ERROR:", error);
    }
  };

  // =====================================================
  // NOTIFICATION INTERVAL
  // =====================================================

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // GLOBAL SEARCH
  // =====================================================

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchLoading(false);
      return;
    }

    setShowSearchResults(true);
    setSearchLoading(true);

    const searchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        let users = [];
        let products = [];
        let orders = [];

        try {
          const userResponse = await axios.get(
            `${API_BASE_URL}/api/users`,
            config
          );

          users = userResponse.data?.data || [];
        } catch (error) {
          console.error("SEARCH USERS ERROR:", error);
        }

        try {
          const productResponse = await axios.get(
            `${API_BASE_URL}/api/products`,
            config
          );

          products = productResponse.data?.data || [];
        } catch (error) {
          console.error("SEARCH PRODUCTS ERROR:", error);
        }

        try {
          const orderResponse = await axios.get(
            `${API_BASE_URL}/api/orders/admin`,
            config
          );

          orders = orderResponse.data?.data || [];
        } catch (error) {
          console.error("SEARCH ORDERS ERROR:", error);
        }

        const userResults = users
          .filter((user) => {
            const searchableText = [
              user.id,
              user.user_id,
              user.name,
              user.full_name,
              user.username,
              user.email,
              user.phone,
              user.mobile,
            ]
              .map((value) => String(value ?? "").toLowerCase())
              .join(" ");

            return searchableText.includes(query);
          })
          .slice(0, 5)
          .map((user) => ({
            type: "user",
            id: user.id || user.user_id,
            title:
              user.full_name ||
              user.name ||
              user.username ||
              "User",
            subtitle:
              user.phone ||
              user.mobile ||
              user.email ||
              "User",
            original: user,
          }));

        const productResults = products
          .filter((product) => {
            const searchableText = [
              product.id,
              product.product_id,
              product.name,
              product.product_name,
              product.title,
              product.category,
              product.category_name,
            ]
              .map((value) => String(value ?? "").toLowerCase())
              .join(" ");

            return searchableText.includes(query);
          })
          .slice(0, 5)
          .map((product) => ({
            type: "product",
            id: product.id || product.product_id,
            title:
              product.name ||
              product.product_name ||
              product.title ||
              "Product",
            subtitle:
              product.category_name ||
              product.category ||
              `Product #${
                product.id || product.product_id || ""
              }`,
            original: product,
          }));

        const orderResults = orders
          .filter((order) => {
            const searchableText = [
              order.id,
              order.order_id,
              order.user_id,
              order.full_name,
              order.name,
              order.phone,
              order.mobile,
              order.email,
              order.status,
              order.payment_method,
              order.total_amount,
            ]
              .map((value) => String(value ?? "").toLowerCase())
              .join(" ");

            return searchableText.includes(query);
          })
          .slice(0, 5)
          .map((order) => ({
            type: "order",
            id: order.id || order.order_id,
            title: `Order #${
              order.id || order.order_id || ""
            }`,
            subtitle:
              order.full_name ||
              order.name ||
              order.phone ||
              order.status ||
              "Order",
            original: order,
          }));

        setSearchResults([
          ...userResults,
          ...productResults,
          ...orderResults,
        ]);
      } catch (error) {
        console.error("GLOBAL SEARCH ERROR:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timer = setTimeout(searchData, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // =====================================================
  // SEARCH RESULT CLICK
  // =====================================================

  const handleSearchResultClick = (result) => {
    clearSearch();

    if (result.type === "user") {
      navigate("/users");
      return;
    }

    if (result.type === "product") {
      navigate("/products");
      return;
    }

    if (result.type === "order") {
      navigate("/orders");
      return;
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const openNotifications = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeNotifications = () => {
    setAnchorEl(null);
  };

  const clearNotifications = () => {
    setNotifications([]);
    closeNotifications();
  };

  // =====================================================
  // RESULT ICON
  // =====================================================

  const getSearchIcon = (type) => {
    if (type === "user") {
      return (
        <PeopleIcon
          sx={{
            color: "#2563eb",
            fontSize: 20,
          }}
        />
      );
    }

    if (type === "product") {
      return (
        <Inventory2Icon
          sx={{
            color: "#7c3aed",
            fontSize: 20,
          }}
        />
      );
    }

    return (
      <ShoppingCartIcon
        sx={{
          color: "#00843d",
          fontSize: 20,
        }}
      />
    );
  };

  const getSearchTypeLabel = (type) => {
    if (type === "user") return "User";
    if (type === "product") return "Product";
    return "Order";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
   <AppBar
  position="fixed"
  elevation={0}
  sx={{
    left: {
      xs: 0,
      md: "250px",
    },
    width: {
      xs: "100%",
      md: "calc(100% - 250px)",
    },
    backgroundColor: "#ffffff",
    color: "#111827",
    borderBottom: "1px solid #e5e7eb",
    zIndex: 1100,
    fontFamily: "Inter",

    "& *": {
      fontFamily: "Inter",
    },
  }}
>
 <Toolbar
  sx={{
    minHeight: {
      xs: "64px !important",
      sm: "80px !important",
    },
    px: {
      xs: 1,
      sm: 1.5,
      md: 2,
    },
    gap: {
      xs: 0.5,
      sm: 0.75,
      md: 1.5,
    },
    fontFamily: "Inter",
  }}
>
        {/* LOGO */}

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },
            alignItems: "center",
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "11px",
              background:
                "linear-gradient(135deg, #00843d, #00a94f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 20,
                fontFamily: "Inter",
              }}
            >
              V
            </Typography>
          </Box>

          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: "#00843d",
                lineHeight: 1.1,
                fontFamily: "Inter",
              }}
            >
              Vedhamruth
            </Typography>

            <Typography
              sx={{
                fontSize: 11,
                color: "#9ca3af",
                fontFamily: "Inter",
              }}
            >
              Admin Panel
            </Typography>
          </Box>
        </Box>
        {/* SIDEBAR MENU */}

<IconButton
  onClick={onMenuClick}
  sx={{
    display: {
      xs: "flex",
      md: "none",
    },
    color: "#111827",
    flexShrink: 0,
    p: 1,
    mr: {
      xs: 1,
      sm: 1.5,
    },
  }}
>
  <MenuIcon
    sx={{
      fontSize: {
        xs: 24,
        sm: 26,
      },
    }}
  />
</IconButton>

        {/* GLOBAL SEARCH */}

        <Box
          sx={{
            position: "relative",
            flex: 1,
            maxWidth: {
              xs: "100%",
              sm: 280,
              md: 360,
            },
            minWidth: 0,
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={searchQuery}
            placeholder={
              isMobile
                ? "Search..."
                : "Search users, products, orders..."
            }
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            onFocus={() => {
              if (searchQuery.trim()) {
                setShowSearchResults(true);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#9ca3af",
                      fontSize: {
                        xs: 20,
                        sm: 22,
                      },
                    }}
                  />
                </InputAdornment>
              ),

              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  {searchLoading ? (
                    <CircularProgress size={18} />
                  ) : (
                    <IconButton
                      size="small"
                      onClick={clearSearch}
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                </InputAdornment>
              ) : null,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: {
                  xs: 40,
                  sm: 44,
                },
                borderRadius: "10px",
                backgroundColor: "#fff",

                "& fieldset": {
                  borderColor: "#d1d5db",
                },

                "&:hover fieldset": {
                  borderColor: "#00843d",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#00843d",
                },
              },

              "& input": {
                fontSize: {
                  xs: 12,
                  sm: 13,
                },
                fontFamily: "Inter",
              },
            }}
          />

          {/* SEARCH RESULTS */}

          {showSearchResults && searchQuery.trim() && (
            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                top: 50,
                left: {
                  xs: -8,
                  sm: 0,
                },
                right: {
                  xs: -8,
                  sm: 0,
                },
                zIndex: 2000,
                borderRadius: "12px",
                overflow: "hidden",
                maxHeight: {
                  xs: 350,
                  sm: 420,
                },
                overflowY: "auto",
              }}
            >
              {searchLoading ? (
                <Box
                  sx={{
                    py: 3,
                    textAlign: "center",
                  }}
                >
                  <CircularProgress
                    size={25}
                    sx={{ color: "#00843d" }}
                  />

                 <Typography
  sx={{
    mt: 1,
    fontSize: 13,
    fontWeight: 400,
    color: "#6b7280",
    fontFamily: "Inter",
  }}
>
  Searching...
</Typography>
                </Box>
              ) : searchResults.length === 0 ? (
                <Box
                  sx={{
                    py: 3,
                    px: 2,
                    textAlign: "center",
                  }}
                >
                  <SearchIcon
                    sx={{
                      fontSize: 35,
                      color: "#d1d5db",
                    }}
                  />

                 <Typography
  sx={{
    mt: 1,
    fontSize: 13,
    fontWeight: 400,
    color: "#6b7280",
    fontFamily: "Inter",
  }}
>
  No users, products or orders found
</Typography>
                </Box>
              ) : (
                <Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: "#f9fafb",
                      borderBottom: "1px solid #eeeeee",
                    }}
                  >
                    <Typography
  sx={{
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    fontFamily: "Inter",
  }}
>
  SEARCH RESULTS
</Typography>
                  </Box>

                  {searchResults.map((result) => (
                    <Box
                      key={`${result.type}-${result.id}`}
                      onClick={() =>
                        handleSearchResultClick(result)
                      }
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f1f1",
                        "&:hover": {
                          backgroundColor: "#f5faf7",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: "10px",
                          backgroundColor:
                            result.type === "user"
                              ? "#eff6ff"
                              : result.type === "product"
                              ? "#f3e8ff"
                              : "#e8f7ee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {getSearchIcon(result.type)}
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                      <Typography
  sx={{
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Inter",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }}
>
  {result.title}
</Typography>

                       <Typography
  sx={{
    fontSize: 12,
    fontWeight: 400,
    color: "#6b7280",
    fontFamily: "Inter",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }}
>
  {result.subtitle}
</Typography>
                      </Box>

                      <Typography
                        sx={{
                          display: {
                            xs: "none",
                            sm: "block",
                          },
                          fontSize: 11,
                          fontWeight: 700,
                          color:
                            result.type === "user"
                              ? "#2563eb"
                              : result.type === "product"
                              ? "#7c3aed"
                              : "#00843d",
                        }}
                      >
                        {getSearchTypeLabel(result.type)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          )}
        </Box>

        {/* NOTIFICATIONS */}

        <IconButton
          onClick={openNotifications}
          sx={{
            color: "#4b5563",
            flexShrink: 0,
            p: {
              xs: 0.7,
              sm: 1,
            },
          }}
        >
          <Badge
            badgeContent={notifications.length}
            color="error"
          >
            <NotificationsNoneIcon
              sx={{
                fontSize: {
                  xs: 21,
                  sm: 24,
                },
              }}
            />
          </Badge>
        </IconButton>

        {/* NOTIFICATION MENU */}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeNotifications}
          PaperProps={{
            sx: {
              width: {
                xs: "calc(100vw - 24px)",
                sm: 340,
              },
              maxWidth: "340px",
              mt: 1,
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              fontFamily: "Inter",
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight={700}>
              Notifications
            </Typography>

            {notifications.length > 0 && (
              <Button
                size="small"
                onClick={clearNotifications}
                sx={{
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 600,
                }}
              >
                Clear
              </Button>
            )}
          </Box>

          <Divider />

          {notifications.length === 0 ? (
            <Box
              sx={{
                px: 2,
                py: 4,
                textAlign: "center",
              }}
            >
              <NotificationsNoneIcon
                sx={{
                  fontSize: 35,
                  color: "#d1d5db",
                }}
              />

              <Typography
                sx={{
                  color: "#9ca3af",
                  mt: 1,
                  fontSize: 14,
                }}
              >
                No new notifications
              </Typography>
            </Box>
          ) : (
            notifications
              .slice()
              .reverse()
              .map((notification) => (
                <MenuItem
                  key={notification.id}
                  sx={{
                    py: 1.5,
                    whiteSpace: "normal",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor:
                          notification.type === "order"
                            ? "#e8f7ee"
                            : "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {notification.type === "order" ? (
                        <ShoppingCartIcon
                          sx={{
                            fontSize: 19,
                            color: "#00843d",
                          }}
                        />
                      ) : (
                        <PersonAddIcon
                          sx={{
                            fontSize: 19,
                            color: "#2563eb",
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        fontSize={14}
                        fontWeight={700}
                      >
                        {notification.title}
                      </Typography>

                      <Typography
                        fontSize={12}
                        color="text.secondary"
                      >
                        {notification.message}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))
          )}
        </Menu>

        {/* LOGOUT */}

        <Button
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            backgroundColor: "#dc2626",
            textTransform: "none",
            borderRadius: "9px",
            minWidth: {
              xs: 42,
              sm: 110,
            },
            px: {
              xs: 1,
              sm: 2,
            },
            py: {
              xs: 0.8,
              sm: 1,
            },
            fontWeight: 600,
            flexShrink: 0,
            fontFamily: "Inter",

            "& .MuiButton-startIcon": {
              margin: {
                xs: 0,
                sm: "0 8px 0 -4px",
              },
            },

            "&:hover": {
              backgroundColor: "#b91c1c",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: {
                xs: "none",
                sm: "inline",
              },
            }}
          >
            Logout
          </Box>
        </Button>
      </Toolbar>
    </AppBar>
  );
}