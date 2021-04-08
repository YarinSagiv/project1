//const {MongoClient} = require('mongodb');

/*
async function listDatabases(client){
    var databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}


async function main() {

    const uri = "mongodb+srv://ymon:ymonashdod@cluster.0qqlp.mongodb.net/eventSaver?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    await client.connect();
    await listDatabases(client);
    try {
        await client.connect();
    
        await listDatabases(client);
     
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }

}

main().catch(console.error);
*/
//MUST!
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://ymon:ymonashdod@cluster.0qqlp.mongodb.net/eventSaver?retryWrites=true&w=majority";

/*// -- create db
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

// -- create collenction:
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("eventSaver");
  dbo.createCollection("Employers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});*/

/*// -- insert example:
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("eventSaver");
    var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("Employers").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });

  //-- delete document example:
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("eventSaver");
    var myquery = { address: 'Highway 37' };
    dbo.collection("Employers").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
    });
});


//-- update document example:
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("eventSaver");
    var myquery = { address: "Valley 345" };
    var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
    dbo.collection("Employers").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });



//-- find all documents example:
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("eventSaver");
    dbo.collection("Employers").findOne({}, function(err, result) { //find ALL 
      if (err) throw err;
      console.log(result.name);
      db.close();
    });
  });

// -- find documents by a query example:
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("eventSaver");
    var query = { address: "Park Lane 38" };
    dbo.collection("Employers").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });

  */
