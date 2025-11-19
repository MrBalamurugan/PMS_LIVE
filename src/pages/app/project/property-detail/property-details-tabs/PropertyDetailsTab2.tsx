// material-ui
import { Grid, Typography, Chip, Stack, Paper } from '@mui/material';
import type { PropertyDetails } from '../property-details-block/PropertyDetailsConstant';

interface PropertyDetailsTab2Props {
    propertyDetails: PropertyDetails;
}

function PropertyDetailsTab2({ propertyDetails }: PropertyDetailsTab2Props) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Amenities
                    </Typography>

                    {propertyDetails.amenities && propertyDetails.amenities.length > 0 ? (
                        <Stack
                            direction="row"
                            spacing={1.5}
                            flexWrap="wrap"
                            useFlexGap
                        >
                            {propertyDetails.amenities.map((amenity, index) => (
                                <Chip
                                    key={index}
                                    label={amenity}
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 500,
                                        borderRadius: '8px',
                                        px: 1,
                                        py: 0.5,
                                    }}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Typography color="text.secondary" variant="body2">
                            No amenities available.
                        </Typography>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default PropertyDetailsTab2;
