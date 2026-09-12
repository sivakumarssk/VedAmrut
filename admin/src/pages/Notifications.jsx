// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../api";

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem("adminToken");

//       const response = await axios.get(
//         `${API_BASE_URL}/api/notifications`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         setNotifications(response.data.data || []);
//       }
//     } catch (error) {
//       console.error("NOTIFICATIONS ERROR:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();

//     const interval = setInterval(fetchNotifications, 10000);

//     return () => clearInterval(interval);
//   }, []);

//   const getIcon = (notification) => {
//     const text = `${notification.title || ""} ${
//       notification.message || ""
//     }`.toLowerCase();

//     if (text.includes("order")) {
//       return "🛒";
//     }

//     if (text.includes("user") || text.includes("customer")) {
//       return "👤";
//     }

//     return "🔔";
//   };

//   return (
//     <>
//       <style>{styles}</style>

//       <div className="notifications-page">
//         {/* PAGE HEADER */}
//         <div className="page-header">
//           <div className="page-heading">
//             <h1>Notifications</h1>

//             <p>New orders and new user notifications.</p>
//           </div>

//           <button
//             className="refresh-button"
//             onClick={fetchNotifications}
//           >
//             ↻ Refresh
//           </button>
//         </div>

//         {/* LOADING */}
//         {loading ? (
//           <div className="loading">Loading notifications...</div>
//         ) : notifications.length === 0 ? (
//           /* EMPTY */
//           <div className="empty">
//             <div className="empty-icon">🔔</div>

//             <h2>No Notifications</h2>

//             <p>New orders and users will appear here.</p>
//           </div>
//         ) : (
//           /* NOTIFICATION LIST */
//           <div className="notification-list">
//             {notifications.map((notification) => (
//               <div
//                 key={notification.id}
//                 className={`notification-item ${
//                   notification.is_read ? "" : "unread"
//                 }`}
//               >
//                 {/* ICON */}
//                 <div className="notification-icon">
//                   {getIcon(notification)}
//                 </div>

//                 {/* CONTENT */}
//                 <div className="notification-content">
//                   <h3>
//                     {notification.title || "Notification"}
//                   </h3>

//                   <p>{notification.message || ""}</p>

//                   <small>
//                     {notification.created_at
//                       ? new Date(
//                           notification.created_at
//                         ).toLocaleString("en-IN")
//                       : ""}
//                   </small>
//                 </div>

//                 {/* NEW BADGE */}
//                 {!notification.is_read && (
//                   <span className="new-dot">New</span>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// const styles = `
// * {
//   box-sizing: border-box;
// }

// /* GLOBAL INTER FONTS */

// body,
// button,
// input,
// textarea,
// select {
//   font-family: "InterRegular";
// }

// .notifications-page {
//   width: 100%;
//   max-width: 100%;
//   min-height: calc(100vh - 80px);
//   padding: 30px;
//   background: #f5f7f9;
//   overflow-x: hidden;
//   font-family: "InterRegular";
// }

// /* PAGE HEADER */

// .page-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 20px;
//   margin-bottom: 25px;
// }

// .page-heading {
//   min-width: 0;
// }

// .page-header h1 {
//   margin: 0;
//   color: #111827;
//   font-family: "InterBold";
//   font-size: 30px;
//   font-weight: 700;
//   line-height: 1.2;
//   word-break: break-word;
// }

// .page-header p {
//   margin: 8px 0 0;
//   color: #777;
//   font-family: "InterRegular";
//   font-size: 15px;
//   font-weight: 400;
// }

// /* REFRESH BUTTON */

// .refresh-button {
//   flex-shrink: 0;
//   border: none;
//   background: #008f43;
//   color: white;
//   padding: 11px 18px;
//   border-radius: 8px;
//   cursor: pointer;
//   font-family: "InterSemiBold";
//   font-weight: 600;
//   font-size: 14px;
//   white-space: nowrap;
//   transition: background 0.2s ease;
// }

// .refresh-button:hover {
//   background: #007537;
// }

// /* NOTIFICATION LIST */

// .notification-list {
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
//   width: 100%;
// }

// .notification-item {
//   width: 100%;
//   display: flex;
//   align-items: center;
//   gap: 18px;
//   background: white;
//   padding: 20px;
//   border-radius: 12px;
//   border: 1px solid #e5e7eb;
//   box-shadow: 0 2px 7px rgba(0, 0, 0, 0.05);
// }

// .notification-item.unread {
//   border-left: 5px solid #008f43;
//   background: #f7fff9;
// }

// /* ICON */

// .notification-icon {
//   width: 50px;
//   height: 50px;
//   min-width: 50px;
//   border-radius: 50%;
//   background: #eefaf2;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 23px;
// }

// /* CONTENT */

// .notification-content {
//   flex: 1;
//   min-width: 0;
// }

// .notification-content h3 {
//   margin: 0 0 5px;
//   color: #1f2937;
//   font-family: "InterSemiBold";
//   font-size: 16px;
//   font-weight: 600;
//   line-height: 1.4;
//   overflow-wrap: anywhere;
// }

// .notification-content p {
//   margin: 0 0 6px;
//   color: #555;
//   font-family: "InterRegular";
//   font-size: 14px;
//   font-weight: 400;
//   line-height: 1.5;
//   overflow-wrap: anywhere;
// }

// .notification-content small {
//   display: block;
//   color: #999;
//   font-family: "InterRegular";
//   font-size: 12px;
//   font-weight: 400;
//   line-height: 1.4;
//   overflow-wrap: anywhere;
// }

// /* NEW BADGE */

// .new-dot {
//   flex-shrink: 0;
//   background: #008f43;
//   color: white;
//   padding: 5px 10px;
//   border-radius: 15px;
//   font-family: "InterMedium";
//   font-size: 11px;
//   font-weight: 500;
//   white-space: nowrap;
// }

// /* EMPTY AND LOADING */

// .empty,
// .loading {
//   width: 100%;
//   background: white;
//   border-radius: 14px;
//   padding: 80px 30px;
//   text-align: center;
// }

// .empty-icon {
//   font-size: 50px;
// }

// .empty h2 {
//   margin: 15px 0 8px;
//   color: #333;
//   font-family: "InterSemiBold";
//   font-size: 22px;
//   font-weight: 600;
// }

// .empty p {
//   margin: 0;
//   color: #777;
//   font-family: "InterRegular";
//   font-size: 14px;
//   font-weight: 400;
// }

// .loading {
//   color: #777;
//   font-family: "InterMedium";
//   font-size: 15px;
//   font-weight: 500;
// }

// /* TABLET */

// @media (max-width: 900px) {
//   .notifications-page {
//     padding: 24px;
//   }

//   .page-header h1 {
//     font-size: 27px;
//   }

//   .notification-item {
//     gap: 14px;
//     padding: 18px;
//   }
// }

// /* MOBILE */

// @media (max-width: 600px) {
//   .notifications-page {
//     padding: 16px;
//     min-height: calc(100vh - 72px);
//   }

//   .page-header {
//     flex-direction: column;
//     align-items: stretch;
//     gap: 16px;
//     margin-bottom: 20px;
//   }

//   .page-header h1 {
//     font-size: 24px;
//   }

//   .page-header p {
//     font-size: 13px;
//     line-height: 1.5;
//   }

//   .refresh-button {
//     width: 100%;
//     padding: 12px 16px;
//   }

//   .notification-list {
//     gap: 10px;
//   }

//   .notification-item {
//     align-items: flex-start;
//     flex-wrap: wrap;
//     gap: 12px;
//     padding: 16px;
//   }

//   .notification-icon {
//     width: 42px;
//     height: 42px;
//     min-width: 42px;
//     font-size: 19px;
//   }

//   .notification-content {
//     flex: 1;
//     min-width: calc(100% - 58px);
//   }

//   .notification-content h3 {
//     font-size: 14px;
//   }

//   .notification-content p {
//     font-size: 13px;
//   }

//   .notification-content small {
//     font-size: 11px;
//   }

//   .new-dot {
//     margin-left: 54px;
//     padding: 4px 9px;
//     font-size: 10px;
//   }

//   .empty,
//   .loading {
//     padding: 60px 20px;
//   }

//   .empty-icon {
//     font-size: 42px;
//   }

//   .empty h2 {
//     font-size: 19px;
//   }

//   .empty p {
//     font-size: 13px;
//   }
// }

// /* VERY SMALL MOBILE */

// @media (max-width: 380px) {
//   .notifications-page {
//     padding: 12px;
//   }

//   .notification-item {
//     padding: 13px;
//   }

//   .notification-icon {
//     width: 38px;
//     height: 38px;
//     min-width: 38px;
//     font-size: 17px;
//   }

//   .notification-content {
//     min-width: calc(100% - 50px);
//   }

//   .new-dot {
//     margin-left: 50px;
//   }
// }
// `;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error("NOTIFICATIONS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // GET NOTIFICATION ICON
  // =====================================================

  const getIcon = (notification) => {
    const text = `${notification.title || ""} ${
      notification.message || ""
    }`.toLowerCase();

    if (text.includes("order")) {
      return "🛒";
    }

    if (text.includes("user") || text.includes("customer")) {
      return "👤";
    }

    return "🔔";
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="notifications-page loading-page">
          <div className="loading">
            Loading notifications...
          </div>
        </div>
      </>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <>
      <style>{styles}</style>

      <div className="notifications-page">
        {/* HEADER */}

        <div className="page-header">
          <div className="page-heading">
            <h1>Notifications</h1>

            <p>New orders and new user notifications.</p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchNotifications}
          >
            ↻ Refresh
          </button>
        </div>

        {/* EMPTY STATE */}

        {notifications.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔔</div>

            <h2>No Notifications</h2>

            <p>New orders and users will appear here.</p>
          </div>
        ) : (
          /* NOTIFICATION LIST */

          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.is_read ? "" : "unread"
                }`}
              >
                {/* ICON */}

                <div className="notification-icon">
                  {getIcon(notification)}
                </div>

                {/* CONTENT */}

                <div className="notification-content">
                  <h3>
                    {notification.title || "Notification"}
                  </h3>

                  <p>{notification.message || ""}</p>

                  <small>
                    {notification.created_at
                      ? new Date(
                          notification.created_at
                        ).toLocaleString("en-IN")
                      : ""}
                  </small>
                </div>

                {/* NEW BADGE */}

                {!notification.is_read && (
                  <span className="new-dot">New</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = `
* {
  box-sizing: border-box;
}

/* SAME FONT AS USERS PAGE */

body,
button,
input,
textarea,
select {
  font-family: "Inter";
}

.notifications-page,
.notifications-page * {
  font-family: "Inter";
}

.notifications-page {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  background-color: #f5f7f9;
  padding: 30px;
  font-family: "Inter";
}

/* LOADING PAGE */

.loading-page {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  width: 100%;
  background: white;
  border-radius: 14px;
  padding: 80px 30px;
  text-align: center;
  color: #777;
  font-family: "Inter";
  font-size: 15px;
  font-weight: 500;
}

/* PAGE HEADER */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.page-heading {
  min-width: 0;
}

.page-header h1 {
  margin: 0;
  color: #008f43;
  font-family: "Inter";
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  word-break: break-word;
}

.page-header p {
  margin: 8px 0 0;
  color: #777;
  font-family: "Inter";
  font-size: 14px;
  font-weight: 400;
}

/* REFRESH BUTTON */

.refresh-button {
  flex-shrink: 0;
  border: none;
  background: #008f43;
  color: white;
  padding: 11px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Inter";
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.refresh-button:hover {
  background: #007638;
}

/* NOTIFICATION LIST */

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.notification-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 18px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
}

.notification-item.unread {
  border-left: 5px solid #008f43;
  background: #f7fff9;
}

/* ICON */

.notification-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 50%;
  background: #eefaf2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
  font-family: "Inter";
}

/* CONTENT */

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-content h3 {
  margin: 0 0 5px;
  color: #1f2937;
  font-family: "Inter";
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.notification-content p {
  margin: 0 0 6px;
  color: #555;
  font-family: "Inter";
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.notification-content small {
  display: block;
  color: #999;
  font-family: "Inter";
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

/* NEW BADGE */

.new-dot {
  flex-shrink: 0;
  background: #008f43;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-family: "Inter";
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

/* EMPTY STATE */

.empty {
  width: 100%;
  background: white;
  border-radius: 14px;
  padding: 80px 30px;
  text-align: center;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 50px;
  font-family: "Inter";
}

.empty h2 {
  margin: 15px 0 8px;
  color: #333;
  font-family: "Inter";
  font-size: 22px;
  font-weight: 600;
}

.empty p {
  margin: 0;
  color: #777;
  font-family: "Inter";
  font-size: 14px;
  font-weight: 400;
}

/* TABLET */

@media (max-width: 900px) {
  .notifications-page {
    padding: 24px;
  }

  .page-header h1 {
    font-size: 30px;
  }

  .notification-item {
    gap: 14px;
    padding: 18px;
  }
}

/* MOBILE */

@media (max-width: 600px) {
  .notifications-page {
    padding: 16px;
    min-height: 100vh;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    margin-bottom: 20px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .page-header p {
    font-size: 13px;
    line-height: 1.5;
  }

  .refresh-button {
    width: 100%;
    padding: 12px 16px;
  }

  .notification-list {
    gap: 10px;
  }

  .notification-item {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
  }

  .notification-icon {
    width: 42px;
    height: 42px;
    min-width: 42px;
    font-size: 19px;
  }

  .notification-content {
    flex: 1;
    min-width: calc(100% - 58px);
  }

  .notification-content h3 {
    font-size: 14px;
  }

  .notification-content p {
    font-size: 13px;
  }

  .notification-content small {
    font-size: 11px;
  }

  .new-dot {
    margin-left: 54px;
    padding: 4px 9px;
    font-size: 10px;
  }

  .empty,
  .loading {
    padding: 60px 20px;
  }

  .empty-icon {
    font-size: 42px;
  }

  .empty h2 {
    font-size: 19px;
  }

  .empty p {
    font-size: 13px;
  }
}

/* VERY SMALL MOBILE */

@media (max-width: 380px) {
  .notifications-page {
    padding: 12px;
  }

  .notification-item {
    padding: 13px;
  }

  .notification-icon {
    width: 38px;
    height: 38px;
    min-width: 38px;
    font-size: 17px;
  }

  .notification-content {
    min-width: calc(100% - 50px);
  }

  .new-dot {
    margin-left: 50px;
  }
}
`;