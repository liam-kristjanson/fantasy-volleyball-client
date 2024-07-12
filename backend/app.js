require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dbretriever = require('./dbretriever');

const playerController = require('./controllers/PlayerController');

const PORT = process.env.PORT || 8080;
const corsOptions = {
    origin: process.env.FRONT_ORIGIN,
    optionsSuccessStatus: 204,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
};

const app = express();

app.use(cors(corsOptions))

app.get("/", (req, res) => {
    res.send("Service is running...");
})

app.get("/players", playerController.getRankedPlayers);

app.listen(PORT, () => {
    console.log("Process running on http://localhost:" + PORT + " ...");
})
