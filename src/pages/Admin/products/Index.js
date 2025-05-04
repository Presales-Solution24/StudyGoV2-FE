import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "api/axiosInstance";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function ProductIndex() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/product/list");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Gagal memuat data produk:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await axiosInstance.delete(`/product/delete/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Gagal menghapus produk:", err);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Daftar Produk</Typography>
        <Button
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/products/create")}
        >
          Tambah Produk
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama Produk</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Tidak ada data produk.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  {/* <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
