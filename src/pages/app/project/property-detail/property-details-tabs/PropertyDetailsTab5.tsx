// material-ui
import { Grid, Typography, Divider, Box } from '@mui/material';
import type { PropertyDetails } from '../property-details-block/PropertyDetailsConstant';

interface PropertyDetailsTab3Props {
    propertyDetails: PropertyDetails;
}

function PropertyDetailsTab3({ propertyDetails }: PropertyDetailsTab3Props) {
    return (
        <Box sx={{ p: 2 }}>
            {/* ===== Sale Details Section ===== */}
            <Typography variant="h6" sx={{ mb: 1 }}>
                Sale Details
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={3}>
                    <Typography color="textSecondary">Sale Price:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.salePrice ?? '-'}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography color="textSecondary">Offer Price:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.saleOfferPrice ?? '-'}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography color="textSecondary">Validity:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.saleValidity?.toLocaleDateString() ?? '-'}</Typography>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* ===== Rent Details Section ===== */}
            <Typography variant="h6" sx={{ mb: 1 }}>
                Rent Details
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Typography color="textSecondary">Rent Price:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.rentPrice ?? '-'}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography color="textSecondary">Offer Price:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.rentOfferPrice ?? '-'}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography color="textSecondary">Validity:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.rentValidity?.toLocaleDateString() ?? '-'}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PropertyDetailsTab3;
