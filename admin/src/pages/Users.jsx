
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleIcon from "@mui/icons-material/People";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { API_BASE_URL } from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // View dialog
  const [viewDialogOpen, setViewDialogOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [viewLoading, setViewLoading] =
    useState(false);

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] =
    useState(false);

  const [editLoading, setEditLoading] =
    useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });

  // Delete
  const [deleteLoading, setDeleteLoading] =
    useState(null);

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getConfig = () => {
    const token =
      localStorage.getItem("adminToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =====================================================
  // FETCH ALL USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/users`,
        getConfig()
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to fetch users"
        );
      }

      setUsers(response.data.data || []);

    } catch (error) {
      console.error(
        "FETCH USERS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  
  useEffect(() => {
  fetchUsers();

  const interval = setInterval(() => {
    fetchUsers();
  }, 15000);

  return () => clearInterval(interval);
}, []);

  // =====================================================
  // VIEW USER
  // =====================================================

  const handleViewUser = async (id) => {
    try {
      setViewLoading(true);
      setViewDialogOpen(true);
      setSelectedUser(null);

      const response = await axios.get(
        `${API_BASE_URL}/api/users/${id}`,
        getConfig()
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to fetch user"
        );
      }

      setSelectedUser(
        response.data.data
      );

    } catch (error) {
      console.error(
        "VIEW USER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user"
      );

      setViewDialogOpen(false);

    } finally {
      setViewLoading(false);
    }
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleEditUser = (user) => {
    setSelectedUser(user);

    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      dob: user.dob
        ? String(user.dob).substring(0, 10)
        : "",
    });

    setEditDialogOpen(true);
  };

  // =====================================================
  // EDIT INPUT
  // =====================================================

  const handleEditChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setEditLoading(true);

      const response = await axios.put(
        `${API_BASE_URL}/api/users/${selectedUser.id}`,
        {
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          address: editForm.address,
          dob: editForm.dob || null,
        },
        getConfig()
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to update user"
        );
      }

      // Update user in current list
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...response.data.data,
              }
            : user
        )
      );

      setEditDialogOpen(false);

      setSelectedUser(
        response.data.data
      );

      alert("User updated successfully");

    } catch (error) {
      console.error(
        "UPDATE USER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update user"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(id);

      const response = await axios.delete(
        `${API_BASE_URL}/api/users/${id}`,
        getConfig()
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to delete user"
        );
      }

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== id
        )
      );

      alert("User deleted successfully");

    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete user"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // =====================================================
  // CLOSE VIEW
  // =====================================================

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setSelectedUser(null);
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const handleCloseEdit = () => {
    if (editLoading) return;

    setEditDialogOpen(false);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f7f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress
          sx={{
            color: "#008f43",
          }}
        />

        <Typography color="text.secondary">
          Loading users...
        </Typography>
      </Box>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <>
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
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 28,
                  md: 32,
                },
                fontWeight: 800,
                color: "#008f43",
              }}
            >
              Users
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#777",
                fontSize: 14,
              }}
            >
              Manage Vedhamruth customers.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            sx={{
              backgroundColor: "#008f43",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 2.5,

              "&:hover": {
                backgroundColor: "#007638",
              },
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* =================================================
            ERROR
        ================================================= */}

        {error ? (
          <Card
            sx={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 3,
              boxShadow: "none",
              mb: 3,
            }}
          >
            <CardContent>
              <Typography
                color="error"
                fontWeight={600}
              >
                {error}
              </Typography>

              <Button
                onClick={fetchUsers}
                sx={{
                  mt: 1,
                  color: "#008f43",
                  textTransform: "none",
                }}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {/* =================================================
            USERS CARD
        ================================================= */}

        <Card
          sx={{
            borderRadius: 3,
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* COUNT */}

            <Box
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom:
                  "1px solid #eeeeee",
              }}
            >
              <PeopleIcon
                sx={{
                  color: "#008f43",
                }}
              />

              <Typography
                color="text.secondary"
              >
                Total Users:
              </Typography>

              <Typography
                fontWeight={800}
                sx={{
                  color: "#008f43",
                }}
              >
                {users.length}
              </Typography>
            </Box>

            {/* =================================================
                EMPTY
            ================================================= */}

            {users.length === 0 ? (
              <Box
                sx={{
                  py: 10,
                  textAlign: "center",
                }}
              >
                <PeopleIcon
                  sx={{
                    fontSize: 60,
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
                  No Users Found
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Registered customers
                  will appear here.
                </Typography>
              </Box>
            ) : (
              /* =================================================
                 TABLE
              ================================================= */

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  sx={{
                    minWidth: 900,
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor:
                          "#008f43",
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        ID
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        Name
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        Email
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        Phone
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        Address
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        Joined
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        hover
                        sx={{
                          "&:last-child td": {
                            borderBottom: 0,
                          },
                        }}
                      >
                        {/* ID */}

                        <TableCell>
                          <Typography
                            fontWeight={600}
                            sx={{
                              color: "#555",
                            }}
                          >
                            #{user.id}
                          </Typography>
                        </TableCell>

                        {/* NAME */}

                        <TableCell>
                          <Typography
                            fontWeight={700}
                          >
                            {user.full_name ||
                              user.name ||
                              "User"}
                          </Typography>
                        </TableCell>

                        {/* EMAIL */}

                        <TableCell>
                          {user.email || "-"}
                        </TableCell>

                        {/* PHONE */}

                        <TableCell>
                          {user.phone || "-"}
                        </TableCell>

                        {/* ADDRESS */}

                        <TableCell
                          sx={{
                            maxWidth: 220,
                          }}
                        >
                          <Typography
                            sx={{
                              whiteSpace:
                                "nowrap",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {user.address ||
                              "-"}
                          </Typography>
                        </TableCell>

                        {/* JOINED */}

                        <TableCell>
                          {user.created_at
                            ? new Date(
                                user.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </TableCell>

                        {/* ACTIONS */}

                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent:
                                "center",
                              gap: 0.5,
                            }}
                          >
                            {/* VIEW */}

                            <IconButton
                              onClick={() =>
                                handleViewUser(
                                  user.id
                                )
                              }
                              sx={{
                                color:
                                  "#2563eb",

                                "&:hover": {
                                  backgroundColor:
                                    "#eff6ff",
                                },
                              }}
                              title="View User"
                            >
                              <VisibilityIcon />
                            </IconButton>

                            {/* EDIT */}

                            <IconButton
                              onClick={() =>
                                handleEditUser(
                                  user
                                )
                              }
                              sx={{
                                color:
                                  "#7c3aed",

                                "&:hover": {
                                  backgroundColor:
                                    "#f5f3ff",
                                },
                              }}
                              title="Edit User"
                            >
                              <EditIcon />
                            </IconButton>

                            {/* DELETE */}

                            <IconButton
                              disabled={
                                deleteLoading ===
                                user.id
                              }
                              onClick={() =>
                                handleDeleteUser(
                                  user.id
                                )
                              }
                              sx={{
                                color:
                                  "#dc2626",

                                "&:hover": {
                                  backgroundColor:
                                    "#fef2f2",
                                },
                              }}
                              title="Delete User"
                            >
                              {deleteLoading ===
                              user.id ? (
                                <CircularProgress
                                  size={22}
                                  sx={{
                                    color:
                                      "#dc2626",
                                  }}
                                />
                              ) : (
                                <DeleteIcon />
                              )}
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* =====================================================
          VIEW USER DIALOG
      ===================================================== */}

      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseView}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 800,
            color: "#008f43",
          }}
        >
          User Details

          <IconButton
            onClick={handleCloseView}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {viewLoading ? (
            <Box
              sx={{
                py: 6,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress
                sx={{
                  color: "#008f43",
                }}
              />
            </Box>
          ) : selectedUser ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <UserDetail
                label="User ID"
                value={`#${selectedUser.id}`}
              />

              <UserDetail
                label="Name"
                value={
                  selectedUser.name ||
                  "-"
                }
              />

              <UserDetail
                label="Email"
                value={
                  selectedUser.email ||
                  "-"
                }
              />

              <UserDetail
                label="Phone"
                value={
                  selectedUser.phone ||
                  "-"
                }
              />

              <UserDetail
                label="Address"
                value={
                  selectedUser.address ||
                  "-"
                }
              />

              <UserDetail
                label="Date of Birth"
                value={
                  selectedUser.dob
                    ? new Date(
                        selectedUser.dob
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "-"
                }
              />

              <UserDetail
                label="Role"
                value={
                  selectedUser.role ||
                  "user"
                }
              />

              <UserDetail
                label="Joined"
                value={
                  selectedUser.created_at
                    ? new Date(
                        selectedUser.created_at
                      ).toLocaleString(
                        "en-IN"
                      )
                    : "-"
                }
              />
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <Button
            onClick={handleCloseView}
            sx={{
              color: "#008f43",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          EDIT USER DIALOG
      ===================================================== */}

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 800,
            color: "#008f43",
          }}
        >
          Edit User

          <IconButton
            onClick={handleCloseEdit}
            disabled={editLoading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              label="Name"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              fullWidth
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleEditChange}
              fullWidth
            />

            <TextField
              label="Phone"
              name="phone"
              value={editForm.phone}
              onChange={handleEditChange}
              fullWidth
            />

            <TextField
              label="Address"
              name="address"
              value={editForm.address}
              onChange={handleEditChange}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={editForm.dob}
              onChange={handleEditChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={handleCloseEdit}
            disabled={editLoading}
            sx={{
              color: "#555",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdateUser}
            disabled={
              editLoading ||
              !editForm.name.trim()
            }
            sx={{
              backgroundColor: "#008f43",
              textTransform: "none",
              fontWeight: 700,

              "&:hover": {
                backgroundColor: "#007638",
              },
            }}
          >
            {editLoading
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// =====================================================
// USER DETAIL COMPONENT
// =====================================================

function UserDetail({
  label,
  value,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        p: 1.5,
        backgroundColor: "#f8faf9",
        borderRadius: 2,
      }}
    >
      <Typography
        fontWeight={700}
        sx={{
          color: "#555",
          minWidth: 120,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "#222",
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}