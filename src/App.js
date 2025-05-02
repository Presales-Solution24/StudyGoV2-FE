import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "assets/theme";

// Routes
import routes from "routes";
import AdminLayout from "layouts/Admin/AdminLayout";
import adminRoutes from "adminRoutes";

// Error pages
import NotFound from "pages/Error/NotFound";
import Forbidden from "pages/Error/Forbidden";
import ServerError from "pages/Error/ServerError";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes
      .map((route) => {
        if (route.collapse) {
          return getRoutes(route.collapse);
        }
        if (route.route) {
          return (
            <Route path={route.route} element={route.component} key={route.key || route.route} />
          );
        }
        return null;
      })
      .flat(); // <- tambahkan ini untuk meratakan array-nya

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public routes */}
        {getRoutes(routes)}

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          {adminRoutes.map((route) => (
            <Route
              key={route.key}
              path={route.route.replace("/admin/", "")}
              element={route.component}
            />
          ))}
        </Route>

        {/* Error Pages */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}
