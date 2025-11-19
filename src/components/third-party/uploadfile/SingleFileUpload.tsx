import { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface LogoUploadProps {
  onUpload: (file: File | null) => void;
  maxSizeMB?: number; // default 2MB
  titlelogo: string;
  defaultFile?: string; // URL or Base64 string
}

const LogoUpload = ({
  onUpload,
  titlelogo,
  maxSizeMB = 2,
  defaultFile = "",
}: LogoUploadProps) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultFile);
  const [fileError, setFileError] = useState<string>("");

  useEffect(() => {
    if (defaultFile) {
      setPreviewUrl(defaultFile);
    }
  }, [defaultFile]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setSelectedFile(null);
      setFileError(`File size exceeds ${maxSizeMB}MB!`);
      setPreviewUrl(defaultFile || "");
      onUpload(null);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFileError("");
    onUpload(file);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        height: "100%",
      }}
    >
      {/* Upload Box */}
      <Box
        sx={{
          flex: "0 0 25%",
          border: "2px dashed",
          borderColor: theme.palette.divider,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          p: 1.5,
          height: "100%",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {titlelogo}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          (Max {maxSizeMB}MB) <br /> (PNG / JPEG)
        </Typography>

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      </Box>

      {/* Preview Box */}
      <Box
        sx={{
          flex: "0 0 25%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid",
          borderColor: theme.palette.divider,
          borderRadius: 1,
          height: "100%",
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt="Uploaded logo preview"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            No Image
          </Typography>
        )}
      </Box>

      {/* File Info / Error Box */}
      <Box
        sx={{
          flex: "1 1 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 1,
          border: "1px solid",
          borderColor: theme.palette.divider,
          borderRadius: 1,
          minHeight: 80,
          overflow: "hidden",
        }}
      >
        {fileError ? (
          <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
            {fileError}
          </Typography>
        ) : selectedFile ? (
          <>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </Typography>
          </>
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            No file selected
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LogoUpload;
