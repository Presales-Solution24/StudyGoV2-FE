// ContentListPage.js (refactored dan lebih modular)
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
import IconVideo from "../assets/images/Icon/IconVideo.png";

const CONTENT_ICONS = {
  video: IconVideo,
  saleskit_pdf: "/assets/icons/pdf.png",
};

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

  const fetchContents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const response = await fetch(
        `https://lentera-be.solution-core.com/api/content/list?category_id=${id}&content_type=${type}`,
        { headers: { Authorization: token } }
      );

      if (response.status === 401) return navigate("/login");
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error("Error fetching content list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsername = async (userId) => {
    if (usernames[userId]) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://lentera-be.solution-core.com/api/dashboard/profile-by-id/${userId}`,
        { headers: { Authorization: token } }
      );
      const data = await response.json();
      setUsernames((prev) => ({ ...prev, [userId]: data.username }));
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const fetchComments = async (contentId) => {
    setLoadingComments(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://lentera-be.solution-core.com/api/content/comment/list/${contentId}`,
        { headers: { Authorization: token } }
      );
      const data = await response.json();
      setComments(data);
      [...new Set(data.map((c) => c.user_id))].forEach(fetchUsername);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const incrementView = async (contentId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://lentera-be.solution-core.com/api/content/view/${contentId}`, {
        headers: { Authorization: token },
      });
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };

  const fetchAverageRating = async (contentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://lentera-be.solution-core.com/api/content/rating/average/${contentId}`,
        { headers: { Authorization: token } }
      );
      const data = await response.json();
      setAverageRating(data.average_rating);
      setTotalRatings(data.total_ratings);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const handleOpenModal = (content) => {
    setSelectedContent(content);
    setOpenModal(true);
    fetchComments(content.id);
    incrementView(content.id);
    fetchAverageRating(content.id);
  };

  const handleSubmitRating = async (value) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://lentera-be.solution-core.com/api/content/rating/submit`, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: selectedContent.id, rating: value }),
      });
      setUserRating(value);
      fetchAverageRating(selectedContent.id);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://lentera-be.solution-core.com/api/content/comment/add`, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: selectedContent.id, comment_text: newComment }),
      });
      setNewComment("");
      fetchComments(selectedContent.id);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [id, type]);

  const getImage = (item) =>
    CONTENT_ICONS[item.content_type] || `https://lentera-be.solution-core.com${item.file_url}`;

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox py={10} px={{ xs: 1.5, sm: 2, md: 3 }}>
        <MKTypography variant="h3" textAlign="center" mb={4}>
          Konten {type.charAt(0).toUpperCase() + type.slice(1)}
        </MKTypography>
        {/* <Button onClick={() => navigate(-1)} variant="contained" sx={{ mb: 3 }}>
          ← Kembali ke Kategori
        </Button> */}
        <MKBox display="flex" justifyContent="center" mb={3}>
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "16px",
              px: 3,
              py: 1.2,
            }}
          >
            ← Kembali ke Kategori
          </Button>
        </MKBox>

        {loading ? (
          <MKBox display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </MKBox>
        ) : contents.length === 0 ? (
          <MKTypography variant="h6" textAlign="center">
            Belum ada konten.
          </MKTypography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {contents.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  onClick={() => handleOpenModal(item)}
                  sx={{ cursor: "pointer", transition: "0.3s", "&:hover": { boxShadow: 6 } }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImage(item)}
                    alt={`Thumbnail ${item.title}`}
                    style={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <MKTypography variant="h6">{item.title}</MKTypography>
                    <MKTypography variant="body2" color="text">
                      {item.description}
                    </MKTypography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal */}
        {selectedContent && (
          <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
            <DialogTitle>{selectedContent.title}</DialogTitle>
            <DialogContent dividers>
              {selectedContent.content_type === "video" ? (
                <video
                  src={`https://lentera-be.solution-core.com${selectedContent.file_url}`}
                  controls
                  style={{ width: "100%" }}
                />
              ) : selectedContent.content_type === "saleskit_pdf" ? (
                <iframe
                  src={`https://lentera-be.solution-core.com${selectedContent.file_url}`}
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
                />
              ) : (
                <img
                  src={`https://lentera-be.solution-core.com${selectedContent.file_url}`}
                  alt={selectedContent.title}
                  style={{ width: "100%" }}
                />
              )}

              <MKTypography variant="h6" mt={3}>
                Rating
              </MKTypography>
              <Rating value={averageRating} precision={0.1} readOnly />
              <MKTypography variant="body2">
                {averageRating.toFixed(1)} ({totalRatings} rating)
              </MKTypography>

              <MKTypography variant="body2" mt={1}>
                Beri Rating Kamu:
              </MKTypography>
              <Rating value={userRating} onChange={(e, val) => handleSubmitRating(val)} />

              <MKTypography variant="h6" mt={3}>
                Komentar
              </MKTypography>
              {loadingComments ? (
                <MKTypography variant="body2">Memuat komentar...</MKTypography>
              ) : (
                comments.map((c) => (
                  <MKBox key={c.id} mb={1.5} p={1} border="1px solid #ccc" borderRadius="md">
                    <MKTypography variant="subtitle2" fontWeight="bold">
                      {usernames[c.user_id] || "User"}
                    </MKTypography>
                    <MKTypography variant="body2">{c.comment_text}</MKTypography>
                    <MKTypography variant="caption" color="text">
                      {new Date(c.created_date).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        hour12: false,
                      })}
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
              <Button onClick={() => setOpenModal(false)}>Tutup</Button>
            </DialogActions>
          </Dialog>
        )}
      </MKBox>
    </>
  );
}
