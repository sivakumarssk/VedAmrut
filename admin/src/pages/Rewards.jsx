// import { useEffect, useState } from "react";
// import {
//   Alert,
//   Box,
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

// import api from "../api";

// export default function Rewards() {
//   const [rewards, setRewards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchRewards();
//   }, []);

//   const fetchRewards = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await api.get(
//         "/api/product-qr/rewards-summary"
//       );

//       setRewards(response.data.data || []);
//     } catch (err) {
//       console.error("Rewards API Error:", err);

//       setError(
//         err.response?.data?.message ||
//           "Failed to load rewards summary"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatAmount = (amount) => {
//     return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography
//         variant="h4"
//         sx={{ fontWeight: 700, mb: 3 }}
//       >
//         Rewards Summary
//       </Typography>

//       {loading && (
//         <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {!loading && !error && (
//         <TableContainer
//           component={Paper}
//           sx={{
//             borderRadius: 2,
//             boxShadow: 2,
//             overflowX: "auto",
//           }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "#f3e8ff" }}>
//                 <TableCell sx={{ fontWeight: 700 }}>
//                   Product Name
//                 </TableCell>

//                 <TableCell align="center" sx={{ fontWeight: 700 }}>
//                   Total QR Codes
//                 </TableCell>

//                 <TableCell align="center" sx={{ fontWeight: 700 }}>
//                   Claimed
//                 </TableCell>

//                 <TableCell align="center" sx={{ fontWeight: 700 }}>
//                   Unclaimed
//                 </TableCell>

//                 <TableCell align="right" sx={{ fontWeight: 700 }}>
//                   Claimed Amount
//                 </TableCell>

//                 <TableCell align="right" sx={{ fontWeight: 700 }}>
//                   Unclaimed Amount
//                 </TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {rewards.length > 0 ? (
//                 rewards.map((item) => (
//                   <TableRow
//                     key={item.product_id}
//                     hover
//                   >
//                     <TableCell>
//                       {item.product_name}
//                     </TableCell>

//                     <TableCell align="center">
//                       {item.total_qr_codes}
//                     </TableCell>

//                     <TableCell align="center">
//                       {item.claimed}
//                     </TableCell>

//                     <TableCell align="center">
//                       {item.unclaimed}
//                     </TableCell>

//                     <TableCell align="right">
//                       {formatAmount(item.claimed_amount)}
//                     </TableCell>

//                     <TableCell align="right">
//                       {formatAmount(item.unclaimed_amount)}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center">
//                     No rewards data found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
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

import api from "../api";

export default function Rewards() {
  const navigate = useNavigate();

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH REWARDS SUMMARY
  // ========================================

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/product-qr/rewards-summary"
      );

      setRewards(response.data.data || []);
    } catch (err) {
      console.error("Rewards API Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load rewards summary"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FORMAT AMOUNT
  // ========================================

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ========================================
  // MAIN PAGE
  // ========================================

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        fontFamily: "Inter",
      }}
    >
      {/* PAGE TITLE */}

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: "#1f2937",
        }}
      >
        Rewards Summary
      </Typography>

      {/* ERROR */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* REWARDS TABLE */}

      {!error && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 2,
            overflowX: "auto",
          }}
        >
          <Table>
            {/* TABLE HEADER */}

            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#e8f7ee",
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  Product Name
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ fontWeight: 700 }}
                >
                  Total QR Codes
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ fontWeight: 700 }}
                >
                  Claimed
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ fontWeight: 700 }}
                >
                  Unclaimed
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ fontWeight: 700 }}
                >
                  Claimed Amount
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ fontWeight: 700 }}
                >
                  Unclaimed Amount
                </TableCell>
              </TableRow>
            </TableHead>

            {/* TABLE BODY */}

            <TableBody>
              {rewards.length > 0 ? (
                rewards.map((item) => (
                  <TableRow
                    key={item.product_id}
                    hover
                    onClick={() =>
                      navigate(`/rewards/${item.product_id}`, {
                        state: {
                          productName: item.product_name,
                        },
                      })
                    }
                    sx={{
                      cursor: "pointer",

                      "&:hover": {
                        backgroundColor: "#e8f7ee",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#00843d",
                      }}
                    >
                      {item.product_name}
                    </TableCell>

                    <TableCell align="center">
                      {item.total_qr_codes}
                    </TableCell>

                    <TableCell align="center">
                      {item.claimed}
                    </TableCell>

                    <TableCell align="center">
                      {item.unclaimed}
                    </TableCell>

                    <TableCell align="right">
                      {formatAmount(item.claimed_amount)}
                    </TableCell>

                    <TableCell align="right">
                      {formatAmount(item.unclaimed_amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 5 }}
                  >
                    No rewards data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}