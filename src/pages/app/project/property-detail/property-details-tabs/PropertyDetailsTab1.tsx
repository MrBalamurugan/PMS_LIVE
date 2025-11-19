// material-ui
import { Grid, Typography } from '@mui/material';
import type { PropertyDetails } from '../property-details-block/PropertyDetailsConstant';
interface PropertyDetailsTab1Props {
    propertyDetails: PropertyDetails;
}


function PropertyDetailsTab1({ propertyDetails }: PropertyDetailsTab1Props) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Typography color="textSecondary">Property Name :</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography>{propertyDetails.propertyName}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography color="textSecondary" noWrap>
                    Project Name :
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography>{propertyDetails.projectName}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography color="textSecondary" noWrap>
                    Property Type :
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography>{propertyDetails.propertyType}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography color="textSecondary" noWrap>
                    Orientation :
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography noWrap>{propertyDetails.orientation}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography color="textSecondary" noWrap>
                    Address :
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography noWrap>{propertyDetails.address1}, {propertyDetails.address2}</Typography>
            </Grid>
        </Grid>
    );
}

export default PropertyDetailsTab1;
