import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';

const DataUpdatedDialog = ({ dataList, handleClose, isOpen, pointType, handleSubmitParam }) => {
  console.log("pointType * " + JSON.stringify(dataList))
  const initialState = {
    "Row ID": dataList["Row ID"],
    "Request Employee Id": dataList["Request Employee Id"],
    "Employee ID": dataList["Employee ID"],
    "Employee Name": dataList["Employee Name"],
    "Point Amount": dataList["Point Amount"],
    "PointTypeID": pointType
  }

  const UILABLE = {
    "Row ID": "GUID",
    "Request Employee Id": "店長",
    "Employee ID": "社員番号",
    "Employee Name": "お名前",
    "Point Amount": 'ポイント',
  }
  const [formData, setFormData] = useState(initialState);
  const [pointTypeList, setData] = useState([]);
  const [origianlPointType, setOriginalPointType] = useState(pointType);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch data from the Node.js backend
    axios.get('http://localhost:5000/bigquery')
      .then((response) => {
        console.log(response)
        setData(response.data);
        //setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching BigQuery data:', error);
        setError(error);
        //setLoading(false);
      });
  }, []);
  const handleChange = (event) => {
    setOriginalPointType(event.target.value);
  };
  const handleSubmit = () => {
    handleSubmitParam(formData);
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // if(name === "pointAmount" && value !== 500){
    //   setInputFieldError('Input Point Amount is must be 500 for each request')
    // }
    if (name === "PointTypeID") {
      setOriginalPointType(value);
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
          <FormControl fullWidth>
            <InputLabel id="select-label">ポイントタイプセレクター</InputLabel>
            <Select
              labelId="select-label"
              name='PointTypeID'
              label="Select an Option"
              value={origianlPointType}
              onChange={handleChange}
            >
              {/* Loop through the options prop to generate MenuItems */}
              {pointTypeList.map((option) => (
                <MenuItem value={option.PointTypeID} key={option.PointTypeID}>
                  {option.PointTypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
