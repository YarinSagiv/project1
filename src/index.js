// Load Node modules
const express = require("express");
const ejs = require('ejs');
// Initialise Express
const app = express();

const appPort = process.env.PORT || 4000;

const MongoClient = require('mongodb').MongoClient;
const { request } = require("express");
const { ReplSet } = require("mongodb");
const url = "mongodb+srv://ymon:ymonashdod@cluster.0qqlp.mongodb.net/eventSaver?retryWrites=true&w=majority";
var Uid = "";
var typeUser = "";
var fullName = "";


// Set the view engine to ejs
app.set("view engine", "ejs");
// Render static files
app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));


app.listen(appPort);
console.log(`app is running. port: ${appPort}`);
console.log(`http://127.0.0.1:${appPort}/`);

function addViewer(req, res, next) {
    req.state = {};
    req.addState = function (key, value) {
        req.state[key] = value;
    };
    res.view = function (viewName, moreState) {
        res.render(viewName, Object.assign({ id1: Uid, typeUser: typeUser, Uname: fullName }, req.state, moreState,));
    };
    next();
}

app.use(addViewer);

// *** GET Routes - display pages ***
// Root Route
app.get("/", function (req, res) {
    res.view("pages/firstpage");
});

app.get("/contactUs", function (req, res) {
    res.view("pages/contactUs");
});



app.get("/logOut", function (req, res) {
    Uid = "";
    typeUser = "";
    fullName = "";
    res.view("pages/firstpage");
});

app.get("/logIn", function (req, res) {
    if (Uid != "") {
        res.redirect("/");
    }
    else {
        res.view("pages/logIn", { suc2: true });
    }
});

app.get("/addEvent", function (req, res) {
    if (Uid != "" && typeUser != "Employers") {
        res.redirect("/");
    }
    else {
        res.view("pages/addEvent", { suc3: true });

    }
});


app.get("/updateEvent", function (req, res) {
    if (Uid != "" && typeUser != "Employers") {
        res.redirect("/");
    }
    else {
        res.view("pages/updateEvent", { suc3: true });

    }
});

app.get('/newu', function (req, res) {

    if (Uid != "") {
        res.redirect("/");
    }
    else {
        res.view('pages/newu', { suc1: true });
    }
});


app.get('/newC', function (req, res) {
    if (Uid != "" && typeUser == "resourcesCompanyWorkers")
        res.view('pages/newC', { temp1: true });
    else
        res.redirect("/");
});


app.get('/changeC', function (req, res) {
    if (Uid != "" && typeUser == "ContractorWorkers")
        res.view('pages/changeC', { temp1: true });
    else
        res.redirect("/");
});

app.get('/newHR', function (req, res) {
    if (Uid != "" && typeUser == "resourcesCompanyWorkers")
        res.view('pages/newHR', { temp2: true });
    else
        res.redirect("/");
});

app.get('/changeHR', function (req, res) {
    if (Uid != "" && typeUser == "resourcesCompanyWorkers")
        res.view('pages/changeHR');
    else
        res.redirect("/");
});

app.get('/changeE', function (req, res) {
    if (Uid != "" && typeUser == "Employers")
        res.view('pages/changeE');
    else
        res.redirect("/");
});

// function that input to the data base the details that the user enter when he add contractor worker to the website
app.post('/inputDBcontractor', (req, res) => {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myobj = {
            _id: req.body.iduser,
            firstName: req.body.firstname,
            lastName: req.body.secname,
            password: req.body.psw,
            phoneNumbers: null,
            userName: req.body.username,
            email: null,
            hasAddress: false,
            address: null,
            jobTypes: null,
            dates: null,
            jobRate: null,
            accompaniedServices: null,
            rangeOfPrice: null,
            minPrice: null,
            maxPrice: null,
            gender: "other"


        };


        var succ = dbo.collection("ContractorWorkers").insertOne(myobj, function (err, resault1) {

            if (err) {
                res.view("pages/newC", { temp1: "false" });
            }
            else {

                res.redirect("/"); //the response 
            }
            console.log("1 document inserted");
            db.close();

        });
    });
});

// function that input to the data base the details that the user enter when he add humam resource company worker to the website
app.post('/inputDBHR', (req, res) => {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myobj = {
            _id: req.body.iduser,
            firstName: req.body.firstname,
            lastName: req.body.secname,
            password: req.body.psw,
            phoneNumbers: null,
            userName: req.body.username,
            email: null
        };
        var succ = dbo.collection("resourcesCompanyWorkers").insertOne(myobj, function (err, resault2) {

            if (err) {
                res.view("pages/newHR", { temp2: "false" });
            }
            else {
                res.redirect("/"); //the response 
            }
            console.log("1 document inserted");
            db.close();

        });
    });
});

app.post('/updatePasswordC', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };
        var newvalues = { $set: { password: req.body.psw } };
        dbo.collection("ContractorWorkers").updateOne(myquery, newvalues, function (err, res1) {
            if (err) throw err;
            else {
                //alert("password changed successfully!");
                res.redirect("/"); //the response 
            }
            console.log("1 document updated");
            db.close();
        });
    });
});

app.post('/updatePasswordHR', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };
        var newvalues = { $set: { password: req.body.psw } };
        dbo.collection("resourcesCompanyWorkers").updateOne(myquery, newvalues, function (err, res2) {
            if (err) throw err;
            else {
                //alert("password changed successfully!");
                res.redirect("/"); //the response 
            }
            console.log("1 document updated");
            db.close();
        });
    });
});

app.post('/updatePasswordE', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };
        var newvalues = { $set: { password: req.body.psw } };
        dbo.collection("Employers").updateOne(myquery, newvalues, function (err, res3) {
            if (err) throw err;
            else {
                //alert("password changed successfully!");
                res.redirect("/"); //the response 
            }
            console.log("1 document updated");
            db.close();
        });
    });
});

app.get('/deleteC', (req, res) => {
    //-- delete document example:
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };
        dbo.collection("ContractorWorkers").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            //alert("account deleted successfully!");
            console.log("1 document deleted");
            res.redirect("/logOut");
            db.close();
        });
    });
});

app.get('/deleteHR', (req, res) => {
    //-- delete document example:
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };
        dbo.collection("resourcesCompanyWorkers").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            //alert("account deleted successfully!");
            console.log("1 document deleted");
            res.redirect("/logOut");
            db.close();
        });
    });
});

app.get('/deleteE', (req, res) => {
    //-- delete document example:
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };
        dbo.collection("Employers").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            //alert("account deleted successfully!");
            console.log("1 document deleted");
            res.redirect("/logOut");
            db.close();
        });
    });
});



app.get('/updateProfileContractor', function (req, res) {
    /* 
        get ditails from db
    */

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var query = { _id: Uid };
        dbo.collection("ContractorWorkers").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                res.view('pages/updateProfileContractor', result[0]);
            }
            db.close();
        });
    });

});



app.post('/updateEvent', async (req, res) => {


    var query = { _id: Uid }; //id employer
    var newvalues = { $set: {} };

    var date = req.body.date;

    let rec1 = await dbo.collection("Recuitment").find(query).toArray();
    let con1 = await dbo.collection("ContractorWorkers").find(rec1[0].idC).toArray();
    var i;
    for (i=0;i<con1.length; i++)
    {
        var unDates=con1[i][dates].split(",");
        if (unDates.includes(req.date))
        {
             res.view('pages/addEvent', { suc3: false });
        }

        else
        {
            // if the location of the event change - email will send to all the contructors
            lastLoc==con1[i][event][location];
            if(lastLoc!=req.body.eventloc)
            {
                emaildate(i);
            }

             // if the date of the event change - email will send to the contructor
            lastDate=con1[i][event][date];            
            if(lastDate!=req.body.date)
            {
                emailLoc(i);
            }
        }
    
    }

});


app.post('/inputEvent', async (req, res) => {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");

        var myobj = {
    
            eventname: req.body.eventname,
            eventLoc: req.body.eventLoc,
            numGuest: req.body.numGuest,
            date: req.body.date,
            time: req.body.time,
            idE: Uid
        }

        var succ = dbo.collection("Event").insertOne(myobj, function (err, res1) {

            console.log("1 document inserted");
            res.redirect("/profileEmployerPage"); //the response 
            db.close();

        });


    });
});
//send email with the new date to  the contructor worker

function emaildate(index)
{
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eventsaver2@gmail.com',
        pass: 'eventsaver2323!'
      }
    });
    
    var mailOptions = {
      from: 'eventsaver2@gmail.com',
      to: con1[index][email],
      subject: 'Sending Email using Node.js',
      text: 'The location of the event change to'+String(req.body.eventloc)
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}




//send email with the new location to  the contructor worker
function emailLoc(index)
{
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eventsaver2@gmail.com',
        pass: 'eventsaver2323!'
      }
    });
    
    var mailOptions = {
      from: 'eventsaver2@gmail.com',
      to: con1[index][email],
      subject: 'Sending Email using Node.js',
      text: 'The date of the event change to'+String(req.body.date)
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}


app.post('/updateContractor', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };

        var hasA, theA, date; //address
        if (typeof req.body.addressC != "undefined") {
            hasA = true;
        }
        else
            hasA = false;
        if (hasA)
            theA = req.body.address;
        else
            theA = null;
        /*if (req.body.areas == "")
            area = null;*/
        if (req.body.dates == "")
            date = null;
        else
            date = req.body.dates;

        var newvalues = { $set: { firstName: req.body.firstname, lastName: req.body.lastname, email: req.body.email, hasAddress: hasA, address: theA, phoneNumbers: req.body.phone, dates: date, jobTypes: req.body.types, gender: req.body.gender } };

        dbo.collection("ContractorWorkers").updateOne(myquery, newvalues, function (err, res1) {
            if (err) throw err;
            //alert("account updated successfully!");

            console.log("1 document updated");

            fullName = req.body.firstname + " " + req.body.lastname;

            res.view("pages/firstpage");

            db.close();
        });
    });

    //res.send({redirect: '/blog'});
    //res.redirect('/');
});

// function that input to the data base the details that the user enter when he register to the website
app.post('/inputDataBase', (req, res) => {


    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myobj = {
            _id: req.body.iduser,
            firstName: req.body.firstname,
            lastName: req.body.secname,
            phoneNumbers: req.body.phone,
            userName: req.body.username,
            email: req.body.email,
            password: req.body.psw,
         
        };


        var succ = dbo.collection("Employers").insertOne(myobj, function (err, res1) {

            if (err) {

                res.view("pages/newu", { suc1: "false" });
            }
            else {
                //alert("account added successfully!");
                console.log("1 document inserted");
                res.redirect("/"); //the response 
                db.close();

            }



        });

    });







});


app.post('/loginInCheck', async (req, res) => {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");

        var query = { userName: req.body.uname, password: req.body.psw };
        let EmployersArray1 = await dbo.collection("Employers").find(query).toArray();
        let EmployersArray2 = await dbo.collection("ContractorWorkers").find(query).toArray();
        let EmployersArray3 = await dbo.collection("resourcesCompanyWorkers").find(query).toArray();
        if (EmployersArray1.length == 0 && EmployersArray2.length == 0 && EmployersArray3.length == 0) {
            res.view("pages/logIn", { suc2: "false" });

        }
        else if (EmployersArray1.length != 0) {
            typeUser = "Employers";
            Uid = EmployersArray1[0]._id;
            fullName = EmployersArray1[0].firstName + " " + EmployersArray1[0].lastName;
            res.redirect("/"); //the response 
        }
        else if (EmployersArray2.length != 0) {
            typeUser = "ContractorWorkers";
            Uid = EmployersArray2[0]._id;
            fullName = EmployersArray2[0].firstName + " " + EmployersArray2[0].lastName;
            res.redirect("/"); //the response 
        }
        else if (EmployersArray3.length != 0) {
            typeUser = "resourcesCompanyWorkers";
            Uid = EmployersArray3[0]._id;
            fullName = EmployersArray3[0].firstName + " " + EmployersArray3[0].lastName;
            res.redirect("/"); //the response 
        }

        db.close();
    });
});


app.get('/updateProfileEmployer', function (req, res) {
    if (Uid != "" && typeUser == "Employers") {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("eventSaver");
            //var query = { _id: Uid };
            var query = { _id: Uid };
            dbo.collection("Employers").find(query).toArray(function (err, result) {
                if (err) throw err;
                if (result.length != 0) {
                    res.view('pages/updateProfileEmployer', result[0]);
                }
                else
                    res.redirect("/");

                db.close();
            });
        });
    }
    else
        res.redirect("/");

});


app.post('/updateProfileEmployer', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };

        var newvalues = { $set: { firstName: req.body.firstname, lastName: req.body.lastname, email: req.body.email, phoneNumbers: req.body.phone } };

        dbo.collection("Employers").updateOne(myquery, newvalues, function (err, res1) {
            if (err) { throw err; }
            //alert("account updated successfully!");
            console.log("1 document updated");

            fullName = req.body.firstname + " " + req.body.lastname;
            res.redirect("/");

        });
        db.close();

    });

});


app.get("/profileEmployerPage", function (req, res) {
    if (Uid != "" && typeUser == "Employers") {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("eventSaver");
            var query = { _id: Uid };
            dbo.collection("Employers").find(query).toArray(function (err, result) {
                if (err) throw err;
                if (result.length != 0) {
                    res.view('pages/profileEmployerPage', result[0]);
                }
                db.close();
            });
        });
    }
    else {
        res.redirect('/');
    }
});

app.get("/profileContractorPage", function (req, res) {
    var info = "";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        //var query = { _id: Uid };
        var query = { _id: Uid };
        dbo.collection("ContractorWorkers").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                res.view('pages/profileContractorPage', result[0]);
            }
            db.close();
        });
    });
});



app.post('/updatePasswordE', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: Uid };
        var newvalues = { $set: { password: req.body.psw } };
        dbo.collection("Employers").updateOne(myquery, newvalues, function (err, res3) {
            if (err) throw err;
            else {
                res.render("pages/firstpage"); //the response 
            }
            //alert("password updated successfully!");
            console.log("1 document updated");
            db.close();
        });
    });
});


app.get("/searchContractor", function (req, res) {
    if (Uid != "" && (typeUser == "Employers" || typeUser == "resourcesCompanyWorkers")) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("eventSaver");
            var query = {};

            var firstname = req.body.firstname1;
            if (firstname != "")
                query["firstName"] = firstname;

            dbo.collection("ContractorWorkers").find(query).toArray(function (err, result) {
                if (err) throw err;
                if (result.length != 0) {
                    console.log(result[0][firstname]);
                    res.view('pages/searchContractorWorker', result[0]);
                }
                db.close();
            });
        });
    }
    else {
        res.redirect('/');
    }
});
app.get("/searchContractorWorker", function (req, res) {
    res.view('pages/searchContractorWorker');
});


app.get("/contractorReports", function (req, res) {
    res.view("pages/contractorReports", { Recruits: null });
});

app.post('/contractorReports', async (req, res) => {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");



        //db.inventory.find( { status: "A" }, { item: 1, status: 1, _id: 0 } )

        //projection
        var fieldsE = { _id: 0 }; //do not bring id field
        var fieldsR = {};

        if (typeof req.body.nameEmp != undefined) {
            fieldsE.firstName = 1;
            fieldsE.lastName = 1;
        }
        if (typeof req.body.phone != undefined) {
            fieldsE.phoneNumbers = 1;
        }
        if (typeof req.body.email != undefined) {
            fieldsE.email = 1;
        }
        if (typeof req.body.date != undefined) {
            fieldsR.date = 1;
            fieldsR.startTime = 1;
        }
        if (typeof req.body.location != undefined) {
            fieldsR.location = 1;
        }

        //-------
        Uid = "208375709";
        //-------

        let recruits = await dbo.collection("Recuitment").find({ idC: Uid }, fieldsR).toArray();
        console.log("recruits:   "+JSON.stringify(recruits));
        console.log("recruits[0].idEmployer = "+recruits[0].idEmployer);

        var united = [];
        for (var i=0;i<recruits.length;++i) {
            let employer = await dbo.collection("Employers").find({ _id: recruits[i].idEmployer }).toArray();
            console.log("employer  " + JSON.stringify(employer[0]));

            united.push({ ...recruits[i], ...employer[0] });
            console.log("united  " + JSON.stringify(united));

        }

        if (recruits.length != 0) {
            var send = {
                nameEmp: req.body.nameEmp,
                phone: req.body.phone,
                email1: req.body.email,
                date: req.body.date,
                location: req.body.location,
                Recruits: united
            };

            res.view("pages/contractorReports", send);
        }
        //if (typeof req.body.nameEmp != "undefined")



    });
});













// https://project1sprint1.herokuapp.com
