import React from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";

export default function CategoryPage() {
  const { categoryId } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <Typography variant="h4">Halaman Kategori: {categoryId}</Typography>
    </div>
  );
}
