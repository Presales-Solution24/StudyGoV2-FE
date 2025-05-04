import { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
} from "@mui/material";

export default function SpecValueForm() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [specifications, setSpecifications] = useState([]);
  const [originalSpecifications, setOriginalSpecifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/list");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  const fetchProducts = async (categoryId) => {
    try {
      const res = await axiosInstance.get("/product/list", {
        params: { category_id: categoryId },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    }
  };

  const fetchSpecifications = async (productId) => {
    try {
      const res = await axiosInstance.get("/specification/value/list", {
        params: { product_id: productId },
      });
      setSpecifications(res.data || []);
      setOriginalSpecifications(JSON.parse(JSON.stringify(res.data || [])));
    } catch (err) {
      console.error("Gagal memuat spesifikasi:", err);
    }
  };

  const handleValueChange = (index, newValue) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[index].value = newValue;
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        product_id: selectedProduct,
        specifications: specifications.map((spec) => ({
          specification_id: spec.specification_id,
          value: spec.value,
        })),
      };
      const res = await axiosInstance.post("/specification/value/save", payload);
      alert(res.data.message);
      setEditMode(false);
      setOriginalSpecifications(specifications);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSpecifications(JSON.parse(JSON.stringify(originalSpecifications)));
    setEditMode(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedProduct("");
      setSpecifications([]);
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedProduct) {
      setEditMode(false); // Reset edit mode setiap kali produk berubah
      fetchSpecifications(selectedProduct);
    }
  }, [selectedProduct]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Nilai Spesifikasi Produk
      </Typography>

      <TextField
        select
        label="Pilih Kategori"
        fullWidth
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        margin="normal"
        sx={{ ".MuiInputBase-root": { minHeight: 50 } }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      {selectedCategory && (
        <TextField
          select
          label="Pilih Produk"
          fullWidth
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          margin="normal"
          sx={{ ".MuiInputBase-root": { minHeight: 50 } }}
        >
          {products.map((prod) => (
            <MenuItem key={prod.id} value={prod.id}>
              {prod.name}
            </MenuItem>
          ))}
        </TextField>
      )}

      {selectedProduct && (
        <>
          <TableContainer component={Paper} sx={{ mt: 3, overflowX: "auto" }}>
            <Table>
              <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ minWidth: 40 }}>No</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Nama Spesifikasi</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>Nilai</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {specifications.map((spec, index) => (
                  <TableRow key={spec.specification_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{spec.name}</TableCell>
                    <TableCell>
                      {editMode ? (
                        <TextField
                          fullWidth
                          size="small"
                          InputProps={{ sx: { fontSize: 14, py: 1 } }}
                          value={spec.value ?? ""}
                          onChange={(e) => handleValueChange(index, e.target.value)}
                        />
                      ) : (
                        spec.value ?? "-"
                      )}
                    </TableCell>
                    <TableCell>{spec.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" spacing={2} mt={3}>
            {!editMode ? (
              <Button variant="contained" color="info" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCancel}>
                  Batal
                </Button>
              </>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}
