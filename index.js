const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors")

connectDb();

const app = express();
app.use(cors())

const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to backend")
})

app.use('/api/user', require("./routes/userRoutes"));
app.use('/api/image', require("./routes/imageRoutes"));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});