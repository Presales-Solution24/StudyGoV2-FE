import { Box, Button } from "@mui/material";

import DashboardList from "./DashboardList";
import React from "react";

const DashboardPage = () => {
  const handleAdd = () => {
    console.log("Tambah data");
  };

  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  return (
    <Box p={2}>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAdd}>
        Tambah Data
      </Button>
      <DashboardList onEdit={handleEdit} />
    </Box>
  );
};

export default DashboardPage;
