const {MongoClient, ServerApiVersion} = require('mongodb');
const uri = "mongodb+srv://rnlena:wvTLaOxGYtrRRt0x@cluster0.oz97f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let _db;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    _db = await client.db("shop");
}

const getDB = () => {
    if (_db) {
        return _db;
    }
    throw new Error('MongoDB connection error');
}

const connect = () => {
    return run();
}

exports.connect = connect;
exports.getDB = getDB;
