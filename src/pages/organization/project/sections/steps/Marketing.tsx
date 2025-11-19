import { useState } from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined"; // NEW ICON

const UploadBox = ({ label, onUpload, error }: any) => (
  <Box
    sx={{
      width: 150,
      height: 150,
      border: `2px dashed ${error ? "red" : "#ccc"}`,
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      textAlign: "center",
      p: 1,
      gap: 1,
      transition: "border-color 0.2s ease",
      "&:hover": {
        borderColor: error ? "red" : "#999",
      },
    }}
    component="label"
  >
    <CloudUploadIcon
      sx={{ fontSize: 40, color: error ? "red" : "#888", transition: "0.2s" }}
    />
    <Typography sx={{ fontSize: 14, color: error ? "red" : "inherit" }}>
      {error ? "File too large (max 2MB)" : label}
    </Typography>

    <input type="file" hidden multiple onChange={onUpload} accept="image/*" />
  </Box>
);

// DELETE BUTTON
const DeleteIconButton = ({ onClick }: any) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: 5,
      right: 5,
      background: "white",
      padding: "3px",
      "&:hover": {
        background: "#ffe6e6",
      },
    }}
  >
    <DeleteIcon sx={{ color: "red", fontSize: 20 }} />
  </IconButton>
);

const Marketing = () => {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [coverError, setCoverError] = useState(false);
  const [galleryError, setGalleryError] = useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  // COVER UPLOAD
  const handleCoverUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setCoverError(true);
      setCoverImage(null);
      return;
    }

    setCoverError(false);
    setCoverImage(URL.createObjectURL(file));
  };

  // GALLERY UPLOAD
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files ?? []);
    const validFiles: string[] = [];

    let hasError = false;

    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        validFiles.push(URL.createObjectURL(file));
      } else {
        hasError = true;
      }
    });

    setGalleryError(hasError);
    setGalleryImages((prev) => [...prev, ...validFiles]);
  };

  const deleteCoverImage = () => {
    setCoverImage(null);
  };

  const deleteGalleryImage = (index: any) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 1,
        p: 2,
        maxHeight: "47vh",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: "10px",
        },
      }}
    >
      <Grid container spacing={1.5}>
        {/* Cover section */}
        <Grid item xs={12}>
          <Typography variant="h6">Cover Image</Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <UploadBox
            label="Upload Cover Image"
            onUpload={handleCoverUpload}
            error={coverError}
          />
        </Grid>

        {/* COVER PREVIEW BOX WITH ICON */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              width: 417,
              height: 157,
              border: "2px dashed #ccc",
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#fafafa",
            }}
          >
            {!coverImage && (
              <PhotoLibraryOutlinedIcon sx={{ fontSize: 50, color: "#bbb" }} />
            )}

            {coverImage && (
              <>
                <Box
                  component="img"
                  src={coverImage}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <DeleteIconButton onClick={deleteCoverImage} />
              </>
            )}
          </Box>
        </Grid>

        {/* Gallery section */}
        <Grid item xs={12}>
          <Typography variant="h6">Gallery Image</Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <UploadBox
            label="Upload Gallery Image"
            onUpload={handleGalleryUpload}
            error={galleryError}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={1}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Grid item xs={2.4} key={i}>
                <Box
                  sx={{
                    width: "100%",
                    height: 147,
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#fafafa",
                  }}
                >
                  {!galleryImages[i] && (
                    <PhotoLibraryOutlinedIcon
                      sx={{ fontSize: 40, color: "#bbb" }}
                    />
                  )}

                  {galleryImages[i] && (
                    <>
                      <Box
                        component="img"
                        src={galleryImages[i]}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <DeleteIconButton onClick={() => deleteGalleryImage(i)} />
                    </>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Marketing;
