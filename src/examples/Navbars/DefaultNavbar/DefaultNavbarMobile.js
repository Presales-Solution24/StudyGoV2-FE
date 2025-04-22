import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// @mui components
import Collapse from "@mui/material/Collapse";
import MuiLink from "@mui/material/Link";

// Material Kit 2 components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Navbar dropdown component
import DefaultNavbarDropdown from "examples/Navbars/DefaultNavbar/DefaultNavbarDropdown";

function DefaultNavbarMobile({ routes, open }) {
  const [collapse, setCollapse] = useState("");

  const handleSetCollapse = (name) => {
    setCollapse(collapse === name ? "" : name);
  };

  const renderNavbarItems = routes
    .filter((route) => route.name) // hanya item dengan name valid
    .map(({ name, icon, collapse: routeCollapses, href, route, collapse: navCollapse }) => (
      <DefaultNavbarDropdown
        key={name}
        name={name}
        icon={icon}
        collapseStatus={collapse === name}
        onClick={() => handleSetCollapse(name)}
        href={href}
        route={route}
        collapse={Boolean(navCollapse)}
      >
        {routeCollapses && (
          <MKBox sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            {routeCollapses.map((section) => (
              <MKBox key={section.key || section.name} px={2} py={1}>
                {section.collapse ? (
                  <>
                    <MKTypography
                      display="block"
                      variant="button"
                      fontWeight="bold"
                      textTransform="capitalize"
                      py={1}
                      px={0.5}
                    >
                      {section.name}
                    </MKTypography>
                    {section.collapse.map((item) => (
                      <MKTypography
                        key={item.name}
                        component={item.route ? Link : MuiLink}
                        to={item.route || ""}
                        href={item.href || ""}
                        target={item.href ? "_blank" : ""}
                        rel={item.href ? "noreferrer" : ""}
                        display="block"
                        variant="button"
                        color="text"
                        fontWeight="regular"
                        py={0.625}
                        px={2}
                        sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                          borderRadius: borderRadius.md,
                          cursor: "pointer",
                          transition: "all 300ms ease",
                          "&:hover": {
                            backgroundColor: grey[200],
                            color: dark.main,
                          },
                        })}
                      >
                        {item.name}
                      </MKTypography>
                    ))}
                  </>
                ) : (
                  <MKBox
                    component={section.route ? Link : MuiLink}
                    to={section.route || ""}
                    href={section.href || ""}
                    target={section.href ? "_blank" : ""}
                    rel={section.href ? "noreferrer" : ""}
                    sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                      borderRadius: borderRadius.md,
                      cursor: "pointer",
                      transition: "all 300ms ease",
                      py: 1,
                      px: 1.625,
                      "&:hover": {
                        backgroundColor: grey[200],
                        color: dark.main,
                        "& *": {
                          color: dark.main,
                        },
                      },
                    })}
                  >
                    <MKTypography
                      display="block"
                      variant="button"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      {section.name}
                    </MKTypography>
                    {section.description && (
                      <MKTypography
                        display="block"
                        variant="button"
                        color="text"
                        fontWeight="regular"
                        sx={{ transition: "all 300ms ease" }}
                      >
                        {section.description}
                      </MKTypography>
                    )}
                  </MKBox>
                )}
              </MKBox>
            ))}
          </MKBox>
        )}
      </DefaultNavbarDropdown>
    ));

  return (
    <Collapse in={Boolean(open)} timeout="auto" unmountOnExit>
      <MKBox width="calc(100% + 1.625rem)" my={2} ml={-2}>
        {renderNavbarItems}
      </MKBox>
    </Collapse>
  );
}

DefaultNavbarMobile.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};

export default DefaultNavbarMobile;
