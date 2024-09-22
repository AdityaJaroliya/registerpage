const express=require('express');
const { copyFileSync } = require('fs');
const mysql=require('mysql');
const path=require('path');

const app=express();

app.use(express.urlencoded({extended:true}))
app.use(express.json());

//setting up my view for server side rendering..
app.set('view engine',"ejs");
app.set("views", path.resolve('./views'))

// creating connection with database
var con= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root123",
    database:"llp"
})

con.connect(function(err){
    if(err) throw err;
    console.log("connected!")
})





const port=8000;

app.get('/register', (req, res)=>{
    return res.render('register')
})

app.post('/registerUser', (req, res) => {
    const { user, address } = req.body;

    const sql1 = "INSERT INTO user(userName) VALUES(?)";
    const sql2 = "INSERT INTO addresses(address) VALUES(?)";

    // Using a Promise to handle database queries
    con.query(sql1, [user], (err, result) => {
        if (err) {

            if(err.code==='ER_DUP_ENTRY')
                {
                  return res.status(409).json({msg:"User already registered"});
                }

          console.error(err);
            return res.status(500).json({ error: "Failed to register user" });

           
        }
       

        con.query(sql2, [address], (err2, result2) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ error: "Failed to register address" });
            }

            return res.status(200).json({ msg: "New user registered" });
        });
    });
});

    




app.listen(port,()=>{
    console.log(`port is running at port:${port}`)

})

