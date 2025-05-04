import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "api/axiosInstance";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

export default function SpecDefinitionIndex() {
  const [definitions, setDefinitions] = useState([]);
  const categoryId = 1; // bisa diganti dinamis nanti
  const navigate = useNavigate();

  const fetchDefinitions = async () => {
    try {
      const res = await axiosInstance.get(
        `/specification/definition/list?category_id=${categoryId}`
      );
      setDefinitions(res.data);
    } catch (err) {
      console.error("Gagal memuat data spesifikasi:", err);
    }
  };

  useEffect(() => {
    fetchDefinitions();
  }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Specification Definitions</Typography>
        <Button
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/spec-definition/create")}
        >
          Tambah
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {definitions.map((def, index) => (
              <TableRow key={def.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{def.name}</TableCell>
                <TableCell>{def.unit || "-"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/admin/spec-definition/edit/${def.id}`)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {definitions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
