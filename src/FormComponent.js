// src/FormComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import _ from 'lodash';
import { getCrewData, getForageDataByKey, ALL_SHOP_INFORMATION_KEY, ALL_SHOP_INFORMATION_TABLE, currentLogInUserEmailFromStorage } from './utils';
import AsyncSelect from 'react-select/async';

const FormComponent = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchEmployeeName, setSearchEmployeeName] = useState('');
  const [selectedDate, setSelectedData] = useState(null);
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  const [crewList, setCrewList] = useState('');
  const [allShopInfo, setAllShopInfo] = useState('');
  const [shopCode, setShopCode] = useState('');

  const shouldDisabledDate = (date) => {
    return date.month() !== currentMonth || date.year() !== currentYear;
  }

  const loadOptions = (inputValue) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          allShopInfo.filter(option =>
            option.ShopName.toLowerCase().includes(inputValue.toLowerCase()) || option.ShopCode == inputValue
          )
        );
      }, 1000);
    });
  };


  useEffect(() => {
    // Fetch data from the Node.js backend
    const getCrewListFromIndexDb = async () => {
      try {
        await getCrewData().then((data) => {
          console.log(data);
          setCrewList(data);
        });
        await getForageDataByKey(ALL_SHOP_INFORMATION_TABLE, ALL_SHOP_INFORMATION_KEY).then((data) => {
          console.log(data);
          setAllShopInfo(data);
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getCrewListFromIndexDb();

  }, []);
  const initialState = {
    requestEmployeeId: '',
    employeeId: '',
    employeeName: '',
    pointAmount: '',
    pointRate: ''

  }
  const [formData, setFormData] = useState(initialState);
  const handleSearch = () => {
    // Use Lodash's get function to find the employee name by ID

    const result = _.find(crewList, { EmployeeID: formData.employeeId });
    if (!result) {
      setError('Employee not found')
    } else {
      setSearchEmployeeName(result.EmployeeName)
    }
  };
  const handleShopCodeSelect = (newValue) => {
    console.log(newValue)
    setShopCode(newValue)
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "picker") {
      selectedDate(value);
    } else if (name === 'employeeId') {
      setSearchEmployeeName('')
    }
    console.log(e.target)
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData)
  };
  const handleClear = () => {
    setFormData(initialState);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const res = await axios.post('http://localhost:5000/api/validate', { user_id: formData.employeeId });
      console.log(res)
      if (res.data && res.data.totalRow && res.data.totalRow >= 6) {
        setError('Already reach limited point amount!');
      } else {
        let currentLoginUserEmail = currentLogInUserEmailFromStorage();
        if (!currentLoginUserEmail) {
          setError('Current Login User Email address is not found!')
          return;
        }
        formData["Email"] = currentLoginUserEmail;
        if (selectedDate) {
          const formattedDate = selectedDate.toISOString();
          formData["SelectedDate"] = formattedDate;
        }
        if (searchEmployeeName) {
          formData["employeeName"] = searchEmployeeName
        } else {
          setError("従業員が存在するかどうかを確認する必要があります。まず、提出ボタンをクリックする前に確認ボタンをクリックしてください。")
          return;
        }
        if (shopCode && shopCode.ShopCode) {
          formData["ShopCode"] = shopCode.ShopCode
        } else {
          setError("店舗を選択してください");
          return;
        }
        const insertData = await axios.post('http://localhost:5000/api/submit', formData);
        console.log(insertData);
        if (insertData.status === 200) {
          setMessage(insertData.data.message);
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
        <Grid container spacing={2}>
          <Grid size={5}>
            <TextField
              label="要求された社員番号"
              name="employeeId"
              fullWidth
              margin="normal"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={5}>
            <TextField
              disabled
              label="要求されたお名前"
              name="employeeName"
              fullWidth
              margin="normal"
              value={searchEmployeeName}
              required
            />
          </Grid>
          <Grid size={2} display="flex" justifyContent="center" alignItems="center" >
            <Button variant="contained" color="primary" onClick={handleSearch}>
              確認
            </Button>
          </Grid>
        </Grid>
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          defaultOptions={allShopInfo.slice(0, 50)}
          getOptionLabel={(e) => "( " + e.ShopCode + " ) : " + e.ShopName}
          getOptionValue={(e) => e.ShopCode}
          onChange={(newValue) => handleShopCodeSelect(newValue)}
          placeholder="コードまたは名前で店舗を検索"

        />
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