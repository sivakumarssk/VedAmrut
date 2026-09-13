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
import Products from "./pages/Products";
import Categories from "./pages/Categories";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* DEFAULT → DASHBOARD */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
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

        {/* ORDERS */}

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

        {/* UNKNOWN URL → DASHBOARD */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
