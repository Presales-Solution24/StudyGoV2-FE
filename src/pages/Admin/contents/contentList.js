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
  IconButton,
  Button,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance"; // Pastikan axiosInstance sudah include token Authorization

export default function ContentList() {
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]); // Untuk menyimpan kategori
  const [products, setProducts] = useState([]); // Untuk menyimpan produk
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const BASE_URL = "https://lentera-be.solution-core.com"; // Ganti jika environment berbeda

  // Fetch daftar konten
  const fetchContents = async () => {
    try {
      const res = await axiosInstance.get("/content/list"); // endpoint API backend kamu
      setContents(res.data || []);
    } catch (err) {
      console.error("Gagal memuat konten:", err);
    }
  };

  // Fetch kategori dan produk (jika kamu perlu menampilkannya)
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/list");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/product/list");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Gagal memuat data produk:", err);
    }
  };

  useEffect(() => {
    fetchContents();
    fetchCategories();
    fetchProducts();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  const getProductName = (productId) => {
    const product = products.find((prod) => prod.id === productId);
    return product ? product.name : "N/A";
  };

  const getFilePreview = (contentType, fileUrl) => {
    if (contentType === "image") {
      return (
        <img src={fileUrl} alt="Preview" style={{ width: 50, height: 50, objectFit: "cover" }} />
      );
    } else if (contentType === "pdf") {
      return (
        <Button variant="contained" color="primary" href={fileUrl} target="_blank">
          PDF
        </Button>
      );
    } else if (contentType === "video") {
      return (
        <Button variant="contained" color="primary" href={fileUrl} target="_blank">
          Video
        </Button>
      );
    }
    return null;
  };

  return (
    <Box p={isMobile ? 2 : 0}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant={isMobile ? "h5" : "h4"}>Daftar Konten</Typography>
        <Button
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/contents/create")}
        >
          Tambah
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Judul</TableCell>
              <TableCell>Jenis</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Produk</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            ) : (
              contents.map((content, index) => {
                const fullFileUrl = `${BASE_URL}${content.file_url}`;
                return (
                  <TableRow key={content.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{content.title}</TableCell>
                    <TableCell>{content.content_type}</TableCell>
                    <TableCell>{getCategoryName(content.category_id)}</TableCell>
                    <TableCell>{getProductName(content.product_id)}</TableCell>
                    <TableCell>{getFilePreview(content.content_type, fullFileUrl)}</TableCell>
                    <TableCell>{content.views}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/admin/contents/edit/${content.id}`)}>
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
