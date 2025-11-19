/* eslint-disable @typescript-eslint/no-explicit-any */
import MainCard from "../../../../components/MainCard";
import { Formik } from "formik";
import * as Yup from "yup";
import { dispatch } from "../../../../store";
import { openSnackbar } from "../../../../store/reducers/snackbar";
import {
    Box,
    FormHelperText,
    Grid,
    InputLabel,
    Stack,
    TextField,
    MenuItem,
    CardHeader,
    Divider,
    Autocomplete,
    Chip,
    Button,
} from "@mui/material";
import { useOutletContext } from "react-router";
import { unitTypes, orientations, stages, amenities } from "../property-add/AddPropertyConstant";
import { CloseOutlined } from "@ant-design/icons";

type InputRefContext = React.Ref<any>;

function useInputRef() {
    return useOutletContext<InputRefContext>();
}


const AddPropertyDetailsPanel = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    const inputRef = useInputRef();

    return (
        <MainCard
            content={false}
            title="Property Information"
            sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
        >
            <Formik
                initialValues={{
                    projectname: "",
                    propertyname: "",
                    type: "",
                    size: "",
                    price: 10000,
                    orientation: "",
                    amenities: ["Swimming Pool"],
                    stage: "",
                    address1: "",
                    address2: "",
                    description: "",
                    image: "",
                    documents: "",
                    submit: null,
                }}
                validationSchema={Yup.object().shape({
                    projectname: Yup.string().max(100).required("Project Name is required."),
                    propertyname: Yup.string().max(100).required("Property Name is required."),
                    type: Yup.string().required("Type is required."),
                    size: Yup.string().required("Size is required."),
                    price: Yup.number().min(1000, "Minimum price should be 1000").required("Price is required."),
                    orientation: Yup.string().required("Orientation is required."),
                    amenities: Yup.array().min(1, "At least one amenity is required"),
                    stage: Yup.string().required("Stage is required."),
                    address1: Yup.string(),
                    address2: Yup.string(),
                    description: Yup.string().min(10, "Description should be at least 10 characters."),
                })}
                onSubmit={(_values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: "Property details updated successfully.",
                                variant: "alert",
                                alert: {
                                    color: "success",
                                },
                                close: false,
                            })
                        );
                        setStatus({ success: false });
                        setSubmitting(false);
                    } catch (err: any) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    touched,
                    values,
                }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Box sx={{ p: 2.5 }}>
                            <Grid container spacing={3}>
                                {/* Project Name */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="project-name">Project Name</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="project-name"
                                            value={values.projectname}
                                            name="projectname"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Project Name"
                                        />
                                        {touched.projectname && errors.projectname && (
                                            <FormHelperText error>{errors.projectname}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                {/* Property Name */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="property-name">Property Name</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="property-name"
                                            value={values.propertyname}
                                            name="propertyname"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Property Name"
                                            autoFocus
                                            inputRef={inputRef}
                                        />
                                        {touched.propertyname && errors.propertyname && (
                                            <FormHelperText error>{errors.propertyname}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                {/* Type */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="type">Type</InputLabel>
                                        <TextField
                                            select
                                            fullWidth
                                            id="type"
                                            value={values.type}
                                            name="type"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        >
                                            {unitTypes.map((option: string) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {touched.type && errors.type && (
                                            <FormHelperText error>{errors.type}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                {/* Size */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="size">Size</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="size"
                                            value={values.size}
                                            name="size"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="e.g. 1200 sqft or 23*32"
                                        />
                                        {touched.size && errors.size && (
                                            <FormHelperText error>{errors.size}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                {/* Price */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="price">Price</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="price"
                                            value={values.price}
                                            name="price"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="e.g. 300000"
                                        />
                                        {touched.price && errors.price && (
                                            <FormHelperText error>{errors.price}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                {/* Orientation */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="orientation">Orientation</InputLabel>
                                        <TextField
                                            select
                                            fullWidth
                                            id="orientation"
                                            value={values.orientation}
                                            name="orientation"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        >
                                            {orientations.map((option: string) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {touched.orientation && errors.orientation && (
                                            <FormHelperText error>{errors.orientation}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                {/* Amenities
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="amenities">Amenities</InputLabel>
                                        <TextField
                                            select
                                            fullWidth
                                            id="amenities"
                                            value={values.amenities}
                                            name="amenities"
                                            SelectProps={{
                                                multiple: true,
                                            }}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        >
                                            {amenitiesList.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {touched.amenities && errors.amenities && (
                                            <FormHelperText error>{errors.amenities}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid> */}

                                {/* Stage */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="stage">Stage</InputLabel>
                                        <TextField
                                            select
                                            fullWidth
                                            id="stage"
                                            value={values.stage}
                                            name="stage"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        >
                                            {stages.map((option: string) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {touched.stage && errors.stage && (
                                            <FormHelperText error>{errors.stage}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                            {/* Address */}
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
                                                value={values.address1}
                                                name="address1"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Address 01"
                                            />
                                            {touched.address1 && errors.address1 && (
                                                <FormHelperText error id="address1-helper">
                                                    {errors.address1}
                                                </FormHelperText>
                                            )}
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
                                                value={values.address2}
                                                name="address2"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Address 02"
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Amenities */}
                            <CardHeader title="Skills" />
                            <Divider />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 2.5, m: 0 }} component="ul">
                                <Autocomplete
                                    multiple
                                    fullWidth
                                    id="tags-outlined"
                                    options={amenities}
                                    value={values.amenities}
                                    onBlur={handleBlur}
                                    getOptionLabel={(label) => label}
                                    onChange={(_event, newValue) => {
                                        setFieldValue('amenities', newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} name="skill" placeholder="Add Skills" />}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                {...getTagProps({ index })}
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
                                    value={values.description}
                                    name="description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    id="personal-note"
                                    placeholder="Description"
                                />
                                {touched.description && errors.description && (
                                    <FormHelperText error id="personal-note-helper">
                                        {errors.description}
                                    </FormHelperText>
                                )}
                            </Box>

                            <CardHeader title="Upload" />
                            <Divider />
                            <Box sx={{ p: 2.5 }}>
                                <Grid container spacing={3}>

                                    {/* Image */}
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1.25}>
                                            <InputLabel htmlFor="image">Image</InputLabel>
                                            <TextField
                                                type="file"
                                                fullWidth
                                                id="image"
                                                name="image"
                                                onBlur={handleBlur}
                                            />
                                        </Stack>
                                    </Grid>

                                    {/* Documents */}
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1.25}>
                                            <InputLabel htmlFor="documents">Documents</InputLabel>
                                            <TextField
                                                type="file"
                                                fullWidth
                                                id="documents"
                                                name="documents"
                                                onBlur={handleBlur}
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                                    <Button variant="outlined" color="secondary">
                                        Cancel
                                    </Button>
                                    <p>{isSubmitting ? 'Submitting...' : "False"}</p>
                                    <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                                        Save
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </form>
                )
                }
            </Formik >
        </MainCard >
    );
};

export default AddPropertyDetailsPanel;
