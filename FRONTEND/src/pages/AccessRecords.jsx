import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import recordService from '../services/recordService';

export default function AccessRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await recordService.getAuthorizedRecords();
        setRecords(response.data);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      }
    };
    fetchRecords();
  }, []);

  const handleDownload = async (recordId) => {
    try {
      const response = await recordService.getRecord(recordId);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `record-${recordId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download record:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Authorized Medical Records
      </Typography>
      <Paper sx={{ p: 2, mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell>Record Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record.patientAadhaar}</TableCell>
                  <TableCell>{record.recordType}</TableCell>
                  <TableCell>
                    {new Date(record.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Verified"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(record._id)}
                      size="small"
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}