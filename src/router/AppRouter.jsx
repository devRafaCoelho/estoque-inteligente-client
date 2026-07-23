import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout/AppLayout";
import { PrivateRoute, PublicRoute } from "../components/auth/AuthSessionGuard/AuthSessionGuard";
import LoginPage from "../pages/auth/LoginPage/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage/DashboardPage";
import ProductListPage from "../pages/products/ProductListPage/ProductListPage";
import ProductDetailPage from "../pages/products/ProductDetailPage/ProductDetailPage";
import ProductCreatePage from "../pages/products/ProductCreatePage/ProductCreatePage";
import MyAccountPage from "../pages/account/MyAccountPage/MyAccountPage";
import IntakePage from "../pages/intake/IntakePage/IntakePage";
import IntakePreviewPage from "../pages/intake/IntakePreviewPage/IntakePreviewPage";
import StockOutPage from "../pages/stockOut/StockOutPage/StockOutPage";
import StockOutPreviewPage from "../pages/stockOut/StockOutPreviewPage/StockOutPreviewPage";
import ShoppingListPage from "../pages/shopping/ShoppingListPage/ShoppingListPage";
import NotificationsPage from "../pages/notifications/NotificationsPage/NotificationsPage";
import FinancePage from "../pages/finance/FinancePage/FinancePage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/entrada" element={<IntakePage />} />
          <Route path="/entrada/:id/preview" element={<IntakePreviewPage />} />
          <Route path="/baixa" element={<StockOutPage />} />
          <Route path="/baixa/:id/preview" element={<StockOutPreviewPage />} />
          <Route path="/lista-compras" element={<ShoppingListPage />} />
          <Route path="/financeiro" element={<FinancePage />} />
          <Route path="/notificacoes" element={<NotificationsPage />} />
          <Route path="/produtos" element={<ProductListPage />} />
          <Route path="/produtos/novo" element={<ProductCreatePage />} />
          <Route path="/produtos/:id" element={<ProductDetailPage />} />
          <Route path="/minha-conta" element={<MyAccountPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
