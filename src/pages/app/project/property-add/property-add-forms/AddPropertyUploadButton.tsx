import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    IconButton,
    Box
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";

const AddPropertyUploadButton: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [docs, setDocs] = useState<File[]>([]);

    // Handle image uploads
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImages([...images, ...Array.from(event.target.files)]);
        }
    };

    // Handle document uploads
    const handleDocUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setDocs([...docs, ...Array.from(event.target.files)]);
        }
    };

    // Remove files
    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeDoc = (index: number) => {
        setDocs(docs.filter((_, i) => i !== index));
    };

    return (
        <div>
            {/* Parent Upload Button */}
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Upload
            </Button>

            {/* Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    Upload Files
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {/* Images Section - Left */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Images</Typography>
                            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                                Upload Images
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                            </Button>

                            <Box
                                mt={2}
                                display="flex"
                                flexWrap="wrap"
                                gap={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    p: 2,
                                    minHeight: 120
                                }}
                            >
                                {images.map((file, index) => (
                                    <Box
                                        key={index}
                                        position="relative"
                                        width={100}
                                        height={100}
                                        border="1px solid #ccc"
                                        borderRadius={2}
                                        overflow="hidden"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => removeImage(index)}
                                            sx={{
                                                position: "absolute",
                                                top: 2,
                                                right: 2,
                                                background: "rgba(255,255,255,0.7)"
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>

                        {/* Documents Section - Right */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Documents</Typography>
                            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                                Upload Docs
                                <input
                                    hidden
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                                    multiple
                                    onChange={handleDocUpload}
                                />
                            </Button>

                            <Box
                                mt={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    p: 2,
                                    minHeight: 120
                                }}
                            >
                                {docs.map((file, index) => (
                                    <Box
                                        key={index}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        mb={1}
                                        p={1}
                                        border="1px solid #eee"
                                        borderRadius={1}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ maxWidth: "80%", wordBreak: "break-word" }}
                                        >
                                            {file.name}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => removeDoc(index)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddPropertyUploadButton;
