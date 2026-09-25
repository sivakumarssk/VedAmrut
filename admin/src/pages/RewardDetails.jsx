import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
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

import api from "../api";

export default function RewardDetails() {
  const { productId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const productName =
    location.state?.productName || "Product Reward Details";

  const [claimedRewards, setClaimedRewards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH CLAIMED REWARDS
  // ========================================

  useEffect(() => {
    fetchClaimedRewards();
  }, [productId]);

  const fetchClaimedRewards = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/product-qr/claimed-rewards"
      );

      const allRewards = response.data.data || [];

      // Filter rewards for the selected product

      const filteredRewards = allRewards.filter(
        (item) =>
          Number(item.product_id) === Number(productId)
      );

      setClaimedRewards(filteredRewards);
    } catch (err) {
      console.error("Claimed Rewards Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load customer reward details"
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
  // FORMAT DATE
  // ========================================

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
      {/* BACK BUTTON */}

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/rewards")}
        sx={{
          mb: 3,
          color: "#00843d",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Back to Rewards
      </Button>

      {/* PAGE TITLE */}

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: "#1f2937",
        }}
      >
        {productName}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 3,
          color: "#00843d",
        }}
      >
        Customer Reward Claims
      </Typography>

      {/* LOADING */}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* ERROR */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* CUSTOMER CLAIMS TABLE */}

      {!loading && !error && (
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
                  Customer Name
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Email
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  QR Code
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ fontWeight: 700 }}
                >
                  Reward Amount
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Claimed Date
                </TableCell>
              </TableRow>
            </TableHead>

            {/* TABLE BODY */}

            <TableBody>
              {claimedRewards.length > 0 ? (
                claimedRewards.map((item) => (
                  <TableRow
                    key={item.qr_id}
                    hover
                  >
                    <TableCell>
                      {item.customer_name ||
                        "Unknown Customer"}
                    </TableCell>

                    <TableCell>
                      {item.customer_email || "-"}
                    </TableCell>

                    <TableCell>
                      {item.qr_code}
                    </TableCell>

                    <TableCell align="right">
                      {formatAmount(item.reward_amount)}
                    </TableCell>

                    <TableCell>
                      {formatDate(item.claimed_at)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 5 }}
                  >
                    No customers have claimed rewards for this product.
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