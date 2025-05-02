import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setErrorMsg("Semua field wajib diisi.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      setSuccessMsg("Registrasi berhasil! Mengalihkan ke halaman login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registrasi gagal");
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
                Create an account
              </MKTypography>

              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMsg}
                </Alert>
              )}
              {successMsg && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMsg}
                </Alert>
              )}

              <MKBox component="form" role="form" onSubmit={handleSubmit}>
                <MKBox mb={2}>
                  <MKInput
                    type="text"
                    label="Username"
                    fullWidth
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </MKBox>
                <MKBox mb={2}>
                  <MKInput
                    type="email"
                    label="Email"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </MKBox>
                <MKBox mb={2}>
                  <MKInput
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    fullWidth
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </MKBox>
                <MKBox mt={2} mb={1}>
                  <MKButton variant="gradient" color="info" fullWidth type="submit">
                    Sign Up
                  </MKButton>
                </MKBox>
                <MKBox mt={3} textAlign="center">
                  <MKTypography variant="button" color="text">
                    Already have an account?{" "}
                    <MKTypography
                      component={Link}
                      to="/login"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      textGradient
                    >
                      Sign In
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
