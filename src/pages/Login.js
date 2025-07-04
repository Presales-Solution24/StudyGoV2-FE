import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  Grid,
  Alert,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import MKBox from "components/MKBox";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(""); // error khusus username
  const navigate = useNavigate();

  const domain = "@ein.epson.co.id";

  const validateUsername = (value) => /^[a-zA-Z0-9_-]*$/.test(value);

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    if (validateUsername(value)) {
      setUsername(value);
      setUsernameError("");
    } else {
      setUsernameError("Hanya huruf, angka, _ atau - yang diperbolehkan.");
    }
  };

  const handleSendOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!username) {
      setErrorMsg("Username wajib diisi.");
      return;
    }

    const email = `${username}${domain}`;

    setLoading(true);
    try {
      const res = await axios.post("https://lentera-be.solution-core.com/api/auth/login-otp", {
        email,
      });
      setOtpSent(true);
      setSuccessMsg(res.data.message || "OTP berhasil dikirim ke email.");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal mengirim OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!otp) {
      setErrorMsg("OTP wajib diisi.");
      return;
    }

    const email = `${username}${domain}`;

    setLoading(true);
    try {
      const res = await axios.post("https://lentera-be.solution-core.com/api/auth/verify-otp", {
        email,
        otp,
      });
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      setSuccessMsg("Login berhasil! Mengalihkan...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setUsername("");
      setOtp("");
      setOtpSent(false);
      setErrorMsg("");
      setSuccessMsg("");
      setLoading(false);
      setUsernameError("");
    };
  }, []);

  return (
    <MKBox
      position="absolute"
      top={0}
      left={0}
      width="100%"
      minHeight="100vh"
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
              <Typography variant="h4" textAlign="center" gutterBottom>
                Login dengan OTP
              </Typography>

              <Typography
                variant="body2"
                textAlign="center"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                Masukkan username email EIN kamu tanpa domain @ein.epson.co.id dan verifikasi dengan
                OTP.
              </Typography>

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

              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={handleUsernameChange}
                  margin="normal"
                  required
                  disabled={otpSent}
                  helperText={
                    usernameError
                      ? usernameError
                      : `Email EIN : ${username || "<username>"}${domain}`
                  }
                  error={Boolean(usernameError)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{domain}</InputAdornment>,
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={handleSendOtp}
                  disabled={loading || otpSent || !username || Boolean(usernameError)}
                >
                  {loading && !otpSent ? <CircularProgress size={20} /> : "Kirim OTP"}
                </Button>

                {otpSent && (
                  <>
                    <TextField
                      fullWidth
                      label="OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      margin="normal"
                      required
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      color="primary"
                      type="submit"
                      sx={{ mt: 2 }}
                      disabled={loading}
                    >
                      {loading && otpSent ? <CircularProgress size={24} /> : "Login"}
                    </Button>
                  </>
                )}
              </form>

              <Typography textAlign="center" mt={3} fontSize="0.875rem">
                Belum punya akun?{" "}
                <Link to="/signup" style={{ color: "#1976d2", fontWeight: 500 }}>
                  Daftar sekarang
                </Link>
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </MKBox>
  );
}
