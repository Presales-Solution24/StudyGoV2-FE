import PropTypes from "prop-types";
import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

function Sidebar({ routes = [], mobileOpen, onSidebarToggle }) {
  const location = useLocation();
  const drawerWidth = 240;
  const collapsedWidth = 72;
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapseToggle = () => setCollapsed(!collapsed);

  const drawer = (
    <div>
      <IconButton
        onClick={handleCollapseToggle}
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: collapsed ? "center" : "flex-end",
          mt: 1,
          mx: 1,
        }}
      >
        {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
      </IconButton>

      <List>
        {Array.isArray(routes) &&
          routes
            .filter((route) => route.name) // hanya render route yang punya 'name'
            .map((route) => (
              <ListItem key={route.name} disablePadding sx={{ display: "block" }}>
                <Tooltip title={collapsed ? route.name : ""} placement="right" arrow>
                  <ListItemButton
                    component={Link}
                    to={route.route}
                    selected={location.pathname === route.route}
                    onClick={onSidebarToggle}
                    sx={{
                      minHeight: 48,
                      justifyContent: collapsed ? "center" : "initial",
                      px: 2.5,
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": { backgroundColor: "primary.dark" },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: collapsed ? 0 : 2,
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      {route.icon ? (
                        <i className={route.icon} style={{ fontSize: 20 }} />
                      ) : (
                        <MenuIcon sx={{ fontSize: 20 }} />
                      )}
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary={route.name} />}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
      </List>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          transition: "width 0.3s",
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            mt: "64px",
            height: "calc(100% - 64px)",
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Sidebar Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onSidebarToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            mt: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.array,
  mobileOpen: PropTypes.bool.isRequired,
  onSidebarToggle: PropTypes.func.isRequired,
};

export default Sidebar;
