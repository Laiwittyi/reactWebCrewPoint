import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from './AppBar.js';
import AppBar from './AppBar2.js';
import FormComponent from './FormComponent';
import AllRequestedView from './View.js'
import Home from './Home.js';
import Signup from './SignUp.js';
import GoogleLoginButton from './GoogleLoginButton.js';
import DialogView from './DialogView.js';
import { deleteData, storeName, key } from './utils/indexedDB.js';
import { ReactTableView } from './ReactTableView.js';
function App() {

  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isOpenLogoutDialog, setIsOpenLogoutDialog] = useState(false);
  useEffect(() => {
    const email = localStorage.getItem("info");
    if (email) {
      // Set user state if email is found
      let userObj = JSON.parse(email);
      setUser(userObj);
    }
  }, []);
  function handleClick() {
    setCount(count + 1);
  }

  async function handleLogout() {
    await deleteData(storeName, key)
    localStorage.removeItem("info");
    setIsOpenLogoutDialog(false);
    setUser(null);

  }

  // useEffect(() => {
  //   // Fetch data from the Node.js backend
  //   axios.get('http://localhost:5000/bigquery')
  //     .then((response) => {
  //       console.log(response)
  //       setData(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching BigQuery data:', error);
  //       setError(error);
  //       setLoading(false);
  //     });
  // }, []);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  // <h1>BigQuery Results</h1>
  // <table>
  //   <thead>
  //     <tr>
  //       <th>Point Type Name</th>
  //       <th>Description</th>
  //     </tr>
  //   </thead>
  //   <tbody>
  //     {data.map((row, index) => (
  //       <tr key={index}>
  //         <td>{row.PointTypeName}</td>
  //         <td>{row.Description}</td>
  //       </tr>
  //     ))}
  //   </tbody>
  // </table>

  return (
    <Router>
      <ResponsiveAppBar user={user} handleLogout={() => setIsOpenLogoutDialog(true)} />
      {isOpenLogoutDialog && <DialogView dialogTitle={"ログアウト"} dialogBody={"ログアウトしようとしています。よろしいでしょうか?"}
        isOpen={isOpenLogoutDialog} deleteCallBackfunction={() => { handleLogout(); }} onClose={() => setIsOpenLogoutDialog(false)}
      />}
      <Routes>
        <Route path='/' element={<Home user={user} />}></Route>
        <Route path='/view' element={<AllRequestedView user={user} />}></Route>
        <Route path='/request' element={<FormComponent user={user} />}></Route>
        <Route path='/signUp' element={<Signup />} />
        <Route path='/gooleLoginButton' element={<GoogleLoginButton setUser={setUser} />}></Route>
        <Route path='/sample' element={<ReactTableView />}></Route>
      </Routes>
    </Router>
  )

  // return (
  //   <div>
  //     <ResponsiveAppBar/>
  //     <FormComponent dataList={data}/>
  //   </div>
  // );
}

export default App; 
