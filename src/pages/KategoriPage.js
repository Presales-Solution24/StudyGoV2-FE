import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, CardMedia, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";
import MKTypography from "../components/MKTypography";
import axiosInstance from "../api/axiosInstance";
import ProductTypeIcon from "../assets/images/Icon/ProductTypeNew.png";
import VideoTutorialIcon from "../assets/images/Icon/video-tutorial.png";
import SaleskitIcon from "../assets/images/Icon/flyers.png";
import PDFIcon from "../assets/images/Icon/pdf.png";
import ComparisonIcon from "../assets/images/Icon/comparison.png";
import GlosariumIcon from "../assets/images/Icon/IconGlosarium.png";

export default function KategoriPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/list");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const category = categories.find((cat) => String(cat.id) === id);
  const categoryName = category?.name || "Kategori Tidak Ditemukan";

  const contentTypes = [
    {
      title: "Spesifikasi Produk",
      image: ProductTypeIcon,
      type: "product-types",
    },
    {
      title: "Video Tutorial",
      image: VideoTutorialIcon,
      type: "video",
    },
    {
      title: "Saleskit",
      image: SaleskitIcon,
      type: "saleskit",
    },
    {
      title: "Artikel",
      image: PDFIcon,
      type: "saleskit_pdf",
    },
    {
      title: "Komparasi Produk",
      image: ComparisonIcon,
      type: "comparison",
    },
    {
      title: "Glosarium",
      image: GlosariumIcon, // Ganti dengan icon lokal jika ada
      type: "glossary",
    },
  ];

  const handleContentClick = (type) => {
    if (type === "product-types") {
      navigate(`/kategori/${id}/tipe-produk`);
    } else if (type === "comparison") {
      navigate(`/kategori/${id}/komparasi-produk`);
    } else if (type === "glossary") {
      navigate(`/kategori/glosarium`);
    } else {
      navigate(`/kategori/${id}/konten/${type}`);
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={15} px={{ xs: 1.5, sm: 2, md: 3 }}>
        <MKTypography variant="h3" textAlign="center" mb={4}>
          {loading ? <CircularProgress size={30} /> : categoryName}
        </MKTypography>

        {!loading && (
          <Grid container spacing={3} justifyContent="center">
            {contentTypes.map((item, index) => (
              <Grid item xs={6} sm={6} md={2} key={index}>
                <Card
                  onClick={() => handleContentClick(item.type)}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "all 0.25s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px) scale(1.02)",
                      boxShadow: 8,
                    },
                  }}
                  elevation={3}
                >
                  <CardMedia
                    component="img"
                    height="70"
                    image={item.image}
                    alt={item.title}
                    style={{ objectFit: "contain" }}
                  />
                  <CardContent>
                    <MKTypography variant="h6" textAlign="center">
                      {item.title}
                    </MKTypography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </MKBox>
    </>
  );
}
