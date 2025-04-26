import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "assets/theme";

import routes from "routes";
import AdminLayout from "layouts/Admin/AdminLayout";
import adminRoutes from "adminRoutes";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public routes */}
        {getRoutes(routes)}

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Redirect /admin ke /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" />} />

          {/* List Admin Pages */}
          {adminRoutes.map((route) => (
            <Route
              key={route.name}
              path={route.route.replace("/admin/", "")}
              element={route.component}
            />
          ))}
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/presentation" />} />
      </Routes>
    </ThemeProvider>
  );
}
