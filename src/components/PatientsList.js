import React, { useEffect } from 'react';
import { 
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Alert
} from '@mui/material';

const PatientsList = ({ patients }) => {
  useEffect(() => {
    console.log('PatientsList rendered with patients:', patients);
  }, [patients]);

  if (!patients) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Registered Patients
        </Typography>
        <Alert severity="error">
          No patient data available.
        </Alert>
      </Paper>
    );
  }
  
  if (!Array.isArray(patients)) {
    console.error('Patients is not an array:', patients);
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Registered Patients
        </Typography>
        <Alert severity="error">
          Data error: Expected an array of patients but received {typeof patients}.
        </Alert>
      </Paper>
    );
  }

  if (patients.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Registered Patients
        </Typography>
        <Typography color="textSecondary">
          No patients registered yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Registered Patients
      </Typography>
      
      <Box sx={{ mt: 2, mb: 2 }}>
        <Chip 
          label={`${patients.length} Patient${patients.length !== 1 ? 's' : ''} Registered`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Purpose</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient, index) => {
              return (
                <TableRow key={patient.id || index} hover>
                  <TableCell>{patient.name || 'N/A'}</TableCell>
                  <TableCell>{patient.purpose || 'N/A'}</TableCell>
                  <TableCell>{patient.phonenumber || patient.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>{patient.age !== null && patient.age !== undefined ? String(patient.age) : 'N/A'}</TableCell>
                  <TableCell>{patient.id || 'N/A'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PatientsList; 