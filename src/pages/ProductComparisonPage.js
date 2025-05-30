// src/pages/ProductComparisonPage.js

import React, { useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";
import MKTypography from "../components/MKTypography";

export default function ProductComparisonPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [productA, setProductA] = useState("");
  const [productB, setProductB] = useState("");
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategoryName = async () => {
    try {
      const res = await axiosInstance.get("/category/list");
      const category = res.data.categories.find((cat) => String(cat.id) === categoryId);
      setCategoryName(category ? category.name : "Kategori Tidak Ditemukan");
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/product/list", {
        params: { rowstatus: 1 },
      });
      const filtered = res.data.products.filter((prod) => String(prod.category_id) === categoryId);
      setProducts(filtered);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    }
  };

  const compareProducts = async (idA, idB) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/specification/compare", {
        params: {
          product_a: idA,
          product_b: idB,
        },
      });
      setComparison(res.data);
    } catch (err) {
      console.error("Gagal membandingkan produk:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryName();
    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    if (productA && productB) {
      compareProducts(productA, productB);
    }
  }, [productA, productB]);

  const getProductName = (id) => {
    const product = products.find((p) => p.id === id);
    return product ? product.name : "Produk tidak ditemukan";
  };

  const getProductImage = (id) => {
    const product = products.find((p) => p.id === id);
    return product?.image_url || "";
  };

  const highlightWinner = (spec) => {
    const { value_a, value_b, better_preference } = spec;

    if (value_a == null || value_b == null) return "tie";

    const numA = parseFloat(value_a);
    const numB = parseFloat(value_b);

    if (isNaN(numA) || isNaN(numB)) return "tie";

    if (better_preference === "higher") {
      return numA > numB ? "A" : numA < numB ? "B" : "tie";
    } else if (better_preference === "lower") {
      return numA < numB ? "A" : numA > numB ? "B" : "tie";
    }

    return "tie";
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={10} px={{ xs: 2, sm: 4 }}>
        <MKTypography variant="h4" textAlign="center" mb={1}>
          Komparasi Produk
        </MKTypography>
        <Typography textAlign="center" color="text.secondary" mb={4}>
          Kategori: <strong>{categoryName}</strong>
        </Typography>

        <Grid container spacing={3} justifyContent="center" mb={4}>
          {/* Produk A */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="produk-a-label">Pilih Produk A</InputLabel>
              <Select
                labelId="produk-a-label"
                value={productA}
                label="Pilih Produk A"
                onChange={(e) => setProductA(e.target.value)}
                margin="normal"
                sx={{ minHeight: 50 }}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {productA && (
              <MKBox mt={2} textAlign="center">
                <img
                  src={`http://localhost:5000${getProductImage(productA)}`}
                  alt="Produk A"
                  style={{ maxWidth: "100%", height: 200, objectFit: "contain" }}
                />
                <Typography variant="subtitle2" mt={1}>
                  {getProductName(productA)}
                </Typography>
              </MKBox>
            )}
          </Grid>

          {/* Produk B */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="produk-b-label">Pilih Produk B</InputLabel>
              <Select
                labelId="produk-b-label"
                value={productB}
                label="Pilih Produk B"
                onChange={(e) => setProductB(e.target.value)}
                margin="normal"
                sx={{ minHeight: 50 }}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {productB && (
              <MKBox mt={2} textAlign="center">
                <img
                  src={`http://localhost:5000${getProductImage(productB)}`}
                  alt="Produk B"
                  style={{ maxWidth: "100%", height: 200, objectFit: "contain" }}
                />
                <Typography variant="subtitle2" mt={1}>
                  {getProductName(productB)}
                </Typography>
              </MKBox>
            )}
          </Grid>
        </Grid>

        {productA && productB && (
          <Typography textAlign="center" mb={2}>
            Membandingkan: <strong>{getProductName(productA)}</strong> <em>vs</em>{" "}
            <strong>{getProductName(productB)}</strong>
          </Typography>
        )}

        {loading ? (
          <MKBox display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </MKBox>
        ) : comparison.length > 0 ? (
          <Paper elevation={3}>
            <MKBox sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Spesifikasi</TableCell>
                    <TableCell align="center">{getProductName(productA)}</TableCell>
                    <TableCell align="center">{getProductName(productB)}</TableCell>
                    <TableCell align="center">Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comparison.map((spec, index) => {
                    const winner = highlightWinner(spec);
                    return (
                      <TableRow key={spec.specification_id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{spec.name}</TableCell>
                        <TableCell
                          align="center"
                          style={{
                            backgroundColor: winner === "A" ? "#d0f0c0" : "inherit",
                          }}
                        >
                          {spec.value_a ?? "N/A"}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            backgroundColor: winner === "B" ? "#d0f0c0" : "inherit",
                          }}
                        >
                          {spec.value_b ?? "N/A"}
                        </TableCell>
                        <TableCell align="center">{spec.unit || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </MKBox>
          </Paper>
        ) : productA && productB ? (
          <MKTypography textAlign="center" mt={3}>
            Tidak ada data spesifikasi untuk produk ini.
          </MKTypography>
        ) : null}
      </MKBox>
    </>
  );
}
