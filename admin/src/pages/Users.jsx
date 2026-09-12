// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";

// import RefreshIcon from "@mui/icons-material/Refresh";
// import PeopleIcon from "@mui/icons-material/People";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CloseIcon from "@mui/icons-material/Close";

// import { API_BASE_URL } from "../api";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // View dialog
//   const [viewDialogOpen, setViewDialogOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [viewLoading, setViewLoading] = useState(false);

//   // Edit dialog
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editLoading, setEditLoading] = useState(false);

//   const [editForm, setEditForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     dob: "",
//   });

//   // Delete
//   const [deleteLoading, setDeleteLoading] = useState(null);

//   // =====================================================
//   // GET TOKEN CONFIG
//   // =====================================================

//   const getConfig = () => {
//     const token = localStorage.getItem("adminToken");

//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//   };

//   // =====================================================
//   // FETCH ALL USERS
//   // =====================================================

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await axios.get(
//         `${API_BASE_URL}/api/users`,
//         getConfig()
//       );

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message || "Failed to fetch users"
//         );
//       }

//       setUsers(response.data.data || []);
//     } catch (error) {
//       console.error("FETCH USERS ERROR:", error);

//       setError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch users"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // INITIAL LOAD + AUTO REFRESH
//   // =====================================================

//   useEffect(() => {
//     fetchUsers();

//     const interval = setInterval(() => {
//       fetchUsers();
//     }, 15000);

//     return () => clearInterval(interval);
//   }, []);

//   // =====================================================
//   // VIEW USER
//   // =====================================================

//   const handleViewUser = async (id) => {
//     try {
//       setViewLoading(true);
//       setViewDialogOpen(true);
//       setSelectedUser(null);

//       const response = await axios.get(
//         `${API_BASE_URL}/api/users/${id}`,
//         getConfig()
//       );

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message || "Failed to fetch user"
//         );
//       }

//       setSelectedUser(response.data.data);
//     } catch (error) {
//       console.error("VIEW USER ERROR:", error);

//       alert(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch user"
//       );

//       setViewDialogOpen(false);
//     } finally {
//       setViewLoading(false);
//     }
//   };

//   // =====================================================
//   // OPEN EDIT DIALOG
//   // =====================================================

//   const handleEditUser = (user) => {
//     setSelectedUser(user);

//     setEditForm({
//       name: user.name || user.full_name || "",
//       email: user.email || "",
//       phone: user.phone || "",
//       address: user.address || "",
//       dob: user.dob ? String(user.dob).substring(0, 10) : "",
//     });

//     setEditDialogOpen(true);
//   };

//   // =====================================================
//   // EDIT INPUT CHANGE
//   // =====================================================

//   const handleEditChange = (event) => {
//     const { name, value } = event.target;

//     setEditForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   // =====================================================
//   // UPDATE USER
//   // =====================================================

//   const handleUpdateUser = async () => {
//     if (!selectedUser) return;

//     if (!editForm.name.trim()) {
//       alert("Name is required");
//       return;
//     }

//     try {
//       setEditLoading(true);

//       const response = await axios.put(
//         `${API_BASE_URL}/api/users/${selectedUser.id}`,
//         {
//           name: editForm.name,
//           email: editForm.email,
//           phone: editForm.phone,
//           address: editForm.address,
//           dob: editForm.dob || null,
//         },
//         getConfig()
//       );

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message || "Failed to update user"
//         );
//       }

//       setUsers((previousUsers) =>
//         previousUsers.map((user) =>
//           user.id === selectedUser.id
//             ? {
//                 ...user,
//                 ...response.data.data,
//               }
//             : user
//         )
//       );

//       setSelectedUser(response.data.data);
//       setEditDialogOpen(false);

//       alert("User updated successfully");
//     } catch (error) {
//       console.error("UPDATE USER ERROR:", error);

//       alert(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to update user"
//       );
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   // =====================================================
//   // DELETE USER
//   // =====================================================

//   const handleDeleteUser = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this user?"
//     );

//     if (!confirmed) return;

//     try {
//       setDeleteLoading(id);

//       const response = await axios.delete(
//         `${API_BASE_URL}/api/users/${id}`,
//         getConfig()
//       );

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message || "Failed to delete user"
//         );
//       }

//       setUsers((previousUsers) =>
//         previousUsers.filter((user) => user.id !== id)
//       );

//       alert("User deleted successfully");
//     } catch (error) {
//       console.error("DELETE USER ERROR:", error);

//       alert(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to delete user"
//       );
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   // =====================================================
//   // CLOSE VIEW DIALOG
//   // =====================================================

//   const handleCloseView = () => {
//     setViewDialogOpen(false);
//     setSelectedUser(null);
//   };

//   // =====================================================
//   // CLOSE EDIT DIALOG
//   // =====================================================

//   const handleCloseEdit = () => {
//     if (editLoading) return;

//     setEditDialogOpen(false);
//   };

//   // =====================================================
//   // LOADING SCREEN
//   // =====================================================

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           backgroundColor: "#f5f7f9",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//           gap: 2,
//           p: 2,
//           fontFamily: "Inter",
//         }}
//       >
//         <CircularProgress
//           sx={{
//             color: "#008f43",
//           }}
//         />

//         <Typography
//           color="text.secondary"
//           sx={{
//             fontFamily: "Inter",
//             fontWeight: 500,
//           }}
//         >
//           Loading users...
//         </Typography>
//       </Box>
//     );
//   }

//   // =====================================================
//   // PAGE
//   // =====================================================

//   return (
//     <>
//       <Box
//         sx={{
//           minHeight: "100vh",
//           width: "100%",
//           maxWidth: "100%",
//           overflowX: "hidden",
//           boxSizing: "border-box",
//           backgroundColor: "#f5f7f9",
//           p: {
//             xs: 2,
//             sm: 3,
//             md: 4,
//           },

//           fontFamily: "Inter",

//           "& .MuiTypography-root": {
//             fontFamily: "Inter",
//           },

//           "& .MuiButton-root": {
//             fontFamily: "Inter",
//           },

//           "& .MuiTableCell-root": {
//             fontFamily: "Inter",
//           },

//           "& .MuiDialogTitle-root": {
//             fontFamily: "Inter",
//           },

//           "& .MuiTextField-root": {
//             fontFamily: "Inter",
//           },

//           "& .MuiInputBase-input": {
//             fontFamily: "Inter",
//           },

//           "& .MuiInputLabel-root": {
//             fontFamily: "Inter",
//           },
//         }}
//       >
//         {/* HEADER */}

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: {
//               xs: "flex-start",
//               sm: "center",
//             },
//             flexDirection: {
//               xs: "column",
//               sm: "row",
//             },
//             gap: 2,
//             mb: 3,
//           }}
//         >
//           <Box>
//             <Typography
//               sx={{
//                 fontSize: {
//                   xs: 28,
//                   sm: 30,
//                   md: 32,
//                 },
//                 fontFamily: "Inter",
//                 fontWeight: 700,
//                 color: "#008f43",
//               }}
//             >
//               Users
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 0.5,
//                 color: "#777",
//                 fontSize: 14,
//                 fontFamily: "Inter",
//                 fontWeight: 400,
//               }}
//             >
//               Manage Vedhamruth customers.
//             </Typography>
//           </Box>

//           <Button
//             variant="contained"
//             startIcon={<RefreshIcon />}
//             onClick={fetchUsers}
//             sx={{
//               backgroundColor: "#008f43",
//               textTransform: "none",
//               fontFamily: "Inter",
//               fontWeight: 600,
//               borderRadius: 2,
//               px: 2.5,
//               width: {
//                 xs: "100%",
//                 sm: "auto",
//               },
//               "&:hover": {
//                 backgroundColor: "#007638",
//               },
//             }}
//           >
//             Refresh
//           </Button>
//         </Box>

//         {/* ERROR */}

//         {error && (
//           <Card
//             sx={{
//               backgroundColor: "#fef2f2",
//               border: "1px solid #fecaca",
//               borderRadius: 3,
//               boxShadow: "none",
//               mb: 3,
//             }}
//           >
//             <CardContent
//               sx={{
//                 p: {
//                   xs: 2,
//                   sm: 3,
//                 },
//               }}
//             >
//               <Typography
//                 color="error"
//                 sx={{
//                   fontFamily: "Inter",
//                   fontWeight: 600,
//                 }}
//               >
//                 {error}
//               </Typography>

//               <Button
//                 onClick={fetchUsers}
//                 sx={{
//                   mt: 1,
//                   color: "#008f43",
//                   textTransform: "none",
//                   fontFamily: "Inter",
//                   fontWeight: 600,
//                 }}
//               >
//                 Try Again
//               </Button>
//             </CardContent>
//           </Card>
//         )}

//         {/* USERS CARD */}

//         <Card
//           sx={{
//             width: "100%",
//             borderRadius: 3,
//             boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
//             overflow: "hidden",
//           }}
//         >
//           <CardContent sx={{ p: 0 }}>
//             {/* COUNT */}

//             <Box
//               sx={{
//                 p: {
//                   xs: 2,
//                   sm: 3,
//                 },
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 borderBottom: "1px solid #eeeeee",
//               }}
//             >
//               <PeopleIcon
//                 sx={{
//                   color: "#008f43",
//                 }}
//               />

//               <Typography
//                 color="text.secondary"
//                 sx={{
//                   fontFamily: "Inter",
//                   fontWeight: 400,
//                 }}
//               >
//                 Total Users:
//               </Typography>

//               <Typography
//                 sx={{
//                   color: "#008f43",
//                   fontFamily: "Inter",
//                   fontWeight: 700,
//                 }}
//               >
//                 {users.length}
//               </Typography>
//             </Box>

//             {/* EMPTY STATE */}

//             {users.length === 0 ? (
//               <Box
//                 sx={{
//                   py: 10,
//                   px: 2,
//                   textAlign: "center",
//                 }}
//               >
//                 <PeopleIcon
//                   sx={{
//                     fontSize: 60,
//                     color: "#aaa",
//                   }}
//                 />

//                 <Typography
//                   variant="h6"
//                   sx={{
//                     mt: 1,
//                     fontFamily: "Inter",
//                     fontWeight: 600,
//                   }}
//                 >
//                   No Users Found
//                 </Typography>

//                 <Typography
//                   color="text.secondary"
//                   sx={{
//                     mt: 0.5,
//                     fontFamily: "Inter",
//                     fontWeight: 400,
//                   }}
//                 >
//                   Registered customers will appear here.
//                 </Typography>
//               </Box>
//             ) : (
//               /* TABLE */

//               <TableContainer
//                 component={Paper}
//                 elevation={0}
//                 sx={{
//                   width: "100%",
//                   overflowX: "auto",
//                   WebkitOverflowScrolling: "touch",
//                 }}
//               >
//                 <Table
//                   sx={{
//                     minWidth: 900,
//                   }}
//                 >
//                   <TableHead>
//                     <TableRow
//                       sx={{
//                         backgroundColor: "#008f43",
//                       }}
//                     >
//                       {[
//                         "ID",
//                         "Name",
//                         "Email",
//                         "Phone",
//                         "Address",
//                         "Joined",
//                       ].map((heading) => (
//                         <TableCell
//                           key={heading}
//                           sx={{
//                             color: "white",
//                             fontFamily: "Inter",
//                             fontWeight: 600,
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {heading}
//                         </TableCell>
//                       ))}

//                       <TableCell
//                         align="center"
//                         sx={{
//                           color: "white",
//                           fontFamily: "Inter",
//                           fontWeight: 600,
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         Actions
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {users.map((user) => (
//                       <TableRow
//                         key={user.id}
//                         hover
//                         sx={{
//                           "&:last-child td": {
//                             borderBottom: 0,
//                           },
//                         }}
//                       >
//                         {/* ID */}

//                         <TableCell>
//                           <Typography
//                             sx={{
//                               color: "#555",
//                               fontFamily: "Inter",
//                               fontWeight: 500,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             #{user.id}
//                           </Typography>
//                         </TableCell>

//                         {/* NAME */}

//                         <TableCell>
//                           <Typography
//                             sx={{
//                               minWidth: 120,
//                               whiteSpace: "nowrap",
//                               fontFamily: "Inter",
//                               fontWeight: 600,
//                             }}
//                           >
//                             {user.full_name || user.name || "User"}
//                           </Typography>
//                         </TableCell>

//                         {/* EMAIL */}

//                         <TableCell>
//                           <Typography
//                             sx={{
//                               whiteSpace: "nowrap",
//                               fontFamily: "Inter",
//                               fontWeight: 400,
//                             }}
//                           >
//                             {user.email || "-"}
//                           </Typography>
//                         </TableCell>

//                         {/* PHONE */}

//                         <TableCell>
//                           <Typography
//                             sx={{
//                               whiteSpace: "nowrap",
//                               fontFamily: "Inter",
//                               fontWeight: 400,
//                             }}
//                           >
//                             {user.phone || "-"}
//                           </Typography>
//                         </TableCell>

//                         {/* ADDRESS */}

//                         <TableCell
//                           sx={{
//                             maxWidth: 220,
//                             minWidth: 180,
//                           }}
//                         >
//                           <Typography
//                             title={user.address || "No address"}
//                             sx={{
//                               maxWidth: 220,
//                               whiteSpace: "nowrap",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               fontFamily: "Inter",
//                               fontWeight: 400,
//                             }}
//                           >
//                             {user.address || "No address"}
//                           </Typography>
//                         </TableCell>

//                         {/* JOINED */}

//                         <TableCell>
//                           <Typography
//                             sx={{
//                               whiteSpace: "nowrap",
//                               fontFamily: "Inter",
//                               fontWeight: 400,
//                             }}
//                           >
//                             {user.created_at
//                               ? new Date(
//                                   user.created_at
//                                 ).toLocaleDateString("en-IN")
//                               : "-"}
//                           </Typography>
//                         </TableCell>

//                         {/* ACTIONS */}

//                         <TableCell align="center">
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "center",
//                               gap: 0.5,
//                               minWidth: 130,
//                             }}
//                           >
//                             {/* VIEW */}

//                             <IconButton
//                               onClick={() => handleViewUser(user.id)}
//                               sx={{
//                                 color: "#2563eb",
//                                 "&:hover": {
//                                   backgroundColor: "#eff6ff",
//                                 },
//                               }}
//                               title="View User"
//                             >
//                               <VisibilityIcon />
//                             </IconButton>

//                             {/* EDIT */}

//                             <IconButton
//                               onClick={() => handleEditUser(user)}
//                               sx={{
//                                 color: "#7c3aed",
//                                 "&:hover": {
//                                   backgroundColor: "#f5f3ff",
//                                 },
//                               }}
//                               title="Edit User"
//                             >
//                               <EditIcon />
//                             </IconButton>

//                             {/* DELETE */}

//                             <IconButton
//                               disabled={deleteLoading === user.id}
//                               onClick={() => handleDeleteUser(user.id)}
//                               sx={{
//                                 color: "#dc2626",
//                                 "&:hover": {
//                                   backgroundColor: "#fef2f2",
//                                 },
//                               }}
//                               title="Delete User"
//                             >
//                               {deleteLoading === user.id ? (
//                                 <CircularProgress
//                                   size={22}
//                                   sx={{
//                                     color: "#dc2626",
//                                   }}
//                                 />
//                               ) : (
//                                 <DeleteIcon />
//                               )}
//                             </IconButton>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </CardContent>
//         </Card>
//       </Box>

//       {/* VIEW USER DIALOG */}

//       <Dialog
//         open={viewDialogOpen}
//         onClose={handleCloseView}
//         fullWidth
//         maxWidth="sm"
//         PaperProps={{
//           sx: {
//             m: {
//               xs: 1,
//               sm: 2,
//             },
//             width: {
//               xs: "calc(100% - 16px)",
//               sm: "100%",
//             },
//             borderRadius: 3,
//             fontFamily: "Inter",

//             "& .MuiTypography-root": {
//               fontFamily: "Inter",
//             },

//             "& .MuiDialogTitle-root": {
//               fontFamily: "Inter",
//               fontWeight: 700,
//             },

//             "& .MuiButton-root": {
//               fontFamily: "Inter",
//               fontWeight: 600,
//             },
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             fontFamily: "Inter",
//             fontWeight: 700,
//             color: "#008f43",
//             fontSize: {
//               xs: 20,
//               sm: 24,
//             },
//           }}
//         >
//           User Details

//           <IconButton onClick={handleCloseView}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent
//           dividers
//           sx={{
//             px: {
//               xs: 2,
//               sm: 3,
//             },
//           }}
//         >
//           {viewLoading ? (
//             <Box
//               sx={{
//                 py: 6,
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <CircularProgress
//                 sx={{
//                   color: "#008f43",
//                 }}
//               />
//             </Box>
//           ) : selectedUser ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 1.5,
//               }}
//             >
//               <UserDetail
//                 label="User ID"
//                 value={`#${selectedUser.id}`}
//               />

//               <UserDetail
//                 label="Name"
//                 value={selectedUser.name || "-"}
//               />

//               <UserDetail
//                 label="Email"
//                 value={selectedUser.email || "-"}
//               />

//               <UserDetail
//                 label="Phone"
//                 value={selectedUser.phone || "-"}
//               />

//               <UserDetail
//                 label="Address"
//                 value={selectedUser.address || "-"}
//               />

//               <UserDetail
//                 label="Date of Birth"
//                 value={
//                   selectedUser.dob
//                     ? new Date(
//                         selectedUser.dob
//                       ).toLocaleDateString("en-IN")
//                     : "-"
//                 }
//               />

//               <UserDetail
//                 label="Role"
//                 value={selectedUser.role || "user"}
//               />

//               <UserDetail
//                 label="Joined"
//                 value={
//                   selectedUser.created_at
//                     ? new Date(
//                         selectedUser.created_at
//                       ).toLocaleString("en-IN")
//                     : "-"
//                 }
//               />
//             </Box>
//           ) : null}
//         </DialogContent>

//         <DialogActions
//           sx={{
//             p: 2,
//           }}
//         >
//           <Button
//             onClick={handleCloseView}
//             sx={{
//               color: "#008f43",
//               textTransform: "none",
//               fontFamily: "Inter",
//               fontWeight: 600,
//             }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* EDIT USER DIALOG */}

//       <Dialog
//         open={editDialogOpen}
//         onClose={handleCloseEdit}
//         fullWidth
//         maxWidth="sm"
//         PaperProps={{
//           sx: {
//             m: {
//               xs: 1,
//               sm: 2,
//             },
//             width: {
//               xs: "calc(100% - 16px)",
//               sm: "100%",
//             },
//             borderRadius: 3,
//             fontFamily: "Inter",

//             "& .MuiTypography-root": {
//               fontFamily: "Inter",
//             },

//             "& .MuiDialogTitle-root": {
//               fontFamily: "Inter",
//               fontWeight: 700,
//             },

//             "& .MuiButton-root": {
//               fontFamily: "Inter",
//               fontWeight: 600,
//             },

//             "& .MuiInputBase-input": {
//               fontFamily: "Inter",
//             },

//             "& .MuiInputLabel-root": {
//               fontFamily: "Inter",
//             },
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             fontFamily: "Inter",
//             fontWeight: 700,
//             color: "#008f43",
//             fontSize: {
//               xs: 20,
//               sm: 24,
//             },
//           }}
//         >
//           Edit User

//           <IconButton
//             onClick={handleCloseEdit}
//             disabled={editLoading}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent
//           dividers
//           sx={{
//             px: {
//               xs: 2,
//               sm: 3,
//             },
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//               pt: 1,
//             }}
//           >
//             <TextField
//               label="Name"
//               name="name"
//               value={editForm.name}
//               onChange={handleEditChange}
//               fullWidth
//               required
//             />

//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={editForm.email}
//               onChange={handleEditChange}
//               fullWidth
//             />

//             <TextField
//               label="Phone"
//               name="phone"
//               value={editForm.phone}
//               onChange={handleEditChange}
//               fullWidth
//             />

//             <TextField
//               label="Address"
//               name="address"
//               value={editForm.address}
//               onChange={handleEditChange}
//               fullWidth
//               multiline
//               rows={3}
//             />

//             <TextField
//               label="Date of Birth"
//               name="dob"
//               type="date"
//               value={editForm.dob}
//               onChange={handleEditChange}
//               fullWidth
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               sx={{
//                 "& .MuiInputBase-input": {
//                   padding: "16.5px 14px",
//                   fontFamily: "Inter",
//                 },
//               }}
//             />
//           </Box>
//         </DialogContent>

//         <DialogActions
//           sx={{
//             p: 2,
//             gap: 1,
//             flexDirection: {
//               xs: "column-reverse",
//               sm: "row",
//             },
//             alignItems: {
//               xs: "stretch",
//               sm: "center",
//             },
//           }}
//         >
//           <Button
//             onClick={handleCloseEdit}
//             disabled={editLoading}
//             sx={{
//               color: "#555",
//               textTransform: "none",
//               fontFamily: "Inter",
//               fontWeight: 600,
//               width: {
//                 xs: "100%",
//                 sm: "auto",
//               },
//             }}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             onClick={handleUpdateUser}
//             disabled={editLoading || !editForm.name.trim()}
//             sx={{
//               backgroundColor: "#008f43",
//               textTransform: "none",
//               fontFamily: "Inter",
//               fontWeight: 700,
//               width: {
//                 xs: "100%",
//                 sm: "auto",
//               },
//               "&:hover": {
//                 backgroundColor: "#007638",
//               },
//             }}
//           >
//             {editLoading ? "Saving..." : "Save Changes"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

// // =====================================================
// // USER DETAIL COMPONENT
// // =====================================================

// function UserDetail({ label, value }) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: {
//           xs: "column",
//           sm: "row",
//         },
//         justifyContent: "space-between",
//         alignItems: {
//           xs: "flex-start",
//           sm: "center",
//         },
//         gap: 1,
//         p: 1.5,
//         backgroundColor: "#f8faf9",
//         borderRadius: 2,
//       }}
//     >
//       <Typography
//         sx={{
//           color: "#555",
//           minWidth: {
//             xs: "auto",
//             sm: 120,
//           },
//           fontFamily: "Inter",
//           fontWeight: 600,
//         }}
//       >
//         {label}
//       </Typography>

//       <Typography
//         sx={{
//           color: "#222",
//           textAlign: {
//             xs: "left",
//             sm: "right",
//           },
//           wordBreak: "break-word",
//           overflowWrap: "anywhere",
//           width: {
//             xs: "100%",
//             sm: "auto",
//           },
//           fontFamily: "Inter",
//           fontWeight: 400,
//         }}
//       >
//         {value}
//       </Typography>
//     </Box>
//   );
// }

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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });

  // Delete
  const [deleteLoading, setDeleteLoading] = useState(null);

  // =====================================================
  // GET TOKEN CONFIG
  // =====================================================

  const getConfig = () => {
    const token = localStorage.getItem("adminToken");

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
          response.data?.message || "Failed to fetch users"
        );
      }

      setUsers(response.data.data || []);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);

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
  // INITIAL LOAD + AUTO REFRESH
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
          response.data?.message || "Failed to fetch user"
        );
      }

      setSelectedUser(response.data.data);
    } catch (error) {
      console.error("VIEW USER ERROR:", error);

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
  // OPEN EDIT DIALOG
  // =====================================================

  const handleEditUser = (user) => {
    setSelectedUser(user);

    setEditForm({
      name: user.name || user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      dob: user.dob ? String(user.dob).substring(0, 10) : "",
    });

    setEditDialogOpen(true);
  };

  // =====================================================
  // EDIT INPUT CHANGE
  // =====================================================

  const handleEditChange = (event) => {
    const { name, value } = event.target;

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

    if (!editForm.name.trim()) {
      alert("Name is required");
      return;
    }

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
          response.data?.message || "Failed to update user"
        );
      }

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

      setSelectedUser(response.data.data);

      // Close dialog without success alert
      setEditDialogOpen(false);
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);

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

    if (!confirmed) return;

    try {
      setDeleteLoading(id);

      const response = await axios.delete(
        `${API_BASE_URL}/api/users/${id}`,
        getConfig()
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to delete user"
        );
      }

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== id)
      );

      alert("User deleted successfully");
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

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
  // CLOSE VIEW DIALOG
  // =====================================================

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setSelectedUser(null);
  };

  // =====================================================
  // CLOSE EDIT DIALOG
  // =====================================================

  const handleCloseEdit = () => {
    if (editLoading) return;

    setEditDialogOpen(false);
  };

  // =====================================================
  // LOADING SCREEN
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
          p: 2,
          fontFamily: "Inter",
        }}
      >
        <CircularProgress
          sx={{
            color: "#008f43",
          }}
        />

        <Typography
          color="text.secondary"
          sx={{
            fontFamily: "Inter",
            fontWeight: 500,
          }}
        >
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
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
          backgroundColor: "#f5f7f9",
          p: {
            xs: 1.5,
            sm: 3,
            md: 4,
          },

          fontFamily: "Inter",

          "& .MuiTypography-root": {
            fontFamily: "Inter",
          },

          "& .MuiButton-root": {
            fontFamily: "Inter",
          },

          "& .MuiTableCell-root": {
            fontFamily: "Inter",
          },

          "& .MuiDialogTitle-root": {
            fontFamily: "Inter",
          },

          "& .MuiTextField-root": {
            fontFamily: "Inter",
          },

          "& .MuiInputBase-input": {
            fontFamily: "Inter",
          },

          "& .MuiInputLabel-root": {
            fontFamily: "Inter",
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: "row",
            gap: 1.5,
            mb: 3,
            width: "100%",
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
                fontSize: {
                  xs: 24,
                  sm: 30,
                  md: 32,
                },
                lineHeight: 1.2,
                fontFamily: "Inter",
                fontWeight: 700,
                color: "#008f43",
                wordBreak: "break-word",
              }}
            >
              Users
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#777",
                fontSize: {
                  xs: 12,
                  sm: 14,
                },
                fontFamily: "Inter",
                fontWeight: 400,
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
              fontFamily: "Inter",
              fontWeight: 600,
              borderRadius: 2,
              minWidth: {
                xs: 90,
                sm: 110,
              },
              height: {
                xs: 38,
                sm: 42,
              },
              px: {
                xs: 1.5,
                sm: 2.5,
              },
              flexShrink: 0,
              whiteSpace: "nowrap",
              fontSize: {
                xs: 12,
                sm: 14,
              },
              "& .MuiButton-startIcon": {
                marginRight: {
                  xs: 0.5,
                  sm: 1,
                },
              },
              "&:hover": {
                backgroundColor: "#007638",
              },
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* ERROR */}

        {error && (
          <Card
            sx={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 3,
              boxShadow: "none",
              mb: 3,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >
              <Typography
                color="error"
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                }}
              >
                {error}
              </Typography>

              <Button
                onClick={fetchUsers}
                sx={{
                  mt: 1,
                  color: "#008f43",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 600,
                }}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* USERS CARD */}

        <Card
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* COUNT */}

            <Box
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom: "1px solid #eeeeee",
              }}
            >
              <PeopleIcon
                sx={{
                  color: "#008f43",
                }}
              />

              <Typography
                color="text.secondary"
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                }}
              >
                Total Users:
              </Typography>

              <Typography
                sx={{
                  color: "#008f43",
                  fontFamily: "Inter",
                  fontWeight: 700,
                }}
              >
                {users.length}
              </Typography>
            </Box>

            {/* EMPTY STATE */}

            {users.length === 0 ? (
              <Box
                sx={{
                  py: 10,
                  px: 2,
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
                    fontFamily: "Inter",
                    fontWeight: 600,
                  }}
                >
                  No Users Found
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    fontFamily: "Inter",
                    fontWeight: 400,
                  }}
                >
                  Registered customers will appear here.
                </Typography>
              </Box>
            ) : (
              /* TABLE */

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
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
                        backgroundColor: "#008f43",
                      }}
                    >
                      {[
                        "ID",
                        "Name",
                        "Email",
                        "Phone",
                        "Address",
                        "Joined",
                      ].map((heading) => (
                        <TableCell
                          key={heading}
                          sx={{
                            color: "white",
                            fontFamily: "Inter",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {heading}
                        </TableCell>
                      ))}

                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontFamily: "Inter",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
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
                            sx={{
                              color: "#555",
                              fontFamily: "Inter",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                            }}
                          >
                            #{user.id}
                          </Typography>
                        </TableCell>

                        {/* NAME */}

                        <TableCell>
                          <Typography
                            sx={{
                              minWidth: 120,
                              whiteSpace: "nowrap",
                              fontFamily: "Inter",
                              fontWeight: 600,
                            }}
                          >
                            {user.full_name || user.name || "User"}
                          </Typography>
                        </TableCell>

                        {/* EMAIL */}

                        <TableCell>
                          <Typography
                            sx={{
                              whiteSpace: "nowrap",
                              fontFamily: "Inter",
                              fontWeight: 400,
                            }}
                          >
                            {user.email || "-"}
                          </Typography>
                        </TableCell>

                        {/* PHONE */}

                        <TableCell>
                          <Typography
                            sx={{
                              whiteSpace: "nowrap",
                              fontFamily: "Inter",
                              fontWeight: 400,
                            }}
                          >
                            {user.phone || "-"}
                          </Typography>
                        </TableCell>

                        {/* ADDRESS */}

                        <TableCell
                          sx={{
                            maxWidth: 220,
                            minWidth: 180,
                          }}
                        >
                          <Typography
                            title={user.address || "No address"}
                            sx={{
                              maxWidth: 220,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontFamily: "Inter",
                              fontWeight: 400,
                            }}
                          >
                            {user.address || "No address"}
                          </Typography>
                        </TableCell>

                        {/* JOINED */}

                        <TableCell>
                          <Typography
                            sx={{
                              whiteSpace: "nowrap",
                              fontFamily: "Inter",
                              fontWeight: 400,
                            }}
                          >
                            {user.created_at
                              ? new Date(
                                  user.created_at
                                ).toLocaleDateString("en-IN")
                              : "-"}
                          </Typography>
                        </TableCell>

                        {/* ACTIONS */}

                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 0.5,
                              minWidth: 130,
                            }}
                          >
                            {/* VIEW */}

                            <IconButton
                              onClick={() => handleViewUser(user.id)}
                              sx={{
                                color: "#2563eb",
                                "&:hover": {
                                  backgroundColor: "#eff6ff",
                                },
                              }}
                              title="View User"
                            >
                              <VisibilityIcon />
                            </IconButton>

                            {/* EDIT */}

                            <IconButton
                              onClick={() => handleEditUser(user)}
                              sx={{
                                color: "#7c3aed",
                                "&:hover": {
                                  backgroundColor: "#f5f3ff",
                                },
                              }}
                              title="Edit User"
                            >
                              <EditIcon />
                            </IconButton>

                            {/* DELETE */}

                            <IconButton
                              disabled={deleteLoading === user.id}
                              onClick={() => handleDeleteUser(user.id)}
                              sx={{
                                color: "#dc2626",
                                "&:hover": {
                                  backgroundColor: "#fef2f2",
                                },
                              }}
                              title="Delete User"
                            >
                              {deleteLoading === user.id ? (
                                <CircularProgress
                                  size={22}
                                  sx={{
                                    color: "#dc2626",
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

      {/* VIEW USER DIALOG */}

      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseView}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            m: {
              xs: 1,
              sm: 2,
            },
            width: {
              xs: "calc(100% - 16px)",
              sm: "100%",
            },
            borderRadius: 3,
            fontFamily: "Inter",

            "& .MuiTypography-root": {
              fontFamily: "Inter",
            },

            "& .MuiDialogTitle-root": {
              fontFamily: "Inter",
              fontWeight: 700,
            },

            "& .MuiButton-root": {
              fontFamily: "Inter",
              fontWeight: 600,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Inter",
            fontWeight: 700,
            color: "#008f43",
            fontSize: {
              xs: 20,
              sm: 24,
            },
          }}
        >
          User Details

          <IconButton onClick={handleCloseView}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
          }}
        >
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
                gap: 1.5,
              }}
            >
              <UserDetail
                label="User ID"
                value={`#${selectedUser.id}`}
              />

              <UserDetail
                label="Name"
                value={selectedUser.name || "-"}
              />

              <UserDetail
                label="Email"
                value={selectedUser.email || "-"}
              />

              <UserDetail
                label="Phone"
                value={selectedUser.phone || "-"}
              />

              <UserDetail
                label="Address"
                value={selectedUser.address || "-"}
              />

              <UserDetail
                label="Date of Birth"
                value={
                  selectedUser.dob
                    ? new Date(
                        selectedUser.dob
                      ).toLocaleDateString("en-IN")
                    : "-"
                }
              />

              <UserDetail
                label="Role"
                value={selectedUser.role || "user"}
              />

              <UserDetail
                label="Joined"
                value={
                  selectedUser.created_at
                    ? new Date(
                        selectedUser.created_at
                      ).toLocaleString("en-IN")
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
              fontFamily: "Inter",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT USER DIALOG */}

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            m: {
              xs: 1,
              sm: 2,
            },
            width: {
              xs: "calc(100% - 16px)",
              sm: "100%",
            },
            borderRadius: 3,
            fontFamily: "Inter",

            "& .MuiTypography-root": {
              fontFamily: "Inter",
            },

            "& .MuiDialogTitle-root": {
              fontFamily: "Inter",
              fontWeight: 700,
            },

            "& .MuiButton-root": {
              fontFamily: "Inter",
              fontWeight: 600,
            },

            "& .MuiInputBase-input": {
              fontFamily: "Inter",
            },

            "& .MuiInputLabel-root": {
              fontFamily: "Inter",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Inter",
            fontWeight: 700,
            color: "#008f43",
            fontSize: {
              xs: 20,
              sm: 24,
            },
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

        <DialogContent
          dividers
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
          }}
        >
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
              sx={{
                "& .MuiInputBase-input": {
                  padding: "16.5px 14px",
                  fontFamily: "Inter",
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            gap: 1,
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          <Button
            onClick={handleCloseEdit}
            disabled={editLoading}
            sx={{
              color: "#555",
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 600,
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdateUser}
            disabled={editLoading || !editForm.name.trim()}
            sx={{
              backgroundColor: "#008f43",
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 700,
              width: {
                xs: "100%",
                sm: "auto",
              },
              "&:hover": {
                backgroundColor: "#007638",
              },
            }}
          >
            {editLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// =====================================================
// USER DETAIL COMPONENT
// =====================================================

function UserDetail({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          sm: "center",
        },
        gap: 1,
        p: 1.5,
        backgroundColor: "#f8faf9",
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{
          color: "#555",
          minWidth: {
            xs: "auto",
            sm: 120,
          },
          fontFamily: "Inter",
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "#222",
          textAlign: {
            xs: "left",
            sm: "right",
          },
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          width: {
            xs: "100%",
            sm: "auto",
          },
          fontFamily: "Inter",
          fontWeight: 400,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}