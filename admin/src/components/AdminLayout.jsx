import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7f8",}}>
      <Sidebar />

      <Box sx={{ml: {  xs: 0, md: "250px",},minHeight: "100vh",}}>
        <Header />

        <Box component="main" sx={{ pt: { xs: "72px",  md: "80px",},minHeight: "100vh",}}>
          {children}
          
        </Box>
      </Box>
    </Box>
  );
}