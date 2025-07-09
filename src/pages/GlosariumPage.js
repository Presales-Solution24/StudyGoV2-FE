import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";
import MKTypography from "../components/MKTypography";
import axiosInstance from "../api/axiosInstance";

export default function GlosariumPage() {
  const { id } = useParams();
  const [glossary, setGlossary] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlossary = async () => {
      try {
        const [categoryRes, glossaryRes] = await Promise.all([
          axiosInstance.get(`/category/get/${id}`),
          axiosInstance.get(`/glossary/list`, {
            params: { category_id: id },
          }),
        ]);

        setCategoryName(categoryRes.data?.name || "Kategori Tidak Ditemukan");
        setGlossary(glossaryRes.data.glossaries || []);
      } catch (error) {
        console.error("Gagal memuat glosarium:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlossary();
  }, [id]);

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={10} px={{ xs: 2, sm: 4 }}>
        <MKTypography variant="h3" textAlign="center" mb={4}>
          Glosarium {categoryName}
        </MKTypography>

        {loading ? (
          <MKBox display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </MKBox>
        ) : glossary.length === 0 ? (
          <Typography variant="body1" textAlign="center">
            Belum ada data glosarium.
          </Typography>
        ) : (
          glossary.map((item, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{item.term}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{item.definition}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </MKBox>
    </>
  );
}
