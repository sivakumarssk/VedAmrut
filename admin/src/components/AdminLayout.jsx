// import React from "react";
// import { Box } from "@mui/material";
// import Sidebar from "./Sidebar";
// import Header from "./Header";

// export default function AdminLayout({ children }) {
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100%",
//         overflowX: "hidden",
//         backgroundColor: "#f5f7f8",
//         fontFamily: "Inter",
//         "& *": {
//           fontFamily: "Inter",
//         },
//       }}
//     >
//       {/* SIDEBAR */}
//       <Sidebar />

//       {/* MAIN CONTENT */}
//       <Box
//         sx={{
//           ml: {
//             xs: 0,
//             md: "250px",
//           },
//           minHeight: "100vh",
//           width: {
//             xs: "100%",
//             md: "calc(100% - 250px)",
//           },
//           transition: "all 0.3s ease",
//           fontFamily: "Inter",
//         }}
//       >
//         {/* HEADER */}
//         <Header />

//         {/* PAGE CONTENT */}
//         <Box
//           component="main"
//           sx={{
//             pt: {
//               xs: "72px",
//               md: "80px",
//             },
//             px: {
//               xs: 1.5,
//               sm: 2,
//               md: 3,
//             },
//             pb: 3,
//             minHeight: "100vh",
//             width: "100%",
//             boxSizing: "border-box",
//             fontFamily: "Inter",
//           }}
//         >
//           {children}
//         </Box>
//       </Box>
//     </Box>
//   );
// }
import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        backgroundColor: "#f5f7f8",
        fontFamily: "Inter",
        "& *": {
          fontFamily: "Inter",
        },
      }}
    >
      {/* SIDEBAR */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          ml: {
            xs: 0,
            md: "250px",
          },
          minHeight: "100vh",
          width: {
            xs: "100%",
            md: "calc(100% - 250px)",
          },
          transition: "all 0.3s ease",
          fontFamily: "Inter",
        }}
      >
        {/* HEADER */}
        <Header
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* PAGE CONTENT */}
        <Box
          component="main"
          sx={{
            pt: {
              xs: "72px",
              md: "80px",
            },
            px: {
              xs: 1.5,
              sm: 2,
              md: 3,
            },
            pb: 3,
            minHeight: "100vh",
            width: "100%",
            boxSizing: "border-box",
            fontFamily: "Inter",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}