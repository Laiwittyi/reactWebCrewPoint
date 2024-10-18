import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rainbow from './hoc/Rainbow';
import { Backdrop, LinearProgress, Box } from '@mui/material';
import { saveToIndexedDB, getAllFromIndexedDB, storeName, ALL_SHOP_INFORMATION_TABLE, ALL_SHOP_INFORMATION_KEY, key } from './utils';

const Home = ({ user }) => {

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let userDataFromStorage = localStorage.getItem('info');
        if (userDataFromStorage) {
            const fetchData = async (crewPointIsNotExist, shopInformationIsNotExist) => {
                try {
                    if (crewPointIsNotExist) {
                        const response = await axios.get('http://localhost:5000/allCrewList');
                        if (response.status != 200) {
                            throw new Error('Network response was not ok');
                        }
                        const employeeList = await response.data;
                        saveToIndexedDB(employeeList, storeName, key);
                    }
                    if (shopInformationIsNotExist) {
                        const shopInformationFromDB = await axios.get('http://localhost:5000/allShopInformation');
                        if (shopInformationFromDB.status != 200) {
                            throw new Error('Error in getting shop information');
                        }
                        const allShopInfo = await shopInformationFromDB.data;
                        saveToIndexedDB(allShopInfo, ALL_SHOP_INFORMATION_TABLE, ALL_SHOP_INFORMATION_KEY);
                    }
                } catch (err) {
                    console.log(err.message);
                } finally {
                    setLoading(false);
                }
            };

            const loadData = async () => {
                let keyList = [storeName, ALL_SHOP_INFORMATION_TABLE];
                let dataListFromStorage = await getAllFromIndexedDB(keyList);
                console.log(dataListFromStorage)
                const crewPointIsNotExist = dataListFromStorage[storeName].length <= 0;
                const shopInformationIsNotExist = dataListFromStorage[ALL_SHOP_INFORMATION_TABLE].length <= 0;
                if (crewPointIsNotExist || shopInformationIsNotExist) {
                    fetchData(crewPointIsNotExist, shopInformationIsNotExist);
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