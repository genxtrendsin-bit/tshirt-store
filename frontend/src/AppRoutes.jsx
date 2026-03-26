import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import MyOrders from "./pages/MyOrders";
import SearchResults from "./pages/SearchResults";
import Wishlist from "./pages/Wishlist";

import AdminDashboard from "./admin/pages/AdminDashboard";
import ProductsAdmin from "./admin/pages/ProductsAdmin";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminReviews from "./admin/pages/AdminReviews";
import AdminReviewAnalytics from "./admin/pages/AdminReviewAnalytics";

import AdminRoute from "./components/AdminRoute";
import ParticleBackground from "./components/ParticleBackground";

import MainLayout from "./layout/MainLayout";
import Account from "./pages/Account";
import AdminLogs from "./admin/pages/AdminLogs";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/ResetPassword"
import ForgotPassword from "./pages/ForgotPassword";
import AdminVerifyOtp from "./pages/AdminVerifyOtp";
import AdminUserOrders from "./admin/pages/AdminUserOrders";
import RefundLogs from "./admin/pages/RefundLogs";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Addresses from "./pages/Addresses";
import TopProducts from "./admin/pages/TopProducts";
import TopProductsUser from "./pages/TopProductsUser";
import ShippingInfo from "./pages/ShippingInfo";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminNotification from "./admin/pages/AdminNotification";
import AdminCoupons from "./admin/pages/AdminCoupons";
import AdminCouponDetails from "./admin/pages/AdminCouponDetails";
import AdminExport from "./admin/pages/AdminExport";

function AppRoutes() {

  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (

    <MainLayout>

      {/* Floating Background */}
      {!hideNavbar && <ParticleBackground />}

      <Routes>

        {/* USER ROUTES */}

        <Route path="/" element={<Home />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<MyOrders />} />

        <Route path="/search" element={<SearchResults />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/account" element={<Account />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-admin-otp" element={<AdminVerifyOtp />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/admin/user/:userId/orders" element={<AdminUserOrders />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/addresses" element={<Addresses />} />

        <Route path="/top-products" element={<TopProductsUser />} />

        <Route path="/shipping" element={<ShippingInfo />} />

        <Route path="/terms" element={<Terms />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* ADMIN ROUTES */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ProductsAdmin />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <AdminRoute>
              <AdminReviews />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/review-analytics"
          element={
            <AdminRoute>
              <AdminReviewAnalytics />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/logs"
          element={
            <AdminRoute>
              <AdminLogs />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/refund-logs"
          element={
            <AdminRoute>
              <RefundLogs />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/top-products"
          element={
            <AdminRoute>
              <TopProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <AdminRoute>
              <AdminNotification />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/coupons"
          element={
            <AdminRoute>
              <AdminCoupons />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/coupons/:id"
          element={
            <AdminRoute>
              <AdminCouponDetails />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/export"
          element={
            <AdminRoute>
              <AdminExport />
            </AdminRoute>
          }
        />

      </Routes>

    </MainLayout>

  );

}

export default AppRoutes;