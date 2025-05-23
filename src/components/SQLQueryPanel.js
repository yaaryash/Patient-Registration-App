import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { isEmpty } from '../utils';

const SQLQueryPanel = ({ onExecuteQuery }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecuteQuery = async () => {
    if (isEmpty(query)) {
      setError('Please enter a SQL query');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const queryResults = await onExecuteQuery(query);
      setResults(queryResults);
    } catch (err) {
      setError(err.message || 'Error executing query');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
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
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: 'bold' }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column}`}>
                    {row[column] !== null ? String(row[column]) : 'NULL'}
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
        sx={{ mb: 2, fontFamily: 'monospace' }}
      />

      <Button
        variant="contained"
        onClick={handleExecuteQuery}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? 'Executing...' : 'Execute Query'}
      </Button>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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

export default SQLQueryPanel; 