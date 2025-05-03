import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MKTypography from "components/MKTypography";
import categoryApi from "api/categoryApi";
import { useState } from "react";

// eslint-disable-next-line react/prop-types

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", imageUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.imageUrl) {
      setCategories([...categories, newCategory]);
      setNewCategory({ name: "", imageUrl: "" });
    }
  };

  const handleEditCategory = (index) => {
    setNewCategory(categories[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleUpdateCategory = () => {
    if (newCategory.name && newCategory.imageUrl) {
      const updatedCategories = [...categories];
      updatedCategories[editIndex] = newCategory;
      setCategories(updatedCategories);
      setNewCategory({ name: "", imageUrl: "" });
      setIsEditing(false);
      setEditIndex(null);
    }
  };

  const handleDeleteCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  return (
    <Box>
      <MKTypography variant="h4" mb={4}>
        Manajemen Kategori
      </MKTypography>

      {/* Form Tambah / Edit */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Nama Kategori"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="URL Gambar"
                name="imageUrl"
                value={newCategory.imageUrl}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color={isEditing ? "warning" : "primary"}
                fullWidth
                sx={{ height: "100%" }}
                startIcon={isEditing ? <EditIcon /> : <AddIcon />}
                onClick={isEditing ? handleUpdateCategory : handleAddCategory}
              >
                {isEditing ? "Update" : "Tambah"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* List Kategori */}
      <Grid container spacing={3}>
        {categories.map((cat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Typography variant="h6" mt={2}>
                  {cat.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="warning"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditCategory(index)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteCategory(index)}
                >
                  Hapus
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CategoriesPage;
