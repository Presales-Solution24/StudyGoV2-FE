import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardMedia, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";
import MKTypography from "../components/MKTypography";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Unauthorized. Silakan login dulu.");
        navigate("/login");
        return;
      }

      const response = await fetch("https://lentera-be.solution-core.com/api/category/list", {
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
      setCategories(data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/kategori/${categoryId}`);
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={10} px={{ xs: 1.5, sm: 2, md: 3 }}>
        <MKTypography variant="h3" textAlign="center" mb={4}>
          Pilih Kategori
        </MKTypography>

        {loading ? (
          <MKBox display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </MKBox>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {categories.map((cat) => (
              <Grid item xs={12} sm={6} md={4} key={cat.id}>
                <Card
                  onClick={() => handleCategoryClick(cat.id)}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "all 0.25s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px) scale(1.02)",
                      boxShadow: 8,
                    },
                  }}
                  elevation={3}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={`https://lentera-be.solution-core.com${cat.image_url}`}
                    alt={cat.name}
                    style={{ objectFit: "contain" }}
                  />
                  <CardContent>
                    <MKTypography variant="h5" textAlign="center">
                      {cat.name}
                    </MKTypography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </MKBox>
    </>
  );
}
