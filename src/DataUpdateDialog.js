import React, { useEffect, useState } from 'react';
import {
  Alert, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { shouldDisabledDate } from './utils';
import Grid from '@mui/material/Grid2';
import { searchCrewListById } from './utils';

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
  const [error, setError] = useState('');


  const handleSearch = async () => {
    let findEmployeeObj = await searchCrewListById(formData['Employee ID']);
    if (findEmployeeObj[0]) {
      setFormData((prevData) => ({ ...prevData, ["Employee Name"]: findEmployeeObj[1] }));
    } else {
      setError(findEmployeeObj[1]);
    }
  }
  const handleSubmit = () => {
    if (!formData["Employee Name"]) {
      setError("従業員が存在するかどうかを確認する必要があります。まず、提出ボタンをクリックする前に確認ボタンをクリックしてください。")
      return;
    }
    if (selectedDate) {
      formData["Date"] = selectedDate;
    }
    handleSubmitParam(formData);
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "Employee ID") {
      setFormData((prevData) => ({ ...prevData, ["Employee Name"]: '' }));
    }
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
          {error && <Alert variant="filled" severity="error" onClose={() => { setError('') }}>{error}</Alert>}
          <Grid container spacing={2}>
            {Object.entries(dataList).map(([key, value]) => (
              key === 'Employee ID' ? (
                <>
                  <Grid size={10}>
                    <TextField
                      label={UILABLE[key]}
                      name={key}
                      fullWidth
                      margin='dense'
                      value={formData[key]}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid size={2} display="flex" justifyContent="center" alignItems="center" >
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                      確認
                    </Button>
                  </Grid>
                </>
              ) :
                <Grid size={12}>
                  <TextField
                    disabled={key === 'Row ID' || key === "Point Amount" || key === 'Employee Name'}
                    label={UILABLE[key]}
                    name={key}
                    fullWidth
                    margin='dense'
                    value={formData[key]}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
            ))}
          </Grid>
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
