import React from "react";
import { Grid, Card, CardContent, CardMedia } from "@mui/material";
import { useParams } from "react-router-dom";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";
import MKTypography from "../components/MKTypography";
import { useNavigate } from "react-router-dom";

export default function KategoriPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const categoryNames = {
    1: "Scanner",
    2: "Printer",
  };

  const categoryName = categoryNames[id] || "Kategori Tidak Ditemukan";

  const contentTypes = [
    {
      title: "Video Tutorial",
      image: "https://www.techsmith.com/blog/wp-content/uploads/2021/07/video-tutorial.png", // sesuaikan path gambar kamu
      type: "video",
    },
    {
      title: "Saleskit",
      image: "https://brooksgroup.com/wp-content/uploads/2020/08/sales_presentations.png",
      type: "saleskit",
    },
    {
      title: "Saleskit PDF",
      image: "https://cdn-icons-png.freepik.com/256/2405/2405161.png",
      type: "saleskit_pdf",
    },
    {
      title: "Product Comparison",
      image: "https://www.shutterstock.com/shutterstock/videos/3573221481/thumb/1.jpg",
      type: "comparison",
    },
  ];

  const handleContentClick = (type) => {
    console.log(`Kategori: ${id}, Konten: ${type}`);
    // nanti tinggal fetch API di sini, contoh:
    navigate(`/kategori/${id}/konten/${type}`);
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={10} px={{ xs: 1.5, sm: 2, md: 3 }}>
        <MKTypography variant="h3" textAlign="center" mb={4}>
          {categoryName}
        </MKTypography>

        <Grid container spacing={3} justifyContent="center">
          {contentTypes.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                  height="200"
                  image={item.image}
                  alt={item.title}
                  style={{ objectFit: "cover" }}
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
      </MKBox>
    </>
  );
}
