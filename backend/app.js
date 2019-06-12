import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import router from './routes/index.js';


// Set up the express app
const app = express();

// Parse incoming requests data
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use our routes from './routes/index.js'
app.use(router);

// Variable port to listen on
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port localhost:${PORT}`)
});