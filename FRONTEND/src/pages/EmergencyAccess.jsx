import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

export default function EmergencyAccess() {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [doctorCredentials, setDoctorCredentials] = useState({
        name: '',
        id: '',
        department: '',
        hospital: '',
        reason: ''
    });

    const handleEmergencyAccess = async () => {
        setLoading(true);
        try {
            // Blockchain transaction for emergency access
            // This would create a smart contract record
            await new Promise(resolve => setTimeout(resolve, 2000));
            setActiveStep(2);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Emergency Access Protocol
            </Typography>

            <Alert severity="warning" sx={{ mb: 4 }}>
                This feature should only be used in medical emergencies where immediate access to patient records is critical.
            </Alert>

            <Paper sx={{ p: 3 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    <Step>
                        <StepLabel>Doctor Verification</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Digital Contract</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Access Granted</StepLabel>
                    </Step>
                </Stepper>

                <Box component="form">
                    <TextField
                        fullWidth
                        label="Doctor's Name"
                        margin="normal"
                        value={doctorCredentials.name}
                        onChange={(e) => setDoctorCredentials({
                            ...doctorCredentials,
                            name: e.target.value
                        })}
                    />
                    {/* Add other required fields */}
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Emergency Reason"
                        margin="normal"
                        value={doctorCredentials.reason}
                        onChange={(e) => setDoctorCredentials({
                            ...doctorCredentials,
                            reason: e.target.value
                        })}
                    />

                    <LoadingButton
                        variant="contained"
                        color="error"
                        loading={loading}
                        onClick={handleEmergencyAccess}
                        sx={{ mt: 2 }}
                        fullWidth
                    >
                        Request Emergency Access
                    </LoadingButton>
                </Box>
            </Paper>
        </Container>
    );
}