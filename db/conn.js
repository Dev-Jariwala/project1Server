require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connection Sucessful........')

    })
    .catch((e) => {
        console.log(e)
    })