import React from "react";
import { Grid, Card, CardContent, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";
import MKTypography from "../components/MKTypography";

const categories = [
  {
    id: "printer",
    name: "Printer",
    image: "https://picsum.photos/id/1015/600/400",
  },
  {
    id: "scanner",
    name: "Scanner",
    image: "https://picsum.photos/id/1020/600/400",
  },
  {
    id: "label-printer",
    name: "Label Printer",
    image: "https://picsum.photos/id/1040/600/400",
  },
  {
    id: "projector",
    name: "Projector",
    image: "https://picsum.photos/id/1060/600/400",
  },
  {
    id: "ink",
    name: "Ink & Supplies",
    image: "https://picsum.photos/id/1080/600/400",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/kategori/${categoryId}`);
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={10} px={2}>
        <MKTypography variant="h3" textAlign="center" mb={4}>
          Pilih Kategori
        </MKTypography>
        <Grid container spacing={3} justifyContent="center">
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={4} key={cat.id}>
              <Card
                onClick={() => handleCategoryClick(cat.id)}
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                }}
                elevation={3}
              >
                <CardMedia component="img" height="160" image={cat.image} alt={cat.name} />
                <CardContent>
                  <MKTypography variant="h5" textAlign="center">
                    {cat.name}
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
