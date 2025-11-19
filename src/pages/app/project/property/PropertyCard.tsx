/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ProductPlaceholder from "../../../../components/cards/skeleton/PropertyPlaceholder";
import MainCard from "../../../../components/MainCard";
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { priceConverter } from "./PropertyUtils";

export interface PropertCardProps {
  id: string;
  name: string;
  project: string;
  isStock: boolean;
  image?: string;
  offer?: string;
  offerPrice: number;
  salePrice?: number;
  productRating: number;
}

const PropertyCard = ({
  id,
  name,
  project,
  isStock,
  offer,
  salePrice,
  offerPrice,
  productRating,
  image,
}: PropertCardProps) => {
  const [isLoading] = useState(false);

  return (
    <>
      {isLoading ? (
        <ProductPlaceholder />
      ) : (
        <MainCard
          content={false}
          boxShadow
          sx={{
            "&:hover": {
              transform: "scale3d(1.02, 1.02, 1)",
              transition: "all .4s ease-in-out",
            },
          }}
        >
          <Box sx={{ width: 250, m: "auto" }}>
            <CardMedia
              sx={{
                height: 250,
                textDecoration: "none",
                opacity: isStock ? 1 : 0.25,
              }}
              image={image}
              component={Link}
              to={`/project/property/detail/${id}`}
            />
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: "100%",
              position: "absolute",
              top: 0,
              pt: 1.75,
              pl: 2,
              pr: 1,
            }}
          >
            {!isStock && (
              <Chip
                variant={"light" as any}
                color="error"
                size="small"
                label="Sold out"
              />
            )}
            {offer && (
              <Chip
                label={offer}
                variant={"combined" as any}
                color="success"
                size="small"
              />
            )}
          </Stack>
          <Divider />
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack>
                  <Typography
                    component={Link}
                    to={`/apps/e-commerce/product-details/${id}`}
                    color="textPrimary"
                    variant="h5"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      textDecoration: "none",
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    {project}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                  flexWrap="wrap"
                  rowGap={1.75}
                >
                  <Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h5">
                        ${priceConverter(offerPrice)}
                      </Typography>
                      {salePrice && (
                        <Typography
                          variant="h6"
                          color="textSecondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          ${priceConverter(salePrice)}
                        </Typography>
                      )}
                    </Stack>
                    <Stack direction="row" alignItems="flex-start">
                      <Rating
                        precision={0.5}
                        name="size-small"
                        defaultValue={productRating}
                        size="small"
                        readOnly
                      />
                      <Typography variant="caption">
                        ({productRating?.toFixed(1)})
                      </Typography>
                    </Stack>
                  </Stack>
                  <Button variant="contained" disabled={!isStock}>
                    {!isStock ? "Sold Out" : "Add"}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

export default PropertyCard;
