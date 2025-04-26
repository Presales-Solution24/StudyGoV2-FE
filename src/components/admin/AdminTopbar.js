import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MKBox from "components/MKBox";

function AdminTopbar({ onSidebarToggle }) {
  return (
    <MKBox
      sx={{
        width: "100%",
        height: "64px",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1201, // harus lebih besar dari sidebar drawer
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onSidebarToggle}
        sx={{ mr: 2, display: { md: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <h6 style={{ margin: 0 }}>Admin Panel</h6>
    </MKBox>
  );
}

AdminTopbar.propTypes = {
  onSidebarToggle: PropTypes.func.isRequired,
};

export default AdminTopbar;
