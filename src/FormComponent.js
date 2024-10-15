// src/FormComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MenuItem, Select, FormControl, InputLabel, TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import format from 'date-fns/format';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
const FormComponent = ({ user }) => {
  const navigate = useNavigate();
  const [dataList, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [inputFieldError, setInputFieldError] = useState('');
  const [selectedDate, setSelectedData] = useState(null);
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  const shouldDisabledDate = (date) => {
    return date.month() !== currentMonth || date.year() !== currentYear;
  }
  // const handleChangeForSelector = (event)=>{
  //   let selectedValue = event.target.value;
  //   setSelectedOption(selectedValue);
  //   setFormData((prevData) => ({ ...prevData, ["PointRate"]:selectedValue  }))
  //   console.log(formData)
  // }

  useEffect(() => {
    // Fetch data from the Node.js backend
    axios.get('http://localhost:5000/bigquery')
      .then((response) => {
        console.log(response)
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching BigQuery data:', error);
        //setError(error);
        setLoading(false);
      });
  }, []);
  const initialState = {
    requestEmployeeId: '',
    employeeId: '',
    employeeName: '',
    pointAmount: '',
    pointRate: ''

  }
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if(name === "pointAmount" && value !== 500){
    //   setInputFieldError('Input Point Amount is must be 500 for each request')
    // }
    if (name === "PointTypeID") {
      setSelectedOption(value);
    } else if (name === "picker") {
      selectedDate(value);
    }
    console.log(e.target)
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData)
  };
  const handleClear = () => {
    setFormData(initialState);
    setSelectedOption('')
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, send validation request to backend
    console.log(formData)
    // if(Number(formData.pointAmount) !== 500){
    //   setInputFieldError('Input Point Amount is must be 500 for each request')
    //   return
    // }
    try {
      const res = await axios.post('http://localhost:5000/api/validate', { user_id: formData.employeeId });
      // const validationResponse = await fetch('/api/validate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(),
      // });

      console.log(res)
      //const validationData = res.json();
      if (res.data && res.data.totalRow && res.data.totalRow >= 6) {
        setError('Already reach limited point amount!');
      } else {
        // If validation passed, insert the data

        // const insertResponse = await fetch('/api/submit', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(formData),
        // });

        //const insertData = await insertResponse.json();
        //console.log(insertResponse)
        if (selectedDate) {
          const formattedDate = selectedDate.toISOString();
          formData["SelectedDate"] = formattedDate;
          //return;
        }

        const insertData = await axios.post('http://localhost:5000/api/submit', formData);
        console.log(insertData);
        if (insertData.status === 200) {
          setMessage(insertData.data.message);
          setInputFieldError('')
          setError('')
          handleClear()
        } else {
          setError(insertData.data.message);
          setMessage('')
        }
      }
    } catch (err) {
      setError('Error during validation or insertion');
    }
  };
  if (!user) {
    navigate("/");
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (

    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      {error && <Alert variant="filled" severity="error" onClose={() => { setError('') }}>{error}</Alert>}
      {message && <Alert variant="filled" severity="success" onClose={() => { setMessage('') }}>{message}</Alert>}
      <Typography variant="h4" gutterBottom>
        ポイントリクエスト
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="店長の社員番号"
          name="requestEmployeeId"
          fullWidth
          margin="normal"
          value={formData.requestEmployeeId}
          onChange={handleChange}
          required
        />
        <TextField
          label="要求された社員番号"
          name="employeeId"
          fullWidth
          margin="normal"
          value={formData.employeeId}
          onChange={handleChange}
          required
        />
        <TextField
          label="要求されたお名前"
          name="employeeName"
          fullWidth
          margin="normal"
          value={formData.employeeName}
          onChange={handleChange}
          required
        />
        {/* <NumberInput min={500} max={500}
          aria-label="point amount"
          placeholder="Please enter a point amount"
          value={formData.pointAmount}
          defaultValue = "500"
          onChange={(event, val) => setFormData((prevData) => ({ ...prevData, "pointAmount": val }))}
          required
        /> */}
        {/* <TextField
          label="Point Amount"
          name="pointAmount"
          error={!!inputFieldError}
          helperText={inputFieldError}
          fullWidth
          margin="normal"
          value={formData.pointAmount}
          onChange={handleChange}
          required
        /> */}
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


        <FormControl fullWidth>
          <InputLabel id="select-label">ポイントタイプセレクター</InputLabel>
          <Select
            labelId="select-label"
            name='PointTypeID'
            value={selectedOption}
            onChange={handleChange}
            label="オプションを選択してください"
          >
            {/* Loop through the options prop to generate MenuItems */}
            {dataList.map((option) => (
              <MenuItem value={option.PointTypeID} key={option.PointTypeID}>
                {option.PointTypeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
        >
          提出
        </Button>
      </Box>
    </Container>
  );
};

export default FormComponent;