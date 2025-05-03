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
} from "@mui/material";

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
      setFormData({ name, brand, category_id });
      if (image_url) setPreviewUrl(`${axiosInstance.defaults.baseURL}${image_url}`);
    } catch (err) {
      console.error("Gagal memuat detail produk:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError("");

    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setImage(null);
        setPreviewUrl(null);
        setImageError("Tipe file tidak valid. Gunakan JPG, PNG, atau GIF.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setImage(null);
        setPreviewUrl(null);
        setImageError(`Ukuran gambar maksimal ${MAX_IMAGE_SIZE_MB}MB.`);
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    if (id) payload.append("id", id);
    payload.append("name", formData.name);
    payload.append("brand", formData.brand);
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
          <Typography variant="h5" mb={2}>
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
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload Gambar
              <input hidden type="file" accept="image/*" onChange={handleImageChange} />
            </Button>

            {imageError && (
              <Typography mt={1} color="error" fontSize={14}>
                {imageError}
              </Typography>
            )}

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: 250,
                  objectFit: "contain",
                  marginTop: 12,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Simpan"}
            </Button>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
}
