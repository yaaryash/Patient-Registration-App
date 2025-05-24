import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { addPatient } from "../db/database";
import { handleInputChange, isEmpty } from "../utils/utils";

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

  const onInputChange = useMemo(() => handleInputChange(setPatient), []);

  const validationErrors = useMemo(() => {
    const errors = {};
    if (isEmpty(patient.name)) {
      errors.name = "Patient name is required";
    }
    if (isEmpty(patient.purpose)) {
      errors.purpose = "Purpose of visit is required";
    }
    return errors;
  }, [patient.name, patient.purpose]);

  const isFormValid = useMemo(() => {
    return Object.keys(validationErrors).length === 0;
  }, [validationErrors]);

  const resetForm = useCallback(() => {
    setPatient({
      name: "",
      purpose: "",
      phoneNumber: "",
      age: "",
    });
    setMessage("");
    setError(false);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setMessage("");
      setError(false);
      setIsLoading(true);

      if (!isFormValid) {
        const firstError = Object.values(validationErrors)[0];
        setMessage(firstError);
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

        resetForm();
        setError(false);

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
    },
    [patient, isFormValid, validationErrors, resetForm, onPatientAdded]
  );

  const buttonContent = useMemo(() => {
    return isLoading ? (
      <>
        <CircularProgress size={24} sx={{ mr: 1, color: "white" }} />
        Registering...
      </>
    ) : (
      "Register Patient"
    );
  }, [isLoading]);

  const nameFieldProps = useMemo(
    () => ({
      required: true,
      fullWidth: true,
      label: "Patient Name",
      name: "name",
      value: patient.name,
      onChange: onInputChange,
      margin: "normal",
      placeholder: "Enter full name",
      error: error && !patient.name,
      disabled: isLoading,
      helperText: error && !patient.name ? validationErrors.name : "",
    }),
    [patient.name, onInputChange, error, isLoading, validationErrors.name]
  );

  const purposeFieldProps = useMemo(
    () => ({
      required: true,
      fullWidth: true,
      label: "Purpose of Visit",
      name: "purpose",
      value: patient.purpose,
      onChange: onInputChange,
      margin: "normal",
      placeholder: "Why is the patient here?",
      rows: 1,
      error: error && !patient.purpose,
      disabled: isLoading,
      helperText: error && !patient.purpose ? validationErrors.purpose : "",
    }),
    [patient.purpose, onInputChange, error, isLoading, validationErrors.purpose]
  );

  const phoneFieldProps = useMemo(
    () => ({
      fullWidth: true,
      label: "Phone Number",
      name: "phoneNumber",
      value: patient.phoneNumber,
      onChange: onInputChange,
      margin: "normal",
      placeholder: "Contact number",
      disabled: isLoading,
    }),
    [patient.phoneNumber, onInputChange, isLoading]
  );

  const ageFieldProps = useMemo(
    () => ({
      fullWidth: true,
      label: "Age",
      name: "age",
      type: "number",
      value: patient.age,
      onChange: onInputChange,
      margin: "normal",
      InputProps: { inputProps: { min: 0, max: 120 } },
      disabled: isLoading,
    }),
    [patient.age, onInputChange, isLoading]
  );

  const paperStyles = useMemo(() => ({ p: 3, mb: 4 }), []);
  const buttonStyles = useMemo(() => ({ mt: 2 }), []);
  const messageStyles = useMemo(
    () => ({
      mb: 2,
      fontWeight: "bold",
    }),
    []
  );

  return (
    <Paper elevation={3} sx={paperStyles}>
      <Typography variant="h5" component="h2" gutterBottom>
        Patient Registration
      </Typography>

      {message && (
        <Typography color={error ? "error" : "success"} sx={messageStyles}>
          {message}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField {...nameFieldProps} />
          </Grid>
          <Grid item xs={12}>
            <TextField {...purposeFieldProps} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField {...phoneFieldProps} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField {...ageFieldProps} />
          </Grid>
          <Grid item xs={12} pt={1}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={buttonStyles}
              disabled={isLoading}
            >
              {buttonContent}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

PatientForm.displayName = "PatientForm";

export default PatientForm;
