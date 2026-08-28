import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import CustomerOrderDetails from "./pages/CustomerOrderDetails";
import OrderDetails from "./pages/OrderDetails";
import Products from "./pages/Products";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

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
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* USERS */}

        <Route
          path="/users"
          element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          }
        />

        {/* ORDERS */}

        <Route
          path="/orders"
          element={
            <AdminLayout>
              <Orders />
            </AdminLayout>
          }
        />
   <Route
  path="/orders/customer/:userId"
  element={<CustomerOrderDetails />}
/>

        {/* ORDER DETAILS */}

        <Route
          path="/orders/:id"
          element={
            <AdminLayout>
              <OrderDetails />
            </AdminLayout>
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
<Route
  path="/products"
  element={
    <AdminLayout>
      <Products />
    </AdminLayout>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}