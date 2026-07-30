import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import Wallet from "./pages/Wallet";
import WalletHistory from "./pages/WalletHistory";
import AddBalance from "./pages/AddBalance";
import Withdraw from "./pages/Withdraw";
import WithdrawHistory from "./pages/WithdrawHistory";
import Profile from "./pages/Profile";
import Promotion from "./pages/Promotion";
import Notifications from "./pages/Notifications";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import ChangePassword from "./pages/ChangePassword";
import ChangeMobile from "./pages/ChangeMobile";
import Products from "./pages/Products";
import MyProducts from "./pages/MyProducts";
import MyProductDetails from "./pages/MyProductDetails";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminCustomers from "./pages/AdminCustomers";
import AdminCustomerDetails from "./pages/AdminCustomerDetails";
import AdminWithdrawalDetails from "./pages/AdminWithdrawalDetails";
import AdminBalanceRequests from "./pages/AdminBalanceRequests";
import AdminBalanceRequestDetails from "./pages/AdminBalanceRequestDetails";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminProducts from "./pages/AdminProducts";
import AdminWallets from "./pages/AdminWallets";
import AdminWalletDetails from "./pages/AdminWalletDetails";
import AdminNotifications from "./pages/AdminNotifications";
import PaymentStatus from "./pages/PaymentStatus";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";

/* =========================
   APP
========================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================
            PUBLIC
        ===================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =====================
            CUSTOMER
        ===================== */}

        <Route
          path="/home"
          element={
            <ProtectedUserRoute>
              <Home />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/check-in"
          element={
            <ProtectedUserRoute>
              <CheckIn />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedUserRoute>
              <Wallet />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/wallet-history"
          element={
            <ProtectedUserRoute>
              <WalletHistory />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/add-balance"
          element={
            <ProtectedUserRoute>
              <AddBalance />
            </ProtectedUserRoute>
          }
        />

        <Route
  path="/payment-status"
  element={<PaymentStatus />}
/>

        <Route
          path="/withdraw"
          element={
            <ProtectedUserRoute>
              <Withdraw />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/withdraw-history"
          element={
            <ProtectedUserRoute>
              <WithdrawHistory />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedUserRoute>
              <Profile />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/promotion"
          element={
            <ProtectedUserRoute>
              <Promotion />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedUserRoute>
              <Notifications />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedUserRoute>
              <EditProfile />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedUserRoute>
              <Settings />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedUserRoute>
              <Support />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedUserRoute>
              <ChangePassword />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/change-mobile"
          element={
            <ProtectedUserRoute>
              <ChangeMobile />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedUserRoute>
              <Products />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/my-products"
          element={
            <ProtectedUserRoute>
              <MyProducts />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/my-products/:id"
          element={
            <ProtectedUserRoute>
              <MyProductDetails />
            </ProtectedUserRoute>
          }
        />

        {/* =====================
            ADMIN PUBLIC
        ===================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =====================
            ADMIN PROTECTED
        ===================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/withdrawals"
          element={
            <ProtectedAdminRoute>
              <AdminWithdrawals />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/withdrawals/:id"
          element={
            <ProtectedAdminRoute>
              <AdminWithdrawalDetails />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <ProtectedAdminRoute>
              <AdminCustomers />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/customers/:id"
          element={
            <ProtectedAdminRoute>
              <AdminCustomerDetails />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/balance-requests"
          element={
            <ProtectedAdminRoute>
              <AdminBalanceRequests />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/balance-requests/:id"
          element={
            <ProtectedAdminRoute>
              <AdminBalanceRequestDetails />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminOrders />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedAdminRoute>
              <AdminOrderDetails />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute>
              <AdminProducts />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/wallets"
          element={
            <ProtectedAdminRoute>
              <AdminWallets />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/wallets/:id"
          element={
            <ProtectedAdminRoute>
              <AdminWalletDetails />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <ProtectedAdminRoute>
              <AdminNotifications />
            </ProtectedAdminRoute>
          }
        />

        {/* =====================
            UNKNOWN URL
        ===================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;