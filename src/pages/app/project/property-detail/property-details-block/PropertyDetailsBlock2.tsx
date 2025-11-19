import { Chip, Rating, Stack, Typography } from "@mui/material";
import { type PropertyDetails } from "./PropertyDetailsConstant";
import { StarFilled, StarOutlined } from "@ant-design/icons";

interface PropertyDetailBlock2Props {
  propertyDetails: PropertyDetails;
}

const PropertyDetailsBlock2 = ({
  propertyDetails,
}: PropertyDetailBlock2Props) => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Rating
          name="simple-controlled"
          defaultValue={propertyDetails.rating}
          icon={<StarFilled style={{ fontSize: "inherit" }} />}
          emptyIcon={<StarOutlined style={{ fontSize: "inherit" }} />}
          precision={0.1}
          readOnly
        />
        <Typography color="textSecondary">
          ({propertyDetails.rating?.toFixed(1)})
        </Typography>
      </Stack>
      <Typography variant="h3">{propertyDetails.propertyName}</Typography>
      <Typography color="textSecondary">
        {propertyDetails.projectName}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          size="small"
          label={propertyDetails.status}
          sx={{
            width: "fit-content",
            borderRadius: "4px",
            color:
              propertyDetails.status !== "sold" ? "success.main" : "error.main",
            bgcolor:
              propertyDetails.status !== "sold"
                ? "success.lighter"
                : "error.lighter",
          }}
        />
        <Chip
          size="small"
          label={propertyDetails.stage}
          sx={{
            width: "fit-content",
            borderRadius: "4px",
            color: "success.main",
            bgcolor: "success.lighter",
          }}
        />
      </Stack>

      <Typography color="textSecondary">
        {propertyDetails.description}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h3">${propertyDetails.offerPrice}</Typography>
        {propertyDetails.salePrice && (
          <Typography
            variant="h4"
            color="textSecondary"
            sx={{
              textDecoration: "line-through",
              opacity: 0.5,
              fontWeight: 400,
            }}
          >
            ${propertyDetails.salePrice}
          </Typography>
        )}
      </Stack>
      {/* <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 4 }}>
                <Button type="submit" fullWidth disabled={propertyDetails.status === "sold"} color="primary" variant="contained" size="large">
                    Assigned Lead
                </Button>
                {propertyDetails.status !== "sold" && (
                    <Button fullWidth color="secondary" variant="outlined" size="large" >
                        Add New Lead
                    </Button>
                )}
            </Stack> */}
    </Stack>
  );
};
export default PropertyDetailsBlock2;
