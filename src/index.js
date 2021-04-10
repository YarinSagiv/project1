// Load Node modules
const express = require("express");
const ejs = require('ejs');
// Initialise Express
const app = express();

const app_port = process.env.PORT || 4000;

const MongoClient = require('mongodb').MongoClient;
const { request } = require("express");
const url = "mongodb+srv://ymon:ymonashdod@cluster.0qqlp.mongodb.net/eventSaver?retryWrites=true&w=majority";



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
    res.render("pages/logIn");
});

app.get("/connectpage", function (req, res) {
    res.render('pages/connectpage');
});

app.get('/newu', function (req, res) {
    res.render('pages/newu');
});

app.get('/updateProfileContractor', function (req, res) {
    /* 
        get ditails from db
    */
    var Uid = 1234; //the user's ID after logging in //TODO
    var info = "";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        //var query = { _id: Uid };
        var query = { firstName: "mor" };
        dbo.collection("Employers").find(query).toArray(function (err, result) {
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
    console.log(req.body.phone);
    //------TEST:
    /*
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myobj = { firstName: req.body.firstname, lastName: req.body.lastname };
        dbo.collection("Employers").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });*/

    res.end();
});


app.get('/updateProfileEmployer', function (req, res) {
    res.render('pages/updateProfileEmployer');
});


// https://project1sprint1.herokuapp.com






