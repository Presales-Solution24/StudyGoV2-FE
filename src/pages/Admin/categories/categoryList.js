import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Link,
  IconButton,
  Button,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const BASE_URL = "https://lentera-be.solution-core.com"; // Ganti sesuai server kamu

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/list");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box p={isMobile ? 2 : 3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant={isMobile ? "h5" : "h4"}>Daftar Kategori</Typography>
        <Button
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/categories/create")}
        >
          Tambah
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama Kategori</TableCell>
              <TableCell>Gambar</TableCell>
              <TableCell>URL Gambar</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => {
                const fullImageUrl = `${BASE_URL}${category.image_url}`;
                return (
                  <TableRow key={category.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        alt={category.name}
                        src={fullImageUrl}
                        sx={{ width: 56, height: 56 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Link href={fullImageUrl} target="_blank" rel="noopener">
                        {category.image_url}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/admin/categories/edit/${category.id}`)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
