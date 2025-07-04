import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Silakan login dulu.");
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch("https://lentera-be.solution-core.com/api/auth/info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (response.status === 401) {
          alert("Session habis. Silakan login ulang.");
          navigate("/login");
          return;
        }

        const data = await response.json();
        if (data.role !== "admin") {
          alert("Maaf akun anda tidak memiliki akses Admin, silakan kontak Presales :D");
          navigate("/");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        alert("Terjadi kesalahan. Silakan login ulang.");
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (loading) return null;

  return (
    <MKBox py={3}>
      <MKTypography variant="h4" fontWeight="bold" mb={2}>
        Dashboard Admin
      </MKTypography>
      <MKTypography variant="body1">Selamat datang di Admin Dashboard!</MKTypography>
    </MKBox>
  );
}

export default Dashboard;
