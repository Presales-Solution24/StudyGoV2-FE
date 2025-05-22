import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Card, CardMedia, CardContent, CircularProgress, Typography } from "@mui/material";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";
import MKTypography from "../components/MKTypography";
import axiosInstance from "../api/axiosInstance";

export default function ProductTypePage() {
  const { id } = useParams(); // kategori_id dari URL
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:5000"; // atau sesuaikan dengan base API kamu

  useEffect(() => {
    const fetchProductsAndCategory = async () => {
      try {
        // Ambil nama kategori
        const categoryRes = await axiosInstance.get(`/category/get/${id}`);
        setCategoryName(categoryRes.data?.name || "Kategori Tidak Ditemukan");

        // Ambil produk berdasarkan kategori
        const productRes = await axiosInstance.get("/product/list", {
          params: { category_id: id },
        });
        setProducts(productRes.data.products || []);
      } catch (err) {
        console.error("Gagal memuat produk atau kategori:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategory();
  }, [id]);

  const handleProductClick = (productId) => {
    navigate(`/produk/${productId}/spesifikasi`); // arahkan ke halaman spesifikasi produk
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={10} px={{ xs: 1.5, sm: 2, md: 3 }}>
        <MKTypography variant="h3" textAlign="center" mb={4}>
          {loading ? <CircularProgress size={30} /> : `Produk ${categoryName}`}
        </MKTypography>

        {!loading && (
          <Grid container spacing={3} justifyContent="center">
            {products.length === 0 ? (
              <Typography variant="body1" textAlign="center">
                Tidak ada produk untuk kategori ini.
              </Typography>
            ) : (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card
                    onClick={() => handleProductClick(product.id)}
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={`${BASE_URL}${product.image_url}`}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6" align="center">
                        {product.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </MKBox>
    </>
  );
}
