import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { shouldDisabledDate } from './utils';

const DataUpdatedDialog = ({ dataList, handleClose, isOpen, pointType, handleSubmitParam, DateParam }) => {
  console.log("pointType * " + JSON.stringify(dataList))
  const initialState = {
    "Row ID": dataList["Row ID"],
    "Request Employee Id": dataList["Request Employee Id"],
    "Employee ID": dataList["Employee ID"],
    "Employee Name": dataList["Employee Name"],
    "Point Amount": dataList["Point Amount"],
  }

  const UILABLE = {
    "Row ID": "GUID",
    "Request Employee Id": "店長",
    "Employee ID": "社員番号",
    "Employee Name": "お名前",
    "Point Amount": 'ポイント',
    "Date": '日付'
  }
  const [formData, setFormData] = useState(initialState);
  const [selectedDate, setSelectedData] = useState(dayjs(DateParam));

  useEffect(() => {
    // // Fetch data from the Node.js backend
    // axios.get('http://localhost:5000/bigquery')
    //   .then((response) => {
    //     console.log(response)
    //     setData(response.data);
    //     //setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching BigQuery data:', error);
    //     setError(error);
    //     //setLoading(false);
    //   });
  }, []);
  // const handleChange = (event) => {
  //   setOriginalPointType(event.target.value);
  // };
  const handleSubmit = () => {
    if (selectedDate) {
      formData["Date"] = selectedDate;
    }
    handleSubmitParam(formData);
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    console.log(e.target)
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData)
  };

  return (
    <>

      {/* Dialog for editing row details */}
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          Point Update
        </DialogTitle>
        <DialogContent>
          {Object.entries(dataList).map(([key, value]) => (
            <TextField
              disabled={key === 'Row ID' || key === "Point Amount"}
              label={UILABLE[key]}
              name={key}
              fullWidth
              margin="normal"
              value={formData[key]}
              onChange={handleInputChange}
              required
            />
          ))}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="日付"
              name='picker'
              value={selectedDate}
              onChange={(newDate) => { setSelectedData(newDate); }}
              renderInput={(params) => <TextField {...params} />}
              shouldDisableDate={shouldDisabledDate}
              minDate={dayjs().startOf('month')}
              maxDate={dayjs().endOf('month')}
              margin="normal"
              fullWidth
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DataUpdatedDialog;
