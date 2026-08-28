import React from "react";
import { NavLink } from "react-router-dom";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <PeopleIcon />,
    },
    {
  name: "Products",
  path: "/products",
  icon: <Inventory2Icon />,
},
    {
      name: "Orders",
      path: "/orders",
      icon: <ShoppingCartIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
      }}
    >
      {/* LOGO */}

      <Box
        sx={{
          height: 80,
          display: "flex",
          alignItems: "center",
          px: 3,
          borderBottom: "1px solid #eeeeee",
        }}
      >
        {/* Text Logo - no image required */}

        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, #00843d, #00a94f)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 1.5,
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontSize: 21,
              fontWeight: 800,
            }}
          >
            V
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 21,
            fontWeight: 800,
            color: "#00843d",
          }}
        >
          Vedhamruth
        </Typography>
      </Box>

      <Divider />

      {/* MENU */}

      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  minHeight: 52,
                  mb: 1,
                  borderRadius: "10px",

                  backgroundColor: isActive
                    ? "#e8f7ee"
                    : "transparent",

                  color: isActive
                    ? "#00843d"
                    : "#4b5563",

                  "&:hover": {
                    backgroundColor: "#e8f7ee",
                    color: "#00843d",
                  },

                  "& .MuiListItemIcon-root": {
                    minWidth: 42,
                    color: isActive
                      ? "#00843d"
                      : "#6b7280",
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>

               <ListItemText
  primary={item.name}
  slotProps={{
    primary: {
      sx: {
        fontSize: 15,
        fontWeight: isActive ? 700 : 500,
      },
    },
  }}
/>
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      {/* BOTTOM */}

      <Box sx={{ mt: "auto", p: 2 }}>
        <Box
          sx={{
            backgroundColor: "#f5faf7",
            borderRadius: "12px",
            p: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            Admin Panel
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: "#00843d",
              mt: 0.5,
            }}
          >
            Vedhamruth
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}