// material-ui
import { Grid, Typography, IconButton, Box } from "@mui/material";
import { Description as DescriptionIcon, PictureAsPdf, InsertDriveFile } from "@mui/icons-material";

export interface UploadedDocument {
    name: string;
    type: string; // mime type like "application/pdf"
    size: number; // in bytes
}

interface DocumentsTabProps {
    documents: UploadedDocument[] | undefined;
}

function PropertyDetailsTab4({ documents }: DocumentsTabProps) {
    // Format file size (KB/MB)
    const formatFileSize = (size: number): string => {
        if (size < 1024) return size + " B";
        if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
        return (size / (1024 * 1024)).toFixed(1) + " MB";
    };

    // Pick icon based on file type
    const getFileIcon = (type: string) => {
        if (type.includes("pdf")) return <PictureAsPdf color="error" />;
        if (type.includes("image")) return <DescriptionIcon color="primary" />;
        return <InsertDriveFile color="action" />;
    };

    return (
        <Grid container spacing={2}>
            {documents?.length === 0 ? (
                <Grid item xs={12}>
                    <Typography color="textSecondary">No documents uploaded.</Typography>
                </Grid>
            ) : (
                documents?.map((doc, index) => (
                    <Grid container item xs={12} key={index} alignItems="center">
                        {/* File Icon */}
                        <Grid item xs={1}>
                            {getFileIcon(doc.type)}
                        </Grid>

                        {/* File Name */}
                        <Grid item xs={6}>
                            <Typography noWrap>{doc.name}</Typography>
                        </Grid>

                        {/* File Size */}
                        <Grid item xs={3}>
                            <Typography color="textSecondary">{formatFileSize(doc.size)}</Typography>
                        </Grid>

                        {/* View/Download Button */}
                        <Grid item xs={2}>
                            <Box display="flex" justifyContent="flex-end">
                                <IconButton
                                    component="a"
                                    href={URL.createObjectURL(new Blob([], { type: doc.type }))}
                                    target="_blank"
                                >
                                    <InsertDriveFile />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                ))
            )}
        </Grid>
    );
}

export default PropertyDetailsTab4;
