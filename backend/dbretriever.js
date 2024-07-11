const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const password = process.env.cwvb_database_pw;
const user = process.env.cwvb_database_user;
const uri =
  "mongodb+srv://" +
  process.env.MONGODB_USER +
  ":" +
  process.env.MONGODB_PASSWORD +
  "@cluster0.akkbhp7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
const database = client.db("st-bonni-lwc");

async function fetchDocuments(collectionName, criteriaObj, projectObj) {
  let collection = database.collection(collectionName);
  let retrievedDocs = [];

  let cursor = collection.find(criteriaObj);

  if (projectObj) {
    cursor.project(projectObj);
  }

  for await (let doc of cursor) {
    retrievedDocs.push(doc);
  }

  return retrievedDocs;
}

async function fetchOneDocument(collectionName, criteriaObj) {
  let collection = database.collection(collectionName);
  return await collection.findOne(criteriaObj);
}

async function fetchOrdered(collectionName, criteriaObj, sortObj, count) {
  let collection = database.collection(collectionName);
  let returnDocs = [];

  let cursor = collection.find(criteriaObj).sort(sortObj);

  //if count is specified, return that number of documents, if not defined, return all matches.
  if (count) {
    for (let i = 0; i < count; i++) {
      returnDocs.push(await cursor.next());
    }
  } else {
    for await (let doc of cursor) {
      returnDocs.push(doc);
    }
  }

  return returnDocs;
}

async function updateOne(collectionName, criteriaObj, updateObj) {
  let collection = database.collection(collectionName);

  const result = await collection.updateOne(criteriaObj, updateObj);

  return result;
}

async function insertOne(collectionName, doc) {
  let collection = database.collection(collectionName);

  const result = await collection.insertOne(doc);

  return result;
}

async function fetchDocumentById(collectionName, oid) {
  let collection = database.collection(collectionName);
  let searchOid = new ObjectId(oid);

  const result = await collection.findOne({ _id: searchOid });

  return result;
}

async function deleteDocumentById(collectionName, oid) {
  let collection = database.collection(collectionName);
  let searchOid = new ObjectId(oid);

  const result = await collection.deleteOne({ _id: searchOid });
  return result;
}

async function aggregateDocuments(collectionName, pipeline) {
  let collection = database.collection(collectionName);
  return await collection.aggregate(pipeline).toArray();
}



module.exports.fetchDocuments = fetchDocuments;
module.exports.fetchOneDocument = fetchOneDocument;
module.exports.fetchDocumentById = fetchDocumentById;
module.exports.fetchOrdered = fetchOrdered;
module.exports.updateOne = updateOne;
module.exports.insertOne = insertOne;
module.exports.deleteDocumentById = deleteDocumentById;
module.exports.aggregateDocuments = aggregateDocuments;

