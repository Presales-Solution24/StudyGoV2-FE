import { Box, Button } from "@mui/material";

import CategoryList from "./categoryList";
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };
  const navigate = useNavigate();
  return (
    <Box p={2}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin/categories/create")}
      >
        Tambah Data
      </Button>
      <CategoryList onEdit={handleEdit} />
    </Box>
  );
};

export default DashboardPage;
