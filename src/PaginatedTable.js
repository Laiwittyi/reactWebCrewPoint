import React from 'react';

import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';

const formatDate = (bigQueryDate) => {
  const date = new Date(bigQueryDate);
  return moment(date).format('YYYY/MM/DD'); // Custom format: MM/DD/YYYY
};

const PaginatedTable = ({ data, rowsPerPage, currentPage, onPageChange, columns, handleRowUpdateParam, handleClickOpenParam, handleChangeRowsPerPage, isMobile }) => {
  // Paginate the data
  const indexOfLastRow = (currentPage + 1) * rowsPerPage;
  const indexOfFirstRow = currentPage * rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);
  //const dataPer
  const handleRowUpdate = (e) => {
    //console.log(e.currentTarget.getAttribute('data-custom-key'))
    handleRowUpdateParam(e.currentTarget.getAttribute('data-custom-key'))
  }
  const handleClickOpen = (e) => {
    //console.log(e.currentTarget.getAttribute('data-custom-key'))
    handleClickOpenParam(e.currentTarget.getAttribute('data-custom-key'))
  }
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  column.isActionBtn ? <TableCell key={row.ID}>
                    <IconButton color='primary' onClick={handleRowUpdate} data-custom-key={JSON.stringify(row)}><EditIcon /></IconButton>
                    <IconButton key={row.ID} data-custom-key={JSON.stringify(row)} color='error' onClick={handleClickOpen}><DeleteIcon /></IconButton>
                  </TableCell> :
                    (
                      column.type ?
                        <TableCell key={column.id}>
                          {formatDate(row[column.id].value)}
                        </TableCell>
                        : <TableCell key={column.id}>
                          {row[column.id]}
                        </TableCell>
                    )
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={data.length}
        page={currentPage}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? '' : 'Rows per page'} // Adjust for mobile
      />
    </Paper>
  );
};

export default PaginatedTable;
