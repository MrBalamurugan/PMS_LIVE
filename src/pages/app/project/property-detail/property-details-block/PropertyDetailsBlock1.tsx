/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, CardMedia, Grid, IconButton, Stack, useMediaQuery, useTheme } from "@mui/material";
import MainCard from "../../../../../components/MainCard";
import { ThemeMode } from "../../../../../config";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { DownOutlined, LeftOutlined, RedoOutlined, RightOutlined, UpOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import build2 from "../../../../../assets/images/e-commerce/build2.jpg"
import build3 from "../../../../../assets/images/e-commerce/build3.jpg"
import build4 from "../../../../../assets/images/e-commerce/build4.jpg"
import build5 from "../../../../../assets/images/e-commerce/build5.jpg"
import build6 from "../../../../../assets/images/e-commerce/build6.jpg"
import build7 from "../../../../../assets/images/e-commerce/build7.png"
import build8 from "../../../../../assets/images/e-commerce/build8.jpg"
import build9 from "../../../../../assets/images/e-commerce/build9.webp"

import { useState } from "react";
import Avatar from "../../../../../components/@extended/Avatar";
import Slider from 'react-slick';

const PropertyDetailsBlock1 = () => {

    const theme = useTheme();
    const [selected, setSelected] = useState(build2);
    const products = [build2, build3, build4, build5, build6, build7, build8, build9];
    const [modal, setModal] = useState(false);

    const matchDownLG = useMediaQuery(theme.breakpoints.up('lg'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
    const lgNo = matchDownLG ? 5 : 4;

    const ArrowUp = (props: any) => (
        <Box
            {...props}
            color="secondary"
            className="prev"
            sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'transparent' },
                bgcolor: theme.palette.grey,
                border: `1px solid ${theme.palette.grey[200]}`,
                borderRadius: 1,
                p: 0.75,
                ...(!matchDownMD && { mb: 1.25 }),
                lineHeight: 0,
                '&:after': { boxShadow: 'none' }
            }}
        >
            {!matchDownMD ? (
                <UpOutlined style={{ fontSize: 'small', color: theme.palette.secondary.light }} />
            ) : (
                <LeftOutlined style={{ fontSize: 'small', color: theme.palette.secondary.light }} />
            )}
        </Box>
    );

    const ArrowDown = (props: any) => (
        <Box
            {...props}
            color="secondary"
            className="prev"
            sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'transparent' },
                bgcolor: theme.palette.grey,
                border: `1px solid ${theme.palette.grey[200]}`,
                borderRadius: 1,
                p: 0.75,
                ...(!matchDownMD && { mt: 1.25 }),
                lineHeight: 0,
                '&:after': { boxShadow: 'none' }
            }}
        >
            {!matchDownMD ? (
                <DownOutlined style={{ fontSize: 'small', color: theme.palette.secondary.light }} />
            ) : (
                <RightOutlined style={{ fontSize: 'small', color: theme.palette.secondary.light }} />
            )}
        </Box>
    );
    // const settings = {
    //     rows: 1,
    //     vertical: !matchDownMD,
    //     verticalSwiping: !matchDownMD,
    //     dots: false,
    //     centerMode: true,
    //     swipeToSlide: true,
    //     focusOnSelect: true,
    //     centerPadding: '0px',
    //     slidesToShow: products.length > 3 ? lgNo : products.length,
    //     prevArrow: <ArrowUp />,
    //     nextArrow: <ArrowDown />
    // };
    const settings = {
        rows: 1,
        vertical: !matchDownMD,
        verticalSwiping: !matchDownMD,
        dots: false,
        centerMode: true,
        swipeToSlide: true,
        focusOnSelect: true,
        centerPadding: '0px',
        slidesToShow: products.length > 3 ? lgNo : products.length,
        prevArrow: <ArrowUp />,
        nextArrow: <ArrowDown />
    };


    return (
        <>
            <Grid container spacing={0.5}>
                <Grid item xs={12} md={10} lg={9}>
                    <MainCard
                        content={false}
                        border={false}
                        boxShadow={false}
                        shadow="0"
                        sx={{
                            m: '0 auto',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'grey.50' : 'secondary.lighter',
                            '& .react-transform-wrapper': { cursor: 'crosshair', height: '100%' },
                            '& .react-transform-component': { height: '100%' }
                        }}
                    >
                        <TransformWrapper initialScale={1}>
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    <TransformComponent>
                                        <CardMedia
                                            onClick={() => setModal(!modal)}
                                            component="img"
                                            image={selected}
                                            title="Scroll Zoom"
                                            sx={{ borderRadius: `4px`, position: 'relative' }}
                                        />
                                    </TransformComponent>
                                    <Stack direction="row" className="tools" sx={{ position: 'absolute', bottom: 10, right: 10, zIndex: 1 }}>
                                        <IconButton color="secondary" onClick={() => zoomIn()}>
                                            <ZoomInOutlined style={{ fontSize: '1.15rem' }} />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => zoomOut()}>
                                            <ZoomOutOutlined style={{ fontSize: '1.15rem' }} />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => resetTransform()}>
                                            <RedoOutlined style={{ fontSize: '1.15rem' }} />
                                        </IconButton>
                                    </Stack>
                                </>
                            )}
                        </TransformWrapper>
                    </MainCard>
                </Grid>
                <Grid item xs={12} md={2} lg={3} sx={{ height: '100%' }}>
                    <Box
                        sx={{
                            '& .slick-slider': {
                                display: 'flex',
                                alignItems: 'center',
                                mt: 2
                            },
                            ...(!matchDownMD && {
                                display: 'flex',
                                height: '100%',
                                '& .slick-slider': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: '10px',
                                    width: 100
                                },
                                '& .slick-arrow': {
                                    '&:hover': { bgcolor: theme.palette.grey.A200 },
                                    position: 'initial',
                                    color: theme.palette.grey[500],
                                    bgcolor: theme.palette.grey.A200,
                                    p: 0,
                                    transform: 'rotate(90deg)',
                                    borderRadius: '50%',
                                    height: 17,
                                    width: 19
                                }
                            })
                        }}
                    >
                        <Slider {...settings}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                                <Box key={index} onClick={() => setSelected(products[item - 1])} sx={{ p: 1 }}>
                                    <Avatar
                                        size={matchDownLG ? 'xl' : 'md'}
                                        src={products[item - 1]}
                                        variant="rounded"
                                        sx={{
                                            m: '0 auto',
                                            cursor: 'pointer',
                                            bgcolor: theme.palette.grey,
                                            border: `1px solid ${theme.palette.grey[200]}`
                                        }}
                                    />
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
export default PropertyDetailsBlock1;