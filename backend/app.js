require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dbretriever = require('./dbretriever');


const PORT = process.env.PORT || 8080;

const app = express();

app.get("/", (req, res) => {
    res.send("Service is running...");
})

app.listen(PORT, () => {
    console.log("Process running on http://localhost:" + PORT + " ...");
})
