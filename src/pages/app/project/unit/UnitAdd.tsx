import MainCard from "../../../../components/MainCard"
import { Grid, InputLabel, MenuItem, TextField, type SelectChangeEvent } from "@mui/material"
import { UnitType } from "./UnitConstant"
import { useState } from "react";


function UnitAdd() {
    const [type, setType] = useState<string>();
    
 const handleType = (event: SelectChangeEvent<string>) => {
  setType(event.target.value); 
};


    return (
        <>
            <MainCard>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <MainCard>
                            <Grid container spacing={1} direction="column">
                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 1 }}>Project Name</InputLabel>
                                    <TextField placeholder="Enter project name" fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 1 }}>Unit Name</InputLabel>
                                    <TextField placeholder="Enter unit name" fullWidth />
                                </Grid>

                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 1 }}>Unit Type</InputLabel>
                                    <TextField placeholder="Select unit type" fullWidth select value={type} onChange={()=>handleType}>
                                        {UnitType.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 1 }}>Unit Size</InputLabel>
                                    <TextField placeholder="Enter unit size" fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 1 }}>Unit Orientation</InputLabel>
                                    <TextField placeholder="Enter unit orientation" fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 1 }}>Project Name</InputLabel>
                                    <TextField placeholder="Enter project name" fullWidth />
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                </Grid>

            </MainCard>
        </>
    )
}


export default UnitAdd