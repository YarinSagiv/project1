// Load Node modules
const express = require("express");
const ejs = require('ejs');
// Initialise Express
const app = express();

const app_port = process.env.PORT || 4000;

const MongoClient = require('mongodb').MongoClient;
const { request } = require("express");
const url = "mongodb+srv://ymon:ymonashdod@cluster.0qqlp.mongodb.net/eventSaver?retryWrites=true&w=majority";
var Uid = "208394701";


// Set the view engine to ejs
app.set("view engine", "ejs");
// Render static files
app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));


app.listen(app_port);
console.log(`app is running. port: ${app_port}`);
console.log(`http://127.0.0.1:${app_port}/`);

// *** GET Routes - display pages ***
// Root Route
app.get("/", function (req, res) {
    res.render("pages/firstpage");
});

app.get("/logIn", function (req, res) {
    res.render("pages/logIn",{suc2: true});
});

app.get("/connectpage", function (req, res) {
    res.render('pages/connectpage');
});

app.get('/newu', function (req, res) {
    res.render('pages/newu',{suc1: true});
});

app.get('/updateProfileContractor', function (req, res) {
    /* 
        get ditails from db
    */
    //the user's ID after logging in //TODO
    var info = "";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        //var query = { _id: Uid };
        var query = { _id: Uid };
        dbo.collection("ContractorWorkers").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                console.log(result[0].lastName); //test
                //info = result[0];
                res.render('pages/updateProfileContractor', result[0]);
            }
            db.close();
        });
    });

    /*
      redirect to the update page and send the ditails
    */
    console.log("info " + info);
    //res.render('pages/updateProfileContractor', { name: "mor" });
});

app.post('/updateContractor', (req, res) => {
    console.log("phone+" + req.body.addressC);

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };

        var hasA, theA, area; //address
        if (typeof req.body.addressC != "undefined"){
            hasA = true;
            console.log("hasA 1");
        }
        else
            hasA = false;
        if(hasA)
            theA=req.body.address;
        else
            theA=null;
        if(req.body.areas=="")
            area=null;

        var newvalues = { $set: { firstName: req.body.firstname, lastName: req.body.lastname, email: req.body.email, hasAddress: hasA, address: theA, phoneNumbers:req.body.phone, countryAreas:area, jobTypes:req.body.types } };

        dbo.collection("ContractorWorkers").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });

    //res.send({redirect: '/blog'});
    res.redirect('/');
});

// function that input to the data base the details that the user enter when he register to the website
app.post('/inputDataBase', (req, res) => {


      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myobj = { _id: req.body.iduser,
                      firstName:  req.body.firstname,
                      lastName: req.body.secname,
                      phoneNumbers: req.body.phone,
                      userName: req.body.username,
                      email: req.body.email,
                      password:req.body.psw };
       
        
        var succ=dbo.collection("Employers").insertOne(myobj, function(err, res1) {

          if (err) 
          {
            
            res.render("pages/newu",{suc1 : "false"}); 
          }
          else
          {
            res.render("pages/firstpage"); //the response 
          }

        
          console.log("1 document inserted");
          db.close();
         
          });

        });
        
    

        
        
      
    
});


app.post('/loginInCheck',(req, res) => {
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");

        var query = { userName: req.body.uname,password:req.body.psw };
        dbo.collection("Employers").find(query).toArray(function(err, result) {
        if (result.length==0)
        {
            
            res.render("pages/logIn",{suc2 : "false"}); 

        }
        else
        {
            res.render("pages/firstpage"); //the response 

        }
        db.close();
    
    
});
});
});



app.get('/updateProfileEmployer', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        //var query = { _id: Uid };
        var query = { _id: "208394700" };
        dbo.collection("Employers").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                console.log(result[0].phoneNumbers); //test
                //info = result[0];
                res.render('pages/updateProfileEmployer', result[0]);
            }
            db.close();
        });
    });

    //res.render('pages/updateProfileEmployer');
});


app.post('/updateProfileEmployer', function (req, res) {
    //res.render('pages/updateProfileEmployer');
    console.log(req.body.firstName);
    res.end();
});

// https://project1sprint1.herokuapp.com
