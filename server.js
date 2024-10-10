
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { BigQuery } = require('@google-cloud/bigquery');

//const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const { DateTime } = require('luxon')

// Enable CORS to allow frontend to communicate with backend
function generateUUID() {
  return uuidv4();
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: 'sk-dev-employee-point',
  keyFilename: 'lwy_skl.json',
});
const datasetId = 'crew_poins_copy_bylwy'
const tableId = 'PointRequestNew'

// Define an API route to run a BigQuery query
app.get('/bigquery', async (req, res) => {

  console.log('Invoke PointType')
  const query = `
    SELECT *
    FROM \`sk-dev-employee-point.crew_poins_copy_bylwy.PointType\`
    WHERE Type='EARN' 
  `;

  try {
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});
app.get('/allRequestedView', async (req, res) => {
  console.log('Invoke allRequestView')
  const query = `
SELECT pt.PointMultiplier, pt.PointTypeName,pr.* FROM \`sk-dev-employee-point.crew_poins_copy_bylwy.PointRequestNew\` as pr
left join \`sk-dev-employee-point.crew_poins_copy_bylwy.PointType\` as pt
on SAFE_CAST(pt.PointTypeID AS INT64) = pr.PointTypeID
where pr.PointTypeID is not null  order by CreatedAt ASC
  `;

  try {
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});
// app.post('/api/submit', (req, res) => {
//     // Handle the data submission
//     console.log('Data received:', req.body);
//     res.status(200).json({ success: true, message: 'Data received successfully' });
//   });
app.post('/api/validate', async (req, res) => {

  console.log('Invoke Validate')
  let requestBody = req.body;
  const employeeId = requestBody.user_id;
  console.log(req.body);
  console.log(employeeId);

  const validateQuery = `
select count(Point) as totalRow from \`sk-dev-employee-point.crew_poins_copy_bylwy.PointRequestNew\`
WHERE EXTRACT(YEAR FROM Date) = EXTRACT(YEAR FROM CURRENT_DATETIME())
  AND EXTRACT(MONTH FROM Date) = EXTRACT(MONTH FROM CURRENT_DATETIME())
  and RequestEmployeeId= @employeeId
  and PointTypeID is not null
`
  //   const validateQuery = `
  //   select *
  // from (
  // select sum(result_table.perGetPointByRate) as TotalPoint,result_table.RequestEmployeeId from
  // (SELECT t.PointMultiplier*Point as perGetPointByRate,r.* FROM \`sk-dev-employee-point.crew_poins_copy_bylwy.PointRequestNew\` as r
  // left join \`sk-dev-employee-point.crew_poins_copy_bylwy.PointType\` as t
  // on r.PointTypeID =  t.PointTypeID) as result_table
  // WHERE EXTRACT(YEAR FROM result_table.Date) = EXTRACT(YEAR FROM CURRENT_DATETIME())
  //   AND EXTRACT(MONTH FROM result_table.Date) = EXTRACT(MONTH FROM CURRENT_DATETIME())
  //   and result_table.RequestEmployeeId= @employeeId
  //   group by RequestEmployeeId
  // )
  // where TotalPoint>=6000
  //     `;
  const validateOption = {
    query: validateQuery,
    params: { employeeId: employeeId },
  }

  try {
    const [job] = await bigquery.createQueryJob(validateOption);
    const [rows] = await job.getQueryResults();
    console.log("row" + rows[0]);
    res.json(rows[0]);
    // if (rows[0] >= 6) {
    //   res.json({ exists: true });
    // } else {
    //   res.json({ exists: false });
    // }
  } catch (err) {
    console.error('Validation error:', err.stack);
    res.status(500).json({ error: 'Validation failed' });
  }
});
app.post('/update-row', async (req, res) => {

  console.log('Invoke Update')
  try {
    let passParam = req.body;
    console.log("passParam" + JSON.stringify(passParam));
    const requestEmployeeId = passParam["Request Employee Id"];
    const employeeId = passParam["Employee ID"];
    console.log("employeeId" + employeeId)
    const guid = passParam["Row ID"];
    console.log(guid);
    const employeeName = passParam["Employee Name"];
    const PointTypeID = parseInt(passParam["PointTypeID"]);
    const updateQuery = `update \`sk-dev-employee-point.crew_poins_copy_bylwy.PointRequestNew\` 
                        set AuthorityEmployeeId=@requestEmployeeId
                        , RequestEmployeeId=@employeeId
                        , RequestEmployeeName=@employeeName
                        , PointTypeID=@PointTypeID where ID=@guid
                        and CreatedAt < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR);`;

    const options = {
      query: updateQuery,
      params: {
        requestEmployeeId: requestEmployeeId,
        employeeId: employeeId,
        employeeName: employeeName,
        PointTypeID: PointTypeID,
        guid: guid
      }
    };
    const [job] = await bigquery.createQueryJob(options);
    await job.getQueryResults();
    res.status(200).send({ message: 'Row Updated successfully' });
  } catch (error) {
    console.error('Error updating data into BigQuery:', error.stack);
    res.status(500).json({ message: 'Error updating data into BigQuery', error });
  }
});
app.post('/api/submit', async (req, res) => {

  console.log('Invoke submit')
  console.log(req.body)
  const { requestEmployeeId, employeeId, employeeName, pointAmount, PointTypeID, SelectedDate } = req.body;
  if (!requestEmployeeId || !employeeId || !employeeName || !PointTypeID || !SelectedDate) {
    res.status(500).json({ message: 'EmptyValueInclude' });
  }
  // if(!SelectedDate){
  //   res.status(500).json({ message: 'EmptyValueInclude' );
  // }
  // Capture form data from frontend
  try {
    // Insert data into BigQuery
    let submittedDate = DateTime.fromISO(SelectedDate).toFormat('yyyy-LL-dd HH:mm:ss');
    let guid = generateUUID();
    const timestamp = new Date().toISOString()
    console.log(submittedDate);
    let postRowStatus = "PENDING"
    const rows = [{
      "ID": guid,
      "AuthorityEmployeeId": requestEmployeeId,
      "RequestEmployeeId": employeeId,
      "RequestEmployeeName": employeeName,
      "Point": 500,
      "Date": submittedDate,
      "PointTypeID": PointTypeID,
      "Status": postRowStatus,
      "CreatedAt": timestamp
    }];
    console.log("rows : " + rows);

    await bigquery
      .dataset(datasetId)
      .table(tableId)
      .insert(rows);

    console.log(`Inserted ${rows.length} row(s) into BigQuery`);
    res.status(200).json({ message: 'Data submitted successfully!' });
  } catch (error) {
    console.error('Error inserting data: ', error);
    if (!res.headersSent) {
      res.status(500).json('Error inserting data into BigQuery');
    }
  }
});
app.post('/delete-row', async (req, res) => {

  console.log('Invoke delete')
  const { toDeleteRowID } = req.body;
  const deleteQuery = `
    DELETE FROM \`sk-dev-employee-point.crew_poins_copy_bylwy.PointRequestNew\`
    WHERE ID = @toDeleteRowID
  `
  const options = {
    query: deleteQuery,
    params: { toDeleteRowID: toDeleteRowID }
  };
  try {
    const [job] = await bigquery.createQueryJob(options);
    await job.getQueryResults();
    res.status(200).send({ message: 'Row deleted successfully' });
  } catch (error) {
    console.error("Error deleting row:", error.stack);
    res.status(500).send({ message: 'Error deleting row', error })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
