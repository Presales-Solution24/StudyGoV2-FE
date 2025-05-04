import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "api/axiosInstance";
import {
  Grid,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";

export default function SpecDefinitionForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    unit: "",
    better_preference: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/list");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  const fetchDefinition = async () => {
    try {
      const res = await axiosInstance.get(
        `/specification/definition/list?category_id=${formData.category_id}`
      );
      const definition = res.data.find((def) => def.id === parseInt(id));
      if (definition) {
        setFormData({
          category_id: String(definition.category_id),
          name: definition.name,
          unit: definition.unit,
          better_preference: definition.better_preference || "",
        });
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (id) fetchDefinition();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/specification/definition/save", {
        ...formData,
        id,
      });
      alert(res.data.message);
      navigate("/admin/spec-definition");
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
            {id ? "Edit Spesifikasi" : "Tambah Spesifikasi"}
          </Typography>

          <form onSubmit={handleSubmit}>
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

            <TextField
              fullWidth
              label="Nama Spesifikasi"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Satuan (Opsional)"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Preferensi Lebih Baik (Opsional)"
              name="better_preference"
              value={formData.better_preference}
              onChange={handleChange}
              margin="normal"
              placeholder="Contoh: 'lebih besar', 'lebih kecil'"
            />

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
