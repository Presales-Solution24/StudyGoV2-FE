import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.token) {
        localStorage.setItem("token", `Bearer ${res.data.token}`);
        navigate("/");
      } else {
        setErrorMsg("Token tidak ditemukan.");
      }
    } catch (err) {
      console.error("Login error:", err.response || err.message);
      setErrorMsg(err.response?.data?.message || "Login gagal");
    }
  };

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

              {errorMsg && (
                <MKTypography color="error" textAlign="center" mb={2}>
                  {errorMsg}
                </MKTypography>
              )}

              <MKBox component="form" role="form" onSubmit={handleSubmit}>
                <MKBox mb={2}>
                  <MKInput
                    type="email"
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </MKBox>
                <MKBox mb={2}>
                  <MKInput
                    type="password"
                    label="Password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                  <MKButton variant="gradient" color="info" fullWidth type="submit">
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
