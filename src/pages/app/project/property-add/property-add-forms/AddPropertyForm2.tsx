
// material-ui
import { Button, Grid, InputLabel, Stack, Typography, TextField, MenuItem } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project imports
import AnimateButton from '../../../../../components/@extended/AnimateButton';
import type { FC } from 'react';
import { type PropertyPage2Data } from '../AddPropertyStepper';
import { orientations, stages, statuses } from '../AddPropertyConstant';

const validationSchema = yup.object({
    status: yup.string().required('Status is required'),
    stage: yup.string().required('Stage is required'),
});

// ==============================|| VALIDATION WIZARD - ADDRESS  ||============================== //



interface AddPropertyForm2Props {
    propertyData: PropertyPage2Data;
    setPropertyData: (data: PropertyPage2Data) => void;
    handleNext: () => void;
    handleBack: () => void;
    setErrorIndex: (index: number) => void;
}

const AddPropertyForm2: FC<AddPropertyForm2Props> = ({
    propertyData,
    setPropertyData,
    handleNext,
    handleBack,
    setErrorIndex
}) => {
    const formik = useFormik({
        initialValues: {
            zone: propertyData.zone || "",
            masterCommunity: propertyData.masterCommunity || "",
            masterDeveloper: propertyData.masterDeveloper || "",
            stage: propertyData.stage || "",
            tenure: propertyData.tenure || "",
            status: propertyData.status || "",
            condition: propertyData.condition || "",
            orientation: propertyData.orientation || ""
        },
        validationSchema,
        onSubmit: (values) => {
            setPropertyData({
                zone: values.zone,
                masterCommunity: values.masterCommunity,
                masterDeveloper: values.masterDeveloper,
                stage: values.stage,
                tenure: values.tenure,
                status: values.status,
                condition: values.condition,
                orientation: values.orientation
            });
            handleNext();
        }
    });

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Property Additional Details
            </Typography>
            <form onSubmit={formik.handleSubmit} id="validation-forms">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Project Zone</InputLabel>
                            <TextField
                                id="zone"
                                name="zone"
                                placeholder="Project Zone"
                                value={formik.values.zone}
                                onChange={formik.handleChange}
                                error={formik.touched.zone && Boolean(formik.errors.zone)}
                                helperText={formik.touched.zone && formik.errors.zone}
                                fullWidth
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Master Community</InputLabel>
                            <TextField
                                id="masterCommunity"
                                name="masterCommunity"
                                placeholder="Master Community"
                                value={formik.values.masterCommunity}
                                onChange={formik.handleChange}
                                error={formik.touched.masterCommunity && Boolean(formik.errors.masterCommunity)}
                                helperText={formik.touched.masterCommunity && formik.errors.masterCommunity}
                                fullWidth
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Master Developer</InputLabel>
                            <TextField
                                id="masterDeveloper"
                                name="masterDeveloper"
                                placeholder="Master Developer"
                                value={formik.values.masterDeveloper}
                                onChange={formik.handleChange}
                                error={formik.touched.masterDeveloper && Boolean(formik.errors.masterDeveloper)}
                                helperText={formik.touched.masterDeveloper && formik.errors.masterDeveloper}
                                fullWidth
                                autoComplete="family-name"
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Tenure</InputLabel>
                            <TextField
                                id="tenure"
                                name="tenure"
                                placeholder="Tenure"
                                value={formik.values.tenure}
                                onChange={formik.handleChange}
                                error={formik.touched.tenure && Boolean(formik.errors.tenure)}
                                helperText={formik.touched.tenure && formik.errors.tenure}
                                fullWidth
                                autoComplete="family-name"
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <InputLabel>Condition</InputLabel>
                            <TextField
                                id="condition"
                                name="condition"
                                placeholder="Condition"
                                value={formik.values.condition}
                                onChange={formik.handleChange}
                                error={formik.touched.condition && Boolean(formik.errors.condition)}
                                helperText={formik.touched.condition && formik.errors.condition}
                                fullWidth
                                autoComplete="family-name"
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                            <InputLabel htmlFor="orientation">Orientation</InputLabel>
                            <TextField
                                select
                                fullWidth
                                id="orientation"
                                value={formik.values.orientation}
                                onChange={formik.handleChange}
                                error={formik.touched.orientation && Boolean(formik.errors.orientation)}
                                helperText={formik.touched.orientation && formik.errors.orientation}
                                name="orientation"
                            >
                                {orientations.map((option: string) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                            <InputLabel htmlFor="stage">Stage</InputLabel>
                            <TextField
                                select
                                fullWidth
                                id="stage"
                                value={formik.values.stage}
                                onChange={formik.handleChange}
                                error={formik.touched.stage && Boolean(formik.errors.stage)}
                                helperText={formik.touched.stage && formik.errors.stage}
                                name='stage'
                            >
                                {stages.map((option: string) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                            <InputLabel htmlFor="status">Status</InputLabel>
                            <TextField
                                select
                                fullWidth
                                id="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                error={formik.touched.status && Boolean(formik.errors.status)}
                                helperText={formik.touched.status && formik.errors.status}
                                name="status"
                            >
                                {statuses.map((option: string) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
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



export default AddPropertyForm2;
