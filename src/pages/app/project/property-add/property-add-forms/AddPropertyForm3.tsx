
// material-ui
import { Button, Grid, Stack, Typography, TextField, CardHeader, Divider, Box, Autocomplete, Chip } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project imports
import AnimateButton from '../../../../../components/@extended/AnimateButton';
import type { FC } from 'react';
import { type PropertyPage3Data } from '../AddPropertyStepper';
import { amenities } from '../AddPropertyConstant';
import { CloseOutlined } from '@ant-design/icons';

const validationSchema = yup.object({
    amenities: yup.array().of(yup.string()).required('Amenities are required'),
    description: yup.string().required('Description is required')
});


interface AddPropertyForm3Props {
    propertyData: PropertyPage3Data;
    setPropertyData: (data: PropertyPage3Data) => void;
    handleNext: () => void;
    handleBack: () => void;
    setErrorIndex: (index: number) => void;
}

const AddPropertyForm3: FC<AddPropertyForm3Props> = ({
    propertyData,
    setPropertyData,
    handleNext,
    handleBack,
    setErrorIndex
}) => {
    const formik = useFormik({
        initialValues: {
            amenities: propertyData.amenities || [],
            description: propertyData.description || ""
        },
        validationSchema,
        onSubmit: (values) => {
            setPropertyData({
                amenities: values.amenities,
                description: values.description
            });
            handleNext();
        }
    });

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Property Amenities & Description
            </Typography>
            <form onSubmit={formik.handleSubmit} id="validation-forms">
                <CardHeader title="Amenities" />
                <Divider />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 2.5, m: 0 }} component="ul">
                    <Autocomplete
                        multiple
                        fullWidth
                        id="tags-outlined"
                        options={amenities}
                        value={formik.values.amenities}
                        getOptionLabel={(label) => label}
                        onChange={(_event, newValue) => {
                            formik.setFieldValue('amenities', newValue);
                        }}
                        renderInput={(params) => <TextField {...params} name="amenities" placeholder="Add Amenities" />}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    {...getTagProps({ index })}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    variant={"combined" as any}
                                    label={option}
                                    deleteIcon={<CloseOutlined style={{ fontSize: '0.75rem' }} />}
                                    sx={{ color: 'text.primary' }}
                                />
                            ))
                        }
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                p: 0,
                                '& .MuiAutocomplete-tag': {
                                    m: 1
                                },
                                '& fieldset': {
                                    display: 'none'
                                },
                                '& .MuiAutocomplete-endAdornment': {
                                    display: 'none'
                                },
                                '& .MuiAutocomplete-popupIndicator': {
                                    display: 'none'
                                }
                            }
                        }}
                    />
                </Box>

                {/* Description */}
                <CardHeader title="Description" />
                <Divider />
                <Box sx={{ p: 2.5 }}>
                    <TextField
                        multiline
                        rows={5}
                        fullWidth
                        value={formik.values.description}
                        name="description"
                        onChange={formik.handleChange}
                        id="personal-note"
                        placeholder="Description"
                    />
                </Box>
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



export default AddPropertyForm3;
