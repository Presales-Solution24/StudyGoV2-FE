import { useParams } from "react-router-dom";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

function KategoriPage() {
  const { id } = useParams();

  const categoryNames = {
    printer: "Printer",
    scanner: "Scanner",
    "label-printer": "Label Printer",
    projector: "Projector",
    ink: "Ink & Supplies",
  };

  const categoryName = categoryNames[id] || "Kategori Tidak Ditemukan";

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={12} px={{ xs: 2, sm: 3, md: 5 }}>
        <MKTypography variant="h2" textAlign="center" mb={4}>
          {categoryName}
        </MKTypography>
        <MKTypography variant="body1" textAlign="center">
          {/* Ini nanti bisa kamu isi dengan daftar produk berdasarkan kategori */}
          Menampilkan produk untuk kategori: <strong>{categoryName}</strong>
        </MKTypography>
      </MKBox>
    </>
  );
}

export default KategoriPage;
