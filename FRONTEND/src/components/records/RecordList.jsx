import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import recordService from '../../services/recordService';
import DocumentPreview from '../common/DocumentPreview';

function RecordList() {
  const [records, setRecords] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await recordService.getUserRecords();
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  const handlePreviewClick = (record) => {
    // Construct IPFS gateway URL
    const fileUrl = `http://localhost:8080`;
    setSelectedFile({
      url: fileUrl,
      name: record.fileName
    });
    setPreviewOpen(true);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Uploaded Records
      </Typography>
      <List>
        {records.map((record) => (
          <ListItem
            key={record._id}
            secondaryAction={
              <Button
                variant="contained"
                onClick={() => handlePreviewClick(record)}
                sx={{
                  bgcolor: '#1a237e',
                  '&:hover': {
                    bgcolor: '#0d47a1',
                  },
                }}
              >
                Preview
              </Button>
            }
          >
            <ListItemText
              primary={record.fileName}
              secondary={`IPFS Hash: ${record.ipfsHash}`}
            />
          </ListItem>
        ))}
      </List>

      <DocumentPreview
        open={previewOpen}
        handleClose={() => setPreviewOpen(false)}
        fileUrl={selectedFile?.url}
        fileName={selectedFile?.name}
      />
    </Box>
  );
}

export default RecordList;
