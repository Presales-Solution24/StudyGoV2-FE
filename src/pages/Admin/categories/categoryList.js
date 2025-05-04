import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import axiosInstance from "../../../api/axiosInstance"; // pastikan path sesuai

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/list"); // endpoint categories
      // Misal responsenya: { categories: [{ id, name, url }, ...] }
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Daftar Kategori
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama Kategori</TableCell>
              <TableCell>URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Link href={category.image_url} target="_blank" rel="noopener">
                      {category.image_url}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
