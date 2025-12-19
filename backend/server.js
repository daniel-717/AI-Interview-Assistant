const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

connectDB();


app.use(express.json());
app.use(cors());

const Interview =  require('./routes/interviewRoutes');
app.use('/api/interviews', Interview);
app.use('/api/quiz', Interview); // Using same routes for quiz for now

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));