
// material-ui
import { Button, Grid, InputLabel, Stack, Typography, TextField, CardHeader, Divider, Box, MenuItem } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project imports
import AnimateButton from '../../../../../components/@extended/AnimateButton';
import type { FC } from 'react';
import { type PropertyPage1Data } from '../AddPropertyStepper';
import { unitTypes } from '../AddPropertyConstant';

const validationSchema = yup.object({
    projectName: yup.string().required('Project Name is required'),
    propertyName: yup.string().required('Property Name is required'),
    projectCode: yup.string().required('Project Code is required'),
    address1: yup.string().required('Address is required'),
    propertyType: yup.string().required('Property Type is required')
});

// ==============================|| VALIDATION WIZARD - ADDRESS  ||============================== //



interface AddPropertyForm1Props {
    propertyData: PropertyPage1Data;
    setPropertyData: (data: PropertyPage1Data) => void;
    handleNext: () => void;
    setErrorIndex: (index: number) => void;
}

const AddPropertyForm1: FC<AddPropertyForm1Props> = ({
    propertyData,
    setPropertyData,
    handleNext,
    setErrorIndex
}) => {
    const formik = useFormik({
        initialValues: {
            projectName: propertyData.projectName || "",
            propertyName: propertyData.propertyName || "",
            projectCode: propertyData.projectCode || "",
            address1: propertyData.address1 || "",
            address2: propertyData.address2 || "",
            propertyType: propertyData.propertyType || ""
        },
        validationSchema,
        onSubmit: (values) => {
            setPropertyData({
                projectName: values.projectName,
                propertyName: values.propertyName,
                projectCode: values.projectCode,
                address1: values.address1,
                address2: values.address2,
                propertyType: values.propertyType
            });
            handleNext();
        }
    });

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Property Basic Details
            </Typography>
            <form onSubmit={formik.handleSubmit} id="validation-forms">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Project Name</InputLabel>
                            <TextField
                                id="projectName"
                                name="projectName"
                                placeholder="Project Name *"
                                value={formik.values.projectName}
                                onChange={formik.handleChange}
                                error={formik.touched.projectName && Boolean(formik.errors.projectName)}
                                helperText={formik.touched.projectName && formik.errors.projectName}
                                fullWidth
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Project Code</InputLabel>
                            <TextField
                                id="projectCode"
                                name="projectCode"
                                placeholder="Project Code *"
                                value={formik.values.projectCode}
                                onChange={formik.handleChange}
                                error={formik.touched.projectCode && Boolean(formik.errors.projectCode)}
                                helperText={formik.touched.projectCode && formik.errors.projectCode}
                                fullWidth
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Property Name</InputLabel>
                            <TextField
                                id="propertyName"
                                name="propertyName"
                                placeholder="Property Name *"
                                value={formik.values.propertyName}
                                onChange={formik.handleChange}
                                error={formik.touched.propertyName && Boolean(formik.errors.propertyName)}
                                helperText={formik.touched.propertyName && formik.errors.propertyName}
                                fullWidth
                                autoComplete="family-name"
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                            <InputLabel htmlFor="type">Property Type</InputLabel>
                            <TextField
                                select
                                fullWidth
                                id="type"
                                value={formik.values.propertyType}
                                onChange={formik.handleChange}
                                error={formik.touched.propertyType && Boolean(formik.errors.propertyType)}
                                helperText={formik.touched.propertyType && formik.errors.propertyType}
                                name="propertyType"
                            >
                                {unitTypes.map((option: string) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </Grid>
                </Grid>
                <CardHeader title="Address" />
                <Divider />
                <Box sx={{ p: 2.5 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={1.25}>
                                <InputLabel htmlFor="address1">Address 01</InputLabel>
                                <TextField
                                    multiline
                                    rows={3}
                                    fullWidth
                                    id="address1"
                                    value={formik.values.address1}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address1 && Boolean(formik.errors.address1)}
                                    helperText={formik.touched.address1 && formik.errors.address1}
                                    name="address1"
                                    placeholder="Address 01"
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={1.25}>
                                <InputLabel htmlFor="address2">Address 02</InputLabel>
                                <TextField
                                    multiline
                                    rows={3}
                                    fullWidth
                                    id="address2"
                                    value={formik.values.address2}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address2 && Boolean(formik.errors.address2)}
                                    helperText={formik.touched.address2 && formik.errors.address2}
                                    name="address2"
                                    placeholder="Address 02"
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end">
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit" onClick={() => setErrorIndex(0)}>
                                Next
                            </Button>
                        </AnimateButton>
                    </Stack>
                </Grid>
            </form>
        </>
    );
};



export default AddPropertyForm1;
