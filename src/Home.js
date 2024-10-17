import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rainbow from './hoc/Rainbow';
import { Backdrop, LinearProgress, Box } from '@mui/material';
import { saveToIndexedDB, getAllFromIndexedDB } from './utils';

const Home = ({ user }) => {

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let userDataFromStorage = localStorage.getItem('info');
        if (userDataFromStorage) {
            const fetchData = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/allCrewList');
                    if (response.status != 200) {
                        throw new Error('Network response was not ok');
                    }
                    const employeeList = await response.data;
                    //console.log(employeeList);
                    const employeeObj = employeeList.reduce((acc, curr) => {
                        acc[curr.EmployeeID] = curr.EmployeeName;
                        return acc;
                    }, {});
                    saveToIndexedDB(employeeList);
                } catch (err) {
                    console.log(err.message);
                } finally {
                    setLoading(false);
                }
            };

            const loadData = async () => {
                const crewListFromStorage = await getAllFromIndexedDB();
                if (crewListFromStorage.length <= 0) {
                    fetchData()
                } else {
                    setLoading(false);
                }
            };
            loadData();
        } else {
            setLoading(false);
        }

    }, []);
    if (loading) {
        return (
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <Box sx={{ width: '50%' }}>
                    <LinearProgress />
                </Box>
            </Backdrop>
        )
    }
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center',     // Center vertically
                // Full viewport height to center the text vertically
            }}
        >
            <h2>{user ? user.name + "様、" : ''}すかいらーくクルーポイントからようこそ</h2>

        </div>
    )
}

export default Rainbow(Home)