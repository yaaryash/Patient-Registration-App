import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { addPatient } from "../database";

const PatientForm = ({ onPatientAdded }) => {
  const [patient, setPatient] = useState({
    name: "",
    purpose: "",
    phoneNumber: "",
    age: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    if (!patient.name) {
      setMessage("Patient name is required");
      setError(true);
      setIsLoading(false);
      return;
    }

    if (!patient.purpose) {
      setMessage("Purpose of visit is required");
      setError(true);
      setIsLoading(false);
      return;
    }

    try {
      const patientData = {
        ...patient,
        age: patient.age ? parseInt(patient.age, 10) : null,
      };

      const newPatient = await addPatient(patientData);

      setPatient({
        name: "",
        purpose: "",
        phoneNumber: "",
        age: "",
      });

      setMessage("Patient registered successfully!");

      if (onPatientAdded) onPatientAdded(newPatient);
    } catch (error) {
      console.error("Error adding patient:", error);
      setMessage(
        "Error registering patient: " + (error.message || "Please try again.")
      );
      setError(true);
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              rows={1}
              error={error && !patient.purpose}
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} pt={1}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: "white" }} />
                  Registering...
                </>
              ) : (
                "Register Patient"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PatientForm;
