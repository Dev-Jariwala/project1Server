const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const router = require('./router/router')
require('./db/conn')
const UserData = require('./model/UserSchema')

const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack


const port = process.env.PORT || 8080;

/** HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});


/** api routes */
app.use('/api', router)
app.listen(port, () => {
    console.log(`Server connected to http://localhost:${port}`);
})