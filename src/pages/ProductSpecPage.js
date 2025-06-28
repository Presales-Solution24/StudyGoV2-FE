import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from "@mui/material";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";

const BASE_URL = "https://lentera-be.solution-core.com"; // Ganti sesuai domain backend kamu

export default function ProductSpecPage() {
  const { productId } = useParams();
  const [specs, setSpecs] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [specRes, productRes] = await Promise.all([
          axiosInstance.get("/specification/value/list", {
            params: { product_id: productId },
          }),
          axiosInstance.get(`/product/get/${productId}`),
        ]);

        if (specRes.data && Array.isArray(specRes.data)) {
          setSpecs(specRes.data);
        }

        if (productRes.data) {
          setProduct(productRes.data);
        }
      } catch (err) {
        console.error("Gagal memuat data produk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const fullImageUrl = product?.image_url ? `${BASE_URL}${product.image_url}` : null;

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={10} px={{ xs: 1.5, sm: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : !product ? (
          <Typography textAlign="center">Produk tidak ditemukan.</Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Card>
                  {fullImageUrl && (
                    <CardMedia
                      component="img"
                      height="300"
                      image={fullImageUrl}
                      alt={product.name}
                      sx={{ objectFit: "contain" }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      {product.brand || "-"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Kategori: {product.category_name || "-"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h5" mt={5} mb={2} textAlign="center">
              Spesifikasi Produk
            </Typography>

            {specs.length === 0 ? (
              <Typography textAlign="center" mt={3}>
                Tidak ada spesifikasi tersedia.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Spesifikasi</TableCell>
                      <TableCell>Nilai</TableCell>
                      <TableCell>Unit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {specs.map((spec, index) => (
                      <TableRow key={spec.specification_id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{spec.name}</TableCell>
                        <TableCell>{spec.value ?? "-"}</TableCell>
                        <TableCell>{spec.unit || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </MKBox>
    </>
  );
}
