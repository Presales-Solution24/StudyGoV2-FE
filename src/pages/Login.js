import { useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { Link } from "react-router-dom";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <MKBox
      position="absolute"
      top={0}
      left={0}
      width="100%"
      minHeight="100vh"
      zIndex={1}
      sx={{
        backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
          `${linearGradient(
            rgba(gradients.dark.main, 0.6),
            rgba(gradients.dark.state, 0.6)
          )}, url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <MKBox
        px={2}
        width="100%"
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Grid container justifyContent="center">
          <Grid item xs={11} sm={9} md={4}>
            <Card sx={{ padding: 4 }}>
              <MKTypography variant="h4" textAlign="center" mb={2}>
                Sign in to your account
              </MKTypography>
              <MKBox component="form" role="form">
                <MKBox mb={2}>
                  <MKInput type="email" label="Email" fullWidth />
                </MKBox>
                <MKBox mb={2}>
                  <MKInput type="password" label="Password" fullWidth />
                </MKBox>
                <MKBox display="flex" alignItems="center" ml={-1} mb={2}>
                  <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                  <MKTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    onClick={handleSetRememberMe}
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;Remember me
                  </MKTypography>
                </MKBox>
                <MKBox mt={2} mb={1}>
                  <MKButton variant="gradient" color="info" fullWidth>
                    Sign In
                  </MKButton>
                </MKBox>
                <MKBox mt={3} textAlign="center">
                  <MKTypography variant="button" color="text">
                    Don&apos;t have an account?{" "}
                    <MKTypography
                      component={Link}
                      to="/signup"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      textGradient
                    >
                      Sign Up
                    </MKTypography>
                  </MKTypography>
                </MKBox>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </MKBox>
  );
}
