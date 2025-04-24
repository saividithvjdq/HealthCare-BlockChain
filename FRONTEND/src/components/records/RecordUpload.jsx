import { useState } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Alert,
    CircularProgress 
} from '@mui/material';
import { recordService } from '../../services/api';

export default function RecordUpload() {
    const [file, setFile] = useState(null);
    const [recordType, setRecordType] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('recordType', recordType);
        formData.append('description', description);

        try {
            await recordService.upload(formData);
            setSuccess(true);
            setFile(null);
            setRecordType('');
            setDescription('');
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Upload Health Record
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Record uploaded successfully!</Alert>}

            <input
                accept=".pdf,.jpg,.jpeg,.png"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'none' }}
                id="raised-button-file"
            />
            <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span" fullWidth sx={{ mb: 2 }}>
                    {file ? file.name : 'Choose File'}
                </Button>
            </label>

            <TextField
                fullWidth
                margin="normal"
                label="Record Type"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ mt: 2 }}
                disabled={!file || loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Upload Record'}
            </Button>
        </Box>
    );
}