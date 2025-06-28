import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  Rating,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DefaultNavbar from "../examples/Navbars/DefaultNavbar";
import routes from "../routes";
import MKBox from "../components/MKBox";
import MKTypography from "../components/MKTypography";

export default function ContentListPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);

  // Ambil konten
  const fetchContents = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Unauthorized. Silakan login dulu.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `https://lentera-be.solution-core.com/api/content/list?category_id=${id}&content_type=${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.status === 401) {
        alert("Session habis. Silakan login ulang.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorMsg = await response.text();
        alert(`Gagal ambil konten: ${errorMsg}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setContents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching content list:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [id, type]);

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const handleOpenModal = (content) => {
    setSelectedContent(content);
    setOpenModal(true);
    fetchComments(content.id);
    incrementView(content.id);
    fetchAverageRating(content.id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedContent(null);
    setComments([]);
    setNewComment("");
  };

  // Hitung view
  const incrementView = async (contentId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://lentera-be.solution-core.com/api/content/view/${contentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };

  // Ambil username by user_id
  const fetchUsername = async (userId) => {
    if (usernames[userId]) return; // skip kalau sudah ada
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://lentera-be.solution-core.com/api/dashboard/profile-by-id/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      setUsernames((prev) => ({ ...prev, [userId]: data.username }));
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  // Ambil komentar per konten
  const fetchComments = async (contentId) => {
    try {
      setLoadingComments(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://lentera-be.solution-core.com/api/content/comment/list/${contentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      setComments(data);
      data.forEach((comment) => {
        fetchUsername(comment.user_id);
      });
      setLoadingComments(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setLoadingComments(false);
    }
  };

  // Tambah komentar
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://lentera-be.solution-core.com/api/content/comment/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          content_id: selectedContent.id,
          comment_text: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments(selectedContent.id);
      } else {
        const errorMsg = await response.text();
        alert(`Gagal kirim komentar: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const fetchAverageRating = async (contentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://lentera-be.solution-core.com/api/content/rating/average/${contentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      setAverageRating(data.average_rating);
      setTotalRatings(data.total_ratings);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const handleSubmitRating = async (value) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://lentera-be.solution-core.com/api/content/rating/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          content_id: selectedContent.id,
          rating: value,
        }),
      });

      if (response.ok) {
        setUserRating(value);
        fetchAverageRating(selectedContent.id);
      } else {
        const errorMsg = await response.text();
        alert(`Gagal kirim rating: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={10} px={{ xs: 1.5, sm: 2, md: 3 }}>
        <MKTypography variant="h3" textAlign="center" mb={4}>
          Konten {capitalize(type)}
        </MKTypography>
        <MKTypography variant="h3" textAlign="center" mb={4}>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "16px",
              paddingX: 2,
              paddingY: 1,
            }}
          >
            ← Kembali ke Kategori
          </Button>
        </MKTypography>

        {loading ? (
          <MKBox display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </MKBox>
        ) : contents.length === 0 ? (
          <MKTypography variant="h6" textAlign="center">
            Belum ada konten untuk kategori ini.
          </MKTypography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {contents.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  onClick={() => handleOpenModal(item)}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    height: "100%",
                    cursor: "pointer",
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
                    image={
                      item.content_type === "video"
                        ? "https://cdn-icons-png.flaticon.com/512/610/610209.png"
                        : item.content_type === "saleskit_pdf"
                        ? "https://cdn-icons-png.flaticon.com/512/7670/7670113.png"
                        : `https://lentera-be.solution-core.com${item.file_url}`
                    }
                    alt={item.title}
                    style={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <MKTypography variant="h6" mb={1}>
                      {item.title}
                    </MKTypography>
                    <MKTypography variant="body2" color="text.secondary">
                      {item.description}
                    </MKTypography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal Preview */}
        {selectedContent && (
          <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
            <DialogTitle>{selectedContent.title}</DialogTitle>
            <DialogContent dividers>
              {selectedContent.content_type === "video" ? (
                <video
                  src={`https://lentera-be.solution-core.com${selectedContent.file_url}`}
                  controls
                  style={{ width: "100%", borderRadius: 8 }}
                />
              ) : selectedContent.content_type === "saleskit_pdf" ? (
                <iframe
                  src={`https://lentera-be.solution-core.com${selectedContent.file_url}`}
                  title="PDF Viewer"
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
                />
              ) : (
                <img
                  src={`https://lentera-be.solution-core.com${selectedContent.file_url}`}
                  alt={selectedContent.title}
                  style={{ width: "100%", borderRadius: 8 }}
                />
              )}
              <MKTypography variant="h6" mt={3}>
                Rating
              </MKTypography>
              <MKBox display="flex" alignItems="center" mb={1}>
                <Rating value={averageRating} precision={0.1} readOnly />
                <MKTypography variant="body2" ml={1}>
                  {averageRating.toFixed(1)} ({totalRatings} rating)
                </MKTypography>
              </MKBox>

              <MKTypography variant="body2" mb={0.5}>
                Beri Rating Kamu:
              </MKTypography>
              <Rating
                value={userRating}
                onChange={(event, newValue) => {
                  handleSubmitRating(newValue);
                }}
                max={5}
              />
              {/* Komentar */}
              <MKTypography variant="h6" mt={3} mb={1}>
                Komentar
              </MKTypography>
              {loadingComments ? (
                <MKTypography variant="body2">Memuat komentar...</MKTypography>
              ) : (
                comments.map((comment) => (
                  <MKBox key={comment.id} mb={1.5} p={1} border="1px solid #ddd" borderRadius={2}>
                    <MKTypography variant="subtitle2" fontWeight="bold">
                      {usernames[comment.user_id] || "User"}
                    </MKTypography>
                    <MKTypography variant="body2">{comment.comment_text}</MKTypography>
                    <MKTypography variant="caption" color="text.secondary">
                      {new Date(comment.created_date).toLocaleString()}
                    </MKTypography>
                  </MKBox>
                ))
              )}

              <MKBox display="flex" mt={2}>
                <TextField
                  fullWidth
                  size="small"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis komentar..."
                />
                <Button onClick={handleAddComment} variant="contained" sx={{ ml: 1 }}>
                  Kirim
                </Button>
              </MKBox>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Tutup</Button>
            </DialogActions>
          </Dialog>
        )}
      </MKBox>
    </>
  );
}
