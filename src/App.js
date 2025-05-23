import React, { useState, useEffect } from "react";
import {
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Snackbar,
} from "@mui/material";
import PatientForm from "./components/PatientForm";
import PatientsList from "./components/PatientsList";
import SQLQueryPanel from "./components/SQLQueryPanel";
import { initDb, getPatients, executeSqlQuery } from "./database";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initDb();
        const initialPatients = await getPatients();
        setPatients(initialPatients);
      } catch (error) {
        console.error("Error initializing app:", error);
        setError(
          "Failed to initialize the database: " +
            (error.message || "Unknown error")
        );
      } finally {
        setIsLoading(false);
      }
    };
    setupDatabase();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      refreshPatients();
    }
  };

  const handlePatientAdded = async (newPatient) => {
    setNotification("Patient registered successfully");
    await refreshPatients();
    setTabValue(1);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const refreshPatients = async () => {
    try {
      const updatedPatients = await getPatients();
      setPatients(updatedPatients);
    } catch (error) {
      setError("Failed to refresh patients list");
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient Registration System
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="app tabs"
          >
            <Tab label="Register Patient" />
            <Tab label="View Patients" />
            <Tab label="SQL Query" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                flexDirection: "column",
              }}
            >
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6">Initializing database...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : (
            <>
              <PatientForm onPatientAdded={handlePatientAdded} />
              {notification && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {notification}
                </Alert>
              )}
            </>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                flexDirection: "column",
              }}
            >
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6">Loading patients...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : (
            <PatientsList patients={patients} />
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <SQLQueryPanel onExecuteQuery={executeSqlQuery} />
        </TabPanel>
      </Container>

      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        message={notification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </>
  );
}

export default App;
