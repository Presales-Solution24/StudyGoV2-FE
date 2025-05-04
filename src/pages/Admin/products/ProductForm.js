import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "api/axiosInstance";
import {
  Grid,
  Card,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import imageCompression from "browser-image-compression";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category_id: "",
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const MAX_IMAGE_SIZE_MB = 2;
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

  useEffect(() => {
    fetchCategories();
    if (id) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/list");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/product/get/${id}`);
      const { name, brand, category_id, image_url } = res.data;
      setFormData({ name, brand, category_id: String(category_id) });
      if (image_url) setPreviewUrl(`${axiosInstance.defaults.baseURL}${image_url}`);
    } catch (err) {
      console.error("Gagal memuat detail produk:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageError("");
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImage(null);
      setPreviewUrl(null);
      setImageError("Tipe file tidak valid. Gunakan JPG, PNG, atau GIF.");
      return;
    }

    try {
      let finalImage = file;

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        const options = {
          maxSizeMB: MAX_IMAGE_SIZE_MB,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        finalImage = await imageCompression(file, options);
        setImageError(
          `Gambar dikompresi dari ${(file.size / 1024 / 1024).toFixed(2)}MB menjadi ${(
            finalImage.size /
            1024 /
            1024
          ).toFixed(2)}MB`
        );
      }

      setImage(finalImage);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(finalImage);
    } catch (err) {
      console.error("Gagal mengompresi gambar:", err);
      setImageError("Gagal mengompresi gambar");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.brand || !formData.category_id) {
      alert("Nama, Brand, dan Kategori wajib diisi.");
      setLoading(false);
      return;
    }

    const payload = new FormData();
    if (id) payload.append("id", id);
    payload.append("name", formData.name.trim());
    payload.append("brand", formData.brand.trim());
    payload.append("category_id", formData.category_id);
    if (image) payload.append("image", image);

    try {
      const res = await axiosInstance.post("/product/save", payload);
      alert(res.data.message);
      navigate("/admin/products");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            {id ? "Edit Produk" : "Tambah Produk"}
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
              fullWidth
              label="Nama Produk"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Kategori"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                ".MuiInputBase-root": {
                  minHeight: 50,
                  display: "flex",
                  alignItems: "center",
                },
                ".MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  py: 1.5,
                },
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{ mt: 3 }}
              fullWidth
            >
              Upload Gambar
              <input hidden type="file" accept="image/*" onChange={handleImageChange} />
            </Button>

            {imageError && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {imageError}
              </Alert>
            )}

            {previewUrl && (
              <Box mt={2}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 250,
                    objectFit: "contain",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 4, color: "white" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Simpan Produk"}
            </Button>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
}
