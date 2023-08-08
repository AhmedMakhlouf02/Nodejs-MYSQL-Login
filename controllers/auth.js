const mysql = require('mysql')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});


db.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log(`My Database is Connected ...`);
    }
})



const register = (req,res)=>{
    console.log(req.body);

    const {name, email, password, passwordConfirm} = req.body

    db.query('SELECT email from users  WHERE email = ? ',[email], async(error, results)=>{
        if(error){
            console.log(error);
        }if(results.length > 0){
            return res.render('register',{message: 'That email is already in use'})
        }else if(password !== passwordConfirm){
            return res.render('register',{message: `Password don't match`})   
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query("INSERT INTO users SET ?",{name: name, email: email, password: hashedPassword},(error,results)=>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                // just for demo, normally provided by DB
                const id = new Date().getDate()
                const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
                // Set the JWT token as a cookie
                res.cookie('jwt', token, {httpOnly: true, maxAge: 3600000})
                res.render('register',{
                    message: "User registered"
                })
                }
        })

    });

    
}

module.exports = {register}