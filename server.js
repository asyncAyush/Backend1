
const app = require('../../src/app.js');
const connectDB = require('../../src/db/db');
require('dotenv').config()

connectDB()
app.listen(3000, async(req , res) => {
    console.log("server is running on port 3000")
})