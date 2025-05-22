import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";

const PatientForm = () => {
  const [patient, setPatient] = useState({
    name: "",
    purpose: "",
    phoneNumber: "",
    age: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    if (!patient.name) {
      setMessage("Patient name is required");
      setError(true);
      return;
    }

    if (!patient.purpose) {
      setMessage("Purpose of visit is required");
      setError(true);
      return;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Patient Registration
      </Typography>

      {message && (
        <Typography
          color={error ? "error" : "success"}
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          {message}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Patient Name"
              name="name"
              value={patient.name}
              onChange={handleInputChange}
              margin="normal"
              placeholder="Enter full name"
              error={error && !patient.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Purpose of Visit"
              name="purpose"
              value={patient.purpose}
              onChange={handleInputChange}
              margin="normal"
              placeholder="Why is the patient here?"
              multiline
              rows={2}
              error={error && !patient.purpose}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={patient.phoneNumber}
              onChange={handleInputChange}
              margin="normal"
              placeholder="Contact number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={patient.age}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ inputProps: { min: 0, max: 120 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register Patient
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PatientForm;
