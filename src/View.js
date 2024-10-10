import React, { useState, useEffect } from 'react';
import { Backdrop, CircularProgress, LinearProgress } from '@mui/material';
import axios from 'axios';
import {
  Paper, useMediaQuery, Typography, Box, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DialogView from './DialogView.js';
import PaginatedTable from './PaginatedTable.js';
import DataUpdatedDialog from './DataUpdateDialog.js';


// const formatDate = (bigQueryDate) => {
//   const date = new Date(bigQueryDate);
//   return moment(date).format('YYYY/MM/DD'); // Custom format: MM/DD/YYYY
// };



const ResponsiveTable = ({ rows, columns, fetchAllListFun }) => {
  const [tableDataList, setTableDataList] = useState(rows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //const [open, setOpen] = useState(false);
  const [toDeleteRowID, setToDeleteRowId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [circularLoading, setLoading] = useState(false);
  const [isOpenDataUpdateDialog, setOpenOrNotDataUpdateDialog] = useState(false);
  const [toUpdateData, setToUpdateData] = useState('');
  const [updatePointType, setUpdatePointType] = useState();
  const [forceRender, setForceRender] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if mobile screen size
  const toEditDataKey = {
    "ID": 'Row ID',
    "AuthorityEmployeeId": "Request Employee Id",
    "RequestEmployeeId": "Employee ID",
    "RequestEmployeeName": "Employee Name",
    "Point": "Point Amount",
  }

  const forceUpdate = () => {
    setForceRender(prev => !prev);  // Flip the state to force re-render
  };
  const handleRowUpdate = (rowData) => {
    console.log(JSON.parse(rowData));
    let newDataObj = {};
    let convertDataObj = JSON.parse(rowData);
    Object.entries(toEditDataKey).map(([key, value]) => {
      //let perObjKey = {value:convertDataObj[key]};
      newDataObj[value] = convertDataObj[key];
    });
    setToUpdateData(newDataObj);
    handleOpenUpdateDataDialog(convertDataObj.PointTypeID);
  }

  const processRowUpdate = async (updatedData) => {
    setLoading(true);
    try {
      handleCloseUpdateDataDialog();
      console.log("updatedData" + JSON.stringify(updatedData));
      const response = await axios.post('http://localhost:5000/update-row', updatedData);
      console.log(response.data.message);
      setMessage(response.data.message);
      setError('');
      fetchAllListFun();
      forceUpdate()
    } catch (eror) {
      setMessage('');
      setError('Error updating row!')
    } finally {
      setLoading(false);
    }
  }

  const handleClickOpen = (row) => {
    let rowObj = JSON.parse(row);
    let guid = rowObj.ID;
    console.log(guid);
    setToDeleteRowId(guid);
    handleOpenDialog();
  };

  const handleOpenUpdateDataDialog = (pointType) => {
    setUpdatePointType(pointType);
    setOpenOrNotDataUpdateDialog(true)
  };
  const handleCloseUpdateDataDialog = () => {
    setOpenOrNotDataUpdateDialog(false);
  };


  // Function to open the dialog
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  // Handle changing the page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle changing the number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleRowDelete = async () => {
    setLoading(true);
    try {
      handleCloseDialog();
      const response = await axios.post('http://localhost:5000/delete-row', { toDeleteRowID });
      console.log(response.data.message);
      setMessage(response.data.message);
      setError('');
      setTableDataList(tableDataList.filter((row) => row.ID !== toDeleteRowID))
    } catch (eror) {
      setMessage('');
      setError('Error deleting row!')
    } finally {
      setLoading(false);
    }
    console.log(toDeleteRowID);
  };

  return (
    <React.Fragment>
      {circularLoading && <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={circularLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>}
      {error && <Alert variant="filled" severity="error" onClose={() => { setError('') }}>{error}</Alert>}
      {message && <Alert variant="filled" severity="success" onClose={() => { setMessage('') }}>{message}</Alert>}
      {isDialogOpen && <DialogView dialogTitle={"Deleting Point Transaction"} dialogBody={"You are about to deleting row.Are you sure?"}
        isOpen={isDialogOpen} deleteCallBackfunction={() => { handleRowDelete(); }} onClose={handleCloseDialog}
      />}
      {
        isOpenDataUpdateDialog && < DataUpdatedDialog handleSubmitParam={processRowUpdate} pointType={updatePointType} dataList={toUpdateData} handleClose={handleCloseUpdateDataDialog} isOpen={isOpenDataUpdateDialog} />
      }
      <Paper>
        <PaginatedTable data={tableDataList} rowsPerPage={rowsPerPage} currentPage={page}
          onPageChange={handleChangePage} columns={columns} handleRowUpdateParam={(row) => { handleRowUpdate(row) }} handleClickOpenParam={(row) => { handleClickOpen(row) }}
          handleChangeRowsPerPage={handleChangeRowsPerPage} isMobile={isMobile}
        />
      </Paper>
    </React.Fragment>

  );
};

const AllRequestedView = () => {
  const [requestedPointDataList, setRequestedPointDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [

    { id: 'RequestEmployeeId', label: '要求された社員番号', minWidth: 100 },
    { id: 'RequestEmployeeName', label: '要求されたお名前', minWidth: 170 },
    {
      id: 'Point',
      label: 'ポイント',
      minWidth: 100,
      align: 'right',
    },
    {
      id: 'PointTypeName',
      label: 'ポイントタイプ',
      minWidth: 170,
      align: 'right',
    },
    {
      id: 'Date',
      type: "object",
      label: '日付',
      minWidth: 170,
      align: 'right',
    },
    {
      id: 'Action',
      label: '',
      minWitdth: 170,
      isActionBtn: true
    }
  ];
  const fetchData = async () => {
    setLoading(true);
    axios.get('http://localhost:5000/allRequestedView')
      .then((response) => {
        console.log(response)
        setRequestedPointDataList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching BigQuery data:', error);
        //setError(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    // Fetch data from the Node.js backend
    fetchData();
  }, []);
  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <Box sx={{ width: '50%' }}>
          <LinearProgress />
        </Box>
      </Backdrop>
    )
    // return <div>Loading...</div>;
  }
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        リクエストされたすべてのリスト
      </Typography>
      <ResponsiveTable rows={requestedPointDataList} columns={columns} fetchAllListFun={fetchData} />
    </Box>
  );

  //   return(
  //     <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
  //       { error &&<Alert variant="filled" severity="error" onClose={() => {setError('')}}>{error}</Alert>}  
  //       {message&&<Alert variant="filled" severity="success" onClose={() => {setMessage('')}}>{message}</Alert>}
  //       <Typography variant="h4" gutterBottom>
  //         Point Request
  //       </Typography>
  //      </Container> 
  //   );  
};
export default AllRequestedView;