import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";

export default function ContentForm() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [contentData, setContentData] = useState({
    title: "",
    description: "",
    content_type: "",
    category_id: "",
    product_id: "",
    file: null,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axiosInstance.get("/category/list");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await axiosInstance.get("/product/list");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setContentData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoadingSubmit(true);

    const formData = new FormData();
    formData.append("title", contentData.title);
    formData.append("description", contentData.description);
    formData.append("content_type", contentData.content_type);
    formData.append("category_id", contentData.category_id);
    formData.append("product_id", contentData.product_id);
    formData.append("file", contentData.file);

    try {
      const response = await axiosInstance.post("/content/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccessMessage(response.data.message);
      setContentData({
        title: "",
        description: "",
        content_type: "",
        category_id: "",
        product_id: "",
        file: null,
      });
    } catch (error) {
      setError("Gagal meng-upload konten. Pastikan semua field sudah benar.");
      console.error("Error uploading content", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Tambah Konten
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <TextField
        label="Judul"
        variant="outlined"
        fullWidth
        name="title"
        value={contentData.title}
        onChange={handleInputChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        label="Deskripsi"
        variant="outlined"
        fullWidth
        name="description"
        value={contentData.description}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel id="content-type-label">Jenis Konten</InputLabel>
        <Select
          labelId="content-type-label"
          id="content-type"
          name="content_type"
          value={contentData.content_type}
          label="Jenis Konten"
          onChange={handleInputChange}
          sx={{ height: 56, display: "flex", alignItems: "center" }}
        >
          <MenuItem value="video">Video Tutorial</MenuItem>
          <MenuItem value="saleskit">Saleskit Flyer</MenuItem>
          <MenuItem value="saleskit_pdf">Saleskit PDF</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="category-label">Kategori</InputLabel>
        <Select
          labelId="category-label"
          label="Kategori"
          name="category_id"
          value={contentData.category_id}
          onChange={handleInputChange}
          sx={{ height: 56, display: "flex", alignItems: "center" }}
          required
        >
          {loadingCategories ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))
          )}
        </Select>
        <FormHelperText>Pilih kategori dari daftar</FormHelperText>
      </FormControl>

      {/* Produk Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="product-label">Produk</InputLabel>
        <Select
          labelId="product-label"
          label="Produk"
          name="product_id"
          value={contentData.product_id}
          onChange={handleInputChange}
          sx={{ height: 56, display: "flex", alignItems: "center" }}
          required
        >
          {loadingProducts ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))
          )}
        </Select>
        <FormHelperText>Pilih produk dari daftar</FormHelperText>
      </FormControl>

      <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
        Pilih File
        <input
          type="file"
          hidden
          accept=".jpg,.png,.pdf,.mp4"
          name="file"
          onChange={handleFileChange}
          required
        />
      </Button>

      <Button variant="contained" color="primary" type="submit" fullWidth disabled={loadingSubmit}>
        {loadingSubmit ? "Menyimpan..." : "Simpan Konten"}
      </Button>
    </Box>
  );
}
