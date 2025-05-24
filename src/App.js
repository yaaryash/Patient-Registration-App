import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
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
import {
  initDb,
  getPatients,
  executeSqlQuery,
  createLivePatientQuery,
} from "./db/database";

/**
 * Main App component for MediLite
 * Manages database initialization, patient data state, and tab navigation
 * Features live query updates and notification system
 */

/**
 * TabPanel component for rendering tab content
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Tab content
 * @param {number} props.value - Current active tab index
 * @param {number} props.index - This tab's index
 * @returns {JSX.Element} Tab panel with conditional rendering
 */
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

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * Main application component with tabbed interface
 * @returns {JSX.Element} Complete patient registration application
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [patients, setPatients] = useState([]);

  const liveQueryRef = useRef(null);

  const setupDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await initDb();

      const initialPatients = await getPatients();
      setPatients(initialPatients);

      const liveQuery = await createLivePatientQuery((updatedPatients) => {
        console.log(
          "Live query update received, patients:",
          updatedPatients.length
        );

        setPatients(updatedPatients);

        if (initialPatients.length !== updatedPatients.length) {
          setNotification("Patient data updated");
        }
      });

      liveQueryRef.current = liveQuery;
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

  useEffect(() => {
    setupDatabase();
  }, []);

  const refreshPatients = useCallback(async () => {
    try {
      const updatedPatients = await getPatients();
      setPatients(updatedPatients);
    } catch (error) {
      setError("Failed to refresh patients list");
    }
  }, []);

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
      if (newValue === 1) {
        refreshPatients();
      }
    },
    [refreshPatients]
  );

  const handlePatientAdded = useCallback(
    async (newPatient) => {
      setNotification("Patient registered successfully");
      await refreshPatients();
      setTabValue(1);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    },
    [refreshPatients]
  );

  const handleCloseNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/Logo.jpeg"
              alt="MediLite Logo"
              style={{
                height: "40px",
                width: "40px",
                marginRight: "12px",
                borderRadius: "4px",
              }}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MediLite
            </Typography>
          </Box>
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
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        message={notification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </>
  );
}

export default App;
