
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { BigQuery } = require('@google-cloud/bigquery');
const { OAuth2Client } = require("google-auth-library");
const verfityClient = new OAuth2Client("345268998486-b5q60ibbcn446c8egalgcdveuggthdtq.apps.googleusercontent.com");

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
  projectId: 'lwybigqueryproject',
  keyFilename: 'lwy_skl.json',
});
const datasetId = 'temp_dataset'
const tableId = 'PointRequestNew'

// Define an API route to run a BigQuery query
app.get('/bigquery', async (req, res) => {

  console.log('Invoke PointType')
  const query = `
    SELECT *
    FROM \`lwybigqueryproject.temp_dataset.PointType\`
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
SELECT pt.PointMultiplier, pt.PointTypeName,pr.* FROM \`lwybigqueryproject.temp_dataset.PointRequestNew\` as pr
left join \`lwybigqueryproject.temp_dataset.PointType\` as pt
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

app.get('/allShopInformation', async (req, res) => {
  const getQuery = `
    SELECT \`店舗コード\` as ShopCode,\`店舗名漢字\` as ShopName
    FROM \`lwybigqueryproject.temp_dataset.all_shop_information\`
  `;

  try {
    // Pass the query string in an object with the key 'query'
    const [job] = await bigquery.createQueryJob({ query: getQuery });
    const [rows] = await job.getQueryResults();
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get('/allCrewList', async (req, res) => {
  const getQuery = `
    SELECT DISTINCT EmployeeID, EmployeeName 
    FROM \`lwybigqueryproject.temp_dataset.SmartHR_20240401\`
  `;

  try {
    // Pass the query string in an object with the key 'query'
    const [job] = await bigquery.createQueryJob({ query: getQuery });
    const [rows] = await job.getQueryResults();
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.post('/api/validate', async (req, res) => {

  console.log('Invoke Validate')
  let requestBody = req.body;
  const employeeId = requestBody.user_id;
  console.log(req.body);
  console.log(employeeId);

  const validateQuery = `
select count(Point) as totalRow from \`lwybigqueryproject.temp_dataset.PointRequestNew\`
WHERE EXTRACT(YEAR FROM Date) = EXTRACT(YEAR FROM CURRENT_DATETIME())
  AND EXTRACT(MONTH FROM Date) = EXTRACT(MONTH FROM CURRENT_DATETIME())
  and RequestEmployeeId= @employeeId
  and PointTypeID is not null
`
  const validateOption = {
    query: validateQuery,
    params: { employeeId: employeeId },
  }

  try {
    const [job] = await bigquery.createQueryJob(validateOption);
    const [rows] = await job.getQueryResults();
    console.log("row" + rows[0]);
    res.json(rows[0]);
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
    const DateParam = passParam["Date"];


    console.log(DateParam);
    const updateQuery = `update \`lwybigqueryproject.temp_dataset.PointRequestNew\` 
                        set AuthorityEmployeeId=@requestEmployeeId
                        , RequestEmployeeId=@employeeId
                        , RequestEmployeeName=@employeeName
                        ,Date=CAST(TIMESTAMP(@DateParam) AS DATETIME)  where ID=@guid
                        and CreatedAt < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR);`;

    const options = {
      query: updateQuery,
      params: {
        requestEmployeeId: requestEmployeeId,
        employeeId: employeeId,
        employeeName: employeeName,
        guid: guid,
        DateParam: DateParam
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
  const { requestEmployeeId, employeeId, employeeName, pointAmount, SelectedDate } = req.body;
  if (!requestEmployeeId || !employeeId || !employeeName || !SelectedDate) {
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
      "PointTypeID": 1,
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
    DELETE FROM \`lwybigqueryproject.temp_dataset.PointRequestNew\`
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

async function verifyToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: "345268998486-b5q60ibbcn446c8egalgcdveuggthdtq.apps.googleusercontent.com",  // Specify your client ID
  });

  const payload = ticket.getPayload();  // This contains user information
  return payload;  // You can now extract name, email, picture, etc.
}

app.post("/verify", async (req, res) => {
  const { token } = req.body;

  try {
    const userInfo = await verifyToken(token);
    res.status(200).send(userInfo);
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});
