import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "api/axiosInstance";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <MKBox p={3}>
      <MKTypography variant="h4" mb={2}>
        Daftar Produk
      </MKTypography>

      <MKButton color="info" onClick={() => navigate("/admin/products/create")} sx={{ mb: 2 }}>
        Tambah Produk
      </MKButton>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Nama Produk</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MKBox>
  );
}
