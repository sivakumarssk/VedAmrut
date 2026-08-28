// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";

// export default function Login() {
//   const navigate = useNavigate();

//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!phone || !password) {
//       setError("Mobile number and password are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await api.post("/api/auth/login", {
//         phone,
//         password,
//       });

//       console.log("ADMIN LOGIN RESPONSE:", response.data);

//       const data = response.data;

//       if (!data.success) {
//         throw new Error(data.message);
//       }

//       if (data.user.role !== "admin") {
//         setError("You do not have admin access");
//         return;
//       }

//       localStorage.setItem(
//         "adminToken",
//         data.token
//       );

//       localStorage.setItem(
//         "adminUser",
//         JSON.stringify(data.user)
//       );

//       navigate("/");

//     } catch (error) {
//       console.error("ADMIN LOGIN ERROR:", error);

//       setError(
//         error.response?.data?.message ||
//         error.message ||
//         "Login failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>

//       <div style={styles.card}>

//         <div style={styles.logo}>
//           🌿
//         </div>

//         <h1 style={styles.title}>
//           Admin Login
//         </h1>

//         <p style={styles.subtitle}>
//           Sign in to manage your orders
//         </p>

//         <form onSubmit={handleLogin}>

//           <label style={styles.label}>
//             Mobile Number
//           </label>

//           <input
//             type="text"
//             placeholder="Enter mobile number"
//             value={phone}
//             onChange={(e) =>
//               setPhone(e.target.value)
//             }
//             style={styles.input}
//           />

//           <label style={styles.label}>
//             Password
//           </label>

//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) =>
//               setPassword(e.target.value)
//             }
//             style={styles.input}
//           />

//           {error && (
//             <div style={styles.error}>
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             style={styles.button}
//           >
//             {loading
//               ? "Logging in..."
//               : "Login"}
//           </button>

//         </form>

//       </div>

//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#f5f7f6",
//   },

//   card: {
//     width: "400px",
//     padding: "40px",
//     background: "#ffffff",
//     borderRadius: "18px",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//   },

//   logo: {
//     width: "60px",
//     height: "60px",
//     borderRadius: "50%",
//     background: "#e9f8ef",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "28px",
//     margin: "0 auto 20px",
//   },

//   title: {
//     textAlign: "center",
//     margin: 0,
//     color: "#222",
//   },

//   subtitle: {
//     textAlign: "center",
//     color: "#777",
//     marginBottom: "30px",
//   },

//   label: {
//     display: "block",
//     marginBottom: "7px",
//     fontWeight: "600",
//     color: "#333",
//   },

//   input: {
//     width: "100%",
//     boxSizing: "border-box",
//     padding: "13px",
//     marginBottom: "18px",
//     border: "1px solid #ddd",
//     borderRadius: "9px",
//     fontSize: "14px",
//   },

//   error: {
//     padding: "10px",
//     marginBottom: "15px",
//     background: "#feecec",
//     color: "#dc2626",
//     borderRadius: "8px",
//     fontSize: "14px",
//   },

//   button: {
//     width: "100%",
//     padding: "14px",
//     border: "none",
//     borderRadius: "9px",
//     background: "#1c9c57",
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: "700",
//     cursor: "pointer",
//   },
// };