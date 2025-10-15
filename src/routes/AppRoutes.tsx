import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { ROUTES } from "../routes/routes";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Loading component
import { LoadingSpinner } from "../components/common/LoadingSpinner/LoadingSpinner";

// Lazy load pages for code splitting
const Home = lazy(() => import("../pages/home/Home"));
// const Dashboard = lazy(() => import('@/pages/Dashboard'));
// const Profile = lazy(() => import('@/pages/Profile'));
// const Settings = lazy(() => import('@/pages/Settings'));
const Login = lazy(() => import("../pages/auth/login/LoginPage"));
// const Register = lazy(() => import('@/pages/Register'));
// const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
// const Users = lazy(() => import('@/pages/Users'));
// const UserDetail = lazy(() => import('@/pages/UserDetail'));
// const Products = lazy(() => import('@/pages/Products'));
// const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const NotFound = lazy(() => import("../pages/notFound/NotFound"));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
        </Route>

        {/* Auth routes - redirect to dashboard if logged in */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<>Register</>} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<>Forgetpass</>} />
        </Route>

        {/* Protected routes with DashboardLayout */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            {/* <Route path={ROUTES.DASHBOARD} element={<>Dashboard</>} />
            <Route path={ROUTES.PROFILE} element={<>Profile</>} /> */}
          </Route>
        </Route>

        {/* Admin only routes */}
        <Route element={<PrivateRoute roles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.USERS} element={<>Users</>} />
            <Route path={ROUTES.USER_DETAIL} element={<>UserDetail</>} />
          </Route>
        </Route>

        {/* 404 and catch-all */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </Suspense>
  );
};
