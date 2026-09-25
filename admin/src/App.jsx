
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import RequireAuth from "./components/RequireAuth";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import CustomerOrderDetails from "./pages/CustomerOrderDetails";
import OrderDetails from "./pages/OrderDetails";
import StatusOrders from "./pages/StatusOrders";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Rewards from "./pages/Rewards";
import RewardDetails from "./pages/RewardDetails";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* DEFAULT */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </RequireAuth>
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            <RequireAuth>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </RequireAuth>
          }
        />

        {/* ALL ORDERS */}
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </RequireAuth>
          }
        />

        {/* FILTERED ORDERS */}
        <Route
          path="/orders/status/:status"
          element={
            <RequireAuth>
              <AdminLayout>
                <StatusOrders />
              </AdminLayout>
            </RequireAuth>
          }
        />

        {/* CUSTOMER ORDER DETAILS */}
        <Route
          path="/orders/customer/:userId"
          element={
            <RequireAuth>
              <CustomerOrderDetails />
            </RequireAuth>
          }
        />

        {/* ORDER DETAILS */}
        <Route
          path="/orders/:id"
          element={
            <RequireAuth>
              <AdminLayout>
                <OrderDetails />
              </AdminLayout>
            </RequireAuth>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <RequireAuth>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </RequireAuth>
          }
        />

        {/* CATEGORIES */}
        <Route
          path="/categories"
          element={
            <RequireAuth>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </RequireAuth>
          }
        />
<Route
  path="/rewards"
  element={
    <RequireAuth>
      <AdminLayout>
        <Rewards />
      </AdminLayout>
    </RequireAuth>
  }
/>
<Route
  path="/rewards/:productId"
  element={
    <RequireAuth>
      <AdminLayout>
        <RewardDetails />
      </AdminLayout>
    </RequireAuth>
  }
  />
        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}