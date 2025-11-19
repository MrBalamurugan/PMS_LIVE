import { useRef } from "react";
import AddPropertySidePanel from "./AddPropertySidePanel"
import { Box, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import AddPropertyUploadButton from "./property-add-forms/AddPropertyUploadButton";
const AddProperty = () => {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <AddPropertySidePanel focusInput={focusInput}></AddPropertySidePanel>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <AddPropertyUploadButton></AddPropertyUploadButton>
                    </Box>
                    <Outlet context={inputRef} />
                </Grid>
            </Grid>
        </>
    )
}

export default AddProperty