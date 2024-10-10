import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from './AppBar.js';
import AppBar from './AppBar2.js';
import FormComponent from './FormComponent';
import AllRequestedView from './View.js'
import Home from './Home.js';
import Post from './components/Post.js';
// import * as ReactDOM from "react-dom/client";
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";

// const router = createBrowserRouter([
//   {
//     path:"/",
//     element:<h2>Hello From Skylark!</h2>
//   }
// ]);
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router}/>
//   </React.StrictMode>
// );
// function MyButton({ count, onClick }) {
//   return (
//     <button onClick={onClick}>
//       Clicked {count} times
//     </button>
//   );
// }
function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
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
      <ResponsiveAppBar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/view' element={<AllRequestedView />}></Route>
        <Route path='/request' element={<FormComponent />}></Route>
        <Route path='/modified' element={<h2>Point Modified</h2>}></Route>
        <Route path='/:post_id' element={<Post />} />
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
