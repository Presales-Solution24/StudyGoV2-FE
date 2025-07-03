// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Collapse from "@mui/material/Collapse";
import Icon from "@mui/material/Icon";
import MuiLink from "@mui/material/Link"; // ✅ IMPORT untuk external link

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function DefaultNavbarDropdown({
  name,
  icon,
  children,
  collapseStatus,
  light,
  href,
  route,
  collapse,
  ...rest
}) {
  const isExternal = Boolean(href);
  const WrapperComponent = isExternal ? MuiLink : Link;
  const componentProps = isExternal ? { href, target: "_blank", rel: "noreferrer" } : { to: route };

  return (
    <>
      <MKBox
        {...rest}
        mx={1}
        p={1}
        display="flex"
        alignItems="baseline"
        color={light ? "white" : "dark"}
        opacity={light ? 1 : 0.6}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          position: "relative",
          "&:hover .hover-underline": {
            width: "100%",
          },
        }}
        component={WrapperComponent}
        {...componentProps}
      >
        <MKTypography
          variant="body2"
          lineHeight={1}
          color="inherit"
          sx={{
            alignSelf: "center",
            color: "#1976d2",
            "& *": { verticalAlign: "middle", color: "#1976d2" },
          }}
        >
          {icon}
        </MKTypography>
        <MKTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ ml: 1, mr: 0.25, position: "relative", color: "#1976d2" }}
        >
          {name}
          <MKBox
            className="hover-underline"
            sx={{
              position: "absolute",
              bottom: -2,
              left: 0,
              width: "0%",
              height: "2px",
              backgroundColor: light ? "white" : "#344767",
              transition: "width 0.3s ease-in-out",
            }}
          />
        </MKTypography>
        <MKTypography variant="body2" color={light ? "white" : "dark"} ml="auto">
          <Icon sx={{ fontWeight: "normal", verticalAlign: "middle" }}>
            {collapse && "keyboard_arrow_down"}
          </Icon>
        </MKTypography>
      </MKBox>
      {children && (
        <Collapse in={Boolean(collapseStatus)} timeout={400} unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}

// Setting default values for the props of DefaultNavbarDropdown
DefaultNavbarDropdown.defaultProps = {
  children: false,
  collapseStatus: false,
  light: false,
  href: "",
  route: "",
};

// Typechecking props for the DefaultNavbarDropdown
DefaultNavbarDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.node,
  collapseStatus: PropTypes.bool,
  light: PropTypes.bool,
  href: PropTypes.string,
  route: PropTypes.string,
  collapse: PropTypes.bool.isRequired,
};

export default DefaultNavbarDropdown;
