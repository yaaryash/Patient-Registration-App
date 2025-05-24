import { Paper, Typography, Box, Chip, Alert } from "@mui/material";
import PropTypes from "prop-types";
import CommonTable from "../common/CommonTable";

const PatientsList = ({ patients }) => {
  if (!patients) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Registered Patients
        </Typography>
        <Alert severity="error">No patient data available.</Alert>
      </Paper>
    );
  }

  if (!Array.isArray(patients)) {
    console.error("Patients is not an array:", patients);
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Registered Patients
        </Typography>
        <Alert severity="error">
          Data error: Expected an array of patients but received{" "}
          {typeof patients}.
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

  const columns = [
    { label: "Name", key: "name" },
    { label: "Purpose", key: "purpose" },
    { label: "Phone", key: "phoneNumber", altKeys: ["phonenumber"] },
    { label: "Age", key: "age" },
    { label: "ID", key: "id" },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Registered Patients
      </Typography>
      <Box sx={{ mt: 2, mb: 2 }}>
        <Chip
          label={`${patients.length} Patient${
            patients.length !== 1 ? "s" : ""
          } Registered`}
          color="primary"
          variant="outlined"
        />
      </Box>
      <CommonTable data={patients} columns={columns} />
    </Paper>
  );
};

PatientsList.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      purpose: PropTypes.string,
      phoneNumber: PropTypes.string,
      phonenumber: PropTypes.string,
      age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default PatientsList;
