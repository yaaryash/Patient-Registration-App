import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { isEmpty } from "../utils/utils";

const SQLQueryPanel = ({ onExecuteQuery }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecuteQuery = useCallback(async () => {
    if (isEmpty(query)) {
      setError("Please enter a SQL query");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const queryResults = await onExecuteQuery(query);
      setResults(queryResults);
    } catch (err) {
      setError(err.message || "Error executing query");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [query, onExecuteQuery]);

  const formatColumnHeader = (column) => {
    const lowerColumn = column.toLowerCase();

    if (lowerColumn === "phonenumber" || lowerColumn === "phone_number") {
      return "Phone";
    }
    if (lowerColumn === "createdat" || lowerColumn === "created_at") {
      return "Registered On";
    }

    return column
      .replace(/([A-Z])/g, " $1") 
      .replace(/_/g, " ") 
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();
  };

  const formatCellValue = (value, columnName) => {
    if (value === null || value === undefined) {
      const lowerColumn = columnName.toLowerCase();

      if (
        lowerColumn === "phone" ||
        lowerColumn === "phonenumber" ||
        lowerColumn === "phone_number" ||
        lowerColumn === "age"
      ) {
        return "-";
      }

      return "NULL";
    }

    const stringValue = String(value);

    return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
  };

  const renderResults = () => {
    if (!results || !results.rows || results.rows.length === 0) {
      return (
        <Typography color="textSecondary" sx={{ mt: 2 }}>
          No results to display
        </Typography>
      );
    }

    const columns = Object.keys(results.rows[0]);

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: "bold" }}>
                  {formatColumnHeader(column)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column}`}>
                    {formatCellValue(row[column], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        SQL Query Editor
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your SQL query here..."
        sx={{ mb: 2, fontFamily: "monospace" }}
      />

      <Button
        variant="contained"
        onClick={handleExecuteQuery}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? "Executing..." : "Execute Query"}
      </Button>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {results && renderResults()}
    </Paper>
  );
};

SQLQueryPanel.propTypes = {
  onExecuteQuery: PropTypes.func.isRequired,
};

export default SQLQueryPanel;
