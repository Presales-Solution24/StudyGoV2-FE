import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Card, Grid, InputAdornment, IconButton, Alert, CircularProgress } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoadingRegister(true);

    const { username, email, password } = formData;
    if (!username || !email || !password) {
      setErrorMsg("Semua field wajib diisi.");
      setLoadingRegister(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register-otp", formData);
      setIsOtpSent(true);
      setSuccessMsg("OTP berhasil dikirim ke email.");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoadingVerify(true);

    if (!otp) {
      setErrorMsg("Masukkan OTP terlebih dahulu.");
      setLoadingVerify(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: formData.email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      setSuccessMsg("Verifikasi berhasil. Mengalihkan...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "OTP salah atau verifikasi gagal.");
    } finally {
      setLoadingVerify(false);
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
                {isOtpSent ? "Verifikasi OTP" : "Create an Account"}
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

              <MKBox component="form" role="form" onSubmit={handleRegister}>
                {!isOtpSent ? (
                  <>
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
                      <MKButton
                        variant="gradient"
                        color="info"
                        fullWidth
                        type="submit"
                        disabled={loadingRegister}
                      >
                        {loadingRegister ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Daftar & Kirim OTP"
                        )}
                      </MKButton>
                    </MKBox>
                  </>
                ) : (
                  <>
                    <MKBox mb={2}>
                      <MKInput
                        type="text"
                        label="Masukkan OTP"
                        fullWidth
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </MKBox>
                    <MKBox mt={2} mb={1}>
                      <MKButton
                        variant="gradient"
                        color="info"
                        fullWidth
                        onClick={handleVerifyOtp}
                        disabled={loadingVerify}
                      >
                        {loadingVerify ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Verifikasi OTP"
                        )}
                      </MKButton>
                    </MKBox>
                  </>
                )}
              </MKBox>

              {!isOtpSent && (
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
              )}
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </MKBox>
  );
}
