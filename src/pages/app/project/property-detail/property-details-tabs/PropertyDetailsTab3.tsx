// material-ui
import { Grid, Typography, Box } from '@mui/material';
import type { PropertyDetails } from '../property-details-block/PropertyDetailsConstant';

interface PropertyDetailsTab3Props {
    propertyDetails: PropertyDetails;
}

function PropertyDetailsTab3({ propertyDetails }: PropertyDetailsTab3Props) {
    return (
        <Box sx={{ p: 2 }}>
            {/* ===== Property Area Section ===== */}
            <Typography variant="h6" sx={{ mb: 1 }}>
                Property Area
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Carpet Area */}
                <Grid item xs={3}>
                    <Typography color="textSecondary">Carpet Area (Sqft):</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.carpetSizeSqft ?? '-'}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography color="textSecondary">Carpet Area (Sqm):</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.carpetSizeSqm ?? '-'}</Typography>
                </Grid>

                {/* Built-up Area */}
                <Grid item xs={3}>
                    <Typography color="textSecondary">Built-up Area (Sqft):</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.buildUpSizeSqft ?? '-'}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography color="textSecondary">Built-up Area (Sqm):</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.buildUpSizeSqm ?? '-'}</Typography>
                </Grid>

                {/* Currency */}
                <Grid item xs={3}>
                    <Typography color="textSecondary">Currency:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{propertyDetails.currency ?? '-'}</Typography>
                </Grid>
            </Grid>
        </Box >
    );
}

export default PropertyDetailsTab3;
