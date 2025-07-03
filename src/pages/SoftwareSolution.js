import React from "react";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";
import MKTypography from "../components/MKTypography";
import { Box } from "@mui/material";

export default function SoftwareSolutionPage() {
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={10}
        px={3}
        minHeight="80vh"
        textAlign="center"
      >
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
          alt="Under Construction"
          sx={{ width: 150, height: 150, mb: 4 }}
        />
        <MKTypography variant="h3" gutterBottom>
          Halaman Sedang Dibangun
        </MKTypography>
        <MKTypography variant="body1" color="text.secondary" maxWidth="500px">
          Fitur ini masih dalam proses pengembangan. Kami sedang bekerja keras untuk segera
          menghadirkannya untuk Anda. Terima kasih atas kesabaran dan pengertiannya!
        </MKTypography>
      </MKBox>
    </>
  );
}
