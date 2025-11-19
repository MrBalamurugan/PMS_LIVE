// material-ui
import { Button, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import MainCard from '../../../../components/MainCard';
import { useState, type ReactNode } from 'react';
import AnimateButton from '../../../../components/@extended/AnimateButton';


import AddPropertyForm1 from './property-add-forms/AddPropertyForm1';
import AddPropertyForm2 from './property-add-forms/AddPropertyForm2';
import AddPropertyForm3 from './property-add-forms/AddPropertyForm3';
import AddPropertyForm4 from './property-add-forms/AddPropertyForm4';
const steps = ['Property Basic Details', 'Property Additional Details', 'Property Description & Amenities', 'Property Pricing Details'];

export interface PropertyPage1Data {
    projectName?: string;
    projectCode?: string;
    propertyName?: string;
    address1?: string;
    address2?: string;
    propertyType?: string;
}
export interface PropertyPage2Data {
    zone?: string;
    masterCommunity?: string;
    masterDeveloper?: string;
    stage?: string;
    tenure?: string;
    status?: string;
    condition?: string;
    orientation?: string;
}
export interface PropertyPage3Data {
    amenities?: string[];
    description?: string;
}
export interface PropertyPage4Data {
    salePrice?: number;
    saleOfferPrice?: number;
    saleValidity?: Date;
    rentPrice?: number;
    rentOfferPrice?: number;
    rentValidity?: Date;
    currency?: string;
    carpetSizeSqft?: number;
    carpetSizeSqm?: number;
    buildUpSizeSqft?: number;
    buildUpSizeSqm?: number;
    structure?: string;
}


const getStepContent = (
    step: number,
    handleNext: () => void,
    handleBack: () => void,
    setErrorIndex: (index: number | null) => void,
    propertyPage1Data: PropertyPage1Data,
    propertyPage2Data: PropertyPage2Data,
    propertyPage3Data: PropertyPage3Data,
    propertyPage4Data: PropertyPage4Data,
    setPropertyPage1Data: React.Dispatch<React.SetStateAction<PropertyPage1Data>>,
    setPropertyPage2Data: React.Dispatch<React.SetStateAction<PropertyPage2Data>>,
    setPropertyPage3Data: React.Dispatch<React.SetStateAction<PropertyPage3Data>>,
    setPropertyPage4Data: React.Dispatch<React.SetStateAction<PropertyPage4Data>>,
): ReactNode => {
    switch (step) {
        case 0:
            return (
                <AddPropertyForm1
                    handleNext={handleNext}
                    setErrorIndex={setErrorIndex}
                    propertyData={propertyPage1Data}
                    setPropertyData={setPropertyPage1Data}
                />
            );
        case 1:
            return (
                <AddPropertyForm2
                    propertyData={propertyPage2Data}
                    setPropertyData={setPropertyPage2Data}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    setErrorIndex={setErrorIndex}
                />
            );
        case 2:
            return (
                <AddPropertyForm3
                    propertyData={propertyPage3Data}
                    setPropertyData={setPropertyPage3Data}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    setErrorIndex={setErrorIndex}
                />
            );
        case 3:
            return (
                <AddPropertyForm4
                    propertyData={propertyPage4Data}
                    setPropertyData={setPropertyPage4Data}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    setErrorIndex={setErrorIndex}
                />
            );
        default:
            throw new Error('Unknown step');
    }
};

const AddPropertyStepper = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [errorIndex, setErrorIndex] = useState<number | null>(null);
    const [propertyPage1Data, setPropertyPage1Data] = useState<PropertyPage1Data>({});
    const [propertyPage2Data, setPropertyPage2Data] = useState<PropertyPage2Data>({});
    const [propertyPage3Data, setPropertyPage3Data] = useState<PropertyPage3Data>({});
    const [propertyPage4Data, setPropertyPage4Data] = useState<PropertyPage4Data>({
        saleValidity: new Date(), currency: 'AED'
    });
    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
        setErrorIndex(null);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    return (
        <MainCard title="Property Details" >
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label, index) => {
                    const labelProps: { optional?: ReactNode; error?: boolean } = {};

                    if (index === errorIndex) {
                        labelProps.optional = (
                            <Typography variant="caption" color="error">
                                Error
                            </Typography>
                        );

                        labelProps.error = true;
                    }

                    return (
                        <Step key={label}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <>
                {activeStep === steps.length ? (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Thank you for your order.
                        </Typography>
                        <Typography variant="subtitle1">
                            Your order number is #2001539. We have emailed your order confirmation, and will send you an update when
                            your order has shipped.
                        </Typography>
                        <Stack direction="row" justifyContent="flex-end">
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        setPropertyPage1Data({});
                                        setPropertyPage2Data({});
                                        setPropertyPage3Data({});
                                        setActiveStep(0);
                                    }}
                                    sx={{ my: 3, ml: 1 }}
                                >
                                    Reset
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </>
                ) : (
                    <>
                        {getStepContent(
                            activeStep,
                            handleNext,
                            handleBack,
                            setErrorIndex,
                            propertyPage1Data,
                            propertyPage2Data,
                            propertyPage3Data,
                            propertyPage4Data,
                            setPropertyPage1Data,
                            setPropertyPage2Data,
                            setPropertyPage3Data,
                            setPropertyPage4Data
                        )}
                    </>
                )}
            </>
        </MainCard >
    );
};

export default AddPropertyStepper;
