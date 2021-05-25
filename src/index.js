// Load Node modules
const express = require("express");
const ejs = require('ejs');
// Initialise Express
const app = express();

const appPort = process.env.PORT || 4000;

const MongoClient = require('mongodb').MongoClient;
const { request, query } = require("express");
const { ReplSet, ObjectID } = require("mongodb");
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

app.get("/selectEventUp", async function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        //Uid="316461375";
        var myquery = { idE: Uid };
        var dbo = db.db("eventSaver");
        let ev1 = await dbo.collection("Event").find(myquery).toArray();
        //console.log(ev1.length);
        //console.log(JSON.stringify(ev1));
        console.log("yaringets");
        res.view("pages/selectEventUp", { ev1: ev1 });

    });

});

app.get("/chooseEventUpdate", async function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var myquery = { idE: Uid };
        var dbo = db.db("eventSaver");
        let ev1 = await dbo.collection("Event").find(myquery).toArray();
        console.log(ev1);
        res.view("pages/chooseEventUpdate", { ev1: ev1 });
    });
});

app.get("/RecruitContractorWorker", function (req, res) {
    res.redirect("/");
});

app.get("/chooseContractorRecruit", function (req, res) {
    res.view("pages/chooseContractorRecruit", { suc1: true });
});

app.get("/chooseContractorUpdate", function (req, res) {
    res.view("pages/chooseContractorRecruit", { suc1: true });
});

app.get("/updateRecruit", function (req, res) {
    res.redirect("/");

});

app.post("/updateRecruit", async function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var iduser;//לא לשכוח למחוק!!!!!
        var dbo = db.db("eventSaver");
        var myquery = { idC: iduser };
        var theA;

        if (req.body.locationC == true) {
            theA = await dbo.collection("ContractorWorkers").find(myquery).toArray();
        }
        else {
            theA = req.body.locationE;
        }
        var myobj = {
            startTime: req.body.startTime,
            location: theA,
            status: "pending"
        };

        dbo.collection("Recuitment").updateOne(myquery, myobj, function (err, res1) {
            if (err) throw err;
            console.log("1 document updated");
            res.view("pages/firstpage");
            db.close();
        });
    });

});

app.post("/RecruitContractorWorker", async function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var iduser;//לא לשכוח למחוק!!!!!
        var myquery = { _id: iduser };
        var quar = { _id: Uid };
        var theA;
        if (req.body.locationC == true) {
            var cont = await dbo.collection("ContractorWorkers").find(myquery).toArray();
            if (cont.length != 0)
                theA = cont[0].address;
            else
                theA = '';
        }
        else {
            theA = req.body.locationE;
        }

        var cont2 = await dbo.collection("Event").find(quar).toArray();
        var values;
        if (cont.length != 0) {
            values = {
                idC: iduser,
                idEmployer: Uid,
                idEvent: cont2[0]._id,
                date: cont2[0].date,
                location: theA,
                startTime: req.body.startTime,
                information: req.body.information,
                status: "pending"
            };
        }
        else {
            throw "no event found";
        }


        var inputsucc = dbo.collection("Recuitment").insertOne(values, function (err, resault1) {

            if (err) {
                res.view("pages/RecruitContractorWorker", { temp1: "false" });
            }
            else {

                res.redirect("/"); //the response 
            }
            console.log("1 document inserted");
            db.close();
        });

    });

});

app.post('/chooseEventUpdate', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        // console.log(req.body.selectE);
        var myquery = { idE: Uid, eventname: req.body.selectE };
        //console.log(idE);
        var dbo = db.db("eventSaver");
        dbo.collection("Event").find(myquery).toArray(function (err, result) {
            if (err) throw err;
            //console.log(Uid);
            if (result.length != 0) {
                result[0].suc3 = true;
                //result[0].select=req.body.selectE;
                console.log(result);
                res.view('pages/updateRecruit', result[0]); //result[0] is the update event
            }
            db.close();
        });

    });
});


app.post('/chooseContractorRecruit', async (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        console.log(req.body.iduser);
        var myquery = { _id: req.body.iduser };
        var dbo = db.db("eventSaver");
        let prices = await dbo.collection("jobRate").find(myquery).toArray();
        var send = {};
        let contractor = await dbo.collection("ContractorWorkers").find(myquery).toArray();
        console.log(contractor);
        if (contractor.length == 0) {
            send = { suc1: false };
        }
        else
            send = { suc1: true };

        myquery = { idE: Uid };
        let ev1 = await dbo.collection("Event").find(myquery).toArray();
        if (ev1.length == 0) {
            send.suc2 = false;
        }
        else
            send.suc2 = true;
        if (send.suc1 == false || send.suc2 == false) {
            res.view("pages/chooseContractorRecruit", send);
        }
        else {
            contractor[0].ev1 = ev1;
            contractor[0].prices = prices;
            res.view("pages/RecruitContractorWorker", contractor[0]);
        }

    });
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
    res.redirect("/");

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



app.post('/selectEventUp', (req, res) => {


    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        // console.log(req.body.selectE);
        var myquery = { idE: Uid, eventname: req.body.selectE };
        var dbo = db.db("eventSaver");
        dbo.collection("Event").find(myquery).toArray(function (err, result) {
            if (err) throw err;
            //console.log(Uid);
            if (result.length != 0) {
                result[0].suc3 = true;
                //result[0].select=req.body.selectE;
                console.log(result);
                res.view('pages/updateEvent', result[0]); //result[0] is the update event
            }
            db.close();
        });

    });





});

// function that input to the data base the details that the user enter when he add contractor worker to the website
app.post('/inputDBcontractor', (req, res) => {

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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



/*app.post('/inputRecruit', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myobj = {
            _id:req.body.iduser,
            idC: null,
            idEmployer:Uid,
            idEvent: null,
            date: null,
            startTime: req.body.startTime,
            location:req.body.WorkPlace,
            price:req.body.priceRate,
            information:req.body.information,
            workRate:req.body.workRate
        };
        var succ = dbo.collection("Recuitment").insertOne(myobj, function (err, resault2) {
            if (err) {
                res.view("pages/RecruitContractorWorker", { temp2: "false" , ev1:null });
            }
            else {
                res.redirect("/"); //the response 
            }
            console.log("1 document inserted");
            db.close();
        });
    });
});
*/


app.post('/updatePasswordC', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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



app.get('/updateProfileContractor', async function (req, res) {
    /* 
        get ditails from db
    */

    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var query = { _id: Uid };
        var query2 = { idC: Uid };
        let c1 = await dbo.collection("ContractorWorkers").find(query).toArray();
        let j1 = await dbo.collection("jobRate").find(query2).toArray(); //all the job rate

        console.log(j1);
        c1[0].j1 = j1;
        res.view('pages/updateProfileContractor', c1[0]);

        /*
        dbo.collection("ContractorWorkers").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                res.view('pages/updateProfileContractor', result[0]);
            }
            db.close();
        });
        */
    });

});

/*
app.post('/updateEvent',async function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true },async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
    console.log("update event");
    var query = { idEmployer: Uid }; //id employer
    res.redirect("/updateEvent",ev1); //the response 
    var newvalues = { $set: {} };
    var date = req.body.date;
    let rec1 = await dbo.collection("Recuitment").find(query).toArray(); //all the rectuit of this employer
    for (i=0;i<rec1.length; i++)
    {
        let con1 = await dbo.collection("ContractorWorkers").find(rec1[i].idC).toArray();
        dates=con1[0].dates.split(',');
        console.log("dates"+detes);
        
        if (unDates.includes(req.body.date))
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
    
    })
});
*/
//send email with the new date to  the contructor worker

function emaildate(con1,loc) {
    var nodemailer = require('nodemailer');
    //var con1=con1;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eventsaver2@gmail.com',
            pass: 'eventsaver2323!'
        }
    });

    for (var i = 0; i < con1.length; ++i) {
        var mailOptions = {
            from: 'eventsaver2@gmail.com',
            to: con1[i].email,
            subject: 'Sending Email using Node.js',
            text: 'The location of the event change to' + String(loc)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }


}



//send email with the new location to  the contructor worker
function emailLoc(con1,date) {
    var nodemailer = require('nodemailer');
    var con1 = con1;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eventsaver2@gmail.com',
            pass: 'eventsaver2323!'
        }
    });

    for (var i = 0; i < con1.length; ++i) {
        var mailOptions = {
            from: 'eventsaver2@gmail.com',
            to: con1[i].email,
            subject: 'Sending Email using Node.js',
            text: 'The date of the event change to' + String(date)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }


}

app.post('/updateEvent', async (req, res) => {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        console.log("update post");
        var canU = true;

        var query = { idEmployer: Uid }; //id employer
        let rec1 = await dbo.collection("Recuitment").find(query).toArray(); //all the recruit of this employer

        //console.log(Uid);
        //console.log(rec1);
        //console.log(rec1.length);

        for (var i = 0; i < rec1.length; i++)//all the recruit of this employer
        {
            //console.log("idc"+rec1[i].idC);
            var query22 = { _id: rec1[i].idC };
            let con1 = await dbo.collection("ContractorWorkers").find(query22).toArray(); //the details of the contractor that recruit
            //console.log("check con1:"+con1[0].dates);

            if (con1[0].dates != '') {
                var dates = con1[0].dates.split(',');
                console.log(dates);
                console.log(String(req.body.date));
            }

            if (dates.includes(String(req.body.date))) //if the new date of the event is date that the contractor cant work
            {
                
                canU = false;
                i=rec1.lenght;
                //console.log("iclude");

            }

            else {
                console.log(" not iclude");

                var q1={eventname:req.body.oldname};
                let event1 = await dbo.collection("Event").find(q1).toArray(); //event
                event1[0].suc3=true;
                //let event = await dbo.collection("Event").find(rec1[i].idEvent).toArray(); //the event 
                // if the location of the event change - email will send to all the contructors
                var lastLoc = event1[0].eventLoc;

                if (lastLoc != req.body.eventloc) {
                    //change loc
                    emailLoc(con1,req.body.eventloc);
                }

                // if the date of the event change - email will send to the contructor
                lastDate = event1[0].date;
                if (lastDate != req.body.date) {
                    //change date
                    emaildate(con1,req.body.date);
    
                }


            }


        }
        if (canU) {
            var myquery = { idE: Uid, eventname: req.body.oldname };

            var newvalues = {
                $set: {

                    eventname: req.body.eventname,
                    numGuest: req.body.numGuest,
                    date: req.body.date,
                    time: req.body.time,
                    idE: Uid
                }
            };
            let event = await dbo.collection("Event").updateOne(myquery, newvalues);
            res.view("pages/firstpage");


        }
        else{
            var q1={eventname:req.body.oldname};
            let event1 = await dbo.collection("Event").find(q1).toArray(); //event
            event1[0].suc3=false;
            res.view('pages/updateEvent',event1[0]);
        }


    });

});




app.post('/inputEvent', async (req, res) => {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");

        var myobj = {

            eventname: req.body.eventname,
            eventLoc: req.body.eventloc,
            numGuest: req.body.numGuest,
            date: req.body.date,
            time: req.body.time,
            idE: Uid
        };

        var succ = dbo.collection("Event").insertOne(myobj, function (err, res1) {

            console.log("1 document inserted");
            res.redirect("/profileEmployerPage"); //the response 
            db.close();

        });


    });
});


/*
//func that update the data base of event
app.post('/inputupdateEvent', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var myquery = { _id: req.idEvent };
        var myobj = {
            eventname: req.body.eventname,
            eventLoc: req.body.eventloc,
            numGuest: req.body.numGuest,
            date: req.body.date,
            time: req.body.time,
            idE: Uid
        }
        dbo.collection("Event").updateOne(myquery, myobj, function (err, res1) {
            if (err) throw err;
            console.log("1 document updated");
            res.view("pages/firstpage");
            db.close();
        });
    });
});
*/
app.post('/updateContractor', (req, res) => {


    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
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
        let update = await dbo.collection("ContractorWorkers").updateOne(myquery, newvalues);

        //delete all the documents of the job rate of this contractur
        var myqueryC = { idC: Uid };
        let delete1 = await dbo.collection("jobRate").deleteMany(myqueryC);



        var arrJobRate = req.body.jobrate;
        var jobrates = arrJobRate.split("-");
        //console.log(jobrates[0]);

        console.log(jobrates.length);
        var count = 0;
        for (var i in jobrates) {
            ++count;
            if (count < jobrates.length) {
                //console.log(jobrates[i]);
                var jobrates2 = jobrates[i].split(",");
                var jobR = {
                    title: jobrates2[1],
                    price: jobrates2[3],
                    idC: Uid,
                    description: jobrates2[5],
                    travelingFee: jobrates2[7],
                    accompanied: jobrates2[9]
                };

                console.log(jobR);
            }
            var succ = await dbo.collection("jobRate").insertOne(jobR);

            res.view("pages/firstpage");


            //console.log(jobrates2);
        }


        res.view("pages/firstpage");


    });
});

/*
dbo.collection("ContractorWorkers").updateOne(myquery, newvalues, async function (err, res1) {
    if (err) throw err;
    //alert("account updated successfully!");
    console.log("1 document updated");
    fullName = req.body.firstname + " " + req.body.lastname;
    db.close();
});
*/
/*
//delete all the documents of the job rate of this contractur
dbo.collection("jobRate").deleteOne(myquery, async function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
});
*/
//insert all the new documents of the job rate of this contractur

/*
for (var i = 0; i < arrJobRate.length; ++i) {
    var jobR = {
        title: arrJobRate[i].title,
        price: arrJobRate[i].price,
        idC: Uid,
        description: arrJobRate[i].des,
        travelingFee: arrJobRate[i].fee,
        accompanied: req.body.accompanied
    }
    var succ =await dbo.collection("jobRate").insertOne(jobR);
}
*/



//res.send({redirect: '/blog'});
//res.redirect('/');

// function that input to the data base the details that the user enter when he register to the website
app.post('/inputDataBase', (req, res) => {


    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
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
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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


app.get("/profileEmployerPage", async function (req, res) {
    if (Uid != "" && typeUser == "Employers") {
        MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            var dbo = db.db("eventSaver");
            var query = { _id: Uid };
            var query2 = { idE: Uid };

            let emp = await dbo.collection("Employers").find(query).toArray();
            let eve = await dbo.collection("Event").find(query2).toArray(); //the events

            if (emp.length != 0 && eve.length != 0) {
                emp[0].eve = eve;
                res.view('pages/profileEmployerPage', emp[0]);
            }

            db.close();

            /*
            dbo.collection("Employers").find(query).toArray(function (err, result) {
                if (err) throw err;
                if (result.length != 0) {
                    res.view('pages/profileEmployerPage', result[0]);
                }
                db.close();
            });
            */

        });
    }
    else {
        res.redirect('/');
    }
});

app.get("/profileContractorPage", async function (req, res) {
    var info = "";

    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        //var query = { _id: Uid };

        var query = { _id: Uid };
        var query2 = { idC: Uid };
        let c1 = await dbo.collection("ContractorWorkers").find(query).toArray();
        let j1 = await dbo.collection("jobRate").find(query2).toArray(); //all the job rate

        //console.log(j1);
        c1[0].j1 = j1;
        res.view('pages/profileContractorPage', c1[0]);
        db.close();

    });
});

app.get("/demoPofileE", function (req, res) {
    //if (Uid != "" && typeUser == "Employers") {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("eventSaver");
            var query = { _id: Uid };
            dbo.collection("Employers").find(query).toArray(function (err, result) {
                if (err) throw err;
                if (result.length != 0) {
                    res.view('pages/demoPofileE', result[0]);
                }
                db.close();
            });
        });
    //}
    //else {
       // res.redirect('/');
    //}
});

app.get("/demoPofileC", function (req, res) {
    var info = "";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        //var query = { _id: Uid };
        var query = { _id: Uid };
        dbo.collection("ContractorWorkers").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                res.view('pages/demoPofileC', result[0]);
            }
            db.close();
        });
    });
});



app.post('/updatePasswordE', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
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

/*app.get("/watchProfile", async (req, res) => {
    res.send(req.query.id)
    MongoClient.connect(url, { useUnifiedTopology: true },async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var query1 = { _id: req.query.id };
        let Found = await dbo.collection("Employers").find(query1).toArray();
        console.log("result of searchingE1: " + JSON.stringify(Found));
        console.log("result of searchingE2: " + JSON.stringify(Found[0]));
        console.log("result of searchingE3: " + JSON.stringify(Found[0]._id));
        console.log("result of searchingE4: " + JSON.stringify(Found._id));

        if (Found.length != 0) {
            console.log("Found.length != 0");
            res.render("pages/watchProfile?Found[0]._id");
        }
        //else
            //res.view("pages/searchContractorWorker", { contractorFound: null, messageNR: "no results found" });
    });
});*/
/*dbo.collection("Employers").find(query).toArray(function (err, result) {
    if (err) throw err;
    if (result.length != 0) 
    {
        
        res.render('pages/profileEmployerPage', result);
    }
    else
        res.redirect("/");
});
db.close();*/

//acsses to mongodb and fetch this id column
//render ejs with this data


app.post("/searchContractorWorker", async (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var dictQuery = {};
        var dictQuery2 = {};
        var firstnameI = req.body.INfirstname;
        var lastnameI = req.body.INlastname;
        var genderI = req.body.INgender;
        var accompaniedI = req.body.INaccompanied;
        var jobTypesI = req.body.INjobTypes;

        var from = parseInt(req.body.FROMjobRate);
        var to = parseInt(req.body.TOjobRate);
        var flag = false;
        var query = [
            {
                '$group': {
                    '_id': '$idC',
                    'rate': {
                        '$avg': '$rate'
                    }
                }
            }, {
                '$match': {
                    'rate': {
                        '$lt': to + 1, // lower then -- +1 to include the top value
                        '$gt': from // greater than
                    }
                }
            }
        ];
        let comments = await dbo.collection("Comments").aggregate(query).toArray();
        console.log("comments:  " + JSON.stringify(comments));
        console.log("from:  " + from);
        console.log("to:  " + to);
        var arr = [];
        for (var i = 0; i < comments.length; i++) {
            arr.push(comments[i]._id);
        }
        console.log("arrComments:  " + JSON.stringify(arr));


        if (req.body.fromPriceRates != "" || req.body.toPriceRates != "" || typeof accompaniedI != "undefined") {
            var priceFROMI = parseInt(req.body.fromPriceRates);
            var priceTOI = parseInt(req.body.toPriceRates);
            var query3 = [{ '$match': {} }];
            if (req.body.fromPriceRates != "" && req.body.toPriceRates == "") {
                query3 = [{
                    '$match': {
                        'price': {
                            '$gt': priceFROMI // greater than
                        }
                    }
                }
                ];
            }
            else if (req.body.fromPriceRates == "" && req.body.toPriceRates != "") {
                query3 = [{
                    '$match': {
                        'price': {
                            '$lt': priceTOI + 1 // lower then -- +1 to include the top value   
                        }
                    }
                }
                ];
            }
            else if (req.body.fromPriceRates != "" && req.body.toPriceRates != "") {
                query3 = [{
                    '$match': {
                        'price': {
                            '$lt': priceTOI + 1, // lower then -- +1 to include the top value
                            '$gt': priceFROMI
                        }
                    }
                }];
            }
            else {
                flag = true;
                query3 = [{
                    '$match': {
                        'accompanied': req.body.INaccompanied
                    }
                }];
            }
            if (flag == false && typeof accompaniedI != "undefined") {
                query3[0]['$match'].accompanied = accompaniedI;

            }
            query3[0]['$match'].idC = { '$in': arr };
            var query4 = query3[0]['$match'].idC;
            console.log("result of query4: " + JSON.stringify(query4));

            console.log("result of query3: " + JSON.stringify(query3[0]));


            let price2 = await dbo.collection("jobRate").aggregate(query4).toArray();
            console.log("check price:  " + JSON.stringify(price2));
            var arr = [];
            for (var i = 0; i < price2.length; i++) {
                arr.push(price2[i].idC);
            }
            console.log("arrprice2:  " + JSON.stringify(arr));
        }

        if (firstnameI != "") {
            dictQuery.firstName = firstnameI;
            console.log("check first name1:" + req.body.INfirstname);
        }
        if (lastnameI != "") {
            dictQuery.lastName = lastnameI;
            console.log("check last name1:" + req.body.INlastname);
        }
        if (typeof genderI != "undefined") {
            dictQuery.gender = genderI;
            console.log("check gender:" + req.body.INgender);
        }
        if (typeof jobTypesI != "undefined") {
            dictQuery.jobTypes = jobTypesI;
            //console.log("check JobType:" + req.body.selectE);
            console.log("check JobType:" + req.body.INjobTypes);
        }


        dictQuery._id = { '$in': arr };
        //query3[0]['$match'].idC = { '$in': arrComments };
        let contractorFound = await dbo.collection("ContractorWorkers").find(dictQuery).toArray();
        console.log("result of searching: " + JSON.stringify(contractorFound[0]));

        if (contractorFound.length != 0) {
            res.view("pages/searchContractorWorker", { contractorFound: contractorFound });
            //to check if the "click" var is true (there is a click on 'show profile'), if is true move to the deme profile
        }
        else
            res.view("pages/searchContractorWorker", { contractorFound: null, messageNR: "no results found" });
    });

});


/*let queryObject = {}
if (x!=y){
queryObject["$group"] ={
 }
    }
if (typeof accompaniedI != "undefined") {
    dictQuery2.accompanied = accompaniedI;
    console.log("check accompanied:" + req.body.accompaniedI);
}
if(typeof jobTypesI != "undefined") {
      dictQuery.jobTypes = jobTypesI;
      console.log("check JobType:" + req.body.selectE);
}
var from = parseInt(req.body.FROMjobRate);
var to = parseInt(req.body.TOjobRate);
var query = [
    {
        '$group': {
            '_id': '$idC',
            'rate': {
                '$avg': '$rate'
            }
        }
    }, {
        '$match': {
            'rate': {
                '$lt': to + 1, // lower then -- +1 to include the top value
                '$gt': from // greater than
            }
        }
    }
];
let comments = await dbo.collection("Comments").aggregate(query).toArray();
console.log("comments:  " + JSON.stringify(comments));
//if(priceFROMI!="")
var priceFROMI = parseInt(req.body.fromPriceRates);
var priceTOI = parseInt(req.body.toPriceRates);
var query2 = [{
    '$match': {
        'rate': {
            '$lt': priceTOI + 1, // lower then -- +1 to include the top value
            '$gt': priceFROMI // greater than
        }
    }
}
];
let price2 = await dbo.collection("jobRate").aggregate(query2).toArray();
console.log("jobRate:  " + JSON.stringify(price2));
if (comments.length != 0 && price2.length != 0) {
    var united=[];
    for(var i =0; i<comments.length;i++)
    {
        for(var j=0;j<price2.lenght;j++)
        {
            if(comments[i].idC==price2[j].idC)
            {
                var e = {...comments[i],...price2[j]};
                console.log("e"+ JSON.stringify(e));
                united.push(e);
            }
        }
    }
    for ( i = 0; i < united.length; i++) {
        let contractorFound = await dbo.collection("ContractorWorkers").find({ _id: united[i].idC }).toArray();
        console.log("result of searching: " + JSON.stringify(contractorFound));
        united[i] = { ...united[i], ...contractorFound[0] };
    }
    res.view("pages/searchContractorWorker", { contractorFound: united});
}
else {
    res.view("pages/searchContractorWorker", { contractorFound: null, messageNR: "no results found" });
}
});
});*/



app.get("/searchContractorWorker", function (req, res) {
    res.view('pages/searchContractorWorker', { contractorFound: null });
});


app.post("/searchEmployer", async (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        var flag = false;
        var dictQueryE = {};
        var myquery = { idE: Uid, eventname: req.body.selectE };
        var select=req.body.go;
        var idEmployer = req.body.idE;
        if (idEmployer != "") {
            dictQueryE._id = idEmployer;
            console.log("check id :" + req.body.idE);
        }

        let employerFound = await dbo.collection("Employers").find(dictQueryE).toArray();
        console.log("result of employer searching: " + JSON.stringify(employerFound));

        if (employerFound.length != 0) {
            res.view("pages/searchEmployer", { employerFound: employerFound });
            if (select == true) {
                res.render("pages/demoPofileE",employerFound);

            }
        }
        else
            res.view("pages/searchEmployer", { employerFound: null, messageNRE: "no results found" });
    });

});



app.get("/searchEmployer", function (req, res) {
    res.view('pages/searchEmployer', { employerFound: null });
});


//Reports
//--Contractor's
app.get("/contractorReports", function (req, res) {
    res.view("pages/contractorReports", { Recruits: null });
});

app.post('/contractorReports', async (req, res) => {
    if (Uid == "" || typeUser != "ContractorWorkers") {
        res.redirect("/");
    }
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");

        //projection
        var fieldsE = {}; //do not bring id field
        var fieldsR = { idEmployer: 1 };

        if (typeof req.body.nameEmp != "undefined") {
            fieldsE.firstName = 1;
            fieldsE.lastName = 1;
        }

        if (typeof req.body.phone != "undefined")
            fieldsE.phoneNumbers = 1;

        if (typeof req.body.email != "undefined")
            fieldsE.email = 1;

        if (typeof req.body.nameEmp == "undefined" && typeof req.body.phone == "undefined" && typeof req.body.email == "undefined") {
            fieldsE.firstName = 0;
            fieldsE.lastName = 0;
            fieldsE.phoneNumbers = 0;
            fieldsE.email = 0;
        }

        if (typeof req.body.date != "undefined") {
            fieldsR.date = 1;
            fieldsR.startTime = 1;
        }
        if (typeof req.body.status != "undefined") {
            fieldsR.status = 1;
        }
        if (typeof req.body.location != "undefined") {
            fieldsR.location = 1;
        }
        if (typeof req.body.price != "undefined") {
            fieldsR.price = 1;
        }
        var todayYear = new Date().getFullYear();
        var query3 = { idC: Uid, date: new RegExp(todayYear + "-") };
        console.log("req.body.month " + req.body.month);
        if (req.body.month != "0") {
            query3.date = new RegExp(todayYear + "-" + req.body.month);
        }

        console.log("filterR = " + JSON.stringify(fieldsR));
        let recruits = await dbo.collection("Recuitment").find(query3).project(fieldsR).toArray();
        console.log("recruits:   " + JSON.stringify(recruits));

        var united = [];
        if (recruits.length != 0) {
            for (var i = 0; i < recruits.length; ++i) {
                var employer;
                try {
                    employer = await dbo.collection("Employers").find({ _id: recruits[i].idEmployer }).project(fieldsE).toArray();
                    console.log("employer  " + JSON.stringify(employer[0]));

                    if (typeof req.body.price != "undefined") {
                        //get the rate:
                        var comments = await dbo.collection("Comments").find({ idEmp: employer[0]._id }).project({ rate: 1, _id: 0 }).toArray();
                        console.log("comments " + JSON.stringify(comments));

                        //make one document with all info
                        delete employer[0]._id;
                        united.push({ ...recruits[i], ...employer[0], ...comments[0] });
                    }
                    else {
                        //make one document with all info
                        delete employer[0]._id;
                        united.push({ ...recruits[i], ...employer[0] });
                    }

                    console.log("united  " + JSON.stringify(united));
                }
                catch (UnhandledPromiseRejectionWarning) {
                    console.log(UnhandledPromiseRejectionWarning);
                }


            }


            //get sun price per month:
            todayYear = new Date().getFullYear();
            var date = new RegExp(todayYear + "-");
            if (req.body.month != "0") {
                date = new RegExp(todayYear + "-" + req.body.month);
            }
            var ag3 = [
                {
                    '$match': {
                        'date': date
                    }
                }, {
                    '$group': {
                        '_id': '$idC',
                        'price': {
                            '$sum': {
                                '$toInt': '$price'
                            }
                        }
                    }
                }, {
                    '$match': {
                        '_id': Uid
                    }
                }
            ];
            let recruits2 = await dbo.collection("Recuitment").aggregate(ag3).toArray();
            var salary;
            if (recruits2.length != 0)
                salary = recruits2[0].price;
            else
                salary = 0;

            var send2 = {
                nameEmp: req.body.nameEmp,
                phone: req.body.phone,
                email1: req.body.email,
                date: req.body.date,
                location: req.body.location,
                price: req.body.price,
                rate: req.body.rate,
                month: req.body.month,
                salary: salary,
                status: req.body.status,
                Recruits: united
            };

            res.view("pages/contractorReports", send2);
        }
        else
            res.view("pages/contractorReports", { Recruits: null, message: "no results found" });



    });
});
//--Employer's
app.get('/employerReports', (req, res) => {
    if (Uid == "" || typeUser != "Employers") {
        res.redirect("/");
    }
    res.view("pages/employerReports", { Recruits: null });
});

app.post('/employerReports', async (req, res) => {
    if (Uid == "" || typeUser != "Employers") {
        res.redirect("/");
    }
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");

        //projection
        var fieldsC = { _id: 0 }; //do not bring id field
        var fieldsR = { idC: 1 };

        if (typeof req.body.nameEmp != "undefined") {
            fieldsC.firstName = 1;
            fieldsC.lastName = 1;
        }

        if (typeof req.body.phone != "undefined")
            fieldsC.phoneNumbers = 1;

        if (typeof req.body.service != "undefined")
            fieldsC.jobTypes = 1;

        if (typeof req.body.nameEmp == "undefined" && typeof req.body.phone == "undefined" && typeof req.body.service == "undefined") {
            fieldsC.firstName = 0;
            fieldsC.lastName = 0;
            fieldsC.phoneNumbers = 0;
            fieldsC.jobTypes = 0;
        }

        if (typeof req.body.date != "undefined") {
            fieldsR.date = 1;
            fieldsR.startTime = 1;
        }
        if (typeof req.body.location != "undefined") {
            fieldsR.location = 1;
        }
        if (typeof req.body.price != "undefined") {
            fieldsR.price = 1;
        }

        var todayYear = new Date().getFullYear();
        var query3 = { idEmployer: Uid, date: new RegExp(todayYear + "-") };
        console.log("req.body.month " + req.body.month);
        if (req.body.month != "0") {
            query3.date = new RegExp(todayYear + "-" + req.body.month);
        }

        console.log("filterR = " + JSON.stringify(fieldsR));
        let recruits = await dbo.collection("Recuitment").find(query3).project(fieldsR).toArray();
        console.log("recruits:   " + JSON.stringify(recruits));

        var united = [];
        if (recruits.length != 0) {
            for (var i = 0; i < recruits.length; ++i) {
                var contractor;
                try {
                    contractor = await dbo.collection("ContractorWorkers").find({ _id: recruits[i].idC }).project(fieldsC).toArray();
                    console.log("contractor  " + JSON.stringify(contractor[0]));

                    united.push({ ...recruits[i], ...contractor[0] });
                    console.log("united  " + JSON.stringify(united));
                }
                catch (UnhandledPromiseRejectionWarning) {
                    console.log(UnhandledPromiseRejectionWarning);
                }


            }


            var send2 = {
                nameEmp: req.body.nameEmp,
                phone: req.body.phone,
                service: req.body.service,
                date: req.body.date,
                location: req.body.location,
                price: req.body.price,
                Recruits: united
            };

            res.view("pages/employerReports", send2);
        }
        else
            res.view("pages/employerReports", { Recruits: null, message: "no results found" });
    });
});

//--HR Worker's

var statistics = {};

app.get('/humanResourcesReports', async (req, res) => {
    if (Uid == "" || typeUser != "resourcesCompanyWorkers") {
        res.redirect("/");
    }
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");

        var contractor;

        contractor = await dbo.collection("ContractorWorkers").find().project({ firstName: 1, lastName: 1, phoneNumbers: 1, email: 1, jobTypes: 1 }).toArray();
        var employers = await dbo.collection("Employers").find().project({ firstName: 1, lastName: 1, phoneNumbers: 1, email: 1 }).toArray();

        var numOfCon;
        var i;
        numOfCon = contractor.length;

        //------num of contractors per rate-------
        var numOfRates = [0, 0, 0, 0, 0, 0];
        var sum = 0;
        for (i = 1; i <= 5; i++) {//5 defined rates
            var comment = await dbo.collection("Comments").aggregate([
                {
                    $group: {
                        _id: "$idC",
                        "rate": {
                            "$avg": "$rate"
                        }
                    }
                },
                {
                    $match: {
                        "rate": i
                    }
                },
                {
                    $group: {
                        _id: "rate",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]).toArray();

            if (comment.length != 0) {
                numOfRates[i] = comment[0].count;
                sum += numOfRates[i];
            }
            else
                numOfRates[i] = 0;
        }
        //rest:
        numOfRates[0] = numOfCon - sum; //contractors that don't have rates.

        //------num of contractors per service-----
        var services = { "Hair_Styling": 0, "Makeup": 0, "Event_Stylist": 0, "Sitting_Organizer": 0, "Photography": 0, "DJ": 0, "Musician": 0, "Atraction_Provider": 0, "Invitation_Printer": 0, "noJob": 0 };
        if (numOfCon != 0) {
            console.log(1140);
            for (i = 0; i < contractor.length; ++i) {
                console.log("con:  " + JSON.stringify(contractor[i]));
                var myService = contractor[i].jobTypes;
                if (myService != null) {
                    console.log("my service:   1  " + JSON.stringify(myService));
                    myService = myService.split(",");
                    console.log("my service:   " + JSON.stringify(myService));
                    for (var j = 0; j < myService.length; ++j) {
                        services[myService[j].split(' ').join('_')] += 1;
                    }
                }
                else
                    services["noJob"] += 1;
                console.log("services: " + JSON.stringify(services));

            }
        }
        var send = { Data: null, choise: null, numOfCon: numOfCon, numOfRates: numOfRates, numOfEmployers: employers.length };
        statistics = { numOfCon: numOfCon, numOfRates: numOfRates, ...services, numOfEmployers: employers.length };
        res.view("pages/humanResourcesReports", { ...send, ...services });

    });
});

app.get("/humanResourcesReports-getContractors", (req, res) => {
    if (Uid == "" || typeUser != "resourcesCompanyWorkers") {
        res.redirect("/");
    }
    res.redirect("/humanResourcesReports");
});

app.post('/humanResourcesReports-getEmployers', async (req, res) => {
    if (Uid == "" || typeUser != "resourcesCompanyWorkers") {
        res.redirect("/");
    }
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");

        let employers = await dbo.collection("Employers").find().project({ firstName: 1, lastName: 1, phoneNumbers: 1, email: 1 }).toArray();

        res.view("pages/humanResourcesReports", { Data: employers, choise: "e", ...statistics });


    });
    //res.view("pages/humanResourcesReports", { Data: null, choise: null });
});

app.get("/humanResourcesReports-getEmployers", (req, res) => {
    if (Uid == "" || typeUser != "resourcesCompanyWorkers") {
        res.redirect("/");
    }
    res.redirect("/humanResourcesReports");
});

app.post('/humanResourcesReports-getContractors', async (req, res) => {
    if (Uid == "" || typeUser != "resourcesCompanyWorkers") {
        res.redirect("/");
    }
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");

        let contractor, comments;
        var united = [];
        var numOfCon;
        var i;

        contractor = await dbo.collection("ContractorWorkers").find().project({ firstName: 1, lastName: 1, phoneNumbers: 1, email: 1 }).toArray();
        console.log(JSON.stringify(contractor));
        if (contractor.length != 0) {
            if (req.body.contractors == "avg") {
                for (i = 0; i < contractor.length; ++i) {

                    comments = await dbo.collection("Comments").aggregate([{
                        $match: {
                            idC: contractor[i]._id
                        }
                    },
                    {
                        $group: {
                            _id: "$idC",
                            "rate": {
                                "$avg": "$rate"
                            }
                        }
                    }]).toArray();
                    console.log("comments:  " + JSON.stringify(comments));

                    if (comments.length != 0)
                        contractor[i].rate = comments[0].rate;
                    else
                        contractor[i].rate = null;

                    united.push(contractor[i]);

                }
            }

            else {
                var from = parseInt(req.body.from);
                var to = parseInt(req.body.to);
                for (i = 0; i < contractor.length; ++i) {
                    console.log(contractor[i]._id);
                    var query = [
                        {
                            '$match': {
                                'idC': contractor[i]._id
                            }
                        }, {
                            '$group': {
                                '_id': '$idC',
                                'rate': {
                                    '$avg': '$rate'
                                }
                            }
                        }, {
                            '$match': {
                                'rate': {
                                    '$lt': to + 1, // lower then -- +1 to include the top value
                                    '$gt': from // greater than
                                }
                            }
                        }
                    ];
                    comments = await dbo.collection("Comments").aggregate(query).toArray();
                    console.log("comments:  " + JSON.stringify(comments));

                    if (comments.length != 0) {
                        contractor[i].rate = comments[0].rate;
                        united.push(contractor[i]);
                    }
                    else if (from == 0) {
                        contractor[i].rate = null;
                        united.push(contractor[i]);
                    }
                }

                console.log("united  " + JSON.stringify(united));
            }
            res.view("pages/humanResourcesReports", { Data: united, choise: "c", ...statistics });

        }
        else
            res.view("pages/humanResourcesReports", { noData: "y", ...statistics });

    });
    //res.view("pages/humanResourcesReports", { Data: null, choise: null });
});

app.get("/humanResourcesReports-getRecruits", (req, res) => {
    if (Uid == "" || typeUser != "resourcesCompanyWorkers") {
        res.redirect("/");
    }
    res.redirect("/humanResourcesReports");
});

app.post('/humanResourcesReports-getRecruits', async (req, res) => {
    if (Uid == "" || typeUser != "resourcesCompanyWorkers") {
        res.redirect("/");
    }
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var query = { idE: req.body.idE };
        var dbo = db.db("eventSaver");
        var recruits = await dbo.collection("Recuitment").find(query).toArray();
        if (recruits.length != 0) {
            for (var i = 0; i < recruits.length; ++i) {
                query = { _id: ObjectID(recruits[i].idEvent) };
                var event = await dbo.collection("Event").find(query).toArray();
                console.log("event: " + JSON.stringify(event));
                if (event.length != 0)
                    recruits[i].eventName = event[0].eventname;
            }
            console.log("recruits:: " + JSON.stringify(recruits));
            res.view("pages/humanResourcesReports", { Data: recruits, choise: "r", ...statistics });
        }
        else
            res.view("pages/humanResourcesReports", { noData: "y", ...statistics });
    });

});


app.get('/pendingRecruits', async (req, res) => {
    if (Uid == "" || typeUser != "ContractorWorkers") {
        res.redirect("/");
    }
    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var query = { idC: Uid, status: "pending" };
        var dbo = db.db("eventSaver");
        var recruits = await dbo.collection("Recuitment").find(query).toArray();

        console.log(recruits);
        console.log("end r");

        if (recruits.length != 0) {
            for (var i = 0; i < recruits.length; i++) {
                var employer = await dbo.collection("Employers").find({ _id: recruits[i].idEmployer }).project({ _id: 0 }).toArray();
                console.log(employer);
                console.log(employer.length);

                if (employer.length == 0)
                    throw "no employers found";
                recruits[i] = { ...recruits[i], ...employer[0] };
            }
            console.log("recruits:: " + JSON.stringify(recruits));

            res.view("pages/pendingRecruits", { Data: recruits });
        }
        else
            res.view("pages/pendingRecruits", { Data: null });
    });
});

app.post('/pendingRecruits', async (req, res) => {

    MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("eventSaver");
        if (req.body.rejected != "") {
            console.log("req.body.rejected " + req.body.rejected);
            var reject = req.body.rejected.split(",");
            console.log("reject: " + reject.lenght);
            var values = { $set: { status: "canceled" } };
            if (typeof reject.lenght == "undefined")
                await dbo.collection("Recuitment").updateOne({ _id: ObjectID(reject.toString()) }, values);
            else {
                for (var i; i < reject.lenght; i++) {
                    await dbo.collection("Recuitment").updateOne({ _id: ObjectID(reject[i].toString()) }, values);
                }
            }
            res.redirect("/pendingRecruits");
        }
        else if (req.body.accepted != "") {
            var query = { _id: Uid };
            var acc = req.body.accepted;
            console.log("acc: " + acc.lenght);
            values = { $set: { status: "accepted" } };
            if (typeof acc.lenght == "undefined") {
                await dbo.collection("Recuitment").updateOne({ _id: ObjectID(acc.toString()) }, values);
            }
            else {
                for (i; i < acc.lenght; i++) {
                    await dbo.collection("Recuitment").updateOne({ _id: ObjectID(acc[i].toString()) }, values);
                }
            }
            date1= req.body.date.trim();
            //date1="2021-07-26";
            console.log("yarin date:" + date1);

            values1 = { $set: { status: "canceled" } }; //to update all the requitment in this date 
            query1 = { status: "pending", date: date1 };
            await dbo.collection("Recuitment").updateMany(query1, values1);

            let c1 = await dbo.collection("ContractorWorkers").find(query).toArray(); //the details of the contractor
            var oldD = c1.dates; //the list of all the dates the contractor not avalible
            var newD = oldD + "," + date1;

            values2 = { $set: { dates: newD } };
            await dbo.collection("ContractorWorkers").updateOne(query, values2);

            res.redirect("/pendingRecruits");
        }
        else
            throw "no choise for pending recruits";
    });
});


//https://project1sprint1.herokuapp.com