const {MongoClient} = require('mongodb');


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

