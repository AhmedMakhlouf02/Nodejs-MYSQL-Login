const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dotenv = require('dotenv');
const route = require('./routes/pages');
const auth = require('./routes/auth');




const PORT = process.env.PORT || 5001


dotenv.config({ path: './.env' });
// Parsing URL encoded bodies ( as sent by HTML forms )
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Define routes
app.use('/',route)
app.use('/auth', auth)



const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))
app.set('view engine', 'hbs');







app.listen(PORT, ()=>{
    console.log(`The Server Started on PORT ${PORT}`);
    
    
})

// module.exports = db;
