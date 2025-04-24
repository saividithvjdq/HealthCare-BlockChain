import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    Button, 
    List, 
    ListItem, 
    ListItemText,
    Divider 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { patientService, recordService } from '../../services/api';

export default function PatientProfile() {
    const [profile, setProfile] = useState(null);
    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await patientService.getProfile();
                setProfile(profileData.data);
                
                const recordsData = await recordService.getRecords();
                setRecords(recordsData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box sx={{ py: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Patient Profile
                        </Typography>
                        {profile && (
                            <Box>
                                <Typography>Name: {profile.name}</Typography>
                                <Typography>Email: {profile.email}</Typography>
                                <Typography>Phone: {profile.phone}</Typography>
                                <Typography>Aadhaar: {profile.aadhaarNumber}</Typography>
                            </Box>
                        )}
                        <Button 
                            variant="contained" 
                            fullWidth 
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/records/upload')}
                        >
                            Upload New Record
                        </Button>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Health Records
                        </Typography>
                        <List>
                            {records.map((record, index) => (
                                <Box key={record._id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={record.recordType}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2">
                                                        {new Date(record.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                    <br />
                                                    {record.description}
                                                </>
                                            }
                                        />
                                        <Button 
                                            variant="outlined" 
                                            href={record.fileUrl}
                                            target="_blank"
                                        >
                                            View
                                        </Button>
                                    </ListItem>
                                    {index < records.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
