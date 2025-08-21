const mongoose = require('mongoose')

async function connectDB(){

    try{
       await mongoose.connect(process.env.MONGODB_URL)
        console.log("mongodb is connected successfully")

    }catch(err){
        console.log('mongodb is not connected ')
    }
}

module.exports = connectDB