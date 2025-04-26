import { useState } from "react";
import { Outlet } from "react-router-dom";
import MKBox from "components/MKBox";
import Sidebar from "components/admin/Sidebar";
import adminRoutes from "adminRoutes";
import AdminTopbar from "components/admin/AdminTopbar";

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSidebarToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  return (
    <MKBox sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Sidebar */}
      <Sidebar
        routes={adminRoutes}
        mobileOpen={mobileOpen}
        onSidebarToggle={handleSidebarToggle}
        drawerWidth={drawerWidth}
      />

      {/* Main content */}
      <MKBox sx={{ flexGrow: 1, width: "100%" }}>
        {/* Topbar */}
        <AdminTopbar onSidebarToggle={handleSidebarToggle} drawerWidth={drawerWidth} />

        {/* Content Area */}
        <MKBox
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: "64px", // supaya tidak ketiban topbar
            ml: { xs: 0, md: `${drawerWidth}px` }, // baru kasih margin di desktop
            transition: "all 300ms ease",
          }}
        >
          <Outlet />
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

export default AdminLayout;
