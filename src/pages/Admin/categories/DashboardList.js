import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import categoryApi from "../../..//api/categoryApi"; // sesuaikan path

// === Fungsi bantu di luar komponen ===
const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return "Active";
    case 2:
      return "Inactive";
    default:
      return "NoStatus";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "success";
    case 2:
      return "default";
    default:
      return "warning";
  }
};

const DashboardListItem = ({ item, onEdit, onDelete }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6">{item.name}</Typography>
            <Chip
              label={getStatusLabel(item.rowstatus)}
              color={getStatusColor(item.rowstatus)}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="textSecondary">
              Created By
            </Typography>
            <Typography>{item.created_by}</Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(item.created_date).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">
              Modified By
            </Typography>
            <Typography>{item.modified_by}</Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(item.modified_date).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={1}>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" onClick={() => onEdit(item)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => onDelete(item)}>
                <Delete />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

DashboardListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const DashboardList = ({ onEdit, onDelete }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await categoryApi.getAll();
      console.log("API response:", response.data);
      setData(response.data.categories);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (item) => {
    if (window.confirm(`Hapus item "${item.name}"?`)) {
      try {
        await categoryApi.delete(item.id);
        setData((prev) => prev.filter((i) => i.id !== item.id));
        onDelete?.(item); // opsional, jika parent butuh callback
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={2}>
      {data.map((item) => (
        <DashboardListItem key={item.id} item={item} onEdit={onEdit} onDelete={handleDelete} />
      ))}
    </Box>
  );
};

DashboardList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func, // opsional jika tidak digunakan di parent
};

export default DashboardList;
