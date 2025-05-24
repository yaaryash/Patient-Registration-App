import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

/**
 * CommonTable component for rendering tabular data
 * @param {Array} data - Array of data objects
 * @param {Array} columns - Array of column definitions: { label, key, altKeys? }
 */
const CommonTable = ({ data, columns }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const getValue = (row, col) => {
    if (row[col.key] !== undefined && row[col.key] !== null) return row[col.key];
    if (col.altKeys) {
      for (const alt of col.altKeys) {
        if (row[alt] !== undefined && row[alt] !== null) return row[alt];
      }
    }
    return 'N/A';
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.light' }}>
            {columns.map((col) => (
              <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={row.id || rowIndex} hover>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {getValue(row, col)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable; 