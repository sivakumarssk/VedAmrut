import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { API_BASE_URL } from "../api";

export default function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchNotifications = async () => {
    try {
      const token =
        localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setNotifications(
          response.data.data || []
        );
      }
    } catch (error) {
      console.error(
        "NOTIFICATIONS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      10000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const getIcon = (notification) => {
    const text =
      `${notification.title || ""} ${
        notification.message || ""
      }`.toLowerCase();

    if (
      text.includes("order")
    ) {
      return "🛒";
    }

    if (
      text.includes("user") ||
      text.includes("customer")
    ) {
      return "👤";
    }

    return "🔔";
  };

  return (
    <>
      <style>{styles}</style>

      <div className="notifications-page">

        <div className="page-header">

          <div>
            <h1>
              Notifications
            </h1>

            <p>
              New orders and new user notifications.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchNotifications}
          >
            ↻ Refresh
          </button>

        </div>

        {loading ? (

          <div className="loading">
            Loading notifications...
          </div>

        ) : notifications.length === 0 ? (

          <div className="empty">
            <div>🔔</div>

            <h2>
              No Notifications
            </h2>

            <p>
              New orders and users will appear here.
            </p>
          </div>

        ) : (

          <div className="notification-list">

            {notifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={`notification-item ${
                    notification.is_read
                      ? ""
                      : "unread"
                  }`}
                >

                  <div className="notification-icon">
                    {getIcon(
                      notification
                    )}
                  </div>

                  <div className="notification-content">

                    <h3>
                      {notification.title ||
                        "Notification"}
                    </h3>

                    <p>
                      {notification.message ||
                        ""}
                    </p>

                    <small>
                      {notification.created_at
                        ? new Date(
                            notification.created_at
                          ).toLocaleString(
                            "en-IN"
                          )
                        : ""}
                    </small>

                  </div>

                  {!notification.is_read && (
                    <span className="new-dot">
                      New
                    </span>
                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>
    </>
  );
}

const styles = `
.notifications-page {
  padding: 30px;

  min-height: 100vh;

  background: #f5f7f9;
}

.page-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 25px;
}

.page-header h1 {
  margin: 0;

  font-size: 30px;
}

.page-header p {
  color: #777;
}

.refresh-button {
  border: none;

  background: #008f43;

  color: white;

  padding: 11px 18px;

  border-radius: 8px;

  cursor: pointer;

  font-weight: 600;
}

.notification-list {
  display: flex;

  flex-direction: column;

  gap: 12px;
}

.notification-item {
  display: flex;

  align-items: center;

  gap: 18px;

  background: white;

  padding: 20px;

  border-radius: 12px;

  border: 1px solid #e5e7eb;

  box-shadow:
    0 2px 7px
    rgba(0,0,0,0.05);
}

.notification-item.unread {
  border-left: 5px solid #008f43;

  background: #f7fff9;
}

.notification-icon {
  width: 50px;
  height: 50px;

  border-radius: 50%;

  background: #eefaf2;

  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 23px;
}

.notification-content {
  flex: 1;
}

.notification-content h3 {
  margin: 0 0 5px;

  font-size: 16px;
}

.notification-content p {
  margin: 0 0 6px;

  color: #555;
}

.notification-content small {
  color: #999;
}

.new-dot {
  background: #008f43;

  color: white;

  padding: 5px 10px;

  border-radius: 15px;

  font-size: 11px;

  font-weight: 700;
}

.empty {
  background: white;

  border-radius: 14px;

  padding: 80px;

  text-align: center;
}

.empty div {
  font-size: 50px;
}

.empty h2 {
  color: #333;
}

.empty p {
  color: #777;
}

.loading {
  background: white;

  padding: 80px;

  text-align: center;

  border-radius: 14px;

  color: #777;
}
`;