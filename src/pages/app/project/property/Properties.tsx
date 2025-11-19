/* eslint-disable @typescript-eslint/no-unused-vars */
import PropertyCard from "./PropertyCard"
import { Box, Grid } from "@mui/material"
import ProductEmpty from "./PropertyEmpty"
import { properties } from "./PropertyConstant"
import { useState, type ReactNode } from "react"
import ProductPlaceholder from "../../../../components/cards/skeleton/PropertyPlaceholder"

// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'container' })(({ theme, open, container }) => ({
//   flexGrow: 1,
//   transition: theme.transitions.create('margin', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.shorter
//   }),
//   marginLeft: -320,
//   ...(container && {
//     [theme.breakpoints.only('lg')]: {
//       marginLeft: !open ? -240 : 0
//     }
//   }),
//   [theme.breakpoints.down('lg')]: {
//     paddingLeft: 0,
//     marginLeft: 0
//   },
//   ...(open && {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.shorter
//     }),
//     marginLeft: 0
//   })
// }));



const Properties = () => {
  const initialState = {
    search: '',
    sort: 'low',
    gender: [],
    categories: ['all'],
    colors: [],
    price: '',
    rating: 0
  };
  const [_filter, setFilter] = useState(initialState);
  const [isLoading] = useState(false);


  let productResult: ReactNode = <></>;
  if (properties && properties.length > 0) {
    productResult = properties.map((property, index) => (
      <Grid key={index} item xs={12} sm={6} md={4}>
        <PropertyCard
          id={property.id}
          image={property.image}
          name={property.name}
          project={property.project}
          offer={property.offer}
          isStock={property.isStock}
          offerPrice={property.offerPrice}
          salePrice={property.salePrice}
          productRating={property.productRating}
        />
      </Grid>
    ));
  } else {
    productResult = (
      <Grid item xs={12} sx={{ mt: 3 }}>
        <ProductEmpty handelFilter={() => setFilter(initialState)} />
      </Grid>
    );
  }



  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {isLoading
                ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <Grid key={item} item xs={12} sm={6} md={4} lg={4}>
                    <ProductPlaceholder />
                  </Grid>
                ))
                : productResult}
            </Grid>
          </Grid>
        </Grid>

      </Box>
    </>

  )
}

export default Properties