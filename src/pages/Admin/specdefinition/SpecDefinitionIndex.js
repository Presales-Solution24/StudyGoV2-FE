import { useEffect, useState } from "react";
import axiosInstance from "api/axiosInstance";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
// import AddIcon from "@mui/icons-material/Add";

export default function SpecDefinitionPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "", unit: "", better_preference: "" });
  const [isEdit, setIsEdit] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/list");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  const fetchDefinitions = async (categoryId) => {
    try {
      const res = await axiosInstance.get(
        `/specification/definition/list?category_id=${categoryId}`
      );
      setDefinitions(res.data || []);
    } catch (err) {
      console.error("Gagal memuat data spesifikasi:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !selectedCategory) return alert("Nama dan kategori wajib diisi.");

      const payload = {
        ...formData,
        category_id: selectedCategory,
      };

      const res = await axiosInstance.post("/specification/definition/save", payload);
      alert(res.data.message);
      fetchDefinitions(selectedCategory);
      setFormData({ id: null, name: "", unit: "", better_preference: "" });
      setIsEdit(false);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan data.");
    }
  };

  const handleEdit = (def) => {
    setFormData(def);
    setIsEdit(true);
  };

  const handleCancel = () => {
    setFormData({ id: null, name: "", unit: "", better_preference: "" });
    setIsEdit(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) fetchDefinitions(selectedCategory);
    else setDefinitions([]);
  }, [selectedCategory]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Specification Definitions
      </Typography>

      <TextField
        select
        fullWidth
        label="Pilih Kategori"
        value={selectedCategory}
        sx={{ ".MuiInputBase-root": { minHeight: 50 } }}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setFormData({ id: null, name: "", unit: "", better_preference: "" });
          setIsEdit(false);
        }}
        margin="normal"
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      {selectedCategory && (
        <>
          <Box component="form" noValidate autoComplete="off" mt={2} mb={3}>
            <Typography variant="h6">
              {isEdit ? "Edit Spesifikasi" : "Tambah Spesifikasi"}
            </Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Nama"
                  fullWidth
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Unit"
                  fullWidth
                  value={formData.unit || ""}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Better Preference"
                  select
                  fullWidth
                  value={formData.better_preference || ""}
                  sx={{ ".MuiInputBase-root": { minHeight: 45 } }}
                  onChange={(e) => setFormData({ ...formData, better_preference: e.target.value })}
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value="higher">Higher is better</MenuItem>
                  <MenuItem value="lower">Lower is better</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md="auto">
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                >
                  {isEdit ? "Update" : "Simpan"}
                </Button>
              </Grid>
              {isEdit && (
                <Grid item xs={12} md="auto">
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Batal
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Better Preference</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {definitions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  definitions.map((def, index) => (
                    <TableRow key={def.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{def.name}</TableCell>
                      <TableCell>{def.unit || "-"}</TableCell>
                      <TableCell>{def.better_preference || "-"}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(def)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
