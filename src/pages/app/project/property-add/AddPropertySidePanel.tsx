import { Box, FormLabel, Grid, Menu, MenuItem, Stack, TextField, Typography, useTheme } from "@mui/material"
import MainCard from "../../../../components/MainCard"
import { CameraOutlined, MoreOutlined } from "@ant-design/icons"
import IconButton from "../../../../components/@extended/IconButton";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import build5 from "../../../../assets/images/e-commerce/build5.jpg"
import Avatar from "../../../../components/@extended/Avatar";
import { ThemeMode } from "../../../../config";
import AddPropertyTab from "./AddPropertyTab";
interface AddPropertyTabProps {
    focusInput: () => void;
}

const AddPropertySidePanel: React.FC<AddPropertyTabProps> = ({ focusInput }) => {
    const theme = useTheme();

    const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [avatar, setAvatar] = useState(build5);

    const open = Boolean(anchorEl);
    useEffect(() => {
        if (selectedImage) {
            setAvatar(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <MainCard>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end">
                        <IconButton
                            variant="light"
                            color="secondary"
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <MoreOutlined />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button'
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >

                            <MenuItem
                                component={Link}
                                to="/apps/profiles/user/personal"
                                onClick={() => {
                                    handleClose();
                                    setTimeout(() => {
                                        focusInput();
                                    });
                                }}
                            >
                                Edit
                            </MenuItem>
                            <MenuItem onClick={handleClose} disabled>
                                Delete
                            </MenuItem>
                        </Menu>
                    </Stack>
                    <Stack spacing={2.5} alignItems="center">
                        <FormLabel
                            htmlFor="change-avtar"
                            sx={{
                                position: 'relative',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                '&:hover .MuiBox-root': { opacity: 1 },
                                cursor: 'pointer'
                            }}
                        >
                            <Avatar alt="Avatar 1" src={avatar} sx={{ width: 124, height: 124, border: '1px dashed' }} />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Stack spacing={0.5} alignItems="center">
                                    <CameraOutlined style={{ color: theme.palette.secondary.light, fontSize: '2rem' }} />
                                    <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                                </Stack>
                            </Box>
                        </FormLabel>
                        <TextField
                            type="file"
                            id="change-avtar"
                            placeholder="Outlined"
                            variant="outlined"
                            sx={{ display: 'none' }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSelectedImage(e.target.files?.[0])
                            } />
                        <Stack spacing={0.5} alignItems="center">
                            <Typography variant="h5">Property Name</Typography>
                            <Typography color="secondary">Project Name</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item sm={3} sx={{ display: { sm: 'block', md: 'none' } }} />
                <Grid item xs={12} sm={6} md={12}>
                </Grid>
                <Grid item xs={12}>
                    <AddPropertyTab />
                </Grid>
            </Grid>
        </MainCard>

    )
}

export default AddPropertySidePanel