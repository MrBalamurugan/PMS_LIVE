// material-ui
import { Button, Grid, InputLabel, Stack, Typography, TextField, MenuItem } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project imports
import AnimateButton from '../../../../../components/@extended/AnimateButton';
import type { FC } from 'react';
import { type PropertyPage4Data } from '../AddPropertyStepper';
import { currencies } from '../AddPropertyConstant';
import { useNavigate } from 'react-router-dom';

const SQM_TO_SQFT = 10.7639;

const validationSchema = yup.object({
    salePrice: yup.number().required('Price is required').min(0, 'Price must be a positive number'),
    saleValidity: yup.date().required('Validity date is required'),
    currency: yup.string().required('Currency is required'),
    carpetSizeSqft: yup.number().min(0, 'Carpet Size (sqft) must be positive').required('Carpet Size (sqft) is required'),
    carpetSizeSqm: yup.number().min(0, 'Carpet Size (sqm) must be positive').required('Carpet Size (sqm) is required'),
    buildUpSizeSqft: yup.number().min(0, 'Built-up Size (sqft) must be positive').required('Built-up Size (sqft) is required'),
    buildUpSizeSqm: yup.number().min(0, 'Built-up Size (sqm) must be positive').required('Built-up Size (sqm) is required')
});

interface AddPropertyForm4Props {
    propertyData: PropertyPage4Data;
    setPropertyData: (data: PropertyPage4Data) => void;
    handleNext: () => void;
    handleBack: () => void;
    setErrorIndex: (index: number) => void;
}

const AddPropertyForm4: FC<AddPropertyForm4Props> = ({
    propertyData,
    setPropertyData,
    handleNext,
    handleBack,
}) => {
    const formik = useFormik({
        initialValues: {
            salePrice: propertyData.salePrice,
            saleOfferPrice: propertyData.saleOfferPrice,
            saleValidity: propertyData.saleValidity || new Date().toISOString().split('T')[0],
            rentPrice: propertyData.rentPrice,
            rentOfferPrice: propertyData.rentOfferPrice,
            rentValidity: propertyData.rentValidity || new Date().toISOString().split('T')[0],
            currency: propertyData.currency || 'AED',
            structure: propertyData.structure || '',
            carpetSizeSqft: propertyData.carpetSizeSqft,
            carpetSizeSqm: propertyData.carpetSizeSqm,
            buildUpSizeSqft: propertyData.buildUpSizeSqft,
            buildUpSizeSqm: propertyData.buildUpSizeSqm
        },
        validationSchema,
        onSubmit: (values) => {
            setPropertyData({
                ...values,
                saleValidity: values.saleValidity ? new Date(values.saleValidity) : undefined,
                rentValidity: values.rentValidity ? new Date(values.rentValidity) : undefined
            });
            handleNext();
        }
    });

    const convertSqftToSqm = (sqft: number) => parseFloat((sqft / SQM_TO_SQFT).toFixed(3));
    const convertSqmToSqft = (sqm: number) => parseFloat((sqm * SQM_TO_SQFT).toFixed(2));

    // ✅ Carpet Area Handlers
    const handleCarpetSqftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sqft = parseFloat(e.target.value) || 0;
        formik.setValues({
            ...formik.values,
            carpetSizeSqft: sqft,
            carpetSizeSqm: convertSqftToSqm(sqft)
        });
    };

    const handleCarpetSqmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sqm = parseFloat(e.target.value) || 0;
        formik.setValues({
            ...formik.values,
            carpetSizeSqm: sqm,
            carpetSizeSqft: convertSqmToSqft(sqm)
        });
    };

    // ✅ Built-up Area Handlers
    const handleBuildUpSqftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sqft = parseFloat(e.target.value) || 0;
        formik.setValues({
            ...formik.values,
            buildUpSizeSqft: sqft,
            buildUpSizeSqm: convertSqftToSqm(sqft)
        });
    };

    const handleBuildUpSqmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sqm = parseFloat(e.target.value) || 0;
        formik.setValues({
            ...formik.values,
            buildUpSizeSqm: sqm,
            buildUpSizeSqft: convertSqmToSqft(sqm)
        });
    };
    const navigate = useNavigate();

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Property Area & Pricing Details
            </Typography>
            <form onSubmit={formik.handleSubmit} id="validation-forms">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                            <InputLabel htmlFor="currency">Currency</InputLabel>
                            <TextField
                                select
                                fullWidth
                                id="currency"
                                name="currency"
                                value={formik.values.currency}
                                onChange={formik.handleChange}
                                error={formik.touched.currency && Boolean(formik.errors.currency)}
                                helperText={formik.touched.currency && formik.errors.currency}
                            >
                                {currencies.map((option: { code: string; name: string }) => (
                                    <MenuItem key={option.code} value={option.code}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </Grid>

                    {/* 🏢 Structure / Project Name */}
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                            <InputLabel>Project / Structure Name</InputLabel>
                            <TextField
                                id="structure"
                                name="structure"
                                placeholder="Structure"
                                value={formik.values.structure}
                                onChange={formik.handleChange}
                                fullWidth
                            />
                        </Stack>
                    </Grid>

                    {/* 🏠 Carpet Area */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mt: 1, mb: 0.5 }}>
                            Carpet Area
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Carpet Size (Sqft)</InputLabel>
                            <TextField
                                id="carpetSizeSqft"
                                name="carpetSizeSqft"
                                type="number"
                                value={formik.values.carpetSizeSqft}
                                onChange={handleCarpetSqftChange}
                                error={formik.touched.carpetSizeSqft && Boolean(formik.errors.carpetSizeSqft)}
                                helperText={formik.touched.carpetSizeSqft && formik.errors.carpetSizeSqft}
                                placeholder="Enter Carpet area in Sqft"
                                fullWidth
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Carpet Size (Sqm)</InputLabel>
                            <TextField
                                id="carpetSizeSqm"
                                name="carpetSizeSqm"
                                type="number"
                                value={formik.values.carpetSizeSqm}
                                onChange={handleCarpetSqmChange}
                                error={formik.touched.carpetSizeSqm && Boolean(formik.errors.carpetSizeSqm)}
                                helperText={formik.touched.carpetSizeSqm && formik.errors.carpetSizeSqm}
                                placeholder="Enter Carpet area in Sqm"
                                fullWidth
                            />
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
                            Built-up Area
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Built-up Size (Sqft)</InputLabel>
                            <TextField
                                id="buildUpSizeSqft"
                                name="buildUpSizeSqft"
                                type="number"
                                value={formik.values.buildUpSizeSqft}
                                onChange={handleBuildUpSqftChange}
                                error={formik.touched.buildUpSizeSqft && Boolean(formik.errors.buildUpSizeSqft)}
                                helperText={formik.touched.buildUpSizeSqft && formik.errors.buildUpSizeSqft}
                                placeholder="Enter Built-up area in Sqft"
                                fullWidth
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Built-up Size (Sqm)</InputLabel>
                            <TextField
                                id="buildUpSizeSqm"
                                name="buildUpSizeSqm"
                                type="number"
                                value={formik.values.buildUpSizeSqm}
                                onChange={handleBuildUpSqmChange}
                                error={formik.touched.buildUpSizeSqm && Boolean(formik.errors.buildUpSizeSqm)}
                                helperText={formik.touched.buildUpSizeSqm && formik.errors.buildUpSizeSqm}
                                placeholder="Enter Built-up area in Sqm"
                                fullWidth
                            />
                        </Stack>
                    </Grid>

                    {/* 💰 Price */}

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
                            Sale Price
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Price</InputLabel>
                            <TextField
                                id="salePrice"
                                name="salePrice"
                                type="number"
                                placeholder="Price *"
                                value={formik.values.salePrice}
                                onChange={formik.handleChange}
                                error={formik.touched.salePrice && Boolean(formik.errors.salePrice)}
                                helperText={formik.touched.salePrice && formik.errors.salePrice}
                                fullWidth
                            />
                        </Stack>
                    </Grid>

                    {/* 💸 Offer Price */}
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Offer Price</InputLabel>
                            <TextField
                                id="saleOfferPrice"
                                name="saleOfferPrice"
                                type="number"
                                placeholder="Offer Price *"
                                value={formik.values.saleOfferPrice}
                                onChange={formik.handleChange}
                                fullWidth
                            />
                        </Stack>
                    </Grid>

                    {/* 📅 Validity */}
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Validity</InputLabel>
                            <TextField
                                id="saleValidity"
                                name="saleValidity"
                                type="date"
                                value={formik.values.saleValidity}
                                onChange={formik.handleChange}
                                error={formik.touched.saleValidity && Boolean(formik.errors.saleValidity)}
                                helperText={formik.touched.saleValidity && typeof formik.errors.saleValidity === 'string' ? formik.errors.saleValidity : ''}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
                            Rent Price
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Price</InputLabel>
                            <TextField
                                id="rentPrice"
                                name="rentPrice"
                                type="number"
                                placeholder="Price *"
                                value={formik.values.rentPrice}
                                onChange={formik.handleChange}
                                error={formik.touched.rentPrice && Boolean(formik.errors.rentPrice)}
                                helperText={formik.touched.rentPrice && formik.errors.rentPrice}
                                fullWidth
                            />
                        </Stack>
                    </Grid>

                    {/* 💸 Offer Price */}
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Offer Price</InputLabel>
                            <TextField
                                id="rentOfferPrice"
                                name="rentOfferPrice"
                                type="number"
                                placeholder="Offer Price *"
                                value={formik.values.rentOfferPrice}
                                onChange={formik.handleChange}
                                fullWidth
                            />
                        </Stack>
                    </Grid>

                    {/* 📅 Validity */}
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Validity</InputLabel>
                            <TextField
                                id="rentValidity"
                                name="rentValidity"
                                type="date"
                                value={formik.values.rentValidity}
                                onChange={formik.handleChange}
                                error={formik.touched.rentValidity && Boolean(formik.errors.rentValidity)}
                                helperText={formik.touched.rentValidity && typeof formik.errors.rentValidity === 'string' ? formik.errors.rentValidity : ''}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Stack>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end">
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} onClick={() => handleBack()}>
                                Back
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} onClick={() => navigate('/project/property/detail/Villa')} type="submit">
                                Submit
                            </Button>
                        </AnimateButton>
                    </Stack>
                </Grid>
            </form>
        </>
    );
};

export default AddPropertyForm4;
